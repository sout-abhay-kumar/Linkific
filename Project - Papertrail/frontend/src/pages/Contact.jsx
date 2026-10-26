import { Mail, MessageCircle } from "lucide-react";

export default function Contact() {
  return (
    <section className="mx-auto max-w-3xl">
      <p className="text-[10px] font-bold tracking-[.2em] text-[#55745f]">
        GET IN TOUCH
      </p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight text-stone-900 sm:text-5xl">
        Questions about your library?
      </h1>
      <p className="mt-5 max-w-xl text-base leading-7 text-stone-600">
        Papertrail is designed to keep your reading collection simple. For
        project support or feedback, use the contact details below.
      </p>
      <div className="mt-9 grid gap-4 sm:grid-cols-2">
        <a
          href="mailto:hello@papertrail.local"
          className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm transition hover:border-stone-300 hover:shadow-md"
        >
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#edf2ec] text-[#47654e]">
            <Mail size={19} />
          </span>
          <h2 className="mt-4 font-semibold text-stone-900">Email support</h2>
          <p className="mt-2 text-sm text-stone-500">hello@papertrail.local</p>
        </a>
        <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#f7eddd] text-[#9b7540]">
            <MessageCircle size={19} />
          </span>
          <h2 className="mt-4 font-semibold text-stone-900">
            A note about data
          </h2>
          <p className="mt-2 text-sm leading-6 text-stone-500">
            Your catalogue is stored in the connected local SQLite database.
          </p>
        </div>
      </div>
    </section>
  );
}
