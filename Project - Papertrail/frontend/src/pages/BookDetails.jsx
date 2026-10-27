import { useCallback, useEffect, useState } from "react";
import {
  ArrowLeft,
  BookOpen,
  Hand,
  Pencil,
  RotateCcw,
  Trash2,
} from "lucide-react";
import {
  Link,
  useNavigate,
  useOutletContext,
  useParams,
} from "react-router-dom";
import BookCover from "../components/BookCover";
import BookModal from "../components/BookModal";
import { api } from "../services/api";

export default function BookDetails() {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const { refreshLibraryStats } = useOutletContext();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [working, setWorking] = useState(false);
  const [toast, setToast] = useState("");

  const loadBook = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await api.getBook(bookId);
      setBook(data);
    } catch (err) {
      setBook(null);
      setError(err.message || "Could not load this book.");
    } finally {
      setLoading(false);
    }
  }, [bookId]);

  useEffect(() => {
    loadBook();
  }, [loadBook]);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(() => setToast(""), 2600);
    return () => window.clearTimeout(timer);
  }, [toast]);

  async function changeAvailability(action) {
    setWorking(true);
    setError("");
    try {
      if (action === "borrow") await api.borrowBook(book.id);
      else await api.returnBook(book.id);
      await Promise.all([loadBook(), refreshLibraryStats()]);
      setToast(
        action === "borrow"
          ? "Book marked as borrowed"
          : "Book returned successfully",
      );
    } catch (err) {
      setError(err.message || "Could not update the book.");
    } finally {
      setWorking(false);
    }
  }

  async function saveBook(payload) {
    await api.updateBook(book.id, payload);
    setModalOpen(false);
    await Promise.all([loadBook(), refreshLibraryStats()]);
    setToast("Book details updated");
  }

  async function deleteBook() {
    if (!window.confirm(`Delete “${book.title}” from your library?`)) return;
    setWorking(true);
    setError("");
    try {
      await api.deleteBook(book.id);
      await refreshLibraryStats();
      navigate("/books", { replace: true });
    } catch (err) {
      setError(err.message || "Could not delete the book.");
      setWorking(false);
    }
  }

  if (loading) {
    return (
      <div className="grid min-h-80 place-items-center text-sm text-stone-500">
        <div className="text-center">
          <div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-stone-200 border-t-[#55745f]" />
          <p className="mt-3">Finding this book…</p>
        </div>
      </div>
    );
  }

  if (error && !book) {
    return (
      <section className="mx-auto max-w-xl rounded-2xl border border-red-200 bg-white p-7 text-center shadow-sm">
        <BookOpen className="mx-auto text-red-400" size={30} />
        <h1 className="mt-4 text-xl font-semibold text-stone-900">
          This book is unavailable
        </h1>
        <p role="alert" className="mt-2 text-sm leading-6 text-stone-600">
          {error}
        </p>
        <div className="mt-5 flex justify-center gap-3">
          <button type="button" onClick={loadBook} className="btn-secondary">
            Try again
          </button>
          <Link to="/books" className="btn-primary">
            Back to books
          </Link>
        </div>
      </section>
    );
  }

  const available = Number(book.available_copies || 0);
  const borrowed = Number(book.borrowed_copies || 0);

  return (
    <section className="mx-auto max-w-4xl">
      <Link
        to="/books"
        className="inline-flex items-center gap-2 text-sm font-semibold text-[#47654e] hover:text-[#263f2d]"
      >
        <ArrowLeft size={16} /> Back to books
      </Link>
      {error && (
        <div
          role="alert"
          className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      <article className="mt-5 rounded-3xl border border-stone-200 bg-white p-6 shadow-sm sm:p-9">
        <div className="flex flex-col gap-7 sm:flex-row sm:items-start">
          <BookCover book={book} large />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-md bg-[#edf2ec] px-2.5 py-1 text-xs font-semibold text-[#48664f]">
                {book.category || "General"}
              </span>
              {book.published_year && (
                <span className="text-sm text-stone-400">
                  Published {book.published_year}
                </span>
              )}
            </div>
            <h1 className="mt-4 break-words text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl">
              {book.title}
            </h1>
            <p className="mt-2 text-base text-stone-500">by {book.author}</p>
            <p className="mt-6 max-w-2xl whitespace-pre-wrap text-sm leading-7 text-stone-600">
              {book.description ||
                "No description has been added for this book yet."}
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-4 border-y border-stone-100 py-5 sm:grid-cols-3">
          <div>
            <p className="text-xs font-medium text-stone-400">Total copies</p>
            <p className="mt-1 text-2xl font-semibold text-stone-900">
              {book.total_copies}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium text-stone-400">Available now</p>
            <p className="mt-1 text-2xl font-semibold text-[#47654e]">
              {available}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium text-stone-400">
              Currently borrowed
            </p>
            <p className="mt-1 text-2xl font-semibold text-stone-900">
              {borrowed}
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          {book.is_owner ? (
            <>
              <div className="flex flex-wrap gap-3">
                {available > 0 && (
                  <button
                    type="button"
                    disabled={working}
                    onClick={() => changeAvailability("borrow")}
                    className="btn-primary disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <Hand size={16} /> Borrow a copy
                  </button>
                )}
                {borrowed > 0 && (
                  <button
                    type="button"
                    disabled={working}
                    onClick={() => changeAvailability("return")}
                    className="btn-secondary disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <RotateCcw size={16} /> Return a copy
                  </button>
                )}
                {available === 0 && borrowed === 0 && (
                  <span className="text-sm text-stone-500">
                    No copies are currently available.
                  </span>
                )}
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(true)}
                  className="btn-secondary"
                >
                  <Pencil size={15} /> Edit
                </button>
                <button
                  type="button"
                  disabled={working}
                  onClick={deleteBook}
                  className="inline-flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Trash2 size={15} /> Delete
                </button>
              </div>
            </>
          ) : (
            <p className="text-sm text-stone-500">
              This public catalogue entry is read-only.{" "}
              <Link to="/login" className="font-semibold text-[#47654e] hover:underline">
                Sign in to manage your own books.
              </Link>
            </p>
          )}
        </div>
      </article>
      {modalOpen && (
        <BookModal
          book={book}
          onClose={() => setModalOpen(false)}
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
    </section>
  );
}
