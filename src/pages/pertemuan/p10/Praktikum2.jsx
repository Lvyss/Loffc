import { Link } from "react-router-dom";
import CopyBlock from "../../../components/ui/CopyBlock";

const struktur = `app/Http/Controllers/Admin/
├── DashboardController.php
├── CategoryController.php
├── ItemController.php
└── OrderController.php
app/Http/Controllers/
├── CatalogController.php
├── CartController.php
├── CheckoutController.php
└── OrderController.php
routes/web.php                    ← versi final (B3)
resources/views/
├── layouts/app.blade.php         ← versi final (B4)
├── home.blade.php                ← katalog
├── items/show.blade.php
├── cart/index.blade.php
├── orders/{index, show}.blade.php
├── admin/dashboard.blade.php
├── admin/categories/{index, edit}.blade.php
├── admin/items/{index, create, edit}.blade.php
└── admin/orders/{index, show}.blade.php`;

const steps = [
  {
    no: "00",
    title: "Generate & storage:link",
    fungsi: "Membuat controller admin + customer dan link folder storage.",
    kenapa: "storage:link wajib supaya gambar upload tampil di /storage/...",
    actions: [
      {
        text: "Generate semua controller:",
        code: `php artisan make:controller Admin/DashboardController
php artisan make:controller Admin/CategoryController
php artisan make:controller Admin/ItemController
php artisan make:controller Admin/OrderController
php artisan make:controller CatalogController
php artisan make:controller CartController
php artisan make:controller CheckoutController
php artisan make:controller OrderController
php artisan storage:link`,
        label: "bash",
      },
    ],
    tip: "OrderController ada dua: Admin\\OrderController dan OrderController biasa (untuk customer). Di route, keduanya dipanggil dengan alias path yang berbeda.",
  },
  {
    no: "01",
    title: "Controller Admin (Dashboard, Category, Item, Order)",
    fungsi: "Mengisi logika CRUD admin + upload gambar + ubah status pesanan.",
    kenapa:
      "CategoryController dan ItemController menolak hapus jika datanya sudah pernah dipesan. ItemController menghapus file gambar lama saat update.",
    actions: [
      {
        text: "Isi `Admin/DashboardController.php` — hitung 4 statistik + pesanan terbaru:",
        code: `<?php

namespace App\\Http\\Controllers\\Admin;

use App\\Http\\Controllers\\Controller;
use App\\Models\\Category;
use App\\Models\\Item;
use App\\Models\\Order;

class DashboardController extends Controller
{
    public function index()
    {
        return view('admin.dashboard', [
            'totalCategories' => Category::count(),
            'totalItems'      => Item::count(),
            'totalOrders'     => Order::count(),
            'pendingOrders'   => Order::where('status', 'pending')->count(),
            'latestOrders'    => Order::with('user')->latest()->take(5)->get(),
        ]);
    }
}`,
        label: "app/Http/Controllers/Admin/DashboardController.php",
      },
      {
        text: "Isi `Admin/CategoryController.php` — CRUD + validasi unique + tolak hapus jika sudah ada pesanan:",
        code: `<?php

namespace App\\Http\\Controllers\\Admin;

use App\\Http\\Controllers\\Controller;
use App\\Models\\Category;
use Illuminate\\Http\\Request;

class CategoryController extends Controller
{
    public function index()
    {
        $categories = Category::withCount('items')->latest()->get();
        return view('admin.categories.index', compact('categories'));
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:100|unique:categories,name',
        ]);
        Category::create($data);
        return redirect()->route('admin.categories.index')->with('success', 'Kategori ditambahkan.');
    }

    public function edit(Category $category)
    {
        return view('admin.categories.edit', compact('category'));
    }

    public function update(Request $request, Category $category)
    {
        $data = $request->validate([
            'name' => 'required|string|max:100|unique:categories,name,' . $category->id,
        ]);
        $category->update($data);
        return redirect()->route('admin.categories.index')->with('success', 'Kategori diperbarui.');
    }

    public function destroy(Category $category)
    {
        if ($category->items()->whereHas('orderItems')->exists()) {
            return back()->with('error', 'Kategori tidak bisa dihapus: ada item di dalamnya yang sudah pernah dipesan.');
        }
        $category->delete();
        return redirect()->route('admin.categories.index')->with('success', 'Kategori dihapus.');
    }
}`,
        label: "app/Http/Controllers/Admin/CategoryController.php",
      },
      {
        text: "Isi `Admin/ItemController.php` — CRUD + upload gambar + hapus gambar lama + tolak hapus jika sudah dipesan:",
        code: `<?php

namespace App\\Http\\Controllers\\Admin;

use App\\Http\\Controllers\\Controller;
use App\\Models\\Category;
use App\\Models\\Item;
use Illuminate\\Http\\Request;
use Illuminate\\Support\\Facades\\Storage;

class ItemController extends Controller
{
    private function rules(): array
    {
        return [
            'category_id' => 'required|exists:categories,id',
            'name'        => 'required|string|max:150',
            'description' => 'nullable|string',
            'price'       => 'required|integer|min:0',
            'stock'       => 'required|integer|min:0',
            'image'       => 'nullable|image|max:2048',
        ];
    }

    public function index()
    {
        $items = Item::with('category')->latest()->get();
        return view('admin.items.index', compact('items'));
    }

    public function create()
    {
        $categories = Category::orderBy('name')->get();
        return view('admin.items.create', compact('categories'));
    }

    public function store(Request $request)
    {
        $data = $request->validate($this->rules());

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('items', 'public');
        }

        Item::create($data);
        return redirect()->route('admin.items.index')->with('success', 'Item ditambahkan.');
    }

    public function edit(Item $item)
    {
        $categories = Category::orderBy('name')->get();
        return view('admin.items.edit', compact('item', 'categories'));
    }

    public function update(Request $request, Item $item)
    {
        $data = $request->validate($this->rules());

        if ($request->hasFile('image')) {
            if ($item->image) {
                Storage::disk('public')->delete($item->image);
            }
            $data['image'] = $request->file('image')->store('items', 'public');
        } else {
            unset($data['image']);
        }

        $item->update($data);
        return redirect()->route('admin.items.index')->with('success', 'Item diperbarui.');
    }

    public function destroy(Item $item)
    {
        if ($item->orderItems()->exists()) {
            return back()->with('error', 'Item tidak bisa dihapus karena sudah pernah dipesan. Set stok ke 0 saja.');
        }

        if ($item->image) {
            Storage::disk('public')->delete($item->image);
        }

        $item->delete();
        return redirect()->route('admin.items.index')->with('success', 'Item dihapus.');
    }
}`,
        label: "app/Http/Controllers/Admin/ItemController.php",
      },
      {
        text: "Isi `Admin/OrderController.php` — lihat semua pesanan + ubah status:",
        code: `<?php

namespace App\\Http\\Controllers\\Admin;

use App\\Http\\Controllers\\Controller;
use App\\Models\\Order;
use Illuminate\\Http\\Request;

class OrderController extends Controller
{
    public function index()
    {
        $orders = Order::with('user')->latest()->get();
        return view('admin.orders.index', compact('orders'));
    }

    public function show(Order $order)
    {
        $order->load('user', 'orderItems.item');
        return view('admin.orders.show', compact('order'));
    }

    public function update(Request $request, Order $order)
    {
        $data = $request->validate([
            'status' => 'required|in:pending,diproses,selesai',
        ]);
        $order->update($data);
        return back()->with('success', 'Status pesanan diperbarui.');
    }
}`,
        label: "app/Http/Controllers/Admin/OrderController.php",
      },
    ],
    tip: "Validasi image max:2048 artinya maksimal 2 MB (dalam kilobyte). Kalau upload gagal tanpa pesan, cek `upload_max_filesize` di php.ini.",
  },
  {
    no: "02",
    title: "View Admin (Dashboard, Categories, Items, Orders)",
    fungsi: "Membuat 8 view admin untuk CRUD & kelola pesanan.",
    kenapa:
      "Form upload butuh `enctype=multipart/form-data`. Form update butuh @method('PUT'/'PATCH'/'DELETE').",
    actions: [
      {
        text: "Ganti `admin/dashboard.blade.php` — 4 kotak statistik + tabel pesanan terbaru:",
        code: `@extends('layouts.app')

@section('title', 'Dashboard Admin')

@section('content')
    <h3 class="mb-4">Dashboard Admin</h3>

    <div class="row g-3 mb-4">
        <div class="col-6 col-md-3"><div class="card text-center"><div class="card-body">
            <div class="fs-2">{{ $totalCategories }}</div><div class="text-muted">Kategori</div>
        </div></div></div>
        <div class="col-6 col-md-3"><div class="card text-center"><div class="card-body">
            <div class="fs-2">{{ $totalItems }}</div><div class="text-muted">Item</div>
        </div></div></div>
        <div class="col-6 col-md-3"><div class="card text-center"><div class="card-body">
            <div class="fs-2">{{ $totalOrders }}</div><div class="text-muted">Total Pesanan</div>
        </div></div></div>
        <div class="col-6 col-md-3"><div class="card text-center border-warning"><div class="card-body">
            <div class="fs-2">{{ $pendingOrders }}</div><div class="text-muted">Perlu Diproses</div>
        </div></div></div>
    </div>

    <h5>Pesanan Terbaru</h5>
    <table class="table table-bordered bg-white">
        <thead><tr><th>#</th><th>Customer</th><th>Total</th><th>Status</th><th></th></tr></thead>
        <tbody>
            @forelse ($latestOrders as $order)
                <tr>
                    <td>{{ $order->id }}</td>
                    <td>{{ $order->user->name }}</td>
                    <td>Rp {{ number_format($order->total, 0, ',', '.') }}</td>
                    <td><span class="badge bg-{{ $order->badgeColor() }}">{{ $order->status }}</span></td>
                    <td><a href="{{ route('admin.orders.show', $order) }}" class="btn btn-sm btn-outline-dark">Detail</a></td>
                </tr>
            @empty
                <tr><td colspan="5" class="text-center text-muted">Belum ada pesanan.</td></tr>
            @endforelse
        </tbody>
    </table>
@endsection`,
        label: "resources/views/admin/dashboard.blade.php",
      },
      {
        text: "Kode lengkap view kategori, item, dan pesanan ada di panduan (subbagian A5). Salin apa adanya ke file masing-masing:",
        code: `admin/categories/index.blade.php
admin/categories/edit.blade.php
admin/items/index.blade.php
admin/items/create.blade.php
admin/items/edit.blade.php
admin/orders/index.blade.php
admin/orders/show.blade.php`,
        label: "daftar file",
      },
    ],
    tip: "Form tambah item WAJIB punya `enctype=\"multipart/form-data\"`. Form update ganti gambar juga sama. Tanpa itu file tidak terkirim dan $request->hasFile('image') selalu false.",
  },
  {
    no: "03",
    title: "Controller Customer (Catalog, Cart, Checkout, Order)",
    fungsi:
      "Katalog publik, keranjang di session, checkout dengan DB::transaction, riwayat pesanan customer.",
    kenapa:
      "Cart disimpan di session `[item_id => qty]` supaya tidak perlu tabel keranjang. Checkout memakai transaction: kalau satu langkah gagal (stok kurang), semua dibatalkan. lockForUpdate mencegah dua orang membeli stok terakhir bersamaan.",
    actions: [
      {
        text: "Isi `CatalogController.php` — katalog + filter kategori + detail:",
        code: `<?php

namespace App\\Http\\Controllers;

use App\\Models\\Category;
use App\\Models\\Item;
use Illuminate\\Http\\Request;

class CatalogController extends Controller
{
    public function index(Request $request)
    {
        $categories = Category::orderBy('name')->get();

        $items = Item::with('category')
            ->when($request->category, fn ($q, $categoryId) => $q->where('category_id', $categoryId))
            ->latest()
            ->get();

        return view('home', compact('categories', 'items'));
    }

    public function show(Item $item)
    {
        $item->load('category');
        return view('items.show', compact('item'));
    }
}`,
        label: "app/Http/Controllers/CatalogController.php",
      },
      {
        text: "Isi `CartController.php` — session cart (add, update, destroy):",
        code: `<?php

namespace App\\Http\\Controllers;

use App\\Models\\Item;
use Illuminate\\Http\\Request;

class CartController extends Controller
{
    public function index()
    {
        $cart = session('cart', []);
        $items = Item::whereIn('id', array_keys($cart))->get()->keyBy('id');

        $rows = [];
        $total = 0;

        foreach ($cart as $id => $qty) {
            if (! isset($items[$id])) {
                continue;
            }
            $item = $items[$id];
            $subtotal = $item->price * $qty;
            $total += $subtotal;
            $rows[] = compact('item', 'qty', 'subtotal');
        }

        return view('cart.index', compact('rows', 'total'));
    }

    public function add(Request $request, Item $item)
    {
        $request->validate(['qty' => 'nullable|integer|min:1']);

        $qty = (int) $request->input('qty', 1);
        $cart = session('cart', []);
        $newQty = ($cart[$item->id] ?? 0) + $qty;

        if ($newQty > $item->stock) {
            return back()->with('error', "Stok {$item->name} hanya tersisa {$item->stock}.");
        }

        $cart[$item->id] = $newQty;
        session(['cart' => $cart]);

        return back()->with('success', "{$item->name} masuk keranjang.");
    }

    public function update(Request $request, Item $item)
    {
        $data = $request->validate(['qty' => 'required|integer|min:1']);

        if ($data['qty'] > $item->stock) {
            return back()->with('error', "Stok {$item->name} hanya tersisa {$item->stock}.");
        }

        $cart = session('cart', []);
        $cart[$item->id] = $data['qty'];
        session(['cart' => $cart]);

        return back()->with('success', 'Jumlah diperbarui.');
    }

    public function destroy(Item $item)
    {
        $cart = session('cart', []);
        unset($cart[$item->id]);
        session(['cart' => $cart]);

        return back()->with('success', 'Item dihapus dari keranjang.');
    }
}`,
        label: "app/Http/Controllers/CartController.php",
      },
      {
        text: "Isi `CheckoutController.php` — DB::transaction + lockForUpdate:",
        code: `<?php

namespace App\\Http\\Controllers;

use App\\Models\\Item;
use App\\Models\\Order;
use Illuminate\\Support\\Facades\\DB;

class CheckoutController extends Controller
{
    public function store()
    {
        $cart = session('cart', []);

        if (empty($cart)) {
            return redirect()->route('cart.index')->with('error', 'Keranjang masih kosong.');
        }

        try {
            $order = DB::transaction(function () use ($cart) {
                $items = Item::whereIn('id', array_keys($cart))->lockForUpdate()->get()->keyBy('id');
                $total = 0;

                foreach ($cart as $id => $qty) {
                    $item = $items[$id] ?? null;
                    if (! $item || $item->stock < $qty) {
                        throw new \\RuntimeException('Stok ' . ($item->name ?? 'salah satu item') . ' tidak mencukupi.');
                    }
                    $total += $item->price * $qty;
                }

                $order = Order::create([
                    'user_id' => auth()->id(),
                    'total'   => $total,
                    'status'  => 'pending',
                ]);

                foreach ($cart as $id => $qty) {
                    $item = $items[$id];
                    $order->orderItems()->create([
                        'item_id' => $id,
                        'qty'     => $qty,
                        'price'   => $item->price,
                    ]);
                    $item->decrement('stock', $qty);
                }

                return $order;
            });
        } catch (\\RuntimeException $e) {
            return redirect()->route('cart.index')->with('error', $e->getMessage());
        }

        session()->forget('cart');

        return redirect()->route('orders.show', $order)->with('success', 'Pesanan berhasil dibuat!');
    }
}`,
        label: "app/Http/Controllers/CheckoutController.php",
      },
      {
        text: "Isi `OrderController.php` (customer) — riwayat + detail dengan cek kepemilikan:",
        code: `<?php

namespace App\\Http\\Controllers;

use App\\Models\\Order;

class OrderController extends Controller
{
    public function index()
    {
        $orders = auth()->user()->orders()->latest()->get();
        return view('orders.index', compact('orders'));
    }

    public function show(Order $order)
    {
        abort_if($order->user_id !== auth()->id(), 403);

        $order->load('orderItems.item');
        return view('orders.show', compact('order'));
    }
}`,
        label: "app/Http/Controllers/OrderController.php",
      },
    ],
    tip: "lockForUpdate hanya bekerja di MySQL/Postgres. Di SQLite tetap jalan tapi tanpa lock. Intinya: pembeli kedua yang mencoba membeli stok terakhir akan gagal di dalam transaction dan seluruh perubahan dibatalkan.",
  },
  {
    no: "04",
    title: "Route FINAL (B3) + Layout FINAL (B4)",
    fungsi:
      "Route versi akhir + navbar yang menampilkan menu berbeda untuk admin & customer.",
    kenapa: "Satu file route untuk semua fase — mudah dibaca, mudah diaudit.",
    actions: [
      {
        text: "Ganti seluruh `routes/web.php` dengan versi B3 (ada grup `role:customer` dan `role:admin`):",
        code: `<?php

use App\\Http\\Controllers\\Admin;
use App\\Http\\Controllers\\AuthController;
use App\\Http\\Controllers\\CartController;
use App\\Http\\Controllers\\CatalogController;
use App\\Http\\Controllers\\CheckoutController;
use App\\Http\\Controllers\\OrderController;
use Illuminate\\Support\\Facades\\Route;

Route::get('/', [CatalogController::class, 'index'])->name('home');
Route::get('/items/{item}', [CatalogController::class, 'show'])->name('items.show');

Route::middleware('guest')->group(function () {
    Route::get('/register', [AuthController::class, 'showRegister'])->name('register');
    Route::post('/register', [AuthController::class, 'register']);
    Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
    Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:5,1');
});

Route::middleware('auth')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
    Route::view('/akun', 'account')->name('account');

    Route::middleware('role:customer')->group(function () {
        Route::get('/cart', [CartController::class, 'index'])->name('cart.index');
        Route::post('/cart/add/{item}', [CartController::class, 'add'])->name('cart.add');
        Route::patch('/cart/{item}', [CartController::class, 'update'])->name('cart.update');
        Route::delete('/cart/{item}', [CartController::class, 'destroy'])->name('cart.destroy');

        Route::post('/checkout', [CheckoutController::class, 'store'])->name('checkout');

        Route::get('/orders', [OrderController::class, 'index'])->name('orders.index');
        Route::get('/orders/{order}', [OrderController::class, 'show'])->name('orders.show');
    });

    Route::middleware('role:admin')->prefix('admin')->name('admin.')->group(function () {
        Route::get('/', [Admin\\DashboardController::class, 'index'])->name('dashboard');
        Route::resource('categories', Admin\\CategoryController::class)->except('show');
        Route::resource('items', Admin\\ItemController::class)->except('show');
        Route::resource('orders', Admin\\OrderController::class)->only(['index', 'show', 'update']);
    });
});`,
        label: "routes/web.php",
      },
      {
        text: "Ganti seluruh `layouts/app.blade.php` dengan versi B4 (navbar punya cabang admin vs customer):",
        code: `{{-- navbar --}}
<ul class="navbar-nav ms-auto align-items-lg-center gap-lg-2">
    <li class="nav-item"><a class="nav-link" href="{{ route('home') }}">Katalog</a></li>

    @auth
        @if(auth()->user()->isAdmin())
            <li class="nav-item"><a class="nav-link" href="{{ route('admin.dashboard') }}">Dashboard</a></li>
            <li class="nav-item"><a class="nav-link" href="{{ route('admin.categories.index') }}">Kategori</a></li>
            <li class="nav-item"><a class="nav-link" href="{{ route('admin.items.index') }}">Item</a></li>
            <li class="nav-item"><a class="nav-link" href="{{ route('admin.orders.index') }}">Pesanan</a></li>
        @else
            <li class="nav-item">
                <a class="nav-link" href="{{ route('cart.index') }}">
                    Keranjang <span class="badge bg-warning text-dark">{{ collect(session('cart', []))->sum() }}</span>
                </a>
            </li>
            <li class="nav-item"><a class="nav-link" href="{{ route('orders.index') }}">Pesanan Saya</a></li>
        @endif

        <li class="nav-item"><a class="nav-link" href="{{ route('account') }}">{{ auth()->user()->name }}</a></li>
        <li class="nav-item">
            <form action="{{ route('logout') }}" method="POST" class="d-inline">
                @csrf
                <button class="btn btn-outline-light btn-sm">Logout</button>
            </form>
        </li>
    @else
        <li class="nav-item"><a class="nav-link" href="{{ route('login') }}">Login</a></li>
        <li class="nav-item"><a class="nav-link" href="{{ route('register') }}">Register</a></li>
    @endauth
</ul>

{{-- full layout tetap seperti di Praktikum 1, cuma blok navbar ini yang diganti --}}`,
        label: "resources/views/layouts/app.blade.php",
      },
    ],
    tip: "Kalau halaman putih di area navbar → ada @if/@else/@endif yang tidak seimbang. Hitung pasangannya: @if isAdmin / @else / @endif lalu @auth / @endauth.",
  },
  {
    no: "05",
    title: "View Customer (Katalog, Detail, Cart, Orders)",
    fungsi:
      "5 view customer: home (katalog), items/show, cart/index, orders/index, orders/show.",
    kenapa:
      "Tombol beli hanya muncul jika user login dan role customer. Admin tidak bisa belanja. Guest diarahkan ke login, bukan form POST (kalau form POST, kena 405).",
    actions: [
      {
        text: "Kode lengkap kelima view ada di panduan subbagian B5. Salin sesuai nama filenya:",
        code: `resources/views/home.blade.php          ← katalog + filter kategori
resources/views/items/show.blade.php    ← detail + tombol add to cart
resources/views/cart/index.blade.php    ← tabel qty + subtotal + checkout
resources/views/orders/index.blade.php  ← riwayat pesanan
resources/views/orders/show.blade.php   ← detail pesanan`,
        label: "daftar file",
      },
      {
        text: "Poin penting di `items/show.blade.php`: cabang guest / admin / customer.",
        code: `@if ($item->stock > 0)
    @auth
        @if (auth()->user()->role === 'customer')
            <form action="{{ route('cart.add', $item) }}" method="POST" class="d-flex gap-2" style="max-width:260px">
                @csrf
                <input type="number" name="qty" value="1" min="1" max="{{ $item->stock }}" class="form-control">
                <button class="btn btn-dark text-nowrap">+ Keranjang</button>
            </form>
        @else
            <p class="text-muted fst-italic">Admin tidak bisa berbelanja.</p>
        @endif
    @else
        <a href="{{ route('login') }}" class="btn btn-dark">Login untuk membeli</a>
    @endauth
@endif`,
        label: "items/show.blade.php (potongan)",
      },
    ],
    tip: "Guest klik 'Login untuk membeli' → link GET ke /login. Kalau dibuat form POST ke cart.add, middleware role:customer akan balas 403, bukan redirect ke login.",
  },
  {
    no: "06",
    title: "Jalankan & Uji",
    fungsi:
      "Bersihkan cache, jalankan server, jalankan checklist Bagian A & B.",
    kenapa:
      "optimize:clear penting setelah ubah route, config, atau view cache.",
    actions: [
      {
        text: "Jalankan:",
        code: `php artisan optimize:clear
php artisan serve`,
        label: "bash",
      },
      {
        text: "Uji checklist Bagian A (login admin) lalu Bagian B (login customer). Detail di bawah.",
        bukti: true,
      },
    ],
    tip: "Kalau gambar tidak tampil padahal upload sukses: cek `storage:link` (folder public/storage ada?) dan `APP_URL` di .env.",
  },
];

