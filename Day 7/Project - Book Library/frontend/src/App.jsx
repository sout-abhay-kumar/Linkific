import { useCallback, useEffect, useMemo, useState } from "react";
import {
  BookOpen, Plus, Search, LibraryBig, BookMarked, CheckCircle2, Clock3,
  Pencil, Trash2, X, ChevronDown, ArrowUpRight, RotateCcw, Hand
} from "lucide-react";

const API = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

async function request(path, options = {}) {
  const response = await fetch(`${API}${path}`, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options
  });
  if (!response.ok) {
    let message = "Something went wrong. Please try again.";
    try {
      const body = await response.json();
      message = typeof body.detail === "string" ? body.detail : message;
    } catch {}
    throw new Error(message);
  }
  if (response.status === 204) return null;
  return response.json();
}

const emptyForm = {
  title: "", author: "", category: "Fiction", published_year: "",
  description: "", total_copies: 1
};

const categories = ["Fiction", "Technology", "Personal Growth", "History", "Science", "Biography", "General"];

function BookCover({ book, large = false }) {
  const palettes = [
    ["#dce8df", "#355c4b"], ["#f2dfcc", "#8c5638"], ["#dce2f5", "#45558a"],
    ["#f1dfe4", "#9a536a"], ["#e7e2d8", "#665b49"], ["#d8e9ee", "#3d6977"]
  ];
  const palette = palettes[(book.id || 0) % palettes.length];
  const initials = book.title.split(/\s+/).slice(0, 2).map(w => w[0]).join("").toUpperCase();
  return (
    <div className={`book-cover ${large ? "book-cover-large" : ""}`} style={{ "--cover-bg": palette[0], "--cover-ink": palette[1] }}>
      <span className="cover-mark"><BookOpen size={large ? 27 : 21} strokeWidth={1.5} /></span>
      <span className="cover-initials">{initials}</span>
      <span className="cover-rule" />
      <span className="cover-mini">{book.category || "BOOK"}</span>
    </div>
  );
}

