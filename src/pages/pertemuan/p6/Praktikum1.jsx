import { Link } from "react-router-dom";
import CopyBlock from "../../../components/ui/CopyBlock";

const steps = [
  {
    no: "01",
    title: "Migration Kategori",
    intro:
      "Bikin tabel `categories` di database. Tabel ini cuma punya 1 field: `name`.",
    actions: [
      {
        text: "Buka terminal di folder project, jalankan:",
        code: "php artisan make:migration create_categories_table",
        label: "bash",
      },
      {
        text: "Buka file baru yang muncul di `database/migrations/`, cari method `up()`, isi seperti kode di bawah:",
        code: `public function up(): void
{
    Schema::create('categories', function (Blueprint $table) {
        $table->id();
        $table->string('name');
        $table->timestamps();
    });
}`,
        label: "database/migrations/xxxx_create_categories_table.php",
      },
      {
        text: "Simpan file, lalu jalankan di terminal:",
        code: "php artisan migrate",
        label: "bash",
      },
      {
        text: "Kalau muncul teks `Migrating... Migrated:` — berarti tabel sudah jadi.",
        bukti: true,
      },
    ],
    tip: "Kalau muncul error `Class 'Blueprint' not found`, tambahkan `use Illuminate\\Database\\Schema\\Blueprint;` di atas file migration.",
  },
  {
    no: "02",
    title: "Model Kategori",
    intro: "Model itu jembatan antara PHP dan tabel database.",
    actions: [
      {
        text: "Jalankan di terminal:",
        code: "php artisan make:model Category",
        label: "bash",
      },
      {
        text: "Buka `app/Models/Category.php`.",
      },
      {
        text: "Tambahkan baris `$fillable` di dalam class (setelah `use HasFactory;`):",
        code: `protected $fillable = ['name'];`,
        label: "app/Models/Category.php",
      },
      {
        text: "File model sekarang punya `$fillable` — nanti `Category::create(['name' => 'Fiksi'])` nggak error MassAssignmentException.",
        bukti: true,
      },
    ],
    tip: "`$fillable` itu daftar field yang boleh diisi massal. Tanpa ini, Laravel nolak input dari form demi keamanan.",
  },
  {
    no: "03",
    title: "Route Kategori",
    intro:
      "Route itu 'pintu masuk' — nentuin URL apa manggil fungsi apa di controller. Kita butuh 6 route buat CRUD lengkap.",
    actions: [
      {
        text: "Buka `routes/web.php`.",
      },
      {
        text: "Tambahkan baris `use` di paling atas file (di bawah `<?php`):",
        code: `use App\\Http\\Controllers\\CategoryController;`,
        label: "routes/web.php",
      },
      {
        text: "Tempel 6 route di bagian bawah file (setelah route welcome):",
        code: `Route::get('/categories', [CategoryController::class, 'index'])->name('categories.index');
Route::get('/categories/create', [CategoryController::class, 'create'])->name('categories.create');
Route::post('/categories', [CategoryController::class, 'store'])->name('categories.store');
Route::get('/categories/{category}/edit', [CategoryController::class, 'edit'])->name('categories.edit');
Route::put('/categories/{category}', [CategoryController::class, 'update'])->name('categories.update');
Route::delete('/categories/{category}', [CategoryController::class, 'destroy'])->name('categories.destroy');`,
        label: "routes/web.php",
      },
      {
        text: "Jalankan `php artisan route:list` — harus muncul 6 route dengan nama `categories.*`.",
        bukti: true,
      },
    ],
    tip: "6 route ini = 2 buat nampilin halaman (index & create), 4 buat aksi (store, edit, update, destroy).",
  },
  {
    no: "04",
    title: "Controller Kategori — Full CRUD",
    intro:
      "Controller itu otak-nya. Semua logic CRUD (ambil data, simpan, update, hapus) ada di sini.",
    actions: [
      {
        text: "Jalankan di terminal:",
        code: "php artisan make:controller CategoryController",
        label: "bash",
      },
      {
        text: "Buka `app/Http/Controllers/CategoryController.php`.",
      },
      {
        text: "Tambahkan `use App\\Models\\Category;` di bawah `namespace`:",
        code: `use App\\Models\\Category;`,
        label: "app/Http/Controllers/CategoryController.php",
      },
      {
        text: "Copy 6 method di bawah, tempel ke dalam class `CategoryController` (setelah `{`):",
        code: `public function index()
{
    $categories = Category::all();
    return view('categories.index', compact('categories'));
}

public function create()
{
    return view('categories.create');
}

public function store(Request $request)
{
    $validated = $request->validate(['name' => 'required|string|max:255']);
    Category::create($validated);
    return redirect()->route('categories.index')->with('success', 'Kategori berhasil ditambahkan!');
}

public function edit(Category $category)
{
    return view('categories.edit', compact('category'));
}

public function update(Request $request, Category $category)
{
    $validated = $request->validate(['name' => 'required|string|max:255']);
    $category->update($validated);
    return redirect()->route('categories.index')->with('success', 'Kategori berhasil diupdate!');
}

public function destroy(Category $category)
{
    $category->delete();
    return redirect()->route('categories.index')->with('success', 'Kategori berhasil dihapus!');
}`,
        label: "app/Http/Controllers/CategoryController.php",
      },
      {
        text: "Tidak ada garis merah di VS Code — artinya import & syntax udah oke. Nanti pas dicoba, semua method bakal jalan.",
        bukti: true,
      },
    ],
    tip: "Perhatikan `Category $category` di method edit/update/destroy — itu route model binding. Laravel otomatis nyari data by ID dari URL, nggak perlu `Category::find($id)` manual.",
  },
  {
    no: "05",
    title: "View Index — Halaman Daftar Kategori",
    intro:
      "Halaman pertama yang dilihat user: tabel berisi semua kategori + tombol Edit & Hapus.",
    actions: [
      {
        text: "Buat folder baru: `resources/views/categories/`.",
      },
      {
        text: "Di dalamnya, buat file `index.blade.php`, tempel kode di bawah:",
        code: `<h1>Daftar Kategori</h1>

@if(session('success'))
    <p style="color:green">{{ session('success') }}</p>
@endif

<a href="{{ route('categories.create') }}">+ Tambah Kategori</a>

<table border="1">
    <tr><th>Nama</th><th>Aksi</th></tr>
    @foreach($categories as $category)
        <tr>
            <td>{{ $category->name }}</td>
            <td>
                <a href="{{ route('categories.edit', $category) }}">Edit</a>
                <form action="{{ route('categories.destroy', $category) }}" method="POST" style="display:inline">
                    @csrf
                    @method('DELETE')
                    <button type="submit" onclick="return confirm('Yakin mau hapus?')">Hapus</button>
                </form>
            </td>
        </tr>
    @endforeach
</table>`,
        label: "resources/views/categories/index.blade.php",
      },
      {
        text: "Buka http://127.0.0.1:8000/categories — harus tampil heading 'Daftar Kategori' + tombol '+ Tambah Kategori' + tabel kosong (cuma header 'Nama' & 'Aksi').",
        bukti: true,
      },
    ],
    tip: "`@csrf` wajib di setiap form POST/PUT/DELETE. `@method('DELETE')` itu cara HTML 'menyamar' jadi request DELETE.",
  },
  {
    no: "06",
    title: "View Create — Form Tambah Kategori",
    intro: "Halaman form buat nambah kategori baru.",
    actions: [
      {
        text: "Di folder `resources/views/categories/`, bikin `create.blade.php`, tempel kode di bawah:",
        code: `<h1>Tambah Kategori</h1>

<form action="{{ route('categories.store') }}" method="POST">
    @csrf
    <label>Nama Kategori: <input type="text" name="name"></label><br>
    <button type="submit">Simpan</button>
</form>

@if($errors->any())
    <ul style="color:red">
        @foreach($errors->all() as $error)
            <li>{{ $error }}</li>
        @endforeach
    </ul>
@endif`,
        label: "resources/views/categories/create.blade.php",
      },
      {
        text: "Buka http://127.0.0.1:8000/categories/create — harus tampil form 'Tambah Kategori' + input nama + tombol Simpan.",
        bukti: true,
      },
      {
        text: "Coba submit form kosong → harus muncul pesan error merah 'The name field is required.'",
        bukti: true,
      },
    ],
    tip: "Blok `@if($errors->any())` otomatis nampilin error validasi dari controller.",
  },
  {
    no: "07",
    title: "View Edit — Form Update Kategori",
    intro:
      "Halaman form buat edit kategori yang sudah ada. Field-nya keisi otomatis.",
    actions: [
      {
        text: "Di folder `resources/views/categories/`, bikin `edit.blade.php`, tempel kode di bawah:",
        code: `<h1>Edit Kategori</h1>

<form action="{{ route('categories.update', $category) }}" method="POST">
    @csrf
    @method('PUT')
    <label>Nama Kategori: <input type="text" name="name" value="{{ $category->name }}"></label><br>
    <button type="submit">Update</button>
</form>`,
        label: "resources/views/categories/edit.blade.php",
      },
      {
        text: "Klik 'Edit' di salah satu kategori pada halaman index → form muncul dengan nama kategori keisi otomatis.",
        bukti: true,
      },
      {
        text: "Ubah nama → klik Update → balik ke index dengan notif hijau 'Kategori berhasil diupdate!'",
        bukti: true,
      },
    ],
    tip: "`@method('PUT')` itu penyamaran. HTML form aslinya cuma kenal GET/POST, jadi Laravel nyelipin tanda tersembunyi biar tau ini request PUT (update).",
  },
];

