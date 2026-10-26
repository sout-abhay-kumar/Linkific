import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { CATEGORIES, EMPTY_BOOK } from "../constants";

export default function BookModal({ book, onClose, onSave }) {
  const [form, setForm] = useState(EMPTY_BOOK);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setForm(
      book
        ? {
            title: book.title || "",
            author: book.author || "",
            category: book.category || "Fiction",
            published_year: book.published_year ?? "",
            description: book.description || "",
            total_copies: book.total_copies ?? 1,
          }
        : EMPTY_BOOK,
    );
    setError("");
  }, [book]);

  function update(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function submit(event) {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      await onSave({
        ...form,
        title: form.title.trim(),
        author: form.author.trim(),
        category: form.category.trim() || "General",
        published_year:
          form.published_year === "" ? null : Number(form.published_year),
        total_copies: Number(form.total_copies),
      });
    } catch (err) {
      setError(err.message || "Could not save this book.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-stone-950/35 p-4"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="book-modal-title"
        className="my-auto w-full max-w-xl rounded-2xl bg-white p-5 shadow-xl sm:p-7"
      >
        <div className="mb-6 flex items-start justify-between">
          <div>
            <p className="text-[10px] font-bold tracking-[.18em] text-[#58745e]">
              {book ? "UPDATE CATALOGUE" : "GROW YOUR COLLECTION"}
            </p>
            <h2
              id="book-modal-title"
              className="mt-2 text-2xl font-semibold tracking-tight text-stone-900"
            >
              {book ? "Edit book" : "Add a new book"}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-lg p-2 text-stone-500 hover:bg-stone-100"
          >
            <X size={19} />
          </button>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <label className="block text-sm font-medium text-stone-700">
            Book title
            <input
              required
              maxLength="180"
              value={form.title}
              onChange={(e) => update("title", e.target.value)}
              placeholder="e.g. The Midnight Library"
              className="form-input mt-1.5"
            />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-medium text-stone-700">
              Author
              <input
                required
                maxLength="120"
                value={form.author}
                onChange={(e) => update("author", e.target.value)}
                placeholder="Author name"
                className="form-input mt-1.5"
              />
            </label>
            <label className="block text-sm font-medium text-stone-700">
              Category
              <select
                value={form.category}
                onChange={(e) => update("category", e.target.value)}
                className="form-input mt-1.5"
              >
                {CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-medium text-stone-700">
              Published year{" "}
              <span className="font-normal text-stone-400">(optional)</span>
              <input
                type="number"
                min="1000"
                max="2100"
                value={form.published_year}
                onChange={(e) => update("published_year", e.target.value)}
                placeholder="e.g. 2020"
                className="form-input mt-1.5"
              />
            </label>
            <label className="block text-sm font-medium text-stone-700">
              Total copies
              <input
                required
                type="number"
                min="1"
                max="10000"
                value={form.total_copies}
                onChange={(e) => update("total_copies", e.target.value)}
                className="form-input mt-1.5"
              />
            </label>
          </div>
          <label className="block text-sm font-medium text-stone-700">
            Description{" "}
            <span className="font-normal text-stone-400">(optional)</span>
            <textarea
              rows="3"
              maxLength="3000"
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              placeholder="A short note about this book..."
              className="form-input mt-1.5 resize-y"
            />
          </label>
          {error && (
            <p
              role="alert"
              className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700"
            >
              {error}
            </p>
          )}
          <div className="flex justify-end gap-3 border-t border-stone-100 pt-4">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="btn-primary disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "Saving..." : book ? "Save changes" : "Add book"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
