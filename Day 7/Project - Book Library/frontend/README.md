# Papertrail frontend refactor

This is a component-based refactor of the supplied Papertrail Book Library React file.

## Structure

- `src/App.jsx` — owns page state, API loading, filters, CRUD handlers, and assembles the page.
- `src/components/Header.jsx` — top navigation bar.
- `src/components/Sidebar.jsx` — brand and library navigation.
- `src/components/Content.jsx` — wrapper for the page's main content.
- `src/components/Footer.jsx` — page footer.
- `src/components/BookCover.jsx` — reusable generated book cover.
- `src/components/BookModal.jsx` — add/edit book form.
- `src/constants/books.js` — shared form defaults and categories.
- `src/services/api.js` — shared API request helper.
- `src/main.jsx` — React entry point.

## Integrate into your existing Vite project

1. Copy the `src` files into your existing frontend project's `src` directory.
2. Keep your existing `package.json`, `index.html`, Vite config, and stylesheet.
3. Ensure `lucide-react` is installed: `npm install lucide-react`.
4. Import your existing stylesheet in `src/main.jsx` (or `src/App.jsx`). The supplied source references CSS class names, but the CSS stylesheet was not included with the uploaded file, so this package does not invent or replace those styles.
5. Run your backend and confirm the API is reachable at `http://127.0.0.1:8000`, or set `VITE_API_URL` in your frontend `.env` file.
6. Start the frontend with your existing Vite script, typically `npm run dev`.

## Important

This refactor preserves the existing CSS class names and API routes. The original stylesheet and backend were not included, so those cannot be verified from this source alone.