const checklistA = [
  {
    text: "Buka /admin",
    detail: "Dashboard 4 kotak (3 kategori, 6 item, 0 pesanan).",
  },
  { text: "Tambah kategori kosong", detail: "Error required." },
  {
    text: "Tambah kategori nama yang sudah ada",
    detail: "Error sudah digunakan.",
  },
  { text: "CRUD kategori baru", detail: "Flash hijau tiap aksi." },
  { text: "Tambah item tanpa kategori", detail: "Error validasi." },
  { text: "Tambah item + gambar", detail: "Thumbnail muncul di daftar." },
  { text: "Upload file bukan gambar", detail: "Error 'must be an image'." },
  {
    text: "Edit item, ganti gambar",
    detail: "Gambar baru tampil, file lama terhapus.",
  },
  { text: "Login Budi, buka /admin/items", detail: "403." },
  { text: "Buka /admin/orders", detail: "'Belum ada pesanan'." },
];

const checklistB = [
  {
    text: "Buka / tanpa login",
    detail: "Katalog tampil dengan gambar, harga, stok.",
  },
  {
    text: "Klik filter kategori",
    detail: "URL berubah ?category=1, item terfilter.",
  },
  { text: "Detail item tanpa login", detail: "Tombol 'Login untuk membeli'." },
  { text: "Login Budi, buka detail item", detail: "Form qty + '+ Keranjang'." },
  { text: "Tambah item", detail: "Badge navbar naik, flash hijau." },
  {
    text: "Tambah qty melebihi stok",
    detail: "Flash merah 'Stok hanya tersisa...'.",
  },
  {
    text: "Ubah qty, hapus di /cart",
    detail: "Subtotal & total selalu benar.",
  },
  { text: "Refresh /cart", detail: "Isi keranjang tetap (di session)." },
  { text: "Checkout", detail: "Redirect ke detail pesanan, badge jadi 0." },
  { text: "Admin buka /admin/items", detail: "Stok item sudah berkurang." },
  {
    text: "Admin ubah status pesanan",
    detail: "Budi melihat status baru di 'Pesanan Saya'.",
  },
  { text: "Budi buka pesanan milik orang lain", detail: "403." },
  { text: "Admin buka /cart", detail: "403." },
  {
    text: "Admin hapus item yang sudah dipesan",
    detail: "Ditolak, pesan merah.",
  },
];

