import { BookOpen } from "lucide-react";

export default function BooksLoading() {
  return (
    <section
      className="mt-5"
      aria-label="Loading book catalogue"
      aria-busy="true"
    >
      <div className="mb-5 flex items-center gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#edf2ec] text-[#55745f]">
          <BookOpen size={19} />
        </span>

        <div>
          <p className="text-sm font-medium text-stone-800">
            Opening your library
          </p>
          <p className="mt-1 text-xs text-stone-500">
            Finding your next read...
          </p>
        </div>

        <span className="ml-auto h-5 w-5 animate-spin rounded-full border-2 border-stone-200 border-t-[#55745f]" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {Array.from({ length: 8 }, (_, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-2xl border border-stone-200 bg-white p-4"
          >
            <div className="animate-pulse">
              {/* Book cover skeleton */}
              <div className="flex aspect-[4/3] items-center justify-center rounded-xl bg-stone-100">
                <div className="flex h-3/4 w-2/5 items-center justify-center rounded-md bg-stone-200">
                  <BookOpen size={25} className="text-stone-300" />
                </div>
              </div>

              {/* Book title */}
              <div className="mt-4 h-4 w-4/5 rounded-md bg-stone-200" />

              {/* Author */}
              <div className="mt-3 h-3 w-3/5 rounded-md bg-stone-100" />

              {/* Category and availability */}
              <div className="mt-5 flex items-center justify-between">
                <div className="h-6 w-20 rounded-full bg-stone-100" />
                <div className="h-6 w-16 rounded-full bg-[#edf2ec]" />
              </div>

              {/* Card footer */}
              <div className="mt-5 border-t border-stone-100 pt-4">
                <div className="flex gap-2">
                  <div className="h-9 flex-1 rounded-lg bg-stone-100" />
                  <div className="h-9 w-10 rounded-lg bg-stone-100" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
