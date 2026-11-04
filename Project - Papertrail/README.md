# Papertrail — Book Library

Papertrail is a full-stack book-library application for browsing and managing a shared catalogue. The React interface communicates with a FastAPI API backed by PostgreSQL. Signed-in users can manage books they own; administrators can manage all books and view user accounts.

## Project overview

### Current features

- Browse, search by title, and filter the public catalogue by category and availability.
- View book details and library-wide title, copy, availability, and borrowing totals.
- Register, sign in/out, update account details, change a password, and use the password-reset flow.
- Create, edit, delete, borrow, and return books as an owner; administrators can manage any book.
- Use an administrator-only users listing.
- Protect authenticated browser requests with HttpOnly JWT cookies, CSRF checks, and origin validation.
- Responsive interface built with React and Tailwind CSS.

### Technology

| Area | Technology |
|---|---|
| Frontend | React 18, JavaScript, Vite 6, Tailwind CSS 3, React Router |
| Backend | Python, FastAPI, Uvicorn |
| Data | PostgreSQL, SQLAlchemy 2, Psycopg 3 |
| Validation | Pydantic |
| Authentication | JWT in HttpOnly cookies; Argon2 password hashing |
| Containerization | Backend Dockerfile (`python:3.13-slim`) |

The lockfile resolves Vite 6.4.5, which declares support for Node.js 18, 20, and 22 or later. Python 3.10+ is needed for the source's union type syntax; the backend Dockerfile uses Python 3.13. The repository does not pin a PostgreSQL version.

## Screenshots

No application screenshots are currently present in the repository. No images are embedded here, and no placeholder screenshots have been created. Capture genuine screenshots after running the application and save them in `screenshots/`, for example:

| Page | Suggested file |
|---|---|
| Home / library overview | `screenshots/home.png` |
| Book catalogue | `screenshots/books.png` |
| Sign in | `screenshots/login.png` |
| Sign up | `screenshots/signup.png` |
| Profile | `screenshots/profile.png` |
| Admin users (admin account required) | `screenshots/admin-users.png` |

There is no separate page named Dashboard; the home page at `/` is the library overview. Add Markdown image links here once screenshots have been captured.

## Project structure

```text
Project - Papertrail/
├── backend/
│   ├── app/
│   │   ├── main.py                 # FastAPI app, catalogue, book, stats, and category routes
│   │   ├── auth.py                 # Authentication, profile, and password-reset routes
│   │   ├── admin.py                # Administrator user-list route
│   │   ├── models.py               # SQLAlchemy User, Book, and PasswordResetToken models
│   │   ├── schemas.py              # Pydantic request and response models
│   │   ├── database.py             # PostgreSQL engine, session, and declarative base
│   │   └── security.py             # JWT cookies, CSRF/origin checks, and access control
│   ├── migrations/                 # Additive PostgreSQL SQL migrations
│   ├── scripts/apply_migration.py  # Applies numbered SQL migrations
│   ├── tests/                      # Pytest backend tests
│   ├── Dockerfile                  # Backend image definition
│   ├── requirements.txt
│   └── requirements-dev.txt
├── frontend/
│   ├── src/
│   │   ├── components/             # Shared book, navigation, layout, and statistics UI
│   │   ├── pages/                  # Home, books, auth, profile, admin, and informational pages
│   │   ├── context/AuthContext.jsx # Current-user and authentication state
│   │   ├── services/api.js         # Credentialed API client and CSRF handling
│   │   ├── App.jsx                 # Client-side routes and route guards
│   │   ├── constants.js
│   │   └── index.css
│   ├── .env.example                # VITE_API_URL example (empty for local proxy)
│   ├── package.json
│   └── vite.config.js              # Vite server and local API proxy
├── docs/
│   └── API_DOCUMENTATION.md
├── screenshots/                    # Add captured screenshots here
├── .gitignore
└── README.md
```

The frontend has no separate `hooks/` or `utils/` directory. Application UI components are in `frontend/src/components/`, route views in `frontend/src/pages/`, and API calls in `frontend/src/services/api.js`. The backend's routes are grouped in `main.py`, `auth.py`, and `admin.py`.

## Prerequisites

- Git.
- Node.js 18, 20, or 22+ and npm.
- Python 3.10+ (Python 3.13 is used by the backend Dockerfile).
- A running PostgreSQL server and permission to create a database and role.
- Docker Desktop or Docker Engine only if running the backend container.

Verify installed versions with `node --version`, `npm --version`, `python --version`, and `psql --version`. The repository does not pin Node.js or PostgreSQL versions.

## Installation and local setup

### 1. Clone the repository

From PowerShell:

```powershell
git clone https://github.com/sout-abhay-kumar/Linkific.git
Set-Location 'Linkific\Project - Papertrail'
```

Use your repository URL if this project is hosted elsewhere.

### 2. Create a PostgreSQL database

For example, connect to PostgreSQL as an administrator and create a local role and database. Replace the sample password with your own; do not commit it:

```sql
CREATE USER papertrail WITH PASSWORD 'replace-with-a-local-password';
CREATE DATABASE papertrail OWNER papertrail;
```

### 3. Configure the backend environment

There is no `backend/.env.example` in the repository. Create `backend/.env` locally with the settings below. This file is ignored by Git.

```dotenv
DATABASE_URL=postgresql+psycopg://papertrail:replace-with-a-local-password@localhost:5432/papertrail
JWT_SECRET_KEY=replace-with-a-generated-secret
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
ENVIRONMENT=development
FRONTEND_URL=http://localhost:5173
```

