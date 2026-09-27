import { Link } from "react-router-dom";
import CopyBlock from "../../../components/ui/CopyBlock";

const steps = [
  {
    no: "01",
    title: "Migration Buku (dengan Relasi & Kolom Gambar)",
    intro:
      "Bikin tabel `books` yang nyambung ke tabel `categories` dari Praktikum 1.",
    actions: [
      {
        text: "Jalankan di terminal:",
        code: "php artisan make:migration create_books_table",
        label: "bash",
      },
      {
        text: "Buka file baru di `database/migrations/`, isi method `up()` seperti di bawah:",
        code: `public function up(): void
{
    Schema::create('books', function (Blueprint $table) {
        $table->id();
        $table->string('name');
        $table->string('image')->nullable();
        $table->foreignId('category_id')->constrained()->onDelete('cascade');
        $table->timestamps();
    });
}`,
        label: "database/migrations/xxxx_create_books_table.php",
      },
      {
        text: "Simpan, lalu jalankan migrate:",
        code: "php artisan migrate",
        label: "bash",
      },
      {
        text: "Kalau muncul teks `Migrating... Migrated:` — tabel `books` sudah jadi di database.",
        bukti: true,
      },
    ],
    tip: "`foreignId('category_id')->constrained()` itu yang bikin tabel `books` 'nempel' ke tabel `categories`. `onDelete('cascade')` artinya kalau kategorinya dihapus, semua buku di kategori itu ikut terhapus otomatis.",
  },
  {
    no: "02",
    title: "Model Buku + Relasi Dua Arah",
    intro:
      "Bikin model `Book`, lalu tambahkan relasi di `Book` dan `Category` biar bisa saling 'manggil'.",
    actions: [
      {
        text: "Jalankan di terminal:",
        code: "php artisan make:model Book",
        label: "bash",
      },
      {
        text: "Buka `app/Models/Book.php`, tambahkan `$fillable` dan method relasi:",
        code: `protected $fillable = ['name', 'image', 'category_id'];

public function category()
{
    return $this->belongsTo(Category::class);
}`,
        label: "app/Models/Book.php",
      },
      {
        text: "Buka juga `app/Models/Category.php`, tambahkan method relasi baliknya (di dalam class yang sudah ada):",
        code: `public function books()
{
    return $this->hasMany(Book::class);
}`,
        label: "app/Models/Category.php",
      },
      {
        text: "Sekarang `Book` bisa panggil `$book->category->name`, dan `Category` bisa panggil `$category->books`.",
        bukti: true,
      },
    ],
    tip: "`belongsTo` = 'anak yang nunjuk ke induk' (Book nunjuk Category). `hasMany` = 'induk yang punya banyak anak' (Category punya banyak Book). Dua-duanya wajib ada biar bisa query dua arah.",
  },
  {
    no: "03",
    title: "Aktifkan Storage (Sekali Saja)",
    intro:
      "Bikin folder `storage/app/public` bisa diakses lewat browser via `/storage/...`.",
    actions: [
      {
        text: "Jalankan di terminal (cukup sekali untuk seluruh project):",
        code: "php artisan storage:link",
        label: "bash",
      },
      {
        text: "Kalau berhasil, muncul pesan 'The [public/storage] link has been connected to [storage/app/public].'",
        bukti: true,
      },
      {
        text: "Cek folder `public/` — harusnya ada folder `storage` yang jadi shortcut.",
        bukti: true,
      },
    ],
    tip: "Tanpa `storage:link`, gambar yang diupload gak akan pernah muncul di browser walau datanya berhasil tersimpan di database.",
  },
  {
    no: "04",
    title: "Route Buku",
    intro: "Daftarin 6 route CRUD buku ke controller.",
    actions: [
      {
        text: "Buka `routes/web.php`.",
      },
      {
        text: "Tambahkan `use App\\Http\\Controllers\\BookController;` di bagian atas (barengan sama use yang lain):",
        code: `use App\\Http\\Controllers\\BookController;`,
        label: "routes/web.php",
      },
      {
        text: "Tempel 6 route di bawah (setelah route categories dari Praktikum 1):",
        code: `Route::get('/books', [BookController::class, 'index'])->name('books.index');
Route::get('/books/create', [BookController::class, 'create'])->name('books.create');
Route::post('/books', [BookController::class, 'store'])->name('books.store');
Route::get('/books/{book}/edit', [BookController::class, 'edit'])->name('books.edit');
Route::put('/books/{book}', [BookController::class, 'update'])->name('books.update');
Route::delete('/books/{book}', [BookController::class, 'destroy'])->name('books.destroy');`,
        label: "routes/web.php",
      },
      {
        text: "Jalankan `php artisan route:list` — harus muncul 6 route dengan nama `books.*`.",
        bukti: true,
      },
    ],
    tip: "Pola route-nya identik dengan Kategori — 2 untuk halaman (index & create), 4 untuk aksi (store, edit, update, destroy).",
  },
  {
    no: "05",
    title: "Controller Buku — CRUD + Upload Gambar",
    intro:
      "Semua logic CRUD buku + handling file upload gambar ada di sini.",
    actions: [
      {
        text: "Jalankan di terminal:",
        code: "php artisan make:controller BookController",
        label: "bash",
      },
      {
        text: "Buka `app/Http/Controllers/BookController.php`, tambahkan 3 baris `use` di bawah `namespace`:",
        code: `use App\\Models\\Book;
use App\\Models\\Category;
use Illuminate\\Http\\Request;`,
        label: "app/Http/Controllers/BookController.php",
      },
      {
        text: "Copy 6 method di bawah, tempel ke dalam class `BookController`:",
        code: `public function index()
{
    $books = Book::with('category')->get();
    return view('books.index', compact('books'));
}

public function create()
{
    $categories = Category::all();
    return view('books.create', compact('categories'));
}

public function store(Request $request)
{
    $validated = $request->validate([
        'name'        => 'required|string|max:255',
        'category_id' => 'required|exists:categories,id',
        'image'       => 'required|image|max:2048',
    ]);

    $validated['image'] = $request->file('image')->store('books', 'public');

    Book::create($validated);
    return redirect()->route('books.index')->with('success', 'Buku berhasil ditambahkan!');
}

public function edit(Book $book)
{
    $categories = Category::all();
    return view('books.edit', compact('book', 'categories'));
}

public function update(Request $request, Book $book)
{
    $validated = $request->validate([
        'name'        => 'required|string|max:255',
        'category_id' => 'required|exists:categories,id',
        'image'       => 'nullable|image|max:2048',
    ]);

    if ($request->hasFile('image')) {
        if ($book->image) {
            \\Storage::disk('public')->delete($book->image);
        }
        $validated['image'] = $request->file('image')->store('books', 'public');
    }

    $book->update($validated);
    return redirect()->route('books.index')->with('success', 'Buku berhasil diupdate!');
}

public function destroy(Book $book)
{
    if ($book->image) {
        \\Storage::disk('public')->delete($book->image);
    }
    $book->delete();
    return redirect()->route('books.index')->with('success', 'Buku berhasil dihapus!');
}`,
        label: "app/Http/Controllers/BookController.php",
      },
      {
        text: "Tidak ada garis merah di VS Code — artinya import & syntax oke. Siap dipakai.",
        bukti: true,
      },
    ],
    tip: "Perhatikan bedanya: di `store()` field `image` wajib (`required`) karena buku baru harus ada gambarnya. Di `update()` field `image` opsional (`nullable`) — kalau cuma mau ganti nama, nggak dipaksa upload ulang. Baris `Storage::disk('public')->delete(...)` itu buat hapus gambar lama biar nggak numpuk di server.",
  },
  {
    no: "06",
    title: "View Create — Form Tambah Buku",
    intro: "Form input buku baru dengan pilihan kategori & upload gambar.",
    actions: [
      {
        text: "Buat folder baru: `resources/views/books/`.",
      },
      {
        text: "Di dalamnya, buat file `create.blade.php`, tempel kode di bawah:",
        code: `<h1>Tambah Buku</h1>

<form action="{{ route('books.store') }}" method="POST" enctype="multipart/form-data">
    @csrf
    <label>Nama Buku: <input type="text" name="name"></label><br>
    <label>Gambar: <input type="file" name="image"></label><br>
    <label>Kategori:
        <select name="category_id">
            @foreach($categories as $category)
                <option value="{{ $category->id }}">{{ $category->name }}</option>
            @endforeach
        </select>
    </label><br>
    <button type="submit">Simpan</button>
</form>

@if($errors->any())
    <ul style="color:red">
        @foreach($errors->all() as $error)
            <li>{{ $error }}</li>
        @endforeach
    </ul>
@endif`,
        label: "resources/views/books/create.blade.php",
      },
      {
        text: "Buka http://127.0.0.1:8000/books/create — harus muncul form 'Tambah Buku' dengan 3 input: nama, file gambar, dan dropdown kategori.",
        bukti: true,
      },
      {
        text: "Dropdown kategori harus keisi otomatis dari data Kategori Praktikum 1 (Fiksi, Non-Fiksi, Sejarah).",
        bukti: true,
      },
    ],
    tip: "⚠️ WAJIB ada `enctype=\"multipart/form-data\"` di tag `<form>`. Kalau lupa, file gambar gak akan pernah terkirim walau field-nya keliatan terisi di browser — ini bug paling sering kejadian pas upload file.",
  },
  {
    no: "07",
    title: "View Edit — Form Edit Buku",
    intro:
      "Form edit buku. Kalau gambar nggak diganti, gambar lama tetap dipakai.",
    actions: [
      {
        text: "Di folder `resources/views/books/`, buat file `edit.blade.php`, tempel kode di bawah:",
        code: `<h1>Edit Buku</h1>

<form action="{{ route('books.update', $book) }}" method="POST" enctype="multipart/form-data">
    @csrf
    @method('PUT')
    <label>Nama Buku: <input type="text" name="name" value="{{ $book->name }}"></label><br>

    @if($book->image)
        <img src="{{ asset('storage/'.$book->image) }}" width="100"><br>
    @endif
    <label>Ganti Gambar (kosongkan jika tidak ingin ganti): <input type="file" name="image"></label><br>

    <label>Kategori:
        <select name="category_id">
            @foreach($categories as $category)
                <option value="{{ $category->id }}" {{ $book->category_id == $category->id ? 'selected' : '' }}>
                    {{ $category->name }}
                </option>
            @endforeach
        </select>
    </label><br>
    <button type="submit">Update</button>
</form>`,
        label: "resources/views/books/edit.blade.php",
      },
      {
        text: "Klik 'Edit' di salah satu buku pada halaman index → form muncul dengan nama & kategori keisi otomatis, plus preview gambar lama di atas input file.",
        bukti: true,
      },
      {
        text: "Coba ganti nama saja (tanpa upload gambar baru) → klik Update → gambar lama tetap ada.",
        bukti: true,
      },
      {
        text: "Coba edit lagi, kali ini upload gambar baru → klik Update → gambar baru menggantikan gambar lama.",
        bukti: true,
      },
    ],
    tip: "Blok `@if($book->image) ... @endif` nampilin preview gambar lama. Kalau user nggak upload file baru, field `image` di-skip karena `nullable` di controller.",
  },
  {
    no: "08",
    title: "View Index — Halaman Daftar Buku",
    intro:
      "Halaman utama: tabel berisi semua buku + thumbnail gambar + nama kategori (dari relasi).",
    actions: [
      {
        text: "Di folder `resources/views/books/`, buat file `index.blade.php`, tempel kode di bawah:",
        code: `<h1>Daftar Buku</h1>

@if(session('success'))
    <p style="color:green">{{ session('success') }}</p>
@endif

<a href="{{ route('books.create') }}">+ Tambah Buku</a>

<table border="1">
    <tr><th>Gambar</th><th>Nama</th><th>Kategori</th><th>Aksi</th></tr>
    @foreach($books as $book)
        <tr>
            <td>
                @if($book->image)
                    <img src="{{ asset('storage/'.$book->image) }}" width="60">
                @else
                    -
                @endif
            </td>
            <td>{{ $book->name }}</td>
            <td>{{ $book->category->name }}</td>
            <td>
                <a href="{{ route('books.edit', $book) }}">Edit</a>
                <form action="{{ route('books.destroy', $book) }}" method="POST" style="display:inline">
                    @csrf
                    @method('DELETE')
                    <button type="submit" onclick="return confirm('Yakin mau hapus?')">Hapus</button>
                </form>
            </td>
        </tr>
    @endforeach
</table>`,
        label: "resources/views/books/index.blade.php",
      },
      {
        text: "Buka http://127.0.0.1:8000/books — harus tampil heading 'Daftar Buku' + tombol '+ Tambah Buku' + tabel kosong (cuma header 'Gambar' 'Nama' 'Kategori' 'Aksi').",
        bukti: true,
      },
      {
        text: "Setelah isi beberapa buku, kolom 'Kategori' harus nampilin nama kategori (Fiksi/Non-Fiksi/dll) — bukan angka ID.",
        bukti: true,
      },
    ],
    tip: "`$book->category->name` ini yang namanya 'manggil relasi' — karena `Book` sudah `belongsTo(Category)`, Laravel otomatis bisa 'loncat' dari buku ke nama kategorinya tanpa nulis query JOIN manual.",
  },
];

