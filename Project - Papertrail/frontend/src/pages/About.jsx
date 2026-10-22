import { BookHeart, Leaf, LibraryBig } from "lucide-react";

const values = [
  { icon: LibraryBig, title: "A clear catalogue", text: "Keep titles, authors, categories, and copy counts in one uncluttered place." },
  { icon: BookHeart, title: "Built around reading", text: "Track what is on the shelf and what is out with simple borrow and return actions." },
  { icon: Leaf, title: "Quiet by design", text: "A warm, focused interface that lets the collection—not the software—take centre stage." }
];

export default function About() {
  return (
    <section className="mx-auto max-w-4xl">
      <p className="text-[10px] font-bold tracking-[.2em] text-[#55745f]">ABOUT PAPERTRAIL</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight text-stone-900 sm:text-5xl">A better record of the books you keep.</h1>
      <p className="mt-5 max-w-2xl text-base leading-7 text-stone-600">Papertrail is a personal book library for readers who want an easy, dependable way to care for their collection.</p>
      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        {values.map(({ icon: Icon, title, text }) => <article key={title} className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm"><span className="grid h-10 w-10 place-items-center rounded-xl bg-[#edf2ec] text-[#47654e]"><Icon size={19} /></span><h2 className="mt-4 font-semibold text-stone-900">{title}</h2><p className="mt-2 text-sm leading-6 text-stone-500">{text}</p></article>)}
      </div>
    </section>
  );
}
