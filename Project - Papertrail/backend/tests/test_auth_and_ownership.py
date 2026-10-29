from datetime import datetime, timedelta, timezone
import os

import jwt
import pytest
from sqlalchemy import select, update
from sqlalchemy.orm import Session

import app.auth as auth_module
from app.models import Book, PasswordResetToken, User


ORIGIN = "http://localhost:5173"
PASSWORD = "AsecurePassword123"


def csrf_headers(client):
    response = client.get("/api/auth/csrf")
    assert response.status_code == 200
    return {"Origin": ORIGIN, "X-CSRF-Token": response.json()["csrf_token"]}


def signup(client, email="reader@example.com", full_name="Reader"):
    return client.post(
        "/api/auth/signup",
        headers=csrf_headers(client),
        json={"full_name": full_name, "email": email, "password": PASSWORD},
    )


def add_book(database, owner_id=None):
    with Session(database) as db:
        book = Book(
            title="The Quiet Shelf",
            author="A. Reader",
            category="Fiction",
            total_copies=2,
            borrowed_copies=0,
            owner_id=owner_id,
        )
        db.add(book)
        db.commit()
        db.refresh(book)
        return book.id


def test_signup_normalizes_email_and_sets_safe_http_only_session(client):
    response = signup(client, email="  Reader@Example.com ")

    assert response.status_code == 201
    assert response.json()["email"] == "reader@example.com"
    assert "hashed_password" not in response.json()
    assert "password" not in response.json()
    assert client.cookies.get("papertrail_access")
    assert "httponly" in response.headers["set-cookie"].lower()
    assert client.get("/api/auth/me").json()["full_name"] == "Reader"

    duplicate = signup(client, email="READER@example.com")
    assert duplicate.status_code == 409


def test_password_and_email_validation(client):
    weak_password = client.post(
        "/api/auth/signup",
        headers=csrf_headers(client),
        json={
            "full_name": "Reader",
            "email": "reader@example.com",
            "password": "short",
        },
    )
    assert weak_password.status_code == 422

    invalid_email = client.post(
        "/api/auth/signup",
        headers=csrf_headers(client),
        json={"full_name": "Reader", "email": "not-an-email", "password": PASSWORD},
    )
    assert invalid_email.status_code == 422


def test_login_rejects_bad_credentials_and_accepts_valid_credentials(client):
    assert signup(client).status_code == 201
    client.post("/api/auth/logout", headers=csrf_headers(client))

    wrong_password = client.post(
        "/api/auth/login",
        headers=csrf_headers(client),
        json={"email": "reader@example.com", "password": "IncorrectPassword123"},
    )
    assert wrong_password.status_code == 401

    login = client.post(
        "/api/auth/login",
        headers=csrf_headers(client),
        json={"email": "READER@example.com", "password": PASSWORD},
    )
    assert login.status_code == 200
    assert login.json()["email"] == "reader@example.com"


def test_protected_endpoints_require_valid_cookie_and_csrf(client):
    headers = csrf_headers(client)
    assert client.post("/api/books", json={}).status_code == 403
    invalid_origin = {**headers, "Origin": "https://untrusted.example"}
    assert (
        client.post(
            "/api/auth/signup",
            headers=invalid_origin,
            json={"full_name": "Reader", "email": "reader@example.com", "password": PASSWORD},
        ).status_code
        == 403
    )
    assert client.post("/api/books", headers=headers, json={}).status_code == 401
    assert client.get("/api/auth/me").status_code == 401

    client.cookies.set("papertrail_access", "invalid", path="/api")
    assert client.get("/api/auth/me").status_code == 401
    assert client.get("/api/books").status_code == 200

    expired = jwt.encode(
        {
            "sub": "1",
            "iat": datetime.now(timezone.utc) - timedelta(minutes=2),
            "exp": datetime.now(timezone.utc) - timedelta(minutes=1),
            "jti": "expired-test-token",
            "tv": 0,
        },
        os.environ["JWT_SECRET_KEY"],
        algorithm="HS256",
    )
    client.cookies.set("papertrail_access", expired, path="/api")
    assert client.get("/api/auth/me").status_code == 401