const checklist = [
  {
    text: "Pastikan `php artisan storage:link` sudah pernah dijalankan",
    detail: "Kalau belum, gambar yang diupload nggak bakal muncul di browser.",
  },
  {
    text: "Buka http://127.0.0.1:8000/books — tabel kosong",
    detail: "Kalau 404, cek route & pastikan `php artisan serve` jalan.",
  },
  {
    text: "Klik '+ Tambah Buku' → isi nama, upload gambar, pilih kategori → Simpan",
    detail: "Harus balik ke index dengan notif hijau 'Buku berhasil ditambahkan!'",
  },
  {
    text: "Cek balik ke /books",
    detail: "Thumbnail gambar & nama kategori harus muncul di tabel.",
  },
  {
    text: "Klik Edit → ganti nama saja (tanpa ganti gambar) → Update",
    detail: "Gambar lama tetap muncul, nama berubah.",
  },
  {
    text: "Klik Edit lagi → ganti gambarnya → Update",
    detail: "Gambar baru menggantikan yang lama, gambar lama terhapus dari storage.",
  },
  {
    text: "Klik Hapus pada salah satu buku → konfirmasi OK",
    detail: "Data hilang dari tabel + file gambarnya juga terhapus dari folder storage.",
  },
  {
    text: "Coba submit form Create tanpa upload gambar",
    detail: "Muncul pesan error merah 'The image field is required.'",
  },
  {
    text: "Coba hapus salah satu Kategori di /categories",
    detail: "Semua buku di kategori itu otomatis ikut terhapus (efek onDelete cascade).",
  },
];

