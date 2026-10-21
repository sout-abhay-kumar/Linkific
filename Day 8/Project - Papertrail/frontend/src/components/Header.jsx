import { CircleUserRound } from "lucide-react";

export default function Header() {
  return (
    <header className="flex h-14 items-center justify-between border-b border-stone-200 bg-[#f7f7f4] px-5 md:px-9">
      <div className="text-xs text-stone-500">Workspace <span className="mx-2 text-stone-300">/</span> <span className="font-semibold text-stone-800">Library</span></div>
      <div className="flex items-center gap-2 text-xs text-stone-500">
        <span className="h-2 w-2 rounded-full bg-emerald-500" />
        <span className="hidden sm:inline">Local library</span>
        <CircleUserRound size={22} className="ml-2 text-stone-400" />
      </div>
    </header>
  );
}
