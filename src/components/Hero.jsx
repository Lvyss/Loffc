export default function Hero() {
  return (
    <section className="relative overflow-hidden px-6 pt-16 pb-20">
      <div className="pointer-events-none absolute left-1/2 top-0 h-72 w-[36rem] -translate-x-1/2 rounded-full bg-gold/10 blur-[120px]" />

      <div className="relative mx-auto max-w-3xl text-center">
        <span className="inline-block rounded-full border border-gold/25 bg-bg-card px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-gold-soft">
          Semester 3 · Kelas C
        </span>

        <h1 className="mt-6 font-display text-5xl font-bold leading-tight md:text-6xl">
          <span className="gold-gradient-text">Selamat Datang</span>
          <br />
          <span className="text-neutral-100">di Jobsheet Praktikum</span>
        </h1>

        <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-neutral-400">
          Panduan praktikum mata kuliah Pemrograman Web untuk Offering C. Semua
          materi, praktikum, dan tugas per pertemuan tersusun rapi di bawah ini.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-sm">
          <div className="rounded-lg border border-gold/20 bg-bg-card px-4 py-2">
            <span className="text-neutral-500">Total Pertemuan: </span>
            <span className="font-semibold text-gold-soft">6</span>
          </div>
          <div className="rounded-lg border border-gold/20 bg-bg-card px-4 py-2">
            <span className="text-neutral-500">Dosen : </span>
            <span className="font-semibold text-gold-soft">
              Shofiyah Al Idrus, S.Pd, M.Pd
            </span>
          </div>
          <div className="rounded-lg border border-gold/20 bg-bg-card px-4 py-2">
            <span className="text-neutral-500">Mentor : </span>
            <span className="font-semibold text-gold-soft">
              Eka Nanda Susila
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
