import { Link } from "react-router-dom";

export default function Pertemuan3() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <Link
        to="/"
        className="mb-8 inline-block text-sm text-neutral-500 hover:text-gold-soft"
      >
        ← Kembali
      </Link>
      <span className="inline-block rounded-full border border-gold/25 bg-bg-card px-3 py-1 text-xs uppercase tracking-widest text-gold-soft">
        Pertemuan 03
      </span>
      <h1 className="mt-4 font-display text-4xl font-bold">
        <span className="gold-gradient-text">Dasar HTML & CSS</span>
      </h1>
      <p className="mt-4 text-neutral-400">
        Konten pertemuan ini akan diisi nanti.
      </p>
    </div>
  );
}