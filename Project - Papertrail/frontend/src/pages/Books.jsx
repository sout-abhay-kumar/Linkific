import { useCallback, useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import BookModal from "../components/BookModal";
import Content from "../components/Content";
import { CATEGORIES } from "../constants";
import { api } from "../services/api";

const EMPTY_STATS = {
  total_titles: 0,
  total_copies: 0,
  available_copies: 0,
  borrowed_copies: 0,
};

export default function Books() {
  const { refreshLibraryStats } = useOutletContext();
  const [books, setBooks] = useState([]);
  const [stats, setStats] = useState(EMPTY_STATS);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [availability, setAvailability] = useState("All");
  const [categoryOptions, setCategoryOptions] = useState([
    "All",
    ...CATEGORIES,
  ]);
  const [modalBook, setModalBook] = useState(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [bookData, statData, categoriesData] = await Promise.all([
        api.getBooks({ search: search.trim(), category, availability }),
        api.getStats(),
        api.getCategories(),
      ]);
      setBooks(Array.isArray(bookData) ? bookData : []);
      setStats({ ...EMPTY_STATS, ...statData });
      setCategoryOptions([
        "All",
        ...new Set([
          ...CATEGORIES,
          ...(Array.isArray(categoriesData) ? categoriesData : []),
        ]),
      ]);
    } catch (err) {
      setError(err.message || "Could not load the library.");
    } finally {
      setLoading(false);
    }
  }, [availability, category, search]);

  useEffect(() => {
    const timer = window.setTimeout(loadData, 220);
    return () => window.clearTimeout(timer);
  }, [loadData]);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(() => setToast(""), 2600);
    return () => window.clearTimeout(timer);
  }, [toast]);

  async function reloadAfterChange() {
    await Promise.all([loadData(), refreshLibraryStats()]);
  }

  async function saveBook(payload) {
    const editing = Boolean(modalBook?.id);
    if (editing) await api.updateBook(modalBook.id, payload);
    else await api.createBook(payload);
    setModalBook(undefined);
    setToast(editing ? "Book details updated" : "Book added to your library");
    await reloadAfterChange();
  }

  async function deleteBook(book) {
    if (!window.confirm(`Delete “${book.title}” from your library?`)) return;
    try {
      await api.deleteBook(book.id);
      setToast("Book removed from your library");
      await reloadAfterChange();
    } catch (err) {
      setError(err.message || "Could not delete the book.");
    }
  }

  async function bookAction(book, action) {
    try {
      if (action === "borrow") await api.borrowBook(book.id);
      else await api.returnBook(book.id);
      setToast(
        action === "borrow"
          ? "Book marked as borrowed"
          : "Book returned successfully",
      );
      await reloadAfterChange();
    } catch (err) {
      setError(err.message || "Could not update the book.");
    }
  }

  return (
    <>
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
        onEdit={setModalBook}
        onDelete={deleteBook}
        onBorrow={(book) => bookAction(book, "borrow")}
        onReturn={(book) => bookAction(book, "return")}
        onDismissError={() => setError("")}
        onClearFilters={() => {
          setSearch("");
          setCategory("All");
          setAvailability("All");
        }}
      />
      {modalBook !== undefined && (
        <BookModal
          key={modalBook?.id ?? "new-book"}
          book={modalBook}
          onClose={() => setModalBook(undefined)}
          onSave={saveBook}
        />
      )}
      {toast && (
        <div
          role="status"
          className="fixed bottom-5 left-1/2 z-[60] flex -translate-x-1/2 items-center gap-2 rounded-xl bg-stone-900 px-4 py-3 text-sm text-white shadow-lg"
        >
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          {toast}
        </div>
      )}
    </>
  );
}
