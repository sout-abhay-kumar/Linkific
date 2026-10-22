import { BookOpen, CheckCircle2, Clock3 } from "lucide-react";

const cards = [
  { key: "total_titles", label: "Total titles", hint: "Unique books in your collection", icon: BookOpen, tone: "bg-[#edf0fa] text-[#596a9b]" },
  { key: "available_copies", label: "Copies available", hint: "Ready to be borrowed", icon: CheckCircle2, tone: "bg-[#e8f1e9] text-[#4b7958]" },
  { key: "borrowed_copies", label: "Currently borrowed", hint: "Copies away from the shelf", icon: Clock3, tone: "bg-[#f7eddd] text-[#9b7540]" }
];

export default function Stats({ stats }) {
  return (
    <section aria-label="Library statistics" className="grid gap-3 sm:grid-cols-3">
      {cards.map(({ key, label, hint, icon: Icon, tone }) => (
        <article key={key} className="rounded-2xl border border-stone-200 bg-white p-4">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-medium text-stone-500">{label}</span>
            <span className={`grid h-8 w-8 place-items-center rounded-lg ${tone}`}><Icon size={17} /></span>
          </div>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-stone-900">{stats[key] ?? 0}</p>
          <p className="mt-1 text-[11px] text-stone-400">{hint}</p>
        </article>
      ))}
    </section>
  );
}
