import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
      <p className="font-display text-7xl font-bold text-gold/30">404</p>
      <h1 className="mt-4 font-display text-2xl font-semibold text-neutral-100">
        Halaman tidak ditemukan
      </h1>
      <p className="mt-2 text-sm text-neutral-500">
        Link-nya mungkin salah, atau halaman belum tersedia.
      </p>
      <Link
        to="/"
        className="mt-6 rounded-lg border border-gold/30 bg-gold/10 px-4 py-2 text-sm font-medium text-gold-soft transition-colors hover:bg-gold/20"
      >
        Kembali ke Home
      </Link>
    </div>
  );
}