export default function Praktikum2() {
  // Struktur JSX sama seperti Praktikum1:
  // - breadcrumb (Home / Pertemuan 10 / Praktikum 2)
  // - header badge "Pertemuan 10 · Praktikum 2"
  // - section "Alur" dengan steps[]
  // - dua section checklist: "Checklist Bagian A (Admin)" dan "Checklist Bagian B (Customer)"
  // - footer navigasi: ← Praktikum 1 | Lanjut ke Tugas →
  //
  // Salin pola JSX dari Praktikum1 dan ganti judul checklist & data.
  return (
    <div className="relative min-h-screen">
      <div className="pointer-events-none absolute left-1/2 top-0 h-64 w-[40rem] -translate-x-1/2 rounded-full bg-gold/10 blur-[120px]" />

      <div className="relative max-w-4xl px-6 py-12 mx-auto">
        <nav className="flex items-center gap-2 mb-8 text-xs text-neutral-500">
          <Link to="/" className="hover:text-gold-soft">
            Home
          </Link>
          <span>/</span>
          <Link to="/pertemuan/10" className="hover:text-gold-soft">
            Pertemuan 10
          </Link>
          <span>/</span>
          <span className="text-gold-soft">Praktikum 2</span>
        </nav>

        <div className="pb-6 mb-10 border-b border-gold/15">
          <span className="inline-block px-3 py-1 text-xs font-medium tracking-widest uppercase border rounded-full border-gold/25 bg-bg-card text-gold-soft">
            Pertemuan 10 · Praktikum 2
          </span>
          <h1 className="mt-4 text-4xl font-bold leading-tight font-display md:text-5xl">
            <span className="gold-gradient-text">
              Admin Panel & Alur Customer
            </span>
          </h1>
          <p className="max-w-2xl mt-3 text-sm leading-relaxed text-neutral-400">
            Bagian A: CRUD kategori & item + upload, kelola pesanan. Bagian B:
            katalog, keranjang session, checkout dengan transaction, riwayat
            pesanan.
          </p>
        </div>

        <section className="mb-10">
          <h2 className="flex items-center gap-3 mb-5 text-xl font-semibold font-display text-neutral-100">
            <span className="flex items-center justify-center border rounded-lg h-9 w-9 border-gold/30 bg-gold/10 text-gold-soft">
              🗂
            </span>
            Struktur File Praktikum 2
          </h2>
          <CopyBlock code={struktur} label="struktur folder" />
        </section>

        <section className="mb-14">
          <h2 className="flex items-center gap-3 mb-6 text-xl font-semibold font-display text-neutral-100">
            <span className="flex items-center justify-center border rounded-lg h-9 w-9 border-gold/30 bg-gold/10 text-gold-soft">
              📚
            </span>
            Alur Praktikum — 7 Langkah
          </h2>

          <div className="space-y-6">
            {steps.map((s) => (
              <div
                key={s.no}
                className="overflow-hidden border rounded-xl border-gold/15 bg-bg-elevated"
              >
                <div className="flex items-start gap-4 px-5 py-4 border-b border-gold/10">
                  <div className="flex items-center justify-center w-10 h-10 text-sm font-bold border rounded-lg shrink-0 border-gold/30 bg-gold/10 font-display text-gold-soft">
                    {s.no}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold font-display text-neutral-100">
                      {s.title}
                    </h3>
                  </div>
                </div>

                <div className="px-4 py-3 mx-5 mt-5 space-y-2 border rounded-lg border-gold/10 bg-bg-card">
                  <p className="text-sm leading-relaxed text-neutral-300">
                    <span className="mr-2 rounded bg-gold/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-gold-soft">
                      Fungsi
                    </span>
                    {s.fungsi}
                  </p>
                  <p className="text-sm leading-relaxed text-neutral-400">
                    <span className="mr-2 rounded bg-gold/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-gold-soft">
                      Kenapa
                    </span>
                    {s.kenapa}
                  </p>
                </div>

                <div className="px-5 py-5 space-y-5">
                  {s.actions.map((a, i) => (
                    <div key={i} className="flex gap-3">
                      <div className="flex items-center justify-center w-6 h-6 font-mono text-xs border rounded-md shrink-0 border-gold/30 bg-bg-card text-gold-soft">
                        {i + 1}
                      </div>
                      <div className="flex-1 min-w-0 space-y-2">
                        <p
                          className={`text-sm leading-relaxed ${a.bukti ? "text-green-300/90" : "text-neutral-300"}`}
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

                  {s.tip && (
                    <div className="px-4 py-3 border rounded-lg ml-9 border-gold/20 bg-gold/5">
                      <p className="text-xs text-gold-soft">💡 {s.tip}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-14">
          <h2 className="flex items-center gap-3 mb-5 text-xl font-semibold font-display text-neutral-100">
            <span className="flex items-center justify-center border rounded-lg h-9 w-9 border-gold/30 bg-gold/10 text-gold-soft">
              🛡️
            </span>
            Checklist Bagian A — Admin
          </h2>
          <div className="p-5 border rounded-xl border-gold/20 bg-gradient-to-br from-bg-card to-bg-elevated">
            <ol className="space-y-3">
              {checklistA.map((c, i) => (
                <li key={i} className="flex gap-3">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-gold/30 bg-bg-base font-mono text-xs text-gold-soft">
                    A{i + 1}
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
          </div>
        </section>

        <section className="mb-14">
          <h2 className="flex items-center gap-3 mb-5 text-xl font-semibold font-display text-neutral-100">
            <span className="flex items-center justify-center border rounded-lg h-9 w-9 border-gold/30 bg-gold/10 text-gold-soft">
              🛒
            </span>
            Checklist Bagian B — Customer
          </h2>
          <div className="p-5 border rounded-xl border-gold/20 bg-gradient-to-br from-bg-card to-bg-elevated">
            <ol className="space-y-3">
              {checklistB.map((c, i) => (
                <li key={i} className="flex gap-3">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-gold/30 bg-bg-base font-mono text-xs text-gold-soft">
                    B{i + 1}
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

            <div className="px-4 py-3 mt-5 border rounded-lg border-gold/20 bg-gold/5">
              <p className="text-xs text-gold-soft">
                🎉 Kalau semua checklist lolos, kamu punya kerangka project
                akhir lengkap:{" "}
                <strong>
                  layout → auth → role → CRUD admin → katalog → cart → checkout
                  → status pesanan
                </strong>
                .
              </p>
            </div>
          </div>
        </section>

        <div className="flex items-center justify-between pt-6 border-t border-gold/10">
          <Link
            to="/pertemuan/10/praktikum-1"
            className="text-sm transition-colors text-neutral-500 hover:text-gold-soft"
          >
            ← Praktikum 1
          </Link>
          <Link
            to="/pertemuan/10/tugas"
            className="text-sm transition-colors text-neutral-500 hover:text-gold-soft"
          >
            Lanjut ke Tugas →
          </Link>
        </div>
      </div>
    </div>
  );
}