Generate a secret locally, then paste its output as `JWT_SECRET_KEY` (the application requires at least 32 bytes):

```powershell
python -c "import secrets; print(secrets.token_urlsafe(48))"
```

`JWT_ALGORITHM` must be `HS256`; `ACCESS_TOKEN_EXPIRE_MINUTES` must be a positive integer. `FRONTEND_URL` is the allowed frontend origin and can contain comma-separated origins. For password-reset email outside development, configure `SMTP_HOST`, `SMTP_PORT` (defaults to `587`), `SMTP_FROM_EMAIL`, and, as appropriate, `SMTP_USERNAME`, `SMTP_PASSWORD`, and `SMTP_USE_TLS` (defaults to `true`). Do not put real credentials in documentation or commit `.env`.

### 4. Install and initialize the backend

```powershell
Set-Location backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
```

The FastAPI application calls SQLAlchemy `create_all()` at startup. For a new, empty database, start it once so the base tables (including `books`) are created, then stop it with Ctrl+C and apply the additive migrations:

```powershell
uvicorn app.main:app --reload
```

In another step after stopping the server:

```powershell
python scripts/apply_migration.py
```

Start the backend again:

```powershell
uvicorn app.main:app --reload
```

If using an existing PostgreSQL database that already has the `books` table, apply the migrations before starting the API. The migration script requires PostgreSQL, applies `backend/migrations/*.sql` in filename order, and the SQL is written to be re-runnable. Back up an existing database before changing its schema. The migrations add authentication/ownership and roles; they do not reassign existing books. Legacy books remain publicly visible but are unowned and read-only to regular users; administrators can manage them.

The API listens at `http://127.0.0.1:8000`. FastAPI Swagger UI is at `http://127.0.0.1:8000/docs`; OpenAPI JSON is at `http://127.0.0.1:8000/openapi.json`. The separate endpoint reference is [docs/API_DOCUMENTATION.md](docs/API_DOCUMENTATION.md).

### 5. Install and run the frontend

In a second PowerShell window opened at `Project - Papertrail/`:

```powershell
Set-Location frontend
npm ci
npm run dev
```

Open `http://localhost:5173`. In local development, Vite proxies `/api` requests to `http://127.0.0.1:8000`; leave `VITE_API_URL` empty as shown in `frontend/.env.example`. For a different API origin, set `VITE_API_URL` and configure the backend's `FRONTEND_URL` and credentialed CORS accordingly.

## Administrator account

Public signup always creates a regular `user` account; there is no public role-promotion endpoint. To promote an account, register it first, then have a trusted operator run this SQL against the configured PostgreSQL database:

```sql
UPDATE users
SET role = 'admin'
WHERE email = lower('admin@example.com');
```

Replace the example email with the intended account. Sign out and sign back in to refresh the role in the frontend. Administrators retain regular-user permissions and can manage any book and list users.

## Security and production notes

- Passwords are hashed with Argon2. JWT access tokens are stored in HttpOnly cookies, not browser local storage.
- Unsafe API requests require a matching CSRF cookie/header and an allowed `Origin`.
- In production, the auth cookie is `Secure` and uses `SameSite=None` for a separately hosted frontend/API. Serve the application over HTTPS and configure the exact frontend origin in `FRONTEND_URL`.
- Signing out clears the browser cookie. Password changes and resets increment the user's token version, invalidating outstanding tokens; otherwise, a copied stateless token remains usable until it expires.
- Password-reset tokens are stored as SHA-256 hashes, expire after 30 minutes, and are single-use.
- The Contact page currently contains static SQLite wording, while the backend connects through PostgreSQL `DATABASE_URL`; its displayed `hello@papertrail.local` address is also not confirmed as a working support address. These application strings were not changed as part of this documentation update.

## Docker

The repository includes a Dockerfile for the backend only; there is no Docker Compose file or frontend container definition.

From `backend/`, build the image:

```powershell
docker build -t papertrail-api .
```

After creating `backend/.env`, run the API:

```powershell
docker run --rm --name papertrail-api -p 8000:8000 --env-file .env papertrail-api
```

The database URL must be reachable from inside the container. With PostgreSQL running on the Docker host, use `host.docker.internal` instead of `localhost` in the container's `DATABASE_URL` on Docker Desktop. The image contains the application but not the migration script; apply migrations from the backend environment on the host when an existing database needs them. Startup still runs SQLAlchemy `create_all()`.

## Tests and production build

Backend tests use pytest:

```powershell
Set-Location backend
python -m pip install -r requirements-dev.txt
python -m pytest
```

Build the frontend:

```powershell
Set-Location frontend
npm ci
npm run build
```

## Future improvements

These are suggestions, not implemented features:

- **Features:** Track individual loans, borrowers, due dates, and loan history instead of only a book's borrowed-copy count.
- **User experience:** Add pagination for large catalogues and more search fields (search currently matches titles); align the Contact page's database wording and replace its placeholder-looking support address before a public release.
- **Security:** Add rate limiting and operational monitoring for authentication and password-reset endpoints; document and exercise production cookie/HTTPS settings.
- **Backend:** Use a versioned migration framework as the single schema-management mechanism and move statistics aggregation into database queries for larger catalogues.
- **Frontend:** Add automated browser-level coverage for authentication, role-gated pages, and book-management flows.
- **Deployment:** Provide a deployment guide and coordinated frontend/API/PostgreSQL orchestration; the repository currently defines only a backend Docker image.
