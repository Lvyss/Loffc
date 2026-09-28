import { Link } from "react-router-dom";
import SlideViewer from "../../components/ui/SlideViewer";

const praktikumList = [
  {
    id: 1,
    title: "Praktikum 1 — CRUD Kategori",
    desc: "Migration, Model, Route, Controller & View. Studi kasus paling sederhana dengan 1 field.",
    tag: "Laravel · CRUD",
    path: "/pertemuan/6/praktikum-1",
  },
  {
    id: 2,
    title: "Praktikum 2 — Buku & Relasi",
    desc: "Relasi antar tabel (Category ↔ Book) + upload gambar dengan storage.",
    tag: "Laravel · Relasi",
    path: "/pertemuan/6/praktikum-2",
  },
];

const tugasList = [
  {
    id: 1,
    title: "Tugas — Implementasi FoodMart",
    desc: "Terapin pola CRUD ke project nyata: kategori produk & produk + suntik ke halaman Home.",
    tag: "Tugas · Project",
    path: "/pertemuan/6/tugas",
  },
  {
    id: 2,
    title: "Tugas Tambahan — Mengenal PHP",
    desc: "Bacaan 10 poin + esai: jelaskan apa itu PHP, cara kerjanya, dan kaitannya dengan Laravel.",
    tag: "Tugas · Esai",
    path: "/pertemuan/6/tugas-php",
  },
];

export default function Pertemuan6() {
  return (
    <div className="relative min-h-screen">
      <div className="pointer-events-none absolute left-1/2 top-0 h-64 w-[40rem] -translate-x-1/2 rounded-full bg-gold/10 blur-[120px]" />

      <div className="relative max-w-4xl px-6 py-12 mx-auto">
        {/* Back */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 mb-8 text-sm transition-colors text-neutral-500 hover:text-gold-soft"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Kembali ke daftar pertemuan
        </Link>

        {/* Header */}
        <div className="pb-6 mb-10 border-b border-gold/15">
          <span className="inline-block px-3 py-1 text-xs font-medium tracking-widest uppercase border rounded-full border-gold/25 bg-bg-card text-gold-soft">
            Pertemuan 06
          </span>
          <h1 className="mt-4 text-4xl font-bold leading-tight font-display md:text-5xl">
            <span className="gold-gradient-text">
              CRUD Kategori & Relasi Buku
            </span>
          </h1>
          <p className="max-w-2xl mt-3 text-sm leading-relaxed text-neutral-400">
            Belajar pola CRUD lengkap di Laravel, mulai dari migration,
            model, route, controller, sampai view — lalu lanjut ke relasi
            antar tabel.
          </p>
        </div>

        {/* Slide Materi */}
        <section className="mb-12">
          <h2 className="flex items-center gap-3 mb-4 text-xl font-semibold font-display text-neutral-100">
            <span className="flex items-center justify-center border rounded-lg h-9 w-9 border-gold/30 bg-gold/10 text-gold-soft">
              📊
            </span>
            Slide Materi
          </h2>

          <SlideViewer
            pdf="/slides/pertemuan-6.pdf"
            title="Pertemuan 6 — CRUD & Relasi Laravel"
          />
        </section>

        {/* SECTION: PRAKTIKUM */}
        <section className="mb-12">
          <div className="flex items-center gap-3 pb-3 mb-5 border-b border-gold/15">
            <span className="flex items-center justify-center border rounded-lg h-9 w-9 border-gold/30 bg-gold/10 text-gold-soft">
              ⚙️
            </span>
            <div>
              <h2 className="text-xl font-semibold font-display text-neutral-100">
                Praktikum
              </h2>
              <p className="text-xs text-neutral-500">
                Kerjakan langkah-langkah di bawah secara berurutan
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {praktikumList.map((p) => (
              <Link
                key={p.id}
                to={p.path}
                className="relative p-5 overflow-hidden border card-hover group rounded-xl border-gold/15 bg-bg-elevated"
              >
                <div className="absolute w-24 h-24 transition-opacity rounded-full opacity-0 pointer-events-none -right-8 -top-8 bg-gold/10 blur-2xl group-hover:opacity-100" />

                <span className="inline-block rounded-full border border-gold/25 bg-bg-card px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-gold-soft">
                  {p.tag}
                </span>

                <h3 className="mt-3 text-lg font-semibold font-display text-neutral-100">
                  {p.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-400">
                  {p.desc}
                </p>

                <div className="flex items-center gap-2 mt-4 text-xs font-medium text-gold-soft">
                  Buka Praktikum
                  <svg
                    className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* SECTION: TUGAS */}
        <section className="mb-12">
          <div className="flex items-center gap-3 pb-3 mb-5 border-b border-gold/15">
            <span className="flex items-center justify-center border rounded-lg h-9 w-9 border-gold/30 bg-gold/10 text-gold-soft">
              📝
            </span>
            <div>
              <h2 className="text-xl font-semibold font-display text-neutral-100">
                Tugas
              </h2>
              <p className="text-xs text-neutral-500">
                Dikumpulkan sebelum pertemuan berikutnya
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {tugasList.map((t) => (
              <Link
                key={t.id}
                to={t.path}
                className="relative p-5 overflow-hidden border card-hover group rounded-xl border-gold/15 bg-bg-elevated"
              >
                <div className="absolute w-24 h-24 transition-opacity rounded-full opacity-0 pointer-events-none -right-8 -top-8 bg-gold/10 blur-2xl group-hover:opacity-100" />

                <span className="inline-block rounded-full border border-gold/25 bg-bg-card px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-gold-soft">
                  {t.tag}
                </span>

                <h3 className="mt-3 text-lg font-semibold font-display text-neutral-100">
                  {t.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-400">
                  {t.desc}
                </p>

                <div className="flex items-center gap-2 mt-4 text-xs font-medium text-gold-soft">
                  Buka Tugas
                  <svg
                    className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <div className="pt-6 mt-16 text-center border-t border-gold/10">
          <Link
            to="/"
            className="text-sm transition-colors text-neutral-500 hover:text-gold-soft"
          >
            ← Balik ke Home
          </Link>
        </div>
      </div>
    </div>
  );
}