def test_public_legacy_books_are_preserved_and_read_only(client, database):
    legacy_id = add_book(database)
    catalogue = client.get("/api/books")
    assert catalogue.status_code == 200
    legacy_book = next(book for book in catalogue.json() if book["id"] == legacy_id)
    assert legacy_book["is_owner"] is False
    assert client.get(f"/api/books/{legacy_id}").status_code == 200

    assert signup(client).status_code == 201
    headers = csrf_headers(client)
    book_payload = {
        "title": "Changed",
        "author": "Reader",
        "category": "Fiction",
        "published_year": None,
        "description": "",
        "total_copies": 2,
    }
    assert client.put(f"/api/books/{legacy_id}", headers=headers, json=book_payload).status_code == 404
    assert client.delete(f"/api/books/{legacy_id}", headers=headers).status_code == 404
    assert client.post(f"/api/books/{legacy_id}/borrow", headers=headers).status_code == 404
    assert client.post(f"/api/books/{legacy_id}/return", headers=headers).status_code == 404

    with Session(database) as db:
        unchanged = db.get(Book, legacy_id)
        assert unchanged.owner_id is None
        assert unchanged.title == "The Quiet Shelf"
        assert unchanged.borrowed_copies == 0


def test_only_owner_can_manage_books(client, database):
    first = signup(client, email="first@example.com", full_name="First")
    assert first.status_code == 201
    first_user_id = first.json()["id"]
    create_headers = csrf_headers(client)
    payload = {
        "title": "Owned Book",
        "author": "First Reader",
        "category": "Fiction",
        "published_year": None,
        "description": "",
        "total_copies": 2,
    }
    created = client.post("/api/books", headers=create_headers, json=payload)
    assert created.status_code == 201
    book_id = created.json()["id"]
    assert created.json()["is_owner"] is True
    with Session(database) as db:
        assert db.get(Book, book_id).owner_id == first_user_id

    other_client = client.__class__(client.app)
    assert signup(other_client, email="second@example.com", full_name="Second").status_code == 201
    other_headers = csrf_headers(other_client)
    other_catalogue = other_client.get("/api/books").json()
    assert next(book for book in other_catalogue if book["id"] == book_id)["is_owner"] is False
    assert other_client.put(f"/api/books/{book_id}", headers=other_headers, json=payload).status_code == 404
    assert other_client.delete(f"/api/books/{book_id}", headers=other_headers).status_code == 404
    assert other_client.post(f"/api/books/{book_id}/borrow", headers=other_headers).status_code == 404
    assert other_client.post(f"/api/books/{book_id}/return", headers=other_headers).status_code == 404

    owner_headers = csrf_headers(client)
    assert client.post(f"/api/books/{book_id}/borrow", headers=owner_headers).status_code == 200
    assert client.post(f"/api/books/{book_id}/return", headers=csrf_headers(client)).status_code == 200
    updated = client.put(f"/api/books/{book_id}", headers=csrf_headers(client), json={**payload, "title": "Updated"})
    assert updated.status_code == 200
    assert client.delete(f"/api/books/{book_id}", headers=csrf_headers(client)).status_code == 204


def test_regular_user_cannot_access_admin_api_or_assign_admin_role(client):
    registration = client.post(
        "/api/auth/signup",
        headers=csrf_headers(client),
        json={
            "full_name": "Reader",
            "email": "reader@example.com",
            "password": PASSWORD,
            "role": "admin",
        },
    )
    assert registration.status_code == 422

    assert signup(client).status_code == 201
    assert client.get("/api/auth/me").json()["role"] == "user"
    assert client.get("/api/admin/users").status_code == 403
    assert (
        client.patch(
            "/api/users/me",
            headers=csrf_headers(client),
            json={"role": "admin"},
        ).status_code
        == 422
    )


def test_admin_can_list_users_and_manage_other_users_books(client, database):
    with client.__class__(client.app) as owner_client:
        owner_signup = signup(owner_client, email="owner@example.com", full_name="Owner")
        assert owner_signup.status_code == 201
        book_id = add_book(database, owner_id=owner_signup.json()["id"])

    admin = signup(client, email="admin@example.com", full_name="Admin")
    assert admin.status_code == 201
    with Session(database) as db:
        db.execute(
            update(User)
            .where(User.id == admin.json()["id"])
            .values(role="admin")
        )
        db.commit()
        db.expire_all()

    csrf_headers(client)
    assert client.get("/api/auth/me").json()["role"] == "admin"
    users_response = client.get("/api/admin/users")
    assert users_response.status_code == 200
    assert {user["email"] for user in users_response.json()} == {
        "owner@example.com",
        "admin@example.com",
    }
    assert all("hashed_password" not in user for user in users_response.json())

    book_list = client.get("/api/books").json()
    admin_view = next(book for book in book_list if book["id"] == book_id)
    assert admin_view["is_owner"] is False
    assert admin_view["can_manage"] is True
    updated = client.put(
        f"/api/books/{book_id}",
        headers=csrf_headers(client),
        json={
            "title": "Admin Updated",
            "author": "Owner",
            "category": "Fiction",
            "published_year": None,
            "description": "",
            "total_copies": 1,
        },
    )
    assert updated.status_code == 200
    assert updated.json()["is_owner"] is False
    assert updated.json()["can_manage"] is True
    assert client.post(f"/api/books/{book_id}/borrow", headers=csrf_headers(client)).status_code == 200
    assert client.post(f"/api/books/{book_id}/return", headers=csrf_headers(client)).status_code == 200
    assert client.delete(f"/api/books/{book_id}", headers=csrf_headers(client)).status_code == 204


