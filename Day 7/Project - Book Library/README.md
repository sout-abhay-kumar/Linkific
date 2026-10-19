# Book Library — Full-Stack App

A minimal book-library management app built with **React + Vite** (frontend), **FastAPI** (backend), and **SQLite + SQLAlchemy** (database).

## Features
- View, search, and filter books
- Add, edit, and delete books
- Track availability and total copies
- Borrow and return a copy
- Dashboard stats
- SQLite database is created automatically on first backend start
- Responsive, minimal interface

## Requirements
- Python 3.10+
- Node.js 18+

## 1. Start the backend

Open a terminal in `backend/`:

```bash
python -m venv .venv
```

Activate it:
- Windows PowerShell: `.\.venv\Scripts\Activate.ps1`
- macOS/Linux: `source .venv/bin/activate`

Install and run:

```bash
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Backend: http://127.0.0.1:8000  
Interactive API docs: http://127.0.0.1:8000/docs

## 2. Start the frontend

Open a second terminal in `frontend/`:

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually http://localhost:5173).

## Database
SQLite is used by default. The file `backend/library.db` is created automatically when the API starts. To use another SQL database later, configure a SQLAlchemy database URL in `backend/app/database.py`.

## Main API routes
- `GET /api/books` — list/search/filter books
- `POST /api/books` — create a book
- `PUT /api/books/{book_id}` — update a book
- `DELETE /api/books/{book_id}` — delete a book (only if no copies are currently borrowed)
- `POST /api/books/{book_id}/borrow` — borrow a copy
- `POST /api/books/{book_id}/return` — return a copy
- `GET /api/stats` — dashboard totals
- `GET /health` — health check

## Notes
This is a learning project, not a production-ready multi-user library system. Borrowing is tracked as a count on each book, not by individual member accounts. Before deploying publicly, add authentication/authorization, migrations, tests, stronger concurrency handling, and production configuration.
