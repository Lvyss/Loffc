import { Link } from "react-router-dom";
import CopyBlock from "../../../components/ui/CopyBlock";

const struktur = `app/
├── Http/
│   ├── Controllers/AuthController.php
│   └── Middleware/RoleMiddleware.php
├── Models/{User, Category, Item, Order, OrderItem}.php
bootstrap/app.php              ← alias role + redirectUsersTo
routes/web.php                 ← versi Fase 2
database/migrations/
│   ├── 0001_01_01_000000_create_users_table.php  ← + kolom role
│   └── xxxx_create_toko_tables.php               ← 4 tabel toko
database/seeders/DatabaseSeeder.php
resources/views/
├── layouts/app.blade.php      ← navbar + flash + Bootstrap
├── home.blade.php             ← placeholder
├── account.blade.php
├── admin/dashboard.blade.php  ← placeholder
└── auth/{login, register}.blade.php`;

const analogi = [
  { konsep: "Migration", analogi: "Blueprint tabel — satu sumber kebenaran" },
  { konsep: "Model + Relasi", analogi: "Denah antar ruangan (kategori↔item↔order)" },
  { konsep: "Seeder", analogi: "Barang contoh yang langsung ditata di toko" },
  { konsep: "Role + Middleware", analogi: "Pintu berbeda untuk admin dan customer" },
];

