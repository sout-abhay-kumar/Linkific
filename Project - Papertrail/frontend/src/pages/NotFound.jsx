import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <section className="grid min-h-80 place-items-center text-center">
      <div>
        <p className="text-[10px] font-bold tracking-[.2em] text-[#55745f]">
          PAGE NOT FOUND
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-stone-900">
          That page is not on the shelf.
        </h1>
        <p className="mt-3 text-sm text-stone-500">
          Try returning to your library or browsing the catalogue.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link to="/" className="btn-secondary">
            Home
          </Link>
          <Link to="/books" className="btn-primary">
            Browse books
          </Link>
        </div>
      </div>
    </section>
  );
}
