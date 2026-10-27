# Papertrail API

FastAPI, SQLAlchemy, and PostgreSQL backend for the Papertrail book library.

See the project [README](../README.md) for the additive database migration, environment setup, auth/API behavior, SMTP configuration, and test instructions.

## Run locally

From this directory, create and activate a virtual environment:

```powershell
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

Keep the existing `.env` and its PostgreSQL `DATABASE_URL`. Add the authentication variables from `.env.example`, generate a unique `JWT_SECRET_KEY`, review and apply the migration, then start FastAPI:

```powershell
python scripts/apply_migration.py
uvicorn app.main:app --reload
```

The migration adds auth tables and a nullable owner reference without changing existing book records. It is not applied automatically at startup.
