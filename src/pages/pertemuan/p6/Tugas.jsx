import { Link } from "react-router-dom";
import CopyBlock from "../../../components/ui/CopyBlock";

const steps = [
  // ============================================
  // BAGIAN A — KATEGORI PRODUK
  // ============================================
  {
    no: "A1",
    title: "Migration — Product Categories",
    intro:
      "Bikin tabel `product_categories` (terpisah dari `categories` di Praktikum 1).",
    actions: [
      {
        text: "Jalankan di terminal:",
        code: "php artisan make:migration create_product_categories_table",
        label: "bash",
      },
      {
        text: "Buka file baru di `database/migrations/`, isi method `up()`:",
        code: `Schema::create('product_categories', function (Blueprint $table) {
    $table->id();
    $table->string('name');
    $table->timestamps();
});`,
        label: "database/migrations/xxxx_create_product_categories_table.php",
      },
      {
        text: "Simpan, lalu jalankan migrate:",
        code: "php artisan migrate",
        label: "bash",
      },
      {
        text: "Kalau muncul `Migrating... Migrated:` — tabel `product_categories` sudah jadi.",
        bukti: true,
      },
    ],
    tip: "Sengaja penamaan baru (`product_categories`, bukan `categories`) biar gak nyampur sama data Praktikum 1 & 2.",
  },
  {
    no: "A2",
    title: "Model — ProductCategory + Relasi",
    intro:
      "Model `ProductCategory` dengan relasi `hasMany` ke `Product`.",
    actions: [
      {
        text: "Jalankan di terminal:",
        code: "php artisan make:model ProductCategory",
        label: "bash",
      },
      {
        text: "Buka `app/Models/ProductCategory.php`, tambahkan `$fillable` + relasi:",
        code: `protected $fillable = ['name'];

public function products()
{
    return $this->hasMany(Product::class);
}`,
        label: "app/Models/ProductCategory.php",
      },
      {
        text: "Model siap dipakai — relasi ke `Product` udah dideklarasikan.",
        bukti: true,
      },
    ],
    tip: "Relasi `hasMany` di sini bakal dipakai nanti pas nampilin produk di halaman Home (suntik trending products).",
  },
  {
    no: "A3",
    title: "Route — Product Categories",
    intro: "Cuma 3 route (index, create, store) — tanpa edit/update/destroy.",
    actions: [
      {
        text: "Buka `routes/web.php`, tambahkan `use` di atas:",
        code: `use App\\Http\\Controllers\\ProductCategoryController;`,
        label: "routes/web.php",
      },
      {
        text: "Tempel 3 route di bawah:",
        code: `Route::get('/admin/product-categories', [ProductCategoryController::class, 'index'])->name('product-categories.index');
Route::get('/admin/product-categories/create', [ProductCategoryController::class, 'create'])->name('product-categories.create');
Route::post('/admin/product-categories', [ProductCategoryController::class, 'store'])->name('product-categories.store');`,
        label: "routes/web.php",
      },
      {
        text: "Cek `php artisan route:list` — muncul 3 route `product-categories.*`.",
        bukti: true,
      },
    ],
    tip: "Edit & delete sengaja belum dibuat — itu bagian dari tugas lanjutan di akhir.",
  },
  {
    no: "A4",
    title: "Controller — ProductCategoryController",
    intro: "Logic CRUD (baru Create & Read) kategori produk.",
    actions: [
      {
        text: "Jalankan di terminal:",
        code: "php artisan make:controller ProductCategoryController",
        label: "bash",
      },
      {
        text: "Buka `app/Http/Controllers/ProductCategoryController.php`, tambahkan `use` di bawah namespace:",
        code: `use App\\Models\\ProductCategory;`,
        label: "app/Http/Controllers/ProductCategoryController.php",
      },
      {
        text: "Copy 3 method di bawah, tempel ke dalam class:",
        code: `public function index()
{
    $productCategories = ProductCategory::all();
    return view('admin.product-categories.index', compact('productCategories'));
}

public function create()
{
    return view('admin.product-categories.create');
}

public function store(Request $request)
{
    $validated = $request->validate(['name' => 'required|string|max:255']);
    ProductCategory::create($validated);
    return redirect()->route('product-categories.index')->with('success', 'Kategori produk berhasil ditambahkan!');
}`,
        label: "app/Http/Controllers/ProductCategoryController.php",
      },
      {
        text: "Tidak ada garis merah — artinya syntax & import udah oke.",
        bukti: true,
      },
    ],
  },
  {
    no: "A5",
    title: "View Index — Daftar Kategori Produk",
    intro: "Halaman daftar kategori produk.",
    actions: [
      {
        text: "Bikin folder `resources/views/admin/product-categories/`.",
      },
      {
        text: "Di dalamnya, bikin file `index.blade.php`, isi:",
        code: `<h1>Daftar Kategori Produk</h1>

@if(session('success'))
    <p style="color:green">{{ session('success') }}</p>
@endif

<a href="{{ route('product-categories.create') }}">+ Tambah Kategori</a>

<table border="1">
    <tr><th>Nama</th></tr>
    @foreach($productCategories as $productCategory)
        <tr>
            <td>{{ $productCategory->name }}</td>
        </tr>
    @endforeach
</table>`,
        label: "resources/views/admin/product-categories/index.blade.php",
      },
      {
        text: "Buka `/admin/product-categories` — tabel kosong muncul.",
        bukti: true,
      },
    ],
  },
  {
    no: "A6",
    title: "View Create — Form Kategori Produk",
    intro: "Halaman form tambah kategori produk.",
    actions: [
      {
        text: "Bikin file `create.blade.php` di folder yang sama, isi:",
        code: `<h1>Tambah Kategori Produk</h1>

<form action="{{ route('product-categories.store') }}" method="POST">
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
        label: "resources/views/admin/product-categories/create.blade.php",
      },
      {
        text: "Buka `/admin/product-categories/create` → coba tambah 2-3 kategori (misal: 'Fruits & Veges', 'Juices').",
        bukti: true,
      },
      {
        text: "Balik ke `/admin/product-categories` — data baru muncul di tabel.",
        bukti: true,
      },
    ],
    tip: "Bagian A selesai! Kategori produk udah bisa ditambah & dilihat.",
  },

  // ============================================
  // BAGIAN B — PRODUK
  // ============================================
  {
    no: "B1",
    title: "Migration — Products",
    intro: "Tabel `products` dengan relasi ke `product_categories` + kolom gambar.",
    actions: [
      {
        text: "Jalankan di terminal:",
        code: "php artisan make:migration create_products_table",
        label: "bash",
      },
      {
        text: "Buka file baru di `database/migrations/`, isi method `up()`:",
        code: `Schema::create('products', function (Blueprint $table) {
    $table->id();
    $table->string('name');
    $table->decimal('price', 10, 2);
    $table->string('image')->nullable();
    $table->foreignId('product_category_id')->constrained()->onDelete('cascade');
    $table->timestamps();
});`,
        label: "database/migrations/xxxx_create_products_table.php",
      },
      {
        text: "Simpan, lalu jalankan migrate:",
        code: "php artisan migrate",
        label: "bash",
      },
      {
        text: "Tabel `products` muncul dengan kolom `product_category_id` (bukan `category_id` — biar beda dari Praktikum 2).",
        bukti: true,
      },
    ],
    tip: "Kolom `product_category_id` sengaja dinamai beda dari `category_id` biar gak ketuker sama relasi Buku-Kategori di Praktikum 2.",
  },
  {
    no: "B2",
    title: "Model — Product + Relasi",
    intro: "Model `Product` dengan relasi `belongsTo` ke `ProductCategory`.",
    actions: [
      {
        text: "Jalankan di terminal:",
        code: "php artisan make:model Product",
        label: "bash",
      },
      {
        text: "Buka `app/Models/Product.php`, tambahkan:",
        code: `protected $fillable = ['name', 'price', 'image', 'product_category_id'];

public function productCategory()
{
    return $this->belongsTo(ProductCategory::class);
}`,
        label: "app/Models/Product.php",
      },
      {
        text: "Sekarang `Product` bisa panggil `$product->productCategory->name` di view.",
        bukti: true,
      },
    ],
  },
  {
    no: "B3",
    title: "Route — Products",
    intro: "3 route CRUD produk (index, create, store).",
    actions: [
      {
        text: "Di `routes/web.php`, tambahkan `use`:",
        code: `use App\\Http\\Controllers\\ProductController;`,
        label: "routes/web.php",
      },
      {
        text: "Tempel 3 route di bawah:",
        code: `Route::get('/admin/products', [ProductController::class, 'index'])->name('products.index');
Route::get('/admin/products/create', [ProductController::class, 'create'])->name('products.create');
Route::post('/admin/products', [ProductController::class, 'store'])->name('products.store');`,
        label: "routes/web.php",
      },
      {
        text: "Cek `php artisan route:list` — muncul 3 route `products.*`.",
        bukti: true,
      },
    ],
  },
  {
    no: "B4",
    title: "Controller — ProductController",
    intro: "Create & Read produk dengan upload gambar.",
    actions: [
      {
        text: "Jalankan di terminal:",
        code: "php artisan make:controller ProductController",
        label: "bash",
      },
      {
        text: "Buka `app/Http/Controllers/ProductController.php`, tambahkan 3 baris `use` di bawah namespace:",
        code: `use App\\Models\\Product;
use App\\Models\\ProductCategory;
use Illuminate\\Http\\Request;`,
        label: "app/Http/Controllers/ProductController.php",
      },
      {
        text: "Copy 3 method di bawah:",
        code: `public function index()
{
    $products = Product::with('productCategory')->get();
    return view('admin.products.index', compact('products'));
}

public function create()
{
    $productCategories = ProductCategory::all();
    return view('admin.products.create', compact('productCategories'));
}

public function store(Request $request)
{
    $validated = $request->validate([
        'name'                => 'required|string|max:255',
        'price'               => 'required|numeric|min:0',
        'product_category_id' => 'required|exists:product_categories,id',
        'image'               => 'required|image|max:2048',
    ]);

    $validated['image'] = $request->file('image')->store('products', 'public');

    Product::create($validated);
    return redirect()->route('products.index')->with('success', 'Produk berhasil ditambahkan!');
}`,
        label: "app/Http/Controllers/ProductController.php",
      },
      {
        text: "Tidak ada garis merah — siap dipakai.",
        bukti: true,
      },
    ],
    tip: "`Product::with('productCategory')` itu eager loading — sekali query langsung ambil relasinya, lebih efisien daripada query per baris.",
  },
  {
    no: "B5",
    title: "View Create — Form Produk",
    intro: "Form input produk dengan upload gambar & pilih kategori.",
    actions: [
      {
        text: "Bikin folder `resources/views/admin/products/`.",
      },
      {
        text: "Bikin file `create.blade.php` di dalamnya, isi:",
        code: `<h1>Tambah Produk</h1>

<form action="{{ route('products.store') }}" method="POST" enctype="multipart/form-data">
    @csrf
    <label>Nama Produk: <input type="text" name="name"></label><br>
    <label>Harga: <input type="number" step="0.01" name="price"></label><br>
    <label>Gambar: <input type="file" name="image"></label><br>
    <label>Kategori:
        <select name="product_category_id">
            @foreach($productCategories as $productCategory)
                <option value="{{ $productCategory->id }}">{{ $productCategory->name }}</option>
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
        label: "resources/views/admin/products/create.blade.php",
      },
      {
        text: "Buka `/admin/products/create` — form muncul dengan dropdown kategori yang keisi otomatis dari Bagian A.",
        bukti: true,
      },
    ],
    tip: "⚠️ WAJIB ada `enctype=\"multipart/form-data\"` di tag `<form>` — tanpa ini gambar gak akan terkirim walau keliatan terisi di browser.",
  },
  {
    no: "B6",
    title: "View Index — Daftar Produk",
    intro: "Halaman tabel berisi semua produk + thumbnail + nama kategori.",
    actions: [
      {
        text: "Bikin file `index.blade.php` di folder yang sama, isi:",
        code: `<h1>Daftar Produk</h1>

@if(session('success'))
    <p style="color:green">{{ session('success') }}</p>
@endif

<a href="{{ route('products.create') }}">+ Tambah Produk</a>

<table border="1">
    <tr><th>Gambar</th><th>Nama</th><th>Kategori</th><th>Harga</th></tr>
    @foreach($products as $product)
        <tr>
            <td>
                @if($product->image)
                    <img src="{{ asset('storage/'.$product->image) }}" width="60">
                @else
                    -
                @endif
            </td>
            <td>{{ $product->name }}</td>
            <td>{{ $product->productCategory->name }}</td>
            <td>\${{ $product->price }}</td>
        </tr>
    @endforeach
</table>`,
        label: "resources/views/admin/products/index.blade.php",
      },
      {
        text: "Buka `/admin/products` → tambah beberapa produk, upload gambar, pilih kategori.",
        bukti: true,
      },
      {
        text: "Cek tabel — gambar, nama, kategori, dan harga semua muncul.",
        bukti: true,
      },
    ],
    tip: "Bagian B selesai! Produk udah bisa ditambah & dilihat, plus gambarnya tersimpan di storage.",
  },

  // ============================================
  // BAGIAN C — SUNTIK KE HOME
  // ============================================
  {
    no: "C1",
    title: "Route Halaman Home",
    intro:
      "Ganti route `/` biar ngirim data kategori + produk ke halaman Home.",
    actions: [
      {
        text: "Buka `routes/web.php`, ganti route `/` jadi:",
        code: `Route::get('/', function () {
    $productCategories = \\App\\Models\\ProductCategory::with('products')->get();
    return view('home', compact('productCategories'));
})->name('home');`,
        label: "routes/web.php",
      },
      {
        text: "Sekarang halaman Home bakal punya akses ke `$productCategories` (lengkap dengan relasi `products`).",
        bukti: true,
      },
    ],
    tip: "Kalau tadinya route `/` cuma `return view('home')`, ganti jadi versi di atas biar data produk beneran kekirim.",
  },
  {
    no: "C2",
    title: "Update Section Trending Products di Home",
    intro:
      "Ganti section `bootstrap-tabs product-tabs` di file Blade Home dengan versi dinamis.",
    actions: [
      {
        text: "Buka file Blade halaman Home kamu (hasil convert dari `index.html`).",
      },
      {
        text: "Cari section `bootstrap-tabs product-tabs`, ganti isi `nav nav-tabs` dan `tab-content` dengan kode di bawah:",
        code: `<div class="bootstrap-tabs product-tabs">
    <div class="tabs-header d-flex justify-content-between border-bottom my-5">
        <h3>Trending Products</h3>
        <nav>
            <div class="nav nav-tabs" id="nav-tab" role="tablist">
                <a href="#" class="nav-link text-uppercase fs-6 active" id="nav-all-tab"
                    data-bs-toggle="tab" data-bs-target="#nav-all">All</a>

                @foreach ($productCategories as $productCategory)
                    <a href="#" class="nav-link text-uppercase fs-6" id="nav-{{ Str::slug($productCategory->name) }}-tab"
                        data-bs-toggle="tab" data-bs-target="#nav-{{ Str::slug($productCategory->name) }}">
                        {{ $productCategory->name }}
                    </a>
                @endforeach
            </div>
        </nav>
    </div>

    <div class="tab-content" id="nav-tabContent">

        <div class="tab-pane fade show active" id="nav-all" role="tabpanel">
            <div class="product-grid row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-5">
                @foreach ($productCategories as $productCategory)
                    @foreach ($productCategory->products as $product)
                        <div class="col">
                            <div class="product-item">
                                <figure>
                                    <img src="{{ $product->image ? asset('storage/'.$product->image) : asset('images/product-thumb-1.png') }}" class="tab-image">
                                </figure>
                                <h3>{{ $product->name }}</h3>
                                <span class="qty">1 Unit</span>
                                <span class="rating">
                                    <svg width="24" height="24" class="text-primary"><use xlink:href="#star-solid"></use></svg> 4.5
                                </span>
                                <span class="price">\${{ $product->price }}</span>
                            </div>
                        </div>
                    @endforeach
                @endforeach
            </div>
        </div>

        @foreach ($productCategories as $productCategory)
            <div class="tab-pane fade" id="nav-{{ Str::slug($productCategory->name) }}" role="tabpanel">
                <div class="product-grid row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-5">
                    @foreach ($productCategory->products as $product)
                        <div class="col">
                            <div class="product-item">
                                <figure>
                                    <img src="{{ $product->image ? asset('storage/'.$product->image) : asset('images/product-thumb-1.png') }}" class="tab-image">
                                </figure>
                                <h3>{{ $product->name }}</h3>
                                <span class="qty">1 Unit</span>
                                <span class="rating">
                                    <svg width="24" height="24" class="text-primary"><use xlink:href="#star-solid"></use></svg> 4.5
                                </span>
                                <span class="price">\${{ $product->price }}</span>
                            </div>
                        </div>
                    @endforeach
                </div>
            </div>
        @endforeach

    </div>
</div>`,
        label: "resources/views/home.blade.php",
      },
      {
        text: "Buka `/` (halaman utama) — cek produk muncul di tab 'All' dan di tab kategori masing-masing.",
        bukti: true,
      },
      {
        text: "Gambar produk muncul sesuai yang diupload.",
        bukti: true,
      },
    ],
    tip: "`Str::slug($productCategory->name)` itu helper Laravel buat convert nama kategori jadi slug URL-friendly (misal 'Fruits & Veges' → 'fruits-veges'), dipakai buat id tab.",
  },
];

