import { Link } from "react-router-dom";
import CopyBlock from "../../../components/ui/CopyBlock";

const steps = [
  {
    no: "01",
    title: "Routing",
    intro:
      "Bikin pintu masuk URL `/buku` yang manggil method `index()` di `BukuController`.",
    actions: [
      {
        text: "Buka `routes/web.php`, tambahin baris ini di bawah route yang udah ada:",
        code: `Route::get('/buku', [BukuController::class, 'index']);`,
        label: "routes/web.php",
      },
      {
        text: "Pastikan `use App\\Http\\Controllers\\BukuController;` sudah ada di atas file (nanti otomatis ke-generate waktu bikin controller).",
      },
      {
        text: "Route sudah terdaftar — nanti pas controller udah jadi, URL `/buku` bakal bisa diakses.",
        bukti: true,
      },
    ],
    tip: "Route itu kayak 'alamat rumah'. Tanpa route, URL `/buku` nggak akan nemu siapa yang harus nge-handle.",
  },
  {
    no: "02",
    title: "Controller",
    intro:
      "Controller itu otak-nya — nentuin data apa yang dikirim ke view.",
    actions: [
      {
        text: "Jalanin di terminal:",
        code: "php artisan make:controller BukuController",
        label: "bash",
      },
      {
        text: "Buka file yang baru muncul di `app/Http/Controllers/BukuController.php`, isi fungsi `index()`-nya:",
        code: `public function index()
{
    $bukus = [
        ['judul' => 'Laskar Pelangi', 'penulis' => 'Andrea Hirata', 'stok' => 3],
        ['judul' => 'Bumi Manusia', 'penulis' => 'Pramoedya Ananta Toer', 'stok' => 5],
        ['judul' => 'Filosofi Teras', 'penulis' => 'Henry Manampiring', 'stok' => 2],
    ];

    return view('buku.index', compact('bukus'));
}`,
        label: "app/Http/Controllers/BukuController.php",
      },
      {
        text: "Tidak ada garis merah di VS Code — artinya syntax & import udah oke.",
        bukti: true,
      },
    ],
    tip: "`compact('bukus')` itu cara singkat ngirim variabel `$bukus` ke view, biar bisa dipanggil sebagai `$bukus` di Blade.",
  },
  {
    no: "03",
    title: "Blade View",
    intro:
      "View itu tampilannya — nampilin data yang dikirim controller ke browser.",
    actions: [
      {
        text: "Bikin folder `resources/views/buku/`, di dalamnya bikin file `index.blade.php`.",
      },
      {
        text: "Isi file dengan kode berikut:",
        code: `<!DOCTYPE html>
<html>
<head>
    <title>Daftar Buku Perpustakaan</title>
</head>
<body>
    <h1>Daftar Buku</h1>
    <table border="1" cellpadding="8">
        <tr>
            <th>Judul</th>
            <th>Penulis</th>
            <th>Stok</th>
        </tr>
        @foreach ($bukus as $buku)
        <tr>
            <td>{{ $buku['judul'] }}</td>
            <td>{{ $buku['penulis'] }}</td>
            <td>{{ $buku['stok'] }}</td>
        </tr>
        @endforeach
    </table>
</body>
</html>`,
        label: "resources/views/buku/index.blade.php",
      },
      {
        text: "Sekarang buka `http://localhost:8000/buku`. Kalau muncul tabel 3 buku, berarti berhasil!",
        bukti: true,
      },
      {
        text: "Ini artinya alur **Routing → Controller → Blade** udah nyambung dari ujung ke ujung.",
        bukti: true,
      },
    ],
    tip: "`@foreach ($bukus as $buku)` itu cara looping di Blade. `{{ $buku['judul'] }}` buat nampilin nilai — kurung kurawal ganda otomatis nge-escape HTML biar aman dari XSS.",
  },
];

export default function Praktikum1() {
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
          <span className="text-gold-soft">Praktikum 1</span>
        </nav>

        {/* Header */}
        <div className="mb-10 border-b border-gold/15 pb-6">
          <span className="inline-block rounded-full border border-gold/25 bg-bg-card px-3 py-1 text-xs font-medium uppercase tracking-widest text-gold-soft">
            Pertemuan 05 · Praktikum 1
          </span>
          <h1 className="mt-4 font-display text-4xl font-bold leading-tight md:text-5xl">
            <span className="gold-gradient-text">
              Routing, Controller & Blade
            </span>
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-neutral-400">
            Alur dasar Laravel: bikin route, isi controller pakai data
            dummy, terus tampilkan di view Blade. Ini fondasi semua CRUD
            yang bakal lu bikin nanti.
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            <span className="rounded-full border border-gold/20 bg-bg-elevated px-3 py-1 text-xs text-neutral-300">
              🎯 Tujuan: Route → Controller → Blade View
            </span>
            <span className="rounded-full border border-gold/20 bg-bg-elevated px-3 py-1 text-xs text-neutral-300">
              ⚙️ Prasyarat: Project Laravel dari pertemuan sebelumnya
            </span>
          </div>
        </div>

        {/* Alur */}
        <section className="mb-14">
          <h2 className="mb-6 flex items-center gap-3 font-display text-xl font-semibold text-neutral-100">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-gold/30 bg-gold/10 text-gold-soft">
              📚
            </span>
            Alur Praktikum — 3 Langkah
          </h2>

          <div className="space-y-6">
            {steps.map((s) => (
              <div
                key={s.no}
                className="overflow-hidden rounded-xl border border-gold/15 bg-bg-elevated"
              >
                {/* Header step */}
                <div className="flex items-start gap-4 border-b border-gold/10 px-5 py-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-gold/30 bg-gold/10 font-display text-sm font-bold text-gold-soft">
                    {s.no}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-display text-lg font-semibold text-neutral-100">
                      {s.title}
                    </h3>
                    <p className="mt-1 text-sm text-neutral-500">{s.intro}</p>
                  </div>
                </div>

                {/* Alur aksi */}
                <div className="space-y-5 px-5 py-5">
                  {s.actions.map((a, i) => (
                    <div key={i} className="flex gap-3">
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-gold/30 bg-bg-card font-mono text-xs text-gold-soft">
                        {i + 1}
                      </div>

                      <div className="min-w-0 flex-1 space-y-2">
                        <p
                          className={`text-sm leading-relaxed ${
                            a.bukti
                              ? "text-green-300/90"
                              : "text-neutral-300"
                          }`}
                        >
                          {a.bukti && (
                            <span className="mr-1.5 inline-flex h-4 w-4 -translate-y-0.5 items-center justify-center rounded-full bg-green-500/20 text-[10px] text-green-400">
                              ✓
                            </span>
                          )}
                          {a.text}
                        </p>

                        {a.code && (
                          <CopyBlock code={a.code} label={a.label} />
                        )}
                      </div>
                    </div>
                  ))}

                  {s.tip && (
                    <div className="ml-9 rounded-lg border border-gold/20 bg-gold/5 px-4 py-3">
                      <p className="text-xs text-gold-soft">💡 {s.tip}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Navigasi bawah */}
        <div className="flex items-center justify-between border-t border-gold/10 pt-6">
          <Link
            to="/pertemuan/5"
            className="text-sm text-neutral-500 transition-colors hover:text-gold-soft"
          >
            ← Balik ke Pertemuan 5
          </Link>
          <Link
            to="/pertemuan/5/tugas"
            className="rounded-lg border border-gold/25 bg-gold/10 px-4 py-2 text-sm font-medium text-gold-soft transition-colors hover:bg-gold/20"
          >
            Lanjut Tugas →
          </Link>
        </div>
      </div>
    </div>
  );
}