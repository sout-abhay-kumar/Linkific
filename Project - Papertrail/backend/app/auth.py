import os
import secrets
import smtplib
import ssl
import logging
from email.message import EmailMessage
from datetime import timedelta, timezone
from urllib.parse import quote

from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy import select, update
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from .database import get_db
from .models import PasswordResetToken, User, utc_now
from .schemas import (
    ChangePasswordInput,
    ForgotPasswordInput,
    LoginInput,
    PasswordResetResponse,
    ProfileUpdate,
    ResetPasswordInput,
    SignupInput,
    UserOut,
)
from .security import (
    ENVIRONMENT,
    FRONTEND_URL,
    clear_auth_cookies,
    get_current_user,
    hash_password,
    hash_reset_token,
    require_csrf,
    set_auth_cookie,
    set_csrf_cookie,
    verify_password,
)

router = APIRouter(prefix="/api")
GENERIC_RESET_MESSAGE = "If an account exists for that email, password reset instructions will be sent."
logger = logging.getLogger(__name__)


def send_password_reset_email(email: str, token: str) -> None:
    host = os.getenv("SMTP_HOST", "").strip()
    sender = os.getenv("SMTP_FROM_EMAIL", "").strip()
    if not host or not sender:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Password reset email delivery is not configured.",
        )

    message = EmailMessage()
    message["Subject"] = "Reset your Papertrail password"
    message["From"] = sender
    message["To"] = email
    reset_link = f"{FRONTEND_URL}/reset-password?token={quote(token)}"
    message.set_content(
        "Use this link to reset your Papertrail password. "
        "It expires in 30 minutes and can only be used once:\n\n"
        f"{reset_link}\n"
    )
    use_tls = os.getenv("SMTP_USE_TLS", "true").lower() == "true"
    username = os.getenv("SMTP_USERNAME", "")
    password = os.getenv("SMTP_PASSWORD", "")
    if (username and not password) or (ENVIRONMENT == "production" and not use_tls):
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Password reset email delivery is not configured securely.",
        )
    try:
        with smtplib.SMTP(host, int(os.getenv("SMTP_PORT", "587")), timeout=10) as server:
            if use_tls:
                server.starttls(context=ssl.create_default_context())
            if username:
                server.login(username, password)
            server.send_message(message)
    except (OSError, smtplib.SMTPException, ValueError):
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Password reset email could not be sent. Please try again later.",
        ) from None


@router.get("/auth/csrf")
def issue_csrf_token(response: Response):
    return {"csrf_token": set_csrf_cookie(response)}


@router.post(
    "/auth/signup",
    response_model=UserOut,
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(require_csrf)],
)
def signup(payload: SignupInput, response: Response, db: Session = Depends(get_db)):
    if db.scalar(select(User.id).where(User.email == payload.email)) is not None:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="An account with this email already exists.")

    user = User(
        full_name=payload.full_name,
        email=payload.email,
        hashed_password=hash_password(payload.password),
    )
    db.add(user)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this email already exists.",
        ) from None
    db.refresh(user)
    set_auth_cookie(response, user)
    return user


@router.post("/auth/login", response_model=UserOut, dependencies=[Depends(require_csrf)])
def login(payload: LoginInput, response: Response, db: Session = Depends(get_db)):
    user = db.scalar(select(User).where(User.email == payload.email))
    if user is None or not verify_password(payload.password, user.hashed_password) or not user.is_active:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Email or password is incorrect.")
    set_auth_cookie(response, user)
    return user


@router.get("/auth/me", response_model=UserOut)
def current_user(user: User = Depends(get_current_user)):
    return user


@router.post("/auth/logout", status_code=status.HTTP_204_NO_CONTENT, dependencies=[Depends(require_csrf)])
def logout(response: Response, user: User = Depends(get_current_user)):
    clear_auth_cookies(response)


@router.patch(
    "/users/me",
    response_model=UserOut,
    dependencies=[Depends(require_csrf)],
)
def update_profile(
    payload: ProfileUpdate,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    updates = payload.model_dump(exclude_unset=True)
    if any(value is None for value in updates.values()):
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="Profile fields cannot be null.")
    if "email" in updates:
        other_user = db.scalar(
            select(User.id).where(User.email == updates["email"], User.id != user.id)
        )
        if other_user is not None:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="An account with this email already exists.")
    for field, value in updates.items():
        setattr(user, field, value)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this email already exists.",
        ) from None
    db.refresh(user)
    return user


@router.post("/auth/change-password", dependencies=[Depends(require_csrf)])
def change_password(
    payload: ChangePasswordInput,
    response: Response,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if not verify_password(payload.current_password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Current password is incorrect.")
    if payload.current_password == payload.new_password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Choose a new password different from your current password.",
        )
    user.hashed_password = hash_password(payload.new_password)
    user.token_version += 1
    db.commit()
    clear_auth_cookies(response)
    return {"message": "Password changed. Please sign in again."}


@router.post(
    "/auth/forgot-password",
    response_model=PasswordResetResponse,
    dependencies=[Depends(require_csrf)],
)
def forgot_password(payload: ForgotPasswordInput, db: Session = Depends(get_db)):
    development = ENVIRONMENT == "development"
    if not development and (not os.getenv("SMTP_HOST") or not os.getenv("SMTP_FROM_EMAIL")):
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Password reset email delivery is not configured.",
        )
    user = db.scalar(select(User).where(User.email == payload.email, User.is_active.is_(True)))
    if user is None:
        return {"message": GENERIC_RESET_MESSAGE}

    now = utc_now()
    db.execute(
        update(PasswordResetToken)
        .where(PasswordResetToken.user_id == user.id, PasswordResetToken.used_at.is_(None))
        .values(used_at=now)
    )
    token = secrets.token_urlsafe(32)
    db.add(
        PasswordResetToken(
            user_id=user.id,
            token_hash=hash_reset_token(token),
            expires_at=now + timedelta(minutes=30),
        )
    )
    db.commit()
    result = {"message": GENERIC_RESET_MESSAGE}
    if development:
        result["reset_token"] = token
    else:
        try:
            send_password_reset_email(user.email, token)
        except HTTPException:
            logger.error("Password reset email delivery failed.")
    return result


@router.post("/auth/reset-password", dependencies=[Depends(require_csrf)])
def reset_password(payload: ResetPasswordInput, response: Response, db: Session = Depends(get_db)):
    reset_record = db.scalar(
        select(PasswordResetToken).where(
            PasswordResetToken.token_hash == hash_reset_token(payload.token),
            PasswordResetToken.used_at.is_(None),
        ).with_for_update()
    )
    if reset_record is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="This reset link is invalid or expired.")

    expiry = reset_record.expires_at
    if expiry.tzinfo is None:
        expiry = expiry.replace(tzinfo=timezone.utc)
    now = utc_now()
    if expiry <= now:
        reset_record.used_at = now
        db.commit()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="This reset link is invalid or expired.")

    user = db.get(User, reset_record.user_id)
    if user is None or not user.is_active:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="This reset link is invalid or expired.")
    user.hashed_password = hash_password(payload.new_password)
    user.token_version += 1
    reset_record.used_at = now
    db.execute(
        update(PasswordResetToken)
        .where(
            PasswordResetToken.user_id == user.id,
            PasswordResetToken.id != reset_record.id,
            PasswordResetToken.used_at.is_(None),
        )
        .values(used_at=now)
    )
    db.commit()
    clear_auth_cookies(response)
    return {"message": "Password reset successfully. Please sign in."}
