import { Link } from "react-router-dom";
import CopyBlock from "../../../components/ui/CopyBlock";

const tugasUtama = {
  title: "Tugas — Duplicate Alur Routing → Controller → Blade",
  deadline: "Pertemuan 6",
  desc: "Tanpa liat langkah 1-3 lagi kalau bisa, bikin ulang persis alur yang sama tapi datanya diganti sesuai tema project akhir kalian.",
  rows: [
    { tema: "E-commerce", ganti: "Buku → Produk", contoh: "nama, harga, stok" },
    { tema: "Perpustakaan", ganti: "Buku → Anggota", contoh: "nama, alamat, no_hp" },
    { tema: "Akademik", ganti: "Buku → Mahasiswa", contoh: "nama, nim, jurusan" },
    { tema: "Kesehatan", ganti: "Buku → Pasien", contoh: "nama, umur, diagnosis" },
  ],
};

const bonusList = [
  {
    no: "01",
    title: "Kondisi Tampilan dengan @if",
    desc: "Pakai `@if` di Blade — kasih tulisan merah \"Stok Habis\" kalau stok = 0. Tambahin 1 data dummy dengan stok 0 buat nyoba.",
    code: `@if ($nilai >= 75)
    <p>Lulus</p>
@else
    <p>Tidak Lulus</p>
@endif`,
    label: "contoh-if.blade.php",
    hint: "Di dalam loop `@foreach`, cek `@if ($buku['stok'] == 0)` — kalau true, tampilkan teks merah.",
  },
  {
    no: "02",
    title: "Route Kedua — Filter di Controller",
    desc: "Bikin 1 route baru `/buku/mahal` yang nampilin cuma buku dengan kriteria tertentu (misal stok > 3). Filter dilakuin di Controller sebelum dikirim ke view, BUKAN di Blade.",
    code: `public function nilaiTinggi()
{
    $mahasiswas = collect([
        ['nama' => 'Andi', 'jurusan' => 'Informatika', 'nilai' => 85],
        ['nama' => 'Budi', 'jurusan' => 'Sistem Informasi', 'nilai' => 70],
        ['nama' => 'Citra', 'jurusan' => 'Informatika', 'nilai' => 90],
    ])->where('nilai', '>', 80);

    return view('mahasiswa.index', compact('mahasiswas'));
}`,
    label: "app/Http/Controllers/BukuController.php",
    hint: "Bikin method baru `bukuMahal()` di controller, filter pakai `collect($bukus)->where('stok', '>', 3)`. Terus daftarin route `/buku/mahal` yang manggil method itu.",
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
          <Link to="/pertemuan/5" className="hover:text-gold-soft">Pertemuan 5</Link>
          <span>/</span>
          <span className="text-gold-soft">Tugas</span>
        </nav>

        {/* Header */}
        <div className="mb-10 border-b border-gold/15 pb-6">
          <span className="inline-block rounded-full border border-gold/25 bg-bg-card px-3 py-1 text-xs font-medium uppercase tracking-widest text-gold-soft">
            Pertemuan 05 · Tugas
          </span>
          <h1 className="mt-4 font-display text-4xl font-bold leading-tight md:text-5xl">
            <span className="gold-gradient-text">
              Duplicate Alur + Tantangan Bonus
            </span>
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-neutral-400">
            Bikin ulang alur yang sama dengan tema project akhir kalian,
            lalu tantang diri sendiri dengan bonus-bonus di bawah.
          </p>
        </div>

        {/* TUGAS UTAMA */}
        <section className="mb-14">
          <div className="mb-5 flex items-center gap-3 border-b border-gold/15 pb-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-gold/30 bg-gold/10 text-gold-soft">
              📝
            </span>
            <div>
              <h2 className="font-display text-xl font-semibold text-neutral-100">
                Tugas Utama
              </h2>
              <p className="text-xs text-neutral-500">
                Deadline: {tugasUtama.deadline}
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-gold/20 bg-gradient-to-br from-bg-card to-bg-elevated p-5">
            <h3 className="font-display text-base font-semibold text-neutral-100">
              {tugasUtama.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-neutral-400">
              {tugasUtama.desc}
            </p>

            {/* Tabel tema */}
            <div className="mt-5 overflow-x-auto rounded-lg border border-gold/15">
              <table className="w-full text-sm">
                <thead className="bg-bg-base/60">
                  <tr className="text-left">
                    <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-gold-soft">
                      Tema Kalian
                    </th>
                    <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-gold-soft">
                      Ganti "Buku" jadi…
                    </th>
                    <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-gold-soft">
                      Contoh Data
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {tugasUtama.rows.map((r, i) => (
                    <tr
                      key={i}
                      className="border-t border-gold/10 text-neutral-300"
                    >
                      <td className="px-4 py-2.5">{r.tema}</td>
                      <td className="px-4 py-2.5">{r.ganti}</td>
                      <td className="px-4 py-2.5 text-neutral-400">
                        {r.contoh}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* TANTANGAN BONUS */}
        <section className="mb-14">
          <div className="mb-5 flex items-center gap-3 border-b border-gold/15 pb-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-gold/30 bg-gold/10 text-gold-soft">
              🎁
            </span>
            <div>
              <h2 className="font-display text-xl font-semibold text-neutral-100">
                Tantangan Bonus
              </h2>
              <p className="text-xs text-neutral-500">
                Pilih salah satu, atau coba semuanya kalau waktu masih ada
              </p>
            </div>
          </div>

          <div className="space-y-5">
            {bonusList.map((b) => (
              <div
                key={b.no}
                className="overflow-hidden rounded-xl border border-gold/15 bg-bg-elevated"
              >
                <div className="flex items-start gap-4 border-b border-gold/10 px-5 py-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-gold/30 bg-gold/10 font-display text-sm font-bold text-gold-soft">
                    {b.no}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-display text-base font-semibold text-neutral-100">
                      {b.title}
                    </h3>
                    <p className="mt-1 text-sm text-neutral-500">{b.desc}</p>
                  </div>
                </div>

                <div className="space-y-4 px-5 py-5">
                  <div>
                    <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gold-soft">
                      📄 Contoh Kode
                    </h4>
                    <CopyBlock code={b.code} label={b.label} />
                  </div>

                  <div className="rounded-lg border border-gold/20 bg-gold/5 px-4 py-3">
                    <p className="text-xs text-gold-soft">💡 {b.hint}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Cara Pengumpulan */}
        <section className="mb-14">
          <div className="rounded-xl border border-gold/20 bg-gradient-to-br from-bg-card to-bg-elevated p-5">
            <h3 className="font-display text-base font-semibold text-neutral-100">
              📤 Cara Pengumpulan
            </h3>
            <ul className="mt-3 space-y-2 text-sm text-neutral-300">
              <li className="flex gap-3">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-gold/60" />
                <span>Push project ke GitHub, kumpulkan link-nya</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-gold/60" />
                <span>Screenshot hasil `/buku` dan `/buku/mahal` (kalau bonus 2 dikerjain)</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-gold/60" />
                <span>Kumpulkan via Google Classroom sebelum pertemuan berikutnya</span>
              </li>
            </ul>
          </div>
        </section>

        {/* Navigasi bawah */}
        <div className="flex items-center justify-between border-t border-gold/10 pt-6">
          <Link
            to="/pertemuan/5/praktikum-1"
            className="text-sm text-neutral-500 transition-colors hover:text-gold-soft"
          >
            ← Praktikum 1
          </Link>
          <Link
            to="/pertemuan/5"
            className="rounded-lg border border-gold/25 bg-gold/10 px-4 py-2 text-sm font-medium text-gold-soft transition-colors hover:bg-gold/20"
          >
            Balik ke Pertemuan 5
          </Link>
        </div>
      </div>
    </div>
  );
}