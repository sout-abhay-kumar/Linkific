import { useCallback, useEffect, useState } from "react";
import { ArrowRight, BookOpen } from "lucide-react";
import { Link, useOutletContext } from "react-router-dom";
import BookCard from "../components/BookCard";
import Stats from "../components/Stats";
import { api } from "../services/api";

const EMPTY_STATS = { total_titles: 0, total_copies: 0, available_copies: 0, borrowed_copies: 0 };

export default function Home() {
  const { refreshLibraryStats } = useOutletContext();
  const [stats, setStats] = useState(EMPTY_STATS);
  const [recentBooks, setRecentBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadHome = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [statData, bookData] = await Promise.all([api.getStats(), api.getBooks()]);
      setStats({ ...EMPTY_STATS, ...statData });
      setRecentBooks(Array.isArray(bookData) ? bookData.slice(0, 3) : []);
      refreshLibraryStats();
    } catch (err) {
      setError(err.message || "Could not load the library overview.");
    } finally {
      setLoading(false);
    }
  }, [refreshLibraryStats]);

  useEffect(() => {
    loadHome();
  }, [loadHome]);

  return (
    <section>
      <section className="rounded-3xl border border-[#e5e1d8] bg-white px-6 py-8 shadow-sm sm:px-9 sm:py-10">
        <p className="text-[10px] font-bold tracking-[.2em] text-[#55745f]">YOUR READING SPACE</p>
        <div className="mt-3 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <h1 className="text-3xl font-semibold tracking-tight text-stone-900 sm:text-5xl">A thoughtful home for every book.</h1>
            <p className="mt-4 max-w-xl text-sm leading-6 text-stone-600 sm:text-base">Papertrail keeps your collection clear, calm, and ready for the next chapter.</p>
          </div>
          <Link to="/books" className="btn-primary self-start lg:self-auto">Explore your books <ArrowRight size={16} /></Link>
        </div>
      </section>

      <section className="mt-8">
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-stone-900">At a glance</h2>
            <p className="mt-1 text-sm text-stone-500">A small summary of your shelves.</p>
          </div>
          <Link to="/books" className="text-sm font-semibold text-[#47654e] hover:text-[#263f2d]">Manage library</Link>
        </div>
        {loading ? <div className="grid min-h-40 place-items-center rounded-2xl border border-stone-200 bg-white text-sm text-stone-500">Loading your overview…</div> : <Stats stats={stats} />}
      </section>

      <section className="mt-9">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <h2 className="text-lg font-semibold text-stone-900">Recently added</h2>
            <p className="mt-1 text-sm text-stone-500">The latest titles in your collection.</p>
          </div>
          <Link to="/books" className="text-sm font-semibold text-[#47654e] hover:text-[#263f2d]">View all books <ArrowRight className="ml-1 inline" size={15} /></Link>
        </div>

        {error ? (
          <div role="alert" className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
            <p>{error}</p>
            <button type="button" onClick={loadHome} className="mt-3 font-semibold underline underline-offset-2">Try again</button>
          </div>
        ) : loading ? (
          <div className="mt-5 grid min-h-52 place-items-center text-sm text-stone-500"><div className="text-center"><div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-stone-200 border-t-[#55745f]" /><p className="mt-3">Opening your shelves…</p></div></div>
        ) : recentBooks.length === 0 ? (
          <div className="mt-5 rounded-2xl border border-dashed border-stone-300 bg-white/70 px-5 py-12 text-center">
            <BookOpen className="mx-auto text-[#55745f]" size={28} />
            <h3 className="mt-3 font-semibold text-stone-800">Your shelves are waiting</h3>
            <p className="mt-1 text-sm text-stone-500">Add the first title to begin your Papertrail.</p>
            <Link to="/books" className="btn-primary mt-4">Add a book</Link>
          </div>
        ) : (
          <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {recentBooks.map((book) => <BookCard key={book.id} book={book} />)}
          </div>
        )}
      </section>
    </section>
  );
}