const checklist = [
  "Buka /admin/product-categories → tambah 2-3 kategori (misal: 'Fruits & Veges', 'Juices')",
  "Buka /admin/products → tambah beberapa produk (nama, harga, upload gambar, pilih kategori)",
  "Buka / (halaman utama) → cek produk muncul di tab 'All'",
  "Klik tab kategori di halaman utama → produk ter-filter sesuai kategorinya",
  "Pastikan gambar produk tampil sesuai yang diupload",
  "Coba submit form produk tanpa gambar → muncul error validasi merah",
];

const tugasLanjutan = [
  "Edit (Update) untuk Kategori Produk",
  "Hapus (Delete) untuk Kategori Produk",
  "Edit (Update) untuk Produk",
  "Hapus (Delete) untuk Produk",
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
            <span className="gold-gradient-text">
              Implementasi FoodMart
            </span>
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-neutral-400">
            Terapin pola yang sama (migration, model, relasi, upload gambar)
            ke project nyata — template FoodMart. Cuma sampai <strong>Create
            & Read</strong> dulu, Edit & Delete jadi tugas lanjutan di akhir.
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            <span className="rounded-full border border-gold/20 bg-bg-elevated px-3 py-1 text-xs text-neutral-300">
              🎯 Tujuan: Terapin CRUD ke project nyata
            </span>
            <span className="rounded-full border border-gold/20 bg-bg-elevated px-3 py-1 text-xs text-neutral-300">
              ⚙️ Prasyarat: `php artisan storage:link` sudah dijalankan
            </span>
          </div>
        </div>

        {/* Alur Tugas */}
        <section className="mb-14">
          <h2 className="mb-6 flex items-center gap-3 font-display text-xl font-semibold text-neutral-100">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-gold/30 bg-gold/10 text-gold-soft">
              📚
            </span>
            Alur Tugas — 3 Bagian
          </h2>

          {/* Sub-header Bagian A */}
          <div className="mb-4 mt-2 flex items-center gap-3 rounded-lg border border-gold/20 bg-gold/5 px-4 py-3">
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-gold/20 font-display text-sm font-bold text-gold-soft">
              A
            </span>
            <div>
              <p className="text-sm font-semibold text-gold-soft">
                Kategori Produk
              </p>
              <p className="text-xs text-neutral-500">
                Create & Read — 6 langkah
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {steps
              .filter((s) => s.no.startsWith("A"))
              .map((s) => (
                <StepCard key={s.no} step={s} />
              ))}
          </div>

          {/* Sub-header Bagian B */}
          <div className="mb-4 mt-10 flex items-center gap-3 rounded-lg border border-gold/20 bg-gold/5 px-4 py-3">
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-gold/20 font-display text-sm font-bold text-gold-soft">
              B
            </span>
            <div>
              <p className="text-sm font-semibold text-gold-soft">
                Produk
              </p>
              <p className="text-xs text-neutral-500">
                Create & Read + Upload Gambar — 6 langkah
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {steps
              .filter((s) => s.no.startsWith("B"))
              .map((s) => (
                <StepCard key={s.no} step={s} />
              ))}
          </div>

          {/* Sub-header Bagian C */}
          <div className="mb-4 mt-10 flex items-center gap-3 rounded-lg border border-gold/20 bg-gold/5 px-4 py-3">
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-gold/20 font-display text-sm font-bold text-gold-soft">
              C
            </span>
            <div>
              <p className="text-sm font-semibold text-gold-soft">
                Suntik ke Halaman Home (Trending Products)
              </p>
              <p className="text-xs text-neutral-500">
                Nampilin produk di halaman utama — 2 langkah
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {steps
              .filter((s) => s.no.startsWith("C"))
              .map((s) => (
                <StepCard key={s.no} step={s} />
              ))}
          </div>
        </section>

        {/* Checklist End-to-End */}
        <section className="mb-14">
          <h2 className="mb-5 flex items-center gap-3 font-display text-xl font-semibold text-neutral-100">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-gold/30 bg-gold/10 text-gold-soft">
              ✅
            </span>
            Checklist — Coba Jalankan End-to-End
          </h2>

          <div className="rounded-xl border border-gold/20 bg-gradient-to-br from-bg-card to-bg-elevated p-5">
            <ol className="space-y-3">
              {checklist.map((c, i) => (
                <li key={i} className="flex gap-3">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-gold/30 bg-bg-base font-mono text-xs text-gold-soft">
                    {i + 1}
                  </span>
                  <p className="text-sm text-neutral-300">{c}</p>
                </li>
              ))}
            </ol>

            <div className="mt-5 rounded-lg border border-gold/20 bg-gold/5 px-4 py-3">
              <p className="text-xs text-gold-soft">
                🎉 Kalau semua checklist di atas beres, Bagian A, B, dan C
                selesai — FoodMart lu udah punya kategori produk, produk, dan
                halaman Home yang narik data dinamis dari database.
              </p>
            </div>
          </div>
        </section>

        {/* Tugas Lanjutan */}
        <section className="mb-14">
          <h2 className="mb-5 flex items-center gap-3 font-display text-xl font-semibold text-neutral-100">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-gold/30 bg-gold/10 text-gold-soft">
              📝
            </span>
            Tugas Lanjutan — Edit & Delete
          </h2>

          <div className="rounded-xl border border-gold/20 bg-gradient-to-br from-bg-card to-bg-elevated p-5">
            <p className="text-sm text-neutral-300">
              Praktikum ini baru sampai <strong>Create & Read</strong>.
              Sebagai latihan mandiri, tambahkan:
            </p>

            <ul className="mt-4 space-y-2 text-sm text-neutral-300">
              {tugasLanjutan.map((t, i) => (
                <li key={i} className="flex gap-3">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-gold/60" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>

            <div className="mt-5 rounded-lg border border-gold/20 bg-gold/5 px-4 py-3">
              <p className="text-xs text-gold-soft">
                💡 Gunakan pola yang persis sama seperti yang udah dipelajari
                di <strong>Praktikum 1 (Kategori)</strong> dan{" "}
                <strong>Praktikum 2 (Buku)</strong> — tinggal disesuaikan nama
                model, tabel, dan field-nya.
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
            className="text-sm text-neutral-500 transition-colors hover:text-gold-soft"
          >
            Praktikum 2 →
          </Link>
        </div>
      </div>
    </div>
  );
}

// ============================================
// Komponen Step Card (biar JSX-nya rapi)
// ============================================
function StepCard({ step }) {
  return (
    <div className="overflow-hidden rounded-xl border border-gold/15 bg-bg-elevated">
      <div className="flex items-start gap-4 border-b border-gold/10 px-5 py-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-gold/30 bg-gold/10 font-mono text-xs font-bold text-gold-soft">
          {step.no}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-display text-lg font-semibold text-neutral-100">
            {step.title}
          </h3>
          <p className="mt-1 text-sm text-neutral-500">{step.intro}</p>
        </div>
      </div>

      <div className="space-y-5 px-5 py-5">
        {step.actions.map((a, i) => (
          <div key={i} className="flex gap-3">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-gold/30 bg-bg-card font-mono text-xs text-gold-soft">
              {i + 1}
            </div>

            <div className="min-w-0 flex-1 space-y-2">
              <p
                className={`text-sm leading-relaxed ${
                  a.bukti ? "text-green-300/90" : "text-neutral-300"
                }`}
              >
                {a.bukti && (
                  <span className="mr-1.5 inline-flex h-4 w-4 -translate-y-0.5 items-center justify-center rounded-full bg-green-500/20 text-[10px] text-green-400">
                    ✓
                  </span>
                )}
                {a.text}
              </p>

              {a.code && <CopyBlock code={a.code} label={a.label} />}
            </div>
          </div>
        ))}

        {step.tip && (
          <div className="ml-9 rounded-lg border border-gold/20 bg-gold/5 px-4 py-3">
            <p className="text-xs text-gold-soft">💡 {step.tip}</p>
          </div>
        )}
      </div>
    </div>
  );
}