import { BookOpen, LibraryBig, BookMarked } from "lucide-react";

export default function Sidebar({ totalTitles }) {
  return (
    <aside className="flex w-full flex-col border-b border-stone-200 bg-white px-5 py-4 md:min-h-screen md:w-64 md:border-b-0 md:border-r md:px-6 md:py-7">
      <a href="#" className="flex items-center gap-3 no-underline">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#e6eee6] text-[#345744]">
          <BookOpen size={21} strokeWidth={1.8} />
        </span>
        <span>
          <span className="block text-lg font-semibold tracking-tight text-stone-900">papertrail</span>
          <span className="block text-[10px] font-semibold tracking-[.16em] text-stone-500">YOUR PERSONAL LIBRARY</span>
        </span>
      </a>

      <div className="mt-8 hidden text-[10px] font-bold tracking-[.18em] text-stone-400 md:block">WORKSPACE</div>
      <div className="mt-4 flex items-center justify-between rounded-xl bg-[#edf2ec] px-3 py-3 text-sm font-semibold text-[#345744]">
        <span className="flex items-center gap-3"><LibraryBig size={17} /> Library</span>
        <span className="rounded-md bg-white px-2 py-0.5 text-xs text-stone-600">{totalTitles}</span>
      </div>

      <div className="mt-5 hidden rounded-xl border border-stone-200 p-4 md:block">
        <BookMarked size={18} className="text-[#55745f]" />
        <p className="mt-3 text-sm font-semibold text-stone-800">A little more reading.</p>
        <p className="mt-1 text-xs leading-5 text-stone-500">Keep your collection organized, one page at a time.</p>
      </div>

      <div className="mt-auto hidden pt-8 text-xs leading-5 text-stone-400 md:block">
        <span className="mr-2 inline-block h-2 w-2 rounded-full bg-emerald-500" />
        Your library, in good order.
      </div>
    </aside>
  );
}
