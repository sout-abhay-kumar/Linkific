import { useCallback, useEffect, useState } from "react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Content from "./components/Content";
import BookModal from "./components/BookModal";
import { api } from "./services/api";
import { CATEGORIES } from "./constants";

const EMPTY_STATS = { total_titles: 0, total_copies: 0, available_copies: 0, borrowed_copies: 0 };

export default function App() {
  const [books, setBooks] = useState([]);
  const [stats, setStats] = useState(EMPTY_STATS);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [availability, setAvailability] = useState("All");
  const [categoryOptions, setCategoryOptions] = useState(["All", ...CATEGORIES]);
  const [modalBook, setModalBook] = useState(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");

  const loadData = useCallback(async () => {
    setError("");
    try {
      const [bookData, statData, categoriesData] = await Promise.all([
        api.getBooks({ search: search.trim(), category, availability }),
        api.getStats(),
        api.getCategories()
      ]);
      setBooks(Array.isArray(bookData) ? bookData : []);
      setStats({ ...EMPTY_STATS, ...statData });
      setCategoryOptions(["All", ...new Set([...CATEGORIES, ...(Array.isArray(categoriesData) ? categoriesData : [])])]);
    } catch (err) {
      setError(err.message || "Could not load the library.");
    } finally {
      setLoading(false);
    }
  }, [search, category, availability]);

  useEffect(() => {
    const timer = window.setTimeout(loadData, 200);
    return () => window.clearTimeout(timer);
  }, [loadData]);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(() => setToast(""), 2600);
    return () => window.clearTimeout(timer);
  }, [toast]);

  async function saveBook(payload) {
    if (modalBook?.id) await api.updateBook(modalBook.id, payload);
    else await api.createBook(payload);
    setModalBook(undefined);
    setToast(modalBook?.id ? "Book details updated" : "Book added to your library");
    await loadData();
  }

  async function deleteBook(book) {
    if (!window.confirm(`Delete “${book.title}” from your library?`)) return;
    try {
      await api.deleteBook(book.id);
      setToast("Book removed from your library");
      await loadData();
    } catch (err) {
      setError(err.message || "Could not delete the book.");
    }
  }

  async function bookAction(book, action) {
    try {
      if (action === "borrow") await api.borrowBook(book.id);
      else await api.returnBook(book.id);
      setToast(action === "borrow" ? "Book marked as borrowed" : "Book returned successfully");
      await loadData();
    } catch (err) {
      setError(err.message || "Could not update the book.");
    }
  }

  return (
    <div className="min-h-screen md:flex">
      <Sidebar totalTitles={stats.total_titles} />
      <div className="min-w-0 flex-1">
        <Header />
        <Content
          stats={stats}
          books={books}
          loading={loading}
          error={error}
          search={search}
          setSearch={setSearch}
          category={category}
          setCategory={setCategory}
          availability={availability}
          setAvailability={setAvailability}
          categoryOptions={categoryOptions}
          onAdd={() => setModalBook(null)}
          onEdit={(book) => setModalBook(book)}
          onDelete={deleteBook}
          onBorrow={(book) => bookAction(book, "borrow")}
          onReturn={(book) => bookAction(book, "return")}
          onDismissError={() => setError("")}
          onClearFilters={() => { setSearch(""); setCategory("All"); setAvailability("All"); }}
        />
      </div>
      {modalBook !== undefined && <BookModal key={modalBook?.id ?? "new-book"} book={modalBook} onClose={() => setModalBook(undefined)} onSave={saveBook} />}
      {toast && <div role="status" className="fixed bottom-5 left-1/2 z-[60] flex -translate-x-1/2 items-center gap-2 rounded-xl bg-stone-900 px-4 py-3 text-sm text-white shadow-lg"><span className="h-2 w-2 rounded-full bg-emerald-400" />{toast}</div>}
    </div>
  );
}
