import os
from pathlib import Path

import psycopg
from dotenv import load_dotenv

BACKEND_DIR = Path(__file__).resolve().parents[1]
load_dotenv(BACKEND_DIR / ".env")

database_url = os.getenv("DATABASE_URL", "")
if not database_url.startswith(("postgresql://", "postgresql+psycopg://")):
    raise RuntimeError("DATABASE_URL must point to the existing PostgreSQL database.")
if database_url.startswith("postgresql+psycopg://"):
    database_url = database_url.replace("postgresql+psycopg://", "postgresql://", 1)

migrations = sorted((BACKEND_DIR / "migrations").glob("*.sql"))
if not migrations:
    raise RuntimeError("No SQL migrations were found.")

with psycopg.connect(database_url, autocommit=True) as connection:
    for migration in migrations:
        connection.execute(migration.read_text(encoding="utf-8"), prepare=False)
        print(f"Applied {migration.name}.")

print("Database migrations applied.")
