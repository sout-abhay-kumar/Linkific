import { CircleUserRound } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const pageNames = {
  "/": "Home",
  "/books": "Books",
  "/about": "About",
  "/contact": "Contact",
  "/profile": "Profile",
};

export default function Header() {
  const { pathname } = useLocation();
  const { user } = useAuth();
  const currentPage = pathname.startsWith("/books/")
    ? "Book details"
    : pageNames[pathname] || "Library";

  return (
    <header className="flex h-14 items-center justify-between border-b border-stone-200 bg-[#f7f4ed]/90 px-5 backdrop-blur md:px-9">
      <div className="text-xs text-stone-500">
        Papertrail <span className="mx-2 text-stone-300">/</span>{" "}
        <span className="font-semibold text-stone-800">{currentPage}</span>
      </div>
      <div className="flex items-center gap-2 text-xs text-stone-500">
        <span className="h-2 w-2 rounded-full bg-emerald-500" />
        <span className="hidden sm:inline">Library connected</span>
        {user ? (
          <Link
            to="/profile"
            className="ml-2 inline-flex items-center gap-2 rounded-lg px-2 py-1 font-medium text-stone-600 hover:bg-white hover:text-stone-900"
          >
            <CircleUserRound size={19} className="text-[#55745f]" />
            <span className="hidden sm:inline">{user.full_name}</span>
          </Link>
        ) : (
          <Link
            to="/login"
            className="ml-2 rounded-lg px-2 py-1 font-semibold text-[#47654e] hover:bg-white"
          >
            Sign in
          </Link>
        )}
      </div>
    </header>
  );
}