const checklist = [
  {
    text: "Buka http://127.0.0.1:8000/categories — tampil tabel kosong",
    detail: "Kalau muncul error 404, cek route & pastikan `php artisan serve` jalan.",
  },
  {
    text: "Klik '+ Tambah Kategori' → isi 'Fiksi' → Simpan",
    detail: "Harus balik ke index dengan notif hijau 'Kategori berhasil ditambahkan!'",
  },
  {
    text: "Tambah 2 kategori lagi: 'Non-Fiksi' & 'Sejarah'",
    detail: "Tabel nampilin 3 baris data.",
  },
  {
    text: "Klik 'Edit' salah satu kategori → ubah nama → Update",
    detail: "Balik ke index, nama kategori sudah berubah.",
  },
  {
    text: "Klik 'Hapus' salah satu kategori → konfirmasi OK",
    detail: "Data hilang, muncul notif 'Kategori berhasil dihapus!'",
  },
  {
    text: "Coba submit Create dengan nama kosong",
    detail: "Muncul pesan error merah 'The name field is required.'",
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
          <Link to="/pertemuan/6" className="hover:text-gold-soft">Pertemuan 6</Link>
          <span>/</span>
          <span className="text-gold-soft">Praktikum 1</span>
        </nav>

        {/* Header */}
        <div className="mb-10 border-b border-gold/15 pb-6">
          <span className="inline-block rounded-full border border-gold/25 bg-bg-card px-3 py-1 text-xs font-medium uppercase tracking-widest text-gold-soft">
            Pertemuan 06 · Praktikum 1
          </span>
          <h1 className="mt-4 font-display text-4xl font-bold leading-tight md:text-5xl">
            <span className="gold-gradient-text">CRUD Kategori</span>
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-neutral-400">
            Latihan pola CRUD lengkap (Create, Read, Update, Delete) di Laravel
            pakai studi kasus paling sederhana — Kategori, cuma 1 field{" "}
            <code className="rounded bg-bg-card px-1.5 py-0.5 text-gold-soft">name</code>.
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            <span className="rounded-full border border-gold/20 bg-bg-elevated px-3 py-1 text-xs text-neutral-300">
              🎯 Tujuan: Migration → Model → Route → Controller → View
            </span>
          </div>
        </div>

        {/* Alur */}
        <section className="mb-14">
          <h2 className="mb-6 flex items-center gap-3 font-display text-xl font-semibold text-neutral-100">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-gold/30 bg-gold/10 text-gold-soft">
              📚
            </span>
            Alur Praktikum — 7 Langkah
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

                {/* Alur aksi — instruksi & kode nyatu */}
                <div className="space-y-5 px-5 py-5">
                  {s.actions.map((a, i) => (
                    <div key={i} className="flex gap-3">
                      {/* Nomor langkah */}
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-gold/30 bg-bg-card font-mono text-xs text-gold-soft">
                        {i + 1}
                      </div>

                      <div className="min-w-0 flex-1 space-y-2">
                        {/* Teks instruksi */}
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

                        {/* Blok kode inline — tepat di bawah instruksi */}
                        {a.code && (
                          <CopyBlock code={a.code} label={a.label} />
                        )}
                      </div>
                    </div>
                  ))}

                  {/* Tip */}
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

        {/* Checklist Akhir */}
        <section className="mb-14">
          <h2 className="mb-5 flex items-center gap-3 font-display text-xl font-semibold text-neutral-100">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-gold/30 bg-gold/10 text-gold-soft">
              ✅
            </span>
            Checklist Akhir — Uji Semua Fitur
          </h2>

          <div className="rounded-xl border border-gold/20 bg-gradient-to-br from-bg-card to-bg-elevated p-5">
            <ol className="space-y-3">
              {checklist.map((c, i) => (
                <li key={i} className="flex gap-3">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-gold/30 bg-bg-base font-mono text-xs text-gold-soft">
                    {i + 1}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-neutral-200">
                      {c.text}
                    </p>
                    <p className="mt-0.5 text-xs text-neutral-500">
                      {c.detail}
                    </p>
                  </div>
                </li>
              ))}
            </ol>

            <div className="mt-5 rounded-lg border border-gold/20 bg-gold/5 px-4 py-3">
              <p className="text-xs text-gold-soft">
                🎉 Kalau semua checklist di atas beres, Praktikum 1 selesai —
                tabel <code>categories</code> siap dipakai sebagai fondasi
                relasi di Praktikum 2 (Buku).
              </p>
            </div>
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
            className="rounded-lg border border-gold/25 bg-gold/10 px-4 py-2 text-sm font-medium text-gold-soft transition-colors hover:bg-gold/20"
          >
            Praktikum 2 →
          </Link>
        </div>
      </div>
    </div>
  );
}