const steps = [
  {
    no: "00",
    title: "Buat Project & Konfigurasi .env",
    fungsi: "Membuat kerangka Laravel 13 baru dan menghubungkannya ke database.",
    kenapa:
      "Project terpisah dari praktikum sebelumnya. Laravel butuh tahu database mana yang dipakai lewat .env; nama database harus dibuat dulu di MySQL karena Laravel hanya membuat tabel.",
    actions: [
      {
        text: "Buat project, masuk ke foldernya:",
        code: `composer create-project laravel/laravel:^13.0 toko-mini
cd toko-mini`,
        label: "bash",
      },
      {
        text: "Buka `.env`, atur nama app & database:",
        code: `APP_NAME="Toko Mini"
DB_CONNECTION=mysql
DB_DATABASE=toko_mini
DB_USERNAME=root
DB_PASSWORD=`,
        label: ".env",
      },
      {
        text: "Buat database kosong `toko_mini` lewat phpMyAdmin / HeidiSQL. (Kalau pakai SQLite bawaan, lewati baris DB_*.)",
      },
      {
        text: "Cek versi PHP & Composer (minimal PHP 8.3):",
        code: `php -v
composer -V`,
        label: "bash",
      },
      {
        text: "Keduanya menampilkan versi, PHP minimal 8.3.",
        bukti: true,
      },
    ],
    tip: "Kalau tidak yakin database sudah terhubung, jalankan `php artisan migrate` dulu. Kalau muncul error koneksi, cek lagi DB_DATABASE, DB_USERNAME, DB_PASSWORD di .env.",
  },
  {
    no: "01",
    title: "Migration: Kolom role + 4 Tabel Toko",
    fungsi:
      "Menambah kolom role di users, dan membuat tabel categories, items, orders, order_items dalam satu migration.",
    kenapa:
      "Satu migration untuk semua tabel toko supaya urutan pasti benar (foreign key butuh tabel induk lebih dulu). Kolom role dipakai middleware untuk membedakan admin vs customer.",
    actions: [
      {
        text: "Generate model & migration:",
        code: `php artisan make:model Category
php artisan make:model Item
php artisan make:model Order
php artisan make:model OrderItem
php artisan make:migration create_toko_tables`,
        label: "bash",
      },
      {
        text: "Buka migration `0001_01_01_000000_create_users_table.php`, tambahkan kolom role setelah `password`:",
        code: `$table->string('password');
$table->string('role')->default('customer'); // admin / customer`,
        label: "database/migrations/0001_..._create_users_table.php",
      },
      {
        text: "Buka migration `create_toko_tables`, isi method `up()` dan `down()`:",
        code: `public function up(): void
{
    Schema::create('categories', function (Blueprint $table) {
        $table->id();
        $table->string('name');
        $table->timestamps();
    });

    Schema::create('items', function (Blueprint $table) {
        $table->id();
        $table->foreignId('category_id')->constrained()->cascadeOnDelete();
        $table->string('name');
        $table->text('description')->nullable();
        $table->unsignedInteger('price');
        $table->unsignedInteger('stock')->default(0);
        $table->string('image')->nullable();
        $table->timestamps();
    });

    Schema::create('orders', function (Blueprint $table) {
        $table->id();
        $table->foreignId('user_id')->constrained()->cascadeOnDelete();
        $table->unsignedInteger('total');
        $table->string('status')->default('pending'); // pending, diproses, selesai
        $table->timestamps();
    });

    Schema::create('order_items', function (Blueprint $table) {
        $table->id();
        $table->foreignId('order_id')->constrained()->cascadeOnDelete();
        $table->foreignId('item_id')->constrained();
        $table->unsignedInteger('qty');
        $table->unsignedInteger('price'); // harga saat dibeli
        $table->timestamps();
    });
}

public function down(): void
{
    Schema::dropIfExists('order_items');
    Schema::dropIfExists('orders');
    Schema::dropIfExists('items');
    Schema::dropIfExists('categories');
}`,
        label: "database/migrations/xxxx_create_toko_tables.php",
      },
    ],
    tip: "Urutan create penting: categories dulu baru items (items punya FK ke categories), orders dulu baru order_items. Kalau dibalik: 'Cannot add foreign key constraint'.",
  },
  {
    no: "02",
    title: "Model: Relasi & Helper",
    fungsi:
      "Mengisi model dengan $fillable, relasi antar tabel, dan helper `isAdmin()` / `badgeColor()`.",
    kenapa:
      "Relasi membuat query jadi rapi (mis. `$item->category->name`). Helper `isAdmin()` dan `badgeColor()` menghindari tulis ulang logika di banyak view.",
    actions: [
      {
        text: "Ganti isi `app/Models/Category.php`:",
        code: `<?php

namespace App\\Models;

use Illuminate\\Database\\Eloquent\\Model;
use Illuminate\\Database\\Eloquent\\Relations\\HasMany;

class Category extends Model
{
    protected $fillable = ['name'];

    public function items(): HasMany
    {
        return $this->hasMany(Item::class);
    }
}`,
        label: "app/Models/Category.php",
      },
      {
        text: "Ganti isi `app/Models/Item.php`:",
        code: `<?php

namespace App\\Models;

use Illuminate\\Database\\Eloquent\\Model;
use Illuminate\\Database\\Eloquent\\Relations\\BelongsTo;
use Illuminate\\Database\\Eloquent\\Relations\\HasMany;

class Item extends Model
{
    protected $fillable = ['category_id', 'name', 'description', 'price', 'stock', 'image'];

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function orderItems(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }
}`,
        label: "app/Models/Item.php",
      },
      {
        text: "Ganti isi `app/Models/Order.php` (sudah termasuk helper badgeColor):",
        code: `<?php

namespace App\\Models;

use Illuminate\\Database\\Eloquent\\Model;
use Illuminate\\Database\\Eloquent\\Relations\\BelongsTo;
use Illuminate\\Database\\Eloquent\\Relations\\HasMany;

class Order extends Model
{
    protected $fillable = ['user_id', 'total', 'status'];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function orderItems(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    public function badgeColor(): string
    {
        return match ($this->status) {
            'selesai'  => 'success',
            'diproses' => 'primary',
            default    => 'warning',
        };
    }
}`,
        label: "app/Models/Order.php",
      },
      {
        text: "Ganti isi `app/Models/OrderItem.php`:",
        code: `<?php

namespace App\\Models;

use Illuminate\\Database\\Eloquent\\Model;
use Illuminate\\Database\\Eloquent\\Relations\\BelongsTo;

class OrderItem extends Model
{
    protected $fillable = ['order_id', 'item_id', 'qty', 'price'];

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    public function item(): BelongsTo
    {
        return $this->belongsTo(Item::class);
    }
}`,
        label: "app/Models/OrderItem.php",
      },
      {
        text: "Buka `app/Models/User.php`, ubah `$fillable` dan tambahkan dua method di dalam class:",
        code: `protected $fillable = ['name', 'email', 'password', 'role'];

public function orders(): \\Illuminate\\Database\\Eloquent\\Relations\\HasMany
{
    return $this->hasMany(Order::class);
}

public function isAdmin(): bool
{
    return $this->role === 'admin';
}`,
        label: "app/Models/User.php",
      },
    ],
    tip: "Password otomatis di-hash oleh cast 'hashed' di model User bawaan Laravel 13 — tidak perlu Hash::make saat create. Kalau role tidak masuk $fillable, `User::create(['role' => ...])` di seeder akan error.",
  },
  {
    no: "03",
    title: "Seeder: 2 User + 3 Kategori + 6 Item",
    fungsi:
      "Mengisi data awal supaya aplikasi langsung bisa diuji tanpa input manual.",
    kenapa:
      "Password otomatis di-hash oleh cast 'hashed' di User. Kategori & item disesuaikan mitra kelompok (contoh: minuman/makanan/paket).",
    actions: [
      {
        text: "Ganti seluruh `database/seeders/DatabaseSeeder.php`:",
        code: `<?php

namespace Database\\Seeders;

use App\\Models\\Category;
use App\\Models\\Item;
use App\\Models\\User;
use Illuminate\\Database\\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'name' => 'Admin Toko',
            'email' => 'admin@toko.test',
            'password' => 'password',
            'role' => 'admin',
        ]);

        User::create([
            'name' => 'Budi Customer',
            'email' => 'budi@toko.test',
            'password' => 'password',
            'role' => 'customer',
        ]);

        $minuman = Category::create(['name' => 'Minuman']);
        $makanan = Category::create(['name' => 'Makanan']);
        $paket   = Category::create(['name' => 'Paket Hemat']);

        $data = [
            [$minuman, 'Es Teh Manis',      'Teh segar dingin',      5000, 50],
            [$minuman, 'Es Jeruk',          'Jeruk peras asli',      7000, 40],
            [$makanan, 'Nasi Goreng',       'Nasi goreng spesial',  15000, 30],
            [$makanan, 'Mie Ayam',          'Mie ayam bakso',       13000, 25],
            [$paket,   'Paket Nasi + Teh',  'Nasi goreng + es teh', 18000, 20],
            [$paket,   'Paket Mie + Jeruk', 'Mie ayam + es jeruk',  18000, 20],
        ];

        foreach ($data as [$kategori, $nama, $deskripsi, $harga, $stok]) {
            Item::create([
                'category_id' => $kategori->id,
                'name' => $nama,
                'description' => $deskripsi,
                'price' => $harga,
                'stock' => $stok,
            ]);
        }
    }
}`,
        label: "database/seeders/DatabaseSeeder.php",
      },
      {
        text: "Jalankan migration + seeder:",
        code: "php artisan migrate:fresh --seed",
        label: "bash",
      },
      {
        text: "Cek lewat tinker:",
        code: `php artisan tinker

App\\Models\\User::count();                                   // 2
App\\Models\\Category::count();                               // 3
App\\Models\\Item::with('category')->first();                 // item + kategori
App\\Models\\User::where('role','admin')->first()->isAdmin(); // true
Schema::hasTable('order_items');                              // true
exit`,
        label: "bash",
      },
      {
        text: "Database punya tabel users, categories, items, orders, order_items, sessions; 2 user, 3 kategori, 6 item.",
        bukti: true,
      },
    ],
    tip: "Kalau 'Unknown column role' → edit migration users belum dilakukan atau lupa `migrate:fresh`. Kalau 'Add [role] to fillable' → 'role' belum masuk $fillable di User.",
  },
  {
    no: "04",
    title: "Middleware Role & Auth Controller",
    fungsi:
      "Membuat satpam role + controller login/register/logout dengan session regenerate.",
    kenapa:
      "Middleware menulis aturan akses sekali saja lalu dipasang di route. AuthController memvalidasi input, mencocokkan password, dan meregenerasi session ID supaya tidak bisa dibajak.",
    actions: [
      {
        text: "Generate:",
        code: `php artisan make:controller AuthController
php artisan make:middleware RoleMiddleware`,
        label: "bash",
      },
      {
        text: "Ganti isi `app/Http/Middleware/RoleMiddleware.php`:",
        code: `<?php

namespace App\\Http\\Middleware;

use Closure;
use Illuminate\\Http\\Request;
use Symfony\\Component\\HttpFoundation\\Response;

class RoleMiddleware
{
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = $request->user();

        if (! $user || ! in_array($user->role, $roles)) {
            abort(403);
        }

        return $next($request);
    }
}`,
        label: "app/Http/Middleware/RoleMiddleware.php",
      },
      {
        text: "Buka `bootstrap/app.php`, ganti blok `->withMiddleware(...)` saja (blok lain jangan disentuh):",
        code: `->withMiddleware(function (Middleware $middleware): void {
    $middleware->alias([
        'role' => \\App\\Http\\Middleware\\RoleMiddleware::class,
    ]);

    // User yang sudah login lalu buka /login dilempar ke home
    $middleware->redirectUsersTo(fn () => route('home'));
})`,
        label: "bootstrap/app.php",
      },
      {
        text: "Ganti seluruh isi `app/Http/Controllers/AuthController.php`:",
        code: `<?php

namespace App\\Http\\Controllers;

use App\\Models\\User;
use Illuminate\\Http\\Request;
use Illuminate\\Support\\Facades\\Auth;

class AuthController extends Controller
{
    public function showRegister()
    {
        return view('auth.register');
    }

    public function register(Request $request)
    {
        $data = $request->validate([
            'name'     => 'required|string|max:100',
            'email'    => 'required|email|unique:users,email',
            'password' => 'required|min:6|confirmed',
        ]);

        // role TIDAK dari input form, selalu customer.
        $user = User::create([
            'name'     => $data['name'],
            'email'    => $data['email'],
            'password' => $data['password'],
            'role'     => 'customer',
        ]);

        Auth::login($user);
        $request->session()->regenerate();

        return redirect()->route('home')->with('success', 'Registrasi berhasil, selamat datang!');
    }

    public function showLogin()
    {
        return view('auth.login');
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email'    => 'required|email',
            'password' => 'required',
        ]);

        if (! Auth::attempt($credentials)) {
            return back()
                ->withErrors(['email' => 'Email atau password salah.'])
                ->onlyInput('email');
        }

        $request->session()->regenerate();

        return redirect()->intended(route('home'))->with('success', 'Login berhasil.');
    }

    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('home')->with('success', 'Kamu sudah logout.');
    }
}`,
        label: "app/Http/Controllers/AuthController.php",
      },
    ],
    tip: "role:admin artinya 'pakai middleware role dengan parameter admin'. Dengan ...$roles, bisa juga role:admin,customer. Middleware auth otomatis melempar tamu ke route bernama login — nama itu wajib ada.",
  },
  {
    no: "05",
    title: "Layout + View Auth + Home/Account/Admin",
    fungsi:
      "Membuat layout dengan navbar & flash, halaman login/register, home, account, dan admin dashboard placeholder.",
    kenapa:
      "Satu layout untuk semua halaman — ubah sekali, semua ikut berubah. Flash message terpusat, validasi tampil inline dengan @error.",
    actions: [
      {
        text: "Buat folder `resources/views/layouts`, `auth`, `admin`. Isi `layouts/app.blade.php`:",
        code: `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>@yield('title') - {{ config('app.name') }}</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body class="bg-light">

    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
        <div class="container">
            <a class="navbar-brand" href="{{ route('home') }}">{{ config('app.name') }}</a>

            <ul class="navbar-nav ms-auto align-items-lg-center gap-lg-2">
                <li class="nav-item"><a class="nav-link" href="{{ route('home') }}">Beranda</a></li>

                @auth
                    @if(auth()->user()->isAdmin())
                        <li class="nav-item"><a class="nav-link" href="{{ route('admin.dashboard') }}">Admin</a></li>
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
        </div>
    </nav>

    <main class="container py-4">
        @if (session('success'))
            <div class="alert alert-success">{{ session('success') }}</div>
        @endif
        @if (session('error'))
            <div class="alert alert-danger">{{ session('error') }}</div>
        @endif

        @yield('content')
    </main>

</body>
</html>`,
        label: "resources/views/layouts/app.blade.php",
      },
      {
        text: "Buat `home.blade.php` (placeholder, akan diganti di Praktikum 2):",
        code: `@extends('layouts.app')

@section('title', 'Beranda')

@section('content')
    <h2>Selamat datang di {{ config('app.name') }}</h2>
    <p class="text-muted">Katalog produk akan tampil di sini.</p>
@endsection`,
        label: "resources/views/home.blade.php",
      },
      {
        text: "Buat `account.blade.php`:",
        code: `@extends('layouts.app')

@section('title', 'Akun Saya')

@section('content')
    <h3>Akun Saya</h3>
    <p>Nama: {{ auth()->user()->name }}</p>
    <p>Email: {{ auth()->user()->email }}</p>
    <p>Role: <span class="badge bg-secondary">{{ auth()->user()->role }}</span></p>
@endsection`,
        label: "resources/views/account.blade.php",
      },
      {
        text: "Buat `admin/dashboard.blade.php` (placeholder):",
        code: `@extends('layouts.app')

@section('title', 'Dashboard Admin')

@section('content')
    <h3>Dashboard Admin</h3>
    <p>Halo {{ auth()->user()->name }}.</p>
@endsection`,
        label: "resources/views/admin/dashboard.blade.php",
      },
      {
        text: "Buat `auth/login.blade.php`:",
        code: `@extends('layouts.app')

@section('title', 'Login')

@section('content')
    <div class="col-md-5 mx-auto">
        <div class="card shadow-sm">
            <div class="card-body p-4">
                <h5 class="mb-3">Login</h5>

                <form action="{{ route('login') }}" method="POST">
                    @csrf

                    <div class="mb-3">
                        <label class="form-label">Email</label>
                        <input type="email" name="email" value="{{ old('email') }}"
                               class="form-control @error('email') is-invalid @enderror">
                        @error('email') <div class="invalid-feedback">{{ $message }}</div> @enderror
                    </div>

                    <div class="mb-3">
                        <label class="form-label">Password</label>
                        <input type="password" name="password"
                               class="form-control @error('password') is-invalid @enderror">
                        @error('password') <div class="invalid-feedback">{{ $message }}</div> @enderror
                    </div>

                    <button class="btn btn-dark w-100">Login</button>
                </form>

                <p class="text-center mt-3 mb-0">Belum punya akun? <a href="{{ route('register') }}">Register</a></p>
            </div>
        </div>
    </div>
@endsection`,
        label: "resources/views/auth/login.blade.php",
      },
      {
        text: "Buat `auth/register.blade.php`:",
        code: `@extends('layouts.app')

@section('title', 'Register')

@section('content')
    <div class="col-md-5 mx-auto">
        <div class="card shadow-sm">
            <div class="card-body p-4">
                <h5 class="mb-3">Buat Akun</h5>

                <form action="{{ route('register') }}" method="POST">
                    @csrf

                    <div class="mb-3">
                        <label class="form-label">Nama</label>
                        <input type="text" name="name" value="{{ old('name') }}"
                               class="form-control @error('name') is-invalid @enderror">
                        @error('name') <div class="invalid-feedback">{{ $message }}</div> @enderror
                    </div>

                    <div class="mb-3">
                        <label class="form-label">Email</label>
                        <input type="email" name="email" value="{{ old('email') }}"
                               class="form-control @error('email') is-invalid @enderror">
                        @error('email') <div class="invalid-feedback">{{ $message }}</div> @enderror
                    </div>

                    <div class="mb-3">
                        <label class="form-label">Password</label>
                        <input type="password" name="password"
                               class="form-control @error('password') is-invalid @enderror">
                        @error('password') <div class="invalid-feedback">{{ $message }}</div> @enderror
                    </div>

                    <div class="mb-3">
                        <label class="form-label">Konfirmasi Password</label>
                        <input type="password" name="password_confirmation" class="form-control">
                    </div>

                    <button class="btn btn-dark w-100">Daftar</button>
                </form>

                <p class="text-center mt-3 mb-0">Sudah punya akun? <a href="{{ route('login') }}">Login</a></p>
            </div>
        </div>
    </div>
@endsection`,
        label: "resources/views/auth/register.blade.php",
      },
    ],
    tip: "Semua form wajib punya @csrf, kalau tidak: 419 Page Expired. Tombol Logout adalah form POST karena logout mengubah state session — jangan dibuat link GET.",
  },
  {
    no: "06",
    title: "Route Fase 2 & Jalankan",
    fungsi:
      "Merakit route publik, tamu, login, dan admin; lalu menjalankan server.",
    kenapa:
      "Route adalah peta aplikasi. Dengan mengelompokkan per siapa yang boleh akses, aturan keamanan terlihat di satu tempat dan tidak perlu diulang di controller.",
    actions: [
      {
        text: "Ganti seluruh `routes/web.php`:",
        code: `<?php

use App\\Http\\Controllers\\AuthController;
use Illuminate\\Support\\Facades\\Route;

// ===== Publik =====
Route::view('/', 'home')->name('home');

// ===== Hanya tamu =====
Route::middleware('guest')->group(function () {
    Route::get('/register', [AuthController::class, 'showRegister'])->name('register');
    Route::post('/register', [AuthController::class, 'register']);

    Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
    Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:5,1');
});

// ===== Harus login =====
Route::middleware('auth')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
    Route::view('/akun', 'account')->name('account');

    Route::middleware('role:admin')->prefix('admin')->name('admin.')->group(function () {
        Route::view('/', 'admin.dashboard')->name('dashboard');
    });
});`,
        label: "routes/web.php",
      },
      {
        text: "Bersihkan cache & jalankan server:",
        code: `php artisan optimize:clear
php artisan serve`,
        label: "bash",
      },
      {
        text: "Uji semua skenario di checklist di bawah. Kalau semua lolos, Praktikum 1 selesai.",
        bukti: true,
      },
    ],
    tip: "Kalau muncul 'Route [login] not defined' → routes/web.php belum diganti atau lupa optimize:clear. Kalau 'Target class [role] does not exist' → alias di bootstrap/app.php belum ada.",
  },
];

