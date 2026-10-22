import { CircleUserRound } from "lucide-react";
import { useLocation } from "react-router-dom";

const pageNames = {
  "/": "Home",
  "/books": "Books",
  "/about": "About",
  "/contact": "Contact"
};

export default function Header() {
  const { pathname } = useLocation();
  const currentPage = pathname.startsWith("/books/") ? "Book details" : pageNames[pathname] || "Library";

  return (
    <header className="flex h-14 items-center justify-between border-b border-stone-200 bg-[#f7f4ed]/90 px-5 backdrop-blur md:px-9">
      <div className="text-xs text-stone-500">Papertrail <span className="mx-2 text-stone-300">/</span> <span className="font-semibold text-stone-800">{currentPage}</span></div>
      <div className="flex items-center gap-2 text-xs text-stone-500">
        <span className="h-2 w-2 rounded-full bg-emerald-500" />
        <span className="hidden sm:inline">Library connected</span>
        <CircleUserRound size={22} className="ml-2 text-stone-400" />
      </div>
    </header>
  );
}
