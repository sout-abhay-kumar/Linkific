import { Link } from "react-router-dom";

export default function Unauthorized() {
  return (
    <section className="mx-auto max-w-xl rounded-2xl border border-stone-200 bg-white p-7 text-center shadow-sm">
      <p className="text-[10px] font-bold tracking-[.2em] text-[#55745f]">
        ACCESS RESTRICTED
      </p>
      <h1 className="mt-3 text-2xl font-semibold tracking-tight text-stone-900">
        You don’t have permission to view this page.
      </h1>
      <p className="mt-2 text-sm leading-6 text-stone-500">
        This part of Papertrail is available to administrators only.
      </p>
      <Link to="/" className="btn-primary mt-5">
        Back to your library
      </Link>
    </section>
  );
}
