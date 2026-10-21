# Papertrail — Complete Book Library

A minimal, responsive full-stack book library built with React, Tailwind CSS, FastAPI, and SQLite.

## Features

- Create, read, update, and delete books
- Borrow and return copies
- Search by title, author, or category
- Filter by category and availability
- Library statistics
- Responsive layout with reusable React components
- SQLite persistence
- FastAPI Swagger docs

## Requirements

- Node.js 18+
- Python 3.10+
- Internet connection for first-time npm/pip dependency installation

## 1. Start the backend

Open a terminal:

```bash
cd backend
python -m venv .venv
```

Windows PowerShell:
```powershell
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app.main:app --reload
```

macOS/Linux:
```bash
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Backend runs at `http://127.0.0.1:8000`. API docs: `http://127.0.0.1:8000/docs`.

## 2. Start the frontend

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the URL printed by Vite, usually `http://localhost:5173`.

Optional: copy `frontend/.env.example` to `frontend/.env` if you want to customize `VITE_API_URL`. Restart Vite after changing environment variables.

## Project structure

```text
papertrail-complete/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── database.py
│   │   ├── main.py
│   │   ├── models.py
│   │   └── schemas.py
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── services/api.js
│   │   ├── constants.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
└── README.md
```

## API routes

| Method | Route | Purpose |
|---|---|---|
| GET | `/api/books` | List/search/filter books |
| GET | `/api/stats` | Library statistics |
| GET | `/api/categories` | Category options |
| POST | `/api/books` | Create a book |
| PUT | `/api/books/{id}` | Update a book |
| DELETE | `/api/books/{id}` | Delete a book |
| POST | `/api/books/{id}/borrow` | Borrow one copy |
| POST | `/api/books/{id}/return` | Return one copy |

The database is created automatically on first backend start.
