import { BookOpen, ChevronDown, Search, X } from "lucide-react";

import Stats from "./Stats";
import BookCard from "./BookCard";
import BooksLoading from "./BooksLoading";

export default function Content({
  stats,
  books,
  loading,
  error,
  search,
  setSearch,
  category,
  setCategory,
  availability,
  setAvailability,
  categoryOptions,
  onAdd,
  onEdit,
  onDelete,
  onBorrow,
  onReturn,
  onDismissError,
  onClearFilters,
}) {
  return (
    <section>
      {/* Page heading */}
      <section className="mb-7 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="text-[10px] font-bold tracking-[.2em] text-[#55745f]">
            A QUIETER KIND OF COLLECTION
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl">
            Your library
            <span className="text-[#7c9b80]">.</span>
          </h1>

          <p className="mt-2 text-sm text-stone-500">
            A calm place to keep track of the books you love.
          </p>
        </div>

        <button
          type="button"
          onClick={onAdd}
          className="btn-primary self-start sm:self-auto"
        >
          <span className="text-lg leading-none">+</span> Add a book
        </button>
      </section>

      {/* Error message */}
      {error && (
        <div
          role="alert"
          className="mb-5 flex items-start justify-between gap-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          <p>{error}</p>

          <button
            type="button"
            onClick={onDismissError}
            aria-label="Dismiss error"
            className="shrink-0"
          >
            <X size={17} />
          </button>
        </div>
      )}

      {/* Library statistics */}
      <Stats stats={stats} />

      {/* Book catalogue */}
      <section className="mt-9">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <h2 className="text-lg font-semibold text-stone-900">
              Book catalogue
            </h2>

            <p className="mt-1 text-xs text-stone-500">
              Browse, manage, and discover your collection.
            </p>
          </div>

          <span className="text-xs text-stone-400" aria-live="polite">
            {loading
              ? "Loading books..."
              : `${books.length} ${books.length === 1 ? "book" : "books"}`}
          </span>
        </div>

        {/* Search and filters remain visible while loading */}
        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          {/* Search */}
          <div className="flex min-w-0 flex-1 items-center gap-2 rounded-xl border border-stone-200 bg-white px-3.5">
            <Search size={17} className="shrink-0 text-stone-400" />

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search title, author, category..."
              aria-label="Search books"
              className="h-11 min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-stone-400"
            />

            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                aria-label="Clear search"
                className="text-stone-400 hover:text-stone-700"
              >
                <X size={15} />
              </button>
            )}
          </div>

          {/* Category filter */}
          <label className="relative flex items-center rounded-xl border border-stone-200 bg-white sm:w-44">
            <span className="sr-only">Category</span>

            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="h-11 w-full appearance-none bg-transparent px-3.5 pr-9 text-sm text-stone-600 outline-none"
            >
              {categoryOptions.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            <ChevronDown
              size={15}
              className="pointer-events-none absolute right-3 text-stone-400"
            />
          </label>

          {/* Availability filter */}
          <label className="relative flex items-center rounded-xl border border-stone-200 bg-white sm:w-40">
            <span className="sr-only">Availability</span>

            <select
              value={availability}
              onChange={(event) => setAvailability(event.target.value)}
              className="h-11 w-full appearance-none bg-transparent px-3.5 pr-9 text-sm text-stone-600 outline-none"
            >
              {["All", "Available", "Borrowed"].map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            <ChevronDown
              size={15}
              className="pointer-events-none absolute right-3 text-stone-400"
            />
          </label>
        </div>

        {/* Loading, empty, or book cards */}
        {loading ? (
          <BooksLoading />
        ) : books.length === 0 ? (
          <div className="mt-5 rounded-2xl border border-dashed border-stone-300 bg-white/60 px-5 py-14 text-center">
            <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-[#edf2ec] text-[#55745f]">
              <BookOpen size={23} />
            </span>

            <h3 className="mt-4 font-semibold text-stone-800">
              No books found
            </h3>

            <p className="mt-1 text-sm text-stone-500">
              Try another search or add a new book to your collection.
            </p>

            <div className="mt-4 flex justify-center gap-3">
              <button
                type="button"
                onClick={onClearFilters}
                className="btn-secondary"
              >
                Clear filters
              </button>

              <button type="button" onClick={onAdd} className="btn-primary">
                Add a book
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {books.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                onEdit={onEdit}
                onDelete={onDelete}
                onBorrow={onBorrow}
                onReturn={onReturn}
              />
            ))}
          </div>
        )}
      </section>
    </section>
  );
}
