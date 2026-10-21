# Papertrail — React + Tailwind CSS

A minimal, responsive book library frontend built with React, Vite, Tailwind CSS, and Lucide icons.

## Features

- Responsive sidebar and header
- Book catalogue with cover placeholders
- Search by title, author, or category
- Category and availability filters
- Add, edit, and delete books
- Borrow and return copies
- Statistics cards and clear error/loading states
- Reusable components and API service module

## Requirements

- Node.js 18+
- The matching FastAPI backend running at `http://127.0.0.1:8000`

## Run

```bash
npm install
cp .env.example .env
npm run dev
```

On Windows PowerShell, if `cp` is unavailable, use:

```powershell
Copy-Item .env.example .env
```

Then open the local URL printed by Vite, normally `http://localhost:5173`.

## API contract

The frontend expects these endpoints:

- `GET /api/books?search=&category=&availability=`
- `GET /api/stats`
- `GET /api/categories`
- `POST /api/books`
- `PUT /api/books/{id}`
- `DELETE /api/books/{id}`
- `POST /api/books/{id}/borrow`
- `POST /api/books/{id}/return`

Book JSON fields expected by the UI: `id`, `title`, `author`, `category`, `published_year`, `description`, `total_copies`, `available_copies`, `borrowed_copies`.

Set `VITE_API_URL` in `.env` if your backend runs at another address.

## Folder structure

```text
src/
  components/
    BookCard.jsx
    BookCover.jsx
    BookModal.jsx
    Content.jsx
    Footer.jsx
    Header.jsx
    Sidebar.jsx
    Stats.jsx
  constants.js
  services/api.js
  App.jsx
  main.jsx
  index.css
```

Tailwind is configured in `tailwind.config.js` and `postcss.config.js`.