function BookModal({ book, onClose, onSave }) {
  const [form, setForm] = useState(book ? {
    title: book.title, author: book.author, category: book.category,
    published_year: book.published_year ?? "", description: book.description,
    total_copies: book.total_copies
  } : emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const update = (key, value) => setForm(old => ({ ...old, [key]: value }));

  async function submit(e) {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      await onSave({
        ...form,
        title: form.title.trim(),
        author: form.author.trim(),
        category: form.category.trim() || "General",
        published_year: form.published_year === "" ? null : Number(form.published_year),
        total_copies: Number(form.total_copies)
      });
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="modal-backdrop" onMouseDown={e => e.target === e.currentTarget && onClose()}>
      <section className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div className="modal-head">
          <div>
            <p className="eyebrow">{book ? "UPDATE CATALOGUE" : "GROW YOUR COLLECTION"}</p>
            <h2 id="modal-title">{book ? "Edit book" : "Add a new book"}</h2>
          </div>
          <button className="icon-button" onClick={onClose} aria-label="Close"><X size={19} /></button>
        </div>
        <form onSubmit={submit} className="book-form">
          <label>Book title<input required maxLength="180" value={form.title} onChange={e => update("title", e.target.value)} placeholder="e.g. The Midnight Library" /></label>
          <div className="form-row">
            <label>Author<input required maxLength="120" value={form.author} onChange={e => update("author", e.target.value)} placeholder="Author name" /></label>
            <label>Category
              <select value={form.category} onChange={e => update("category", e.target.value)}>
                {categories.map(c => <option key={c}>{c}</option>)}
              </select>
            </label>
          </div>
          <div className="form-row">
            <label>Published year<input type="number" min="1000" max="2100" value={form.published_year} onChange={e => update("published_year", e.target.value)} placeholder="Optional" /></label>
            <label>Total copies<input required type="number" min="1" max="10000" value={form.total_copies} onChange={e => update("total_copies", e.target.value)} /></label>
          </div>
          <label>Description <span className="optional">Optional</span><textarea rows="3" maxLength="3000" value={form.description} onChange={e => update("description", e.target.value)} placeholder="A short note about this book..." /></label>
          {error && <p className="form-error">{error}</p>}
          <div className="modal-actions">
            <button type="button" className="button button-quiet" onClick={onClose}>Cancel</button>
            <button type="submit" className="button button-primary" disabled={saving}>{saving ? "Saving..." : book ? "Save changes" : "Add book"}</button>
          </div>
        </form>
      </section>
    </div>
  );
}

function App() {
  const [books, setBooks] = useState([]);
  const [stats, setStats] = useState({ total_titles: 0, total_copies: 0, available_copies: 0, borrowed_copies: 0 });
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [availability, setAvailability] = useState("All");
  const [categoryOptions, setCategoryOptions] = useState(["All", ...categories]);
  const [modalBook, setModalBook] = useState(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");

  const loadData = useCallback(async () => {
    setError("");
    try {
      const params = new URLSearchParams();
      if (search.trim()) params.set("search", search.trim());
      if (category !== "All") params.set("category", category);
      if (availability !== "All") params.set("availability", availability);
      const [bookData, statData, cats] = await Promise.all([
        request(`/api/books?${params.toString()}`), request("/api/stats"), request("/api/categories")
      ]);
      setBooks(bookData);
      setStats(statData);
      setCategoryOptions(["All", ...new Set([...categories, ...cats])]);
    } catch (err) {
      setError(`${err.message} Make sure the FastAPI backend is running on ${API}.`);
    } finally {
      setLoading(false);
    }
  }, [search, category, availability]);

  useEffect(() => {
    const timer = setTimeout(loadData, 220);
    return () => clearTimeout(timer);
  }, [loadData]);

  const flash = (message) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2600);
  };

  async function saveBook(payload) {
    if (modalBook) await request(`/api/books/${modalBook.id}`, { method: "PUT", body: JSON.stringify(payload) });
    else await request("/api/books", { method: "POST", body: JSON.stringify(payload) });
    await loadData();
    flash(modalBook ? "Book details updated" : "Book added to your library");
  }

  async function deleteBook(book) {
    if (!window.confirm(`Delete “${book.title}” from your library?`)) return;
    try {
      await request(`/api/books/${book.id}`, { method: "DELETE" });
      await loadData();
      flash("Book removed from your library");
    } catch (err) { setError(err.message); }
  }

  async function bookAction(book, action) {
    try {
      await request(`/api/books/${book.id}/${action}`, { method: "POST" });
      await loadData();
      flash(action === "borrow" ? "Book marked as borrowed" : "Book returned successfully");
    } catch (err) { setError(err.message); }
  }

  const visibleCount = useMemo(() => books.length, [books]);

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark"><BookOpen size={21} /></div>
          <div><strong>papertrail</strong><span>YOUR PERSONAL LIBRARY</span></div>
        </div>
        <div className="side-label">WORKSPACE</div>
        <button className="nav-item active"><LibraryBig size={18} /><span>Library</span><span className="nav-count">{stats.total_titles}</span></button>
        <div className="sidebar-note">
          <div className="note-icon"><BookMarked size={18} /></div>
          <p className="note-title">A little more reading.</p>
          <p className="note-copy">Keep your collection organized, one page at a time.</p>
        </div>
        <div className="sidebar-footer"><span className="status-dot" /> Library is ready for your next chapter.</div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="breadcrumb">Workspace <span>/</span> <strong>Library</strong></div>
          <div className="topbar-right"><span className="online-indicator" /> <span>Local library</span><div className="avatar">L</div></div>
        </header>

        <section className="page-intro">
          <div>
            <p className="eyebrow">MONDAY, YOUR WAY</p>
            <h1>Your library<span>.</span></h1>
            <p className="subtitle">A calm place to keep track of the books you love.</p>
          </div>
          <button className="button button-primary add-button" onClick={() => setModalBook(null)}><Plus size={17} /> Add a book</button>
        </section>

        {error && <div className="error-banner"><span>{error}</span><button onClick={() => setError("")} aria-label="Dismiss"><X size={16} /></button></div>}

        <section className="stats-grid" aria-label="Library statistics">
          <div className="stat-card"><div className="stat-top"><span>Total titles</span><div className="stat-icon icon-lilac"><LibraryBig size={18} /></div></div><div className="stat-number">{stats.total_titles}</div><div className="stat-foot">Unique books in your collection</div></div>
          <div className="stat-card"><div className="stat-top"><span>Copies available</span><div className="stat-icon icon-green"><CheckCircle2 size={18} /></div></div><div className="stat-number">{stats.available_copies}</div><div className="stat-foot">Ready to be borrowed</div></div>
          <div className="stat-card"><div className="stat-top"><span>Currently borrowed</span><div className="stat-icon icon-amber"><Clock3 size={18} /></div></div><div className="stat-number">{stats.borrowed_copies}</div><div className="stat-foot">Copies away from the shelf</div></div>
        </section>

        <section className="catalogue-section">
          <div className="section-heading">
            <div><h2>Book catalogue</h2><p>Browse, manage, and discover your collection.</p></div>
            <span className="results-count">{visibleCount} {visibleCount === 1 ? "book" : "books"}</span>
          </div>
          <div className="toolbar">
            <div className="search-box"><Search size={17} /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search title, author, category..." aria-label="Search books" />{search && <button onClick={() => setSearch("")} aria-label="Clear search"><X size={15} /></button>}</div>
            <label className="select-wrap"><span className="sr-only">Category</span><select value={category} onChange={e => setCategory(e.target.value)}>{categoryOptions.map(c => <option key={c}>{c}</option>)}</select><ChevronDown size={15} /></label>
            <label className="select-wrap"><span className="sr-only">Availability</span><select value={availability} onChange={e => setAvailability(e.target.value)}><option>All</option><option>Available</option><option>Borrowed</option></select><ChevronDown size={15} /></label>
          </div>

          {loading ? <div className="empty-state"><div className="spinner" /><p>Opening your library...</p></div> :
            books.length === 0 ? <div className="empty-state"><div className="empty-icon"><BookOpen size={25} /></div><h3>No books found</h3><p>Try another search or add a new book to your collection.</p><button className="button button-secondary" onClick={() => { setSearch(""); setCategory("All"); setAvailability("All"); }}>Clear filters</button></div> :
            <div className="book-grid">
              {books.map(book => (
                <article className="book-card" key={book.id}>
                  <div className="card-cover-row">
                    <BookCover book={book} />
                    <div className="card-actions">
                      <button className="icon-button small" onClick={() => setModalBook(book)} title="Edit book" aria-label={`Edit ${book.title}`}><Pencil size={15} /></button>
                      <button className="icon-button small danger-hover" onClick={() => deleteBook(book)} title="Delete book" aria-label={`Delete ${book.title}`}><Trash2 size={15} /></button>
                    </div>
                  </div>
                  <div className="book-meta"><span className="category-tag">{book.category}</span>{book.published_year && <span className="book-year">{book.published_year}</span>}</div>
                  <h3 className="book-title" title={book.title}>{book.title}</h3>
                  <p className="book-author">by {book.author}</p>
                  {book.description && <p className="book-description">{book.description}</p>}
                  <div className="card-divider" />
                  <div className="availability-row">
                    <span className={`availability-dot ${book.available_copies > 0 ? "available" : "unavailable"}`} />
                    <span>{book.available_copies > 0 ? `${book.available_copies} of ${book.total_copies} available` : "All copies borrowed"}</span>
                  </div>
                  <div className="card-bottom">
                    {book.available_copies > 0 ?
                      <button className="text-action" onClick={() => bookAction(book, "borrow")}><Hand size={14} /> Borrow a copy <ArrowUpRight size={14} /></button> :
                      <button className="text-action muted-action" disabled><Hand size={14} /> No copies available</button>}
                    {book.borrowed_copies > 0 && <button className="return-action" onClick={() => bookAction(book, "return")}><RotateCcw size={13} /> Return</button>}
                  </div>
                </article>
              ))}
            </div>
          }
        </section>
        <footer className="page-footer"><span>Made for the love of reading.</span><span>Papertrail Library <span className="footer-dot">·</span> v1.0</span></footer>
      </main>

      {modalBook !== undefined && <BookModal book={modalBook || null} onClose={() => setModalBook(undefined)} onSave={saveBook} />}
      {toast && <div className="toast"><CheckCircle2 size={17} /> {toast}</div>}
    </div>
  );
}

export default App;