const checklist = [
  { text: "Buka `/` tanpa login", detail: "Beranda tampil, navbar Login & Register." },
  { text: "Buka `/akun` tanpa login", detail: "Dilempar ke `/login`." },
  { text: "Login salah password", detail: "Pesan 'Email atau password salah.'" },
  { text: "Login budi@toko.test / password", detail: "Masuk beranda, flash hijau, nama muncul di navbar." },
  { text: "Sudah login, buka `/login`", detail: "Dilempar ke beranda (redirectUsersTo)." },
  { text: "Login Budi, buka `/admin`", detail: "Halaman 403 bawaan Laravel." },
  { text: "Logout, login admin@toko.test", detail: "Navbar ada 'Admin', `/admin` bisa dibuka." },
  { text: "Register dengan email yang sudah ada", detail: "Error 'email sudah dipakai'." },
  { text: "Register akun valid", detail: "Otomatis login, role = customer." },
  { text: "Salah login 6 kali berturut-turut", detail: "Halaman 429 (throttle)." },
];

export default function Praktikum1() {
  return (
    <div className="relative min-h-screen">
      <div className="pointer-events-none absolute left-1/2 top-0 h-64 w-[40rem] -translate-x-1/2 rounded-full bg-gold/10 blur-[120px]" />

      <div className="relative max-w-4xl px-6 py-12 mx-auto">
        <nav className="flex items-center gap-2 mb-8 text-xs text-neutral-500">
          <Link to="/" className="hover:text-gold-soft">Home</Link>
          <span>/</span>
          <Link to="/pertemuan/10" className="hover:text-gold-soft">Pertemuan 10</Link>
          <span>/</span>
          <span className="text-gold-soft">Praktikum 1</span>
        </nav>

        <div className="pb-6 mb-10 border-b border-gold/15">
          <span className="inline-block px-3 py-1 text-xs font-medium tracking-widest uppercase border rounded-full border-gold/25 bg-bg-card text-gold-soft">
            Pertemuan 10 · Praktikum 1
          </span>
          <h1 className="mt-4 text-4xl font-bold leading-tight font-display md:text-5xl">
            <span className="gold-gradient-text">
              Fondasi Toko Mini
            </span>
          </h1>
          <p className="max-w-2xl mt-3 text-sm leading-relaxed text-neutral-400">
            Fase 0 → Fase 2 dari panduan: buat project, migration lengkap,
            model + relasi, seeder, middleware role, auth login/register,
            layout, dan route Fase 2.
          </p>

          <div className="flex flex-wrap gap-2 mt-5">
            <span className="px-3 py-1 text-xs border rounded-full border-gold/20 bg-bg-elevated text-neutral-300">
              ⚙️ PHP 8.3+, Composer, XAMPP / Laragon
            </span>
            <span className="px-3 py-1 text-xs border rounded-full border-gold/20 bg-bg-elevated text-neutral-300">
              🎯 Database → Model → Seeder → Auth → Route
            </span>
          </div>
        </div>

        <section className="mb-10">
          <h2 className="flex items-center gap-3 mb-5 text-xl font-semibold font-display text-neutral-100">
            <span className="flex items-center justify-center border rounded-lg h-9 w-9 border-gold/30 bg-gold/10 text-gold-soft">
              🏬
            </span>
            Konsep: Toko Mini
          </h2>

          <div className="grid gap-3 sm:grid-cols-2">
            {analogi.map((a) => (
              <div key={a.konsep} className="px-4 py-3 border rounded-xl border-gold/15 bg-bg-elevated">
                <p className="text-sm font-semibold font-display text-gold-soft">{a.konsep}</p>
                <p className="mt-1 text-sm text-neutral-400">{a.analogi}</p>
              </div>
            ))}
          </div>

          <div className="px-4 py-3 mt-4 border rounded-lg border-gold/20 bg-gold/5">
            <p className="text-xs text-gold-soft">
              💡 Di akhir Praktikum 1 semua route Fase 2 sudah jalan. Admin panel & alur customer diisi di Praktikum 2.
            </p>
          </div>
        </section>

        <section className="mb-14">
          <h2 className="flex items-center gap-3 mb-5 text-xl font-semibold font-display text-neutral-100">
            <span className="flex items-center justify-center border rounded-lg h-9 w-9 border-gold/30 bg-gold/10 text-gold-soft">
              🗂
            </span>
            Struktur File Praktikum 1
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
              <div key={s.no} className="overflow-hidden border rounded-xl border-gold/15 bg-bg-elevated">
                <div className="flex items-start gap-4 px-5 py-4 border-b border-gold/10">
                  <div className="flex items-center justify-center w-10 h-10 text-sm font-bold border rounded-lg shrink-0 border-gold/30 bg-gold/10 font-display text-gold-soft">
                    {s.no}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold font-display text-neutral-100">{s.title}</h3>
                  </div>
                </div>

                <div className="px-4 py-3 mx-5 mt-5 space-y-2 border rounded-lg border-gold/10 bg-bg-card">
                  <p className="text-sm leading-relaxed text-neutral-300">
                    <span className="mr-2 rounded bg-gold/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-gold-soft">Fungsi</span>
                    {s.fungsi}
                  </p>
                  <p className="text-sm leading-relaxed text-neutral-400">
                    <span className="mr-2 rounded bg-gold/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-gold-soft">Kenapa</span>
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
                        <p className={`text-sm leading-relaxed ${a.bukti ? "text-green-300/90" : "text-neutral-300"}`}>
                          {a.bukti && (
                            <span className="mr-1.5 inline-flex h-4 w-4 -translate-y-0.5 items-center justify-center rounded-full bg-green-500/20 text-[10px] text-green-400">✓</span>
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
              ✅
            </span>
            Checklist Akhir — Fase 2
          </h2>

          <div className="p-5 border rounded-xl border-gold/20 bg-gradient-to-br from-bg-card to-bg-elevated">
            <ol className="space-y-3">
              {checklist.map((c, i) => (
                <li key={i} className="flex gap-3">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-gold/30 bg-bg-base font-mono text-xs text-gold-soft">
                    {i + 1}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-neutral-200">{c.text}</p>
                    <p className="mt-0.5 text-xs text-neutral-500">{c.detail}</p>
                  </div>
                </li>
              ))}
            </ol>

            <div className="px-4 py-3 mt-5 border rounded-lg border-gold/20 bg-gold/5">
              <p className="text-xs text-gold-soft">
                🎉 Semua checklist beres → lanjut ke <strong>Praktikum 2</strong>: admin panel dan alur customer (katalog, cart, checkout).
              </p>
            </div>
          </div>
        </section>

        <div className="flex items-center justify-between pt-6 border-t border-gold/10">
          <Link to="/pertemuan/10" className="text-sm transition-colors text-neutral-500 hover:text-gold-soft">
            ← Balik ke Pertemuan 10
          </Link>
          <Link to="/pertemuan/10/praktikum-2" className="text-sm transition-colors text-neutral-500 hover:text-gold-soft">
            Lanjut ke Praktikum 2 →
          </Link>
        </div>
      </div>
    </div>
  );
}