def test_password_reset_tokens_are_hashed_expiring_and_single_use(client, database, monkeypatch):
    monkeypatch.setattr(auth_module, "ENVIRONMENT", "development")
    assert signup(client).status_code == 201
    client.post("/api/auth/logout", headers=csrf_headers(client))

    reset_request = client.post(
        "/api/auth/forgot-password",
        headers=csrf_headers(client),
        json={"email": "reader@example.com"},
    )
    assert reset_request.status_code == 200
    token = reset_request.json()["reset_token"]
    assert token
    with Session(database) as db:
        record = db.scalar(select(PasswordResetToken))
        assert record.token_hash != token

    reset = client.post(
        "/api/auth/reset-password",
        headers=csrf_headers(client),
        json={"token": token, "new_password": "NewSecurePassword456"},
    )
    assert reset.status_code == 200
    reused = client.post(
        "/api/auth/reset-password",
        headers=csrf_headers(client),
        json={"token": token, "new_password": "AnotherSecurePassword789"},
    )
    assert reused.status_code == 400

    monkeypatch.setattr(auth_module, "ENVIRONMENT", "production")
    unknown_account = client.post(
        "/api/auth/forgot-password",
        headers=csrf_headers(client),
        json={"email": "missing@example.com"},
    )
    known_account = client.post(
        "/api/auth/forgot-password",
        headers=csrf_headers(client),
        json={"email": "reader@example.com"},
    )
    assert unknown_account.status_code == 503
    assert known_account.status_code == 503
    assert "reset_token" not in unknown_account.json()
    assert unknown_account.json() == known_account.json()


def test_password_reset_token_expiration_is_enforced(client, database, monkeypatch):
    monkeypatch.setattr(auth_module, "ENVIRONMENT", "development")
    assert signup(client).status_code == 201
    reset_request = client.post(
        "/api/auth/forgot-password",
        headers=csrf_headers(client),
        json={"email": "reader@example.com"},
    )
    token = reset_request.json()["reset_token"]
    with Session(database) as db:
        record = db.scalar(select(PasswordResetToken))
        record.expires_at = datetime.now(timezone.utc) - timedelta(minutes=1)
        db.commit()

    expired = client.post(
        "/api/auth/reset-password",
        headers=csrf_headers(client),
        json={"token": token, "new_password": "NewSecurePassword456"},
    )
    assert expired.status_code == 400
    with Session(database) as db:
        assert db.scalar(select(PasswordResetToken)).used_at is not None


def test_production_reset_responses_do_not_disclose_account_existence(
    client, monkeypatch
):
    monkeypatch.setattr(auth_module, "ENVIRONMENT", "production")
    monkeypatch.setenv("SMTP_HOST", "smtp.example.test")
    monkeypatch.setenv("SMTP_FROM_EMAIL", "no-reply@example.test")
    deliveries = []
    monkeypatch.setattr(
        auth_module,
        "send_password_reset_email",
        lambda email, token: deliveries.append((email, token)),
    )
    assert signup(client).status_code == 201

    existing = client.post(
        "/api/auth/forgot-password",
        headers=csrf_headers(client),
        json={"email": "reader@example.com"},
    )
    missing = client.post(
        "/api/auth/forgot-password",
        headers=csrf_headers(client),
        json={"email": "missing@example.com"},
    )
    assert existing.status_code == missing.status_code == 200
    assert existing.json() == missing.json()
    assert existing.json()["reset_token"] is None
    assert len(deliveries) == 1


def test_profile_updates_only_authenticated_user_and_change_password_revokes_token(client):
    assert signup(client).status_code == 201
    headers = csrf_headers(client)
    updated = client.patch(
        "/api/users/me",
        headers=headers,
        json={"full_name": "New Reader", "email": "new@example.com"},
    )
    assert updated.status_code == 200
    assert updated.json()["full_name"] == "New Reader"
    assert updated.json()["email"] == "new@example.com"
    assert "hashed_password" not in updated.json()

    changed = client.post(
        "/api/auth/change-password",
        headers=csrf_headers(client),
        json={"current_password": PASSWORD, "new_password": "NewSecurePassword456"},
    )
    assert changed.status_code == 200
    assert client.get("/api/auth/me").status_code == 401

    login = client.post(
        "/api/auth/login",
        headers=csrf_headers(client),
        json={"email": "new@example.com", "password": "NewSecurePassword456"},
    )
    assert login.status_code == 200
