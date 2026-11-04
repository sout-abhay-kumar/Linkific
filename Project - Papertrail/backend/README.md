# Papertrail API

FastAPI, SQLAlchemy, and PostgreSQL backend for the Papertrail book library.

For the full environment-variable reference, first-run database initialization, migration order, API endpoints, Docker instructions, and tests, see the project [README](../README.md) and [API documentation](../docs/API_DOCUMENTATION.md).

## Run locally

Create `backend/.env` using the variable names and safe local setup described in the project README. No backend `.env.example` is currently provided. From this directory:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
uvicorn app.main:app --reload
```

The application creates missing tables at startup. The explicit PostgreSQL migrations are still needed to upgrade an existing database schema; follow the project README for the required order, especially on a new database where the base `books` table must exist before applying the migrations.
