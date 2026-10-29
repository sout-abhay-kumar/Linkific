# Papertrail — Book Library

A calm, responsive book library built with React, Tailwind CSS, FastAPI, SQLAlchemy, and PostgreSQL.

## Features

- Public book catalogue, search, filters, and library statistics
- User signup, login, logout, profile updates, and password changes
- HttpOnly JWT cookies with CSRF and origin checks
- Owner-only book creation, updates, deletion, borrowing, and returns
- Admin/User roles with an admin-only user list and cross-owner book management
- Single-use, expiring password-reset tokens
- Responsive Papertrail interface with accessible form controls

## Database migration and existing books

The migrations in `backend/migrations/` are additive. `001_auth_and_book_ownership.sql` creates the `users` and `password_reset_tokens` tables and adds a **nullable** `owner_id` column and foreign key to `books`. It does not update, delete, reassign, or recreate any book rows. Existing books remain unowned (`owner_id IS NULL`), publicly visible, and read-only. New books are assigned to the authenticated user. `002_add_user_roles.sql` adds the `role` column with a `user` default and a constraint limiting roles to `user` and `admin`; existing user rows receive the `user` default.

The application no longer creates or alters tables on import or startup. Review and apply the migration explicitly to the PostgreSQL database configured in `backend/.env`:

1. Keep the existing `.env` and its `DATABASE_URL`; do not replace it with `.env.example`.
2. Add the auth settings from `backend/.env.example`. Generate a unique secret with `python -c "import secrets; print(secrets.token_urlsafe(48))"` and use the output as `JWT_SECRET_KEY`.
3. From `backend`, run `python scripts/apply_migration.py`. The script rejects non-PostgreSQL URLs and applies the numbered SQL migrations in order, each in a transaction. The migrations are designed to be re-runnable.
4. Back up the database according to your normal operational procedure before applying any schema migration.

Do not run the migrations against a different database than the one the application uses.

### Admin account setup

Public registration always creates a `user` account and rejects any submitted `role` field. To promote an account to administrator, first register it, then have an operator with PostgreSQL access run:

```sql
UPDATE users
SET role = 'admin'
WHERE email = lower('admin@example.com');
```

Replace the example address with the intended account. Do not expose this database operation through the public API. The user must sign out and sign back in for the frontend to receive the updated role.

Admins can use the Users page and list users through `GET /api/admin/users`. Admins retain regular-user permissions and can also manage any book; regular users can only manage their own books. Authorization is checked against the current database user on each protected API request. The React route and navigation checks only control the interface and do not replace backend authorization.

## Backend setup

From `backend`, create and activate a virtual environment, then install dependencies:

```powershell
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

Configure `DATABASE_URL`, `JWT_SECRET_KEY`, `JWT_ALGORITHM=HS256`, `ACCESS_TOKEN_EXPIRE_MINUTES`, `FRONTEND_URL`, and `ENVIRONMENT` in `backend/.env`. Use `ENVIRONMENT=development` locally and `ENVIRONMENT=production` behind HTTPS. Start the server after applying the migration:

```powershell
uvicorn app.main:app --reload
```

The API is available at `http://127.0.0.1:8000`; interactive docs are at `/docs`.

### Password reset email

In development, the reset endpoint returns a one-time reset token to the frontend so the flow can be exercised without an email provider. This response is disabled outside development. For production, configure `SMTP_HOST`, `SMTP_PORT`, `SMTP_USERNAME`, `SMTP_PASSWORD`, `SMTP_FROM_EMAIL`, and (normally) `SMTP_USE_TLS=true`. Without SMTP configured, password-reset requests return a service-unavailable response and never include a token. Reset tokens are stored only as SHA-256 hashes, expire after 30 minutes, and can be used once.

## Frontend setup

From `frontend`, install packages and start Vite:

```powershell
npm install
npm run dev
```

Open `http://localhost:5173`. Vite proxies `/api` to the local FastAPI server, keeping browser API requests same-origin during development. `VITE_API_URL` may be set to a different API origin when needed; credentialed cross-origin production deployments must use HTTPS, an exact `FRONTEND_URL` allowlist, and a deployment that permits secure cookies.

## API routes

| Method | Route | Access |
|---|---|---|
| GET | `/api/auth/csrf` | Public; initializes CSRF cookie |
| POST | `/api/auth/signup` | Public + CSRF |
| POST | `/api/auth/login` | Public + CSRF |
| GET | `/api/auth/me` | Authenticated |
| GET | `/api/admin/users` | Admin |
| POST | `/api/auth/logout` | Authenticated + CSRF |
| POST | `/api/auth/forgot-password` | Public + CSRF |
| POST | `/api/auth/reset-password` | Public + CSRF |
| POST | `/api/auth/change-password` | Authenticated + CSRF |
| PATCH | `/api/users/me` | Authenticated + CSRF |
| GET | `/api/books`, `/api/books/{id}` | Public |
| GET | `/api/stats`, `/api/categories` | Public |
| POST/PUT/DELETE | `/api/books[/{id}]` | Owner or admin + CSRF |
| POST | `/api/books/{id}/borrow` or `/return` | Owner or admin + CSRF |

Book-changing routes return `404` for books a regular user does not own, including legacy unowned entries. Public catalogue responses include `is_owner` and `can_manage` flags for UI controls without exposing user IDs.

## Security notes

- JWTs are only set in HttpOnly cookies; passwords and access tokens are not stored in browser local storage.
- Unsafe requests require a matching CSRF cookie/header and an allowed `Origin`. CORS credentials are enabled only for configured origins.
- Local cookies use `SameSite=Lax` without `Secure`; production cookies use `Secure` and `SameSite=None` to support a separately hosted frontend/API. HTTPS is required in production.
- Logout clears the browser cookie. Since access JWTs are stateless, a copied token can remain usable until its configured expiry; changing or resetting a password increments the user's token version and invalidates outstanding sessions.

## Tests

The backend tests use isolated in-memory SQLite databases; they do not connect to or alter the configured PostgreSQL database:

```powershell
cd backend
pip install -r requirements-dev.txt
python -m pytest
```

Frontend production build:

```powershell
cd frontend
npm run build
```
