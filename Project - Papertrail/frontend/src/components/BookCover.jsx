import { BookOpen } from "lucide-react";

const palettes = [
  ["#e1e9df", "#3c604a"],
  ["#f1e2d3", "#8c5d3e"],
  ["#e0e5f2", "#4a5d89"],
  ["#f0e0e5", "#96596e"],
  ["#e9e5dc", "#655d4d"],
  ["#dcebed", "#3e6d78"],
];

export default function BookCover({ book, large = false }) {
  const [background, ink] = palettes[(Number(book.id) || 0) % palettes.length];
  const initials = (book.title || "Book")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
  return (
    <div
      className={`relative flex ${large ? "h-32 w-24" : "h-28 w-20"} shrink-0 flex-col items-center justify-center overflow-hidden rounded-lg shadow-sm`}
      style={{ backgroundColor: background, color: ink }}
      aria-label={`Cover placeholder for ${book.title}`}
    >
      <BookOpen size={large ? 25 : 20} strokeWidth={1.5} />
      <span className="mt-3 text-xl font-semibold tracking-widest">
        {initials}
      </span>
      <span
        className="absolute bottom-3 h-px w-8 opacity-50"
        style={{ backgroundColor: ink }}
      />
      <span className="absolute bottom-1.5 max-w-[90%] truncate text-[7px] font-bold uppercase tracking-widest">
        {book.category || "BOOK"}
      </span>
    </div>
  );
}
