import { ArrowUpRight, Hand, Pencil, RotateCcw, Trash2 } from "lucide-react";
import BookCover from "./BookCover";

export default function BookCard({ book, onEdit, onDelete, onBorrow, onReturn }) {
  const available = Number(book.available_copies || 0);
  const borrowed = Number(book.borrowed_copies || 0);
  return (
    <article className="flex min-w-0 flex-col rounded-2xl border border-stone-200 bg-white p-4 transition hover:border-stone-300 hover:shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <BookCover book={book} />
        <div className="flex gap-1">
          <button onClick={() => onEdit(book)} className="icon-btn" aria-label={`Edit ${book.title}`} title="Edit"><Pencil size={15} /></button>
          <button onClick={() => onDelete(book)} className="icon-btn hover:!bg-red-50 hover:!text-red-600" aria-label={`Delete ${book.title}`} title="Delete"><Trash2 size={15} /></button>
        </div>
      </div>
      <div className="mt-4 flex items-center gap-2">
        <span className="rounded-md bg-[#edf2ec] px-2 py-1 text-[10px] font-semibold text-[#48664f]">{book.category || "General"}</span>
        {book.published_year && <span className="text-xs text-stone-400">{book.published_year}</span>}
      </div>
      <h3 title={book.title} className="mt-3 line-clamp-2 min-h-12 break-words text-base font-semibold leading-6 text-stone-900">{book.title}</h3>
      <p className="mt-0.5 text-sm text-stone-500">by {book.author}</p>
      {book.description && <p className="mt-3 line-clamp-2 text-xs leading-5 text-stone-500">{book.description}</p>}
      <div className="mt-4 border-t border-stone-100 pt-3">
        <div className="flex items-center gap-2 text-xs text-stone-500">
          <span className={`h-2 w-2 rounded-full ${available > 0 ? "bg-emerald-500" : "bg-amber-500"}`} />
          {available > 0 ? `${available} of ${book.total_copies} available` : "All copies borrowed"}
        </div>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
          {available > 0 ? (
            <button onClick={() => onBorrow(book)} className="flex items-center gap-1.5 text-xs font-semibold text-[#47654e] hover:text-[#263f2d]"><Hand size={14} /> Borrow a copy <ArrowUpRight size={13} /></button>
          ) : <span className="text-xs text-stone-400">No copies available</span>}
          {borrowed > 0 && <button onClick={() => onReturn(book)} className="flex items-center gap-1 text-xs font-medium text-stone-500 hover:text-stone-900"><RotateCcw size={13} /> Return</button>}
        </div>
      </div>
    </article>
  );
}
