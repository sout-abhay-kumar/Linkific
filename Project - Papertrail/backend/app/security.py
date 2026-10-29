import hashlib
import hmac
import os
import secrets
from datetime import datetime, timedelta, timezone

import jwt
from argon2 import PasswordHasher
from argon2.exceptions import InvalidHashError, VerificationError, VerifyMismatchError
from fastapi import Cookie, Depends, Header, HTTPException, Request, Response, status
from sqlalchemy.orm import Session

from .database import get_db
from .models import User

JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))
ENVIRONMENT = os.getenv("ENVIRONMENT", "development").lower()
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173").rstrip("/")
CSRF_COOKIE_NAME = "papertrail_csrf"
AUTH_COOKIE_NAME = "papertrail_access"
COOKIE_SAMESITE = "none" if ENVIRONMENT == "production" else "lax"
password_hasher = PasswordHasher()

if len(JWT_SECRET_KEY.encode("utf-8")) < 32:
    raise RuntimeError("JWT_SECRET_KEY must be configured with at least 32 characters.")
if JWT_ALGORITHM != "HS256":
    raise RuntimeError("JWT_ALGORITHM must be HS256.")
if ACCESS_TOKEN_EXPIRE_MINUTES < 1:
    raise RuntimeError("ACCESS_TOKEN_EXPIRE_MINUTES must be a positive integer.")
if ENVIRONMENT not in {"development", "test", "production"}:
    raise RuntimeError("ENVIRONMENT must be development, test, or production.")


def hash_password(password: str) -> str:
    return password_hasher.hash(password)


def verify_password(password: str, hashed_password: str) -> bool:
    try:
        return password_hasher.verify(hashed_password, password)
    except (VerifyMismatchError, VerificationError, InvalidHashError):
        return False


def create_access_token(user: User) -> str:
    now = datetime.now(timezone.utc)
    return jwt.encode(
        {
            "sub": str(user.id),
            "iat": now,
            "exp": now + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES),
            "jti": secrets.token_urlsafe(16),
            "tv": user.token_version,
        },
        JWT_SECRET_KEY,
        algorithm=JWT_ALGORITHM,
    )


def hash_reset_token(token: str) -> str:
    return hashlib.sha256(token.encode("utf-8")).hexdigest()


def allowed_origins() -> set[str]:
    configured = {
        origin.strip().rstrip("/")
        for origin in os.getenv("FRONTEND_URL", FRONTEND_URL).split(",")
        if origin.strip()
    }
    if ENVIRONMENT != "production":
        configured.update({"http://localhost:5173", "http://127.0.0.1:5173"})
    return configured


def require_csrf(
    request: Request,
    csrf_cookie: str | None = Cookie(default=None, alias=CSRF_COOKIE_NAME),
    csrf_header: str | None = Header(default=None, alias="X-CSRF-Token"),
) -> None:
    origin = request.headers.get("origin", "").rstrip("/")
    if origin not in allowed_origins():
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Invalid request origin.")
    if not csrf_cookie or not csrf_header or not hmac.compare_digest(csrf_cookie, csrf_header):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="CSRF validation failed.")


def _decode_user(token: str, db: Session) -> User:
    credentials_error = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Authentication is required.",
        headers={"WWW-Authenticate": "Cookie"},
    )
    try:
        claims = jwt.decode(
            token,
            JWT_SECRET_KEY,
            algorithms=[JWT_ALGORITHM],
            options={"require": ["sub", "exp", "iat", "jti", "tv"]},
        )
        user_id = int(claims["sub"])
        token_version = int(claims["tv"])
    except (jwt.PyJWTError, KeyError, TypeError, ValueError):
        raise credentials_error from None

    user = db.get(User, user_id)
    if user is None or not user.is_active or user.token_version != token_version:
        raise credentials_error
    return user


def get_optional_current_user(
    auth_cookie: str | None = Cookie(default=None, alias=AUTH_COOKIE_NAME),
    db: Session = Depends(get_db),
) -> User | None:
    if auth_cookie is None:
        return None
    try:
        return _decode_user(auth_cookie, db)
    except HTTPException:
        return None


def get_current_user(user: User | None = Depends(get_optional_current_user)) -> User:
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication is required.",
            headers={"WWW-Authenticate": "Cookie"},
        )
    return user


def get_admin_user(user: User = Depends(get_current_user)) -> User:
    if user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Administrator access is required.",
        )
    return user


def set_auth_cookie(response: Response, user: User) -> None:
    response.set_cookie(
        key=AUTH_COOKIE_NAME,
        value=create_access_token(user),
        httponly=True,
        secure=ENVIRONMENT == "production",
        samesite=COOKIE_SAMESITE,
        max_age=ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        path="/api",
    )


def set_csrf_cookie(response: Response) -> str:
    token = secrets.token_urlsafe(32)
    response.set_cookie(
        key=CSRF_COOKIE_NAME,
        value=token,
        httponly=True,
        secure=ENVIRONMENT == "production",
        samesite=COOKIE_SAMESITE,
        max_age=12 * 60 * 60,
        path="/",
    )
    return token


def clear_auth_cookies(response: Response) -> None:
    secure = ENVIRONMENT == "production"
    response.delete_cookie(
        AUTH_COOKIE_NAME, path="/api", secure=secure, httponly=True, samesite=COOKIE_SAMESITE
    )
    response.delete_cookie(
        CSRF_COOKIE_NAME, path="/", secure=secure, httponly=True, samesite=COOKIE_SAMESITE
    )
