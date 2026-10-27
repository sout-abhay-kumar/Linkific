# Papertrail frontend

Responsive React, Vite, Tailwind CSS, and Lucide UI for the Papertrail book library.

## Features

- Public catalogue, book details, search, filters, and statistics
- Papertrail-styled login, signup, forgot/reset password, and profile pages
- Protected profile route and initialization of the current session on app load
- Credentialed API requests with HttpOnly cookies and CSRF headers
- Owner-only book controls

## Run

Start the FastAPI backend and configure the PostgreSQL database first. Then:

```powershell
npm install
npm run dev
```

Vite serves the frontend at `http://localhost:5173` and proxies `/api` to `http://127.0.0.1:8000`. Leave `VITE_API_URL` empty for local development. If using a remote API, set `VITE_API_URL` to its base URL and configure the backend's exact `FRONTEND_URL` and credentialed CORS settings.

For backend setup, migration, environment variables, and security details, see the project [README](../README.md).