export default function Praktikum2() {
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
          <span className="text-gold-soft">Praktikum 2</span>
        </nav>

        {/* Header */}
        <div className="mb-10 border-b border-gold/15 pb-6">
          <span className="inline-block rounded-full border border-gold/25 bg-bg-card px-3 py-1 text-xs font-medium uppercase tracking-widest text-gold-soft">
            Pertemuan 06 · Praktikum 2
          </span>
          <h1 className="mt-4 font-display text-4xl font-bold leading-tight md:text-5xl">
            <span className="gold-gradient-text">
              CRUD Buku — Relasi & Gambar
            </span>
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-neutral-400">
            Gabungin semua konsep: migration, relasi (Kategori ↔ Buku),
            validasi, dan upload gambar — dalam satu studi kasus utuh.
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            <span className="rounded-full border border-gold/20 bg-bg-elevated px-3 py-1 text-xs text-neutral-300">
              🎯 Tujuan: Migration → Model + Relasi → Storage → Route → Controller → View
            </span>
            <span className="rounded-full border border-gold/20 bg-bg-elevated px-3 py-1 text-xs text-neutral-300">
              ⚙️ Prasyarat: Praktikum 1 selesai & tabel `categories` sudah ada isinya
            </span>
          </div>
        </div>

        {/* Alur */}
        <section className="mb-14">
          <h2 className="mb-6 flex items-center gap-3 font-display text-xl font-semibold text-neutral-100">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-gold/30 bg-gold/10 text-gold-soft">
              📚
            </span>
            Alur Praktikum — 8 Langkah
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
                🎉 Kalau semua checklist ini jalan mulus, Praktikum 2 selesai.
                Mahasiswa udah pegang alur lengkap: Migration → Model →
                Relasi → Validasi → Upload Gambar → CRUD penuh.
              </p>
            </div>
          </div>
        </section>

        {/* Navigasi bawah */}
        <div className="flex items-center justify-between border-t border-gold/10 pt-6">
          <Link
            to="/pertemuan/6/praktikum-1"
            className="text-sm text-neutral-500 transition-colors hover:text-gold-soft"
          >
            ← Praktikum 1
          </Link>
          <Link
            to="/pertemuan/6"
            className="rounded-lg border border-gold/25 bg-gold/10 px-4 py-2 text-sm font-medium text-gold-soft transition-colors hover:bg-gold/20"
          >
            Balik ke Pertemuan 6
          </Link>
        </div>
      </div>
    </div>
  );
}