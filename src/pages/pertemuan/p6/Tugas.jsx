import { Link } from "react-router-dom";

const tugasList = [
  {
    id: 1,
    title: "Tugas 1 — [Judul Tugas]",
    deadline: "Pertemuan 7",
    desc: "[Deskripsi tugas — nanti diisi]",
    items: [
      "[Poin instruksi 1]",
      "[Poin instruksi 2]",
      "[Poin instruksi 3]",
    ],
  },
  {
    id: 2,
    title: "Tugas 2 — [Judul Tugas]",
    deadline: "Pertemuan 7",
    desc: "[Deskripsi tugas — nanti diisi]",
    items: [
      "[Poin instruksi 1]",
      "[Poin instruksi 2]",
    ],
  },
];

export default function Tugas() {
  return (
    <div className="relative min-h-screen">
      <div className="pointer-events-none absolute left-1/2 top-0 h-64 w-[40rem] -translate-x-1/2 rounded-full bg-gold/10 blur-[120px]" />

      <div className="relative mx-auto max-w-4xl px-6 py-12">
        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center gap-2 text-xs text-neutral-500">
          <Link to="/" className="hover:text-gold-soft">Home</Link>
          <span>/</span>
          <Link to="/pertemuan/6" className="hover:text-gold-soft">Pertemuan 6</Link>
          <span>/</span>
          <span className="text-gold-soft">Tugas</span>
        </nav>

        {/* Header */}
        <div className="mb-10 border-b border-gold/15 pb-6">
          <span className="inline-block rounded-full border border-gold/25 bg-bg-card px-3 py-1 text-xs font-medium uppercase tracking-widest text-gold-soft">
            Pertemuan 06 · Tugas
          </span>
          <h1 className="mt-4 font-display text-4xl font-bold leading-tight md:text-5xl">
            <span className="gold-gradient-text">Tugas Praktikum</span>
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-neutral-400">
            Kumpulan tugas yang harus dikerjakan setelah menyelesaikan
            Praktikum 1 & 2. Dikumpulkan sebelum pertemuan berikutnya.
          </p>
        </div>

        {/* Daftar Tugas */}
        <section className="mb-14">
          <div className="space-y-5">
            {tugasList.map((t) => (
              <div
                key={t.id}
                className="rounded-xl border border-gold/15 bg-bg-elevated p-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-display text-base font-semibold text-neutral-100">
                      📝 {t.title}
                    </h3>
                    <p className="mt-1 text-xs text-neutral-500">
                      Deadline: <span className="text-gold-soft">{t.deadline}</span>
                    </p>
                  </div>
                </div>

                {t.desc && (
                  <p className="mt-3 text-sm text-neutral-400">{t.desc}</p>
                )}

                <ul className="mt-4 space-y-2 text-sm text-neutral-300">
                  {t.items.map((item, i) => (
                    <li key={i} className="flex gap-3">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-gold/60" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Info Pengumpulan */}
        <section className="mb-14">
          <div className="rounded-xl border border-gold/20 bg-gradient-to-br from-bg-card to-bg-elevated p-5">
            <h3 className="font-display text-base font-semibold text-neutral-100">
              📤 Cara Pengumpulan
            </h3>
            <ul className="mt-3 space-y-2 text-sm text-neutral-300">
              <li className="flex gap-3">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-gold/60" />
                <span>[Instruksi pengumpulan — nanti diisi]</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-gold/60" />
                <span>[Deadline & link pengumpulan — nanti diisi]</span>
              </li>
            </ul>
          </div>
        </section>

        {/* Navigasi bawah */}
        <div className="flex items-center justify-between border-t border-gold/10 pt-6">
          <Link
            to="/pertemuan/6"
            className="text-sm text-neutral-500 transition-colors hover:text-gold-soft"
          >
            ← Balik ke Pertemuan 6
          </Link>
          <Link
            to="/pertemuan/6/praktikum-2"
            className="text-sm text-neutral-500 transition-colors hover:text-gold-soft"
          >
            Praktikum 2 →
          </Link>
        </div>
      </div>
    </div>
  );
}