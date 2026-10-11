import { Link } from "react-router-dom";
import CopyBlock from "../../../components/ui/CopyBlock";

const struktur = `app/
├── Http/
│   ├── Controllers/
│   │   ├── Admin/BookController.php      ← CRUD (khusus admin)
│   │   ├── AuthController.php
│   │   ├── BookController.php            ← lihat katalog (user)
│   │   └── DashboardController.php
│   ├── Middleware/RoleMiddleware.php
│   └── Requests/BookRequest.php
└── Models/{Book.php, User.php}
resources/views/
├── components/input.blade.php
├── layouts/{app, guest}.blade.php
├── partials/{navbar, flash}.blade.php
├── auth/{login, register}.blade.php
├── books/{index, show}.blade.php
├── admin/books/{index, create, edit, _form}.blade.php
├── errors/403.blade.php
├── home.blade.php
└── dashboard.blade.php`;

const analogi = [
  { konsep: "Layout", analogi: "Kop surat standar, isi suratnya beda-beda" },
  { konsep: "Session", analogi: "Kartu tamu yang dipegang selama di kantor" },
  { konsep: "Auth", analogi: "Loket verifikasi identitas" },
  { konsep: "Middleware", analogi: "Satpam di pintu loket" },
];

const steps = [
  {
    no: "00",
    title: "Buat Project",
    fungsi: "Membuat kerangka Laravel 13 yang siap pakai.",
    kenapa:
      "Project baru dan terpisah supaya tidak mengotori praktikum sebelumnya, dan semua file bawaan Laravel (folder, config, migration) langsung tersedia.",
    actions: [
      {
        text: "Buka terminal, jalankan perintah ini lalu masuk ke foldernya:",
        code: `composer create-project laravel/laravel:^13.0 perpus-mini
cd perpus-mini`,
        label: "bash",
      },
      {
        text: "Buka file `.env`, ganti nama aplikasi:",
        code: `APP_NAME="Perpustakaan Mini"`,
        label: ".env",
      },
      {
        text: "Cek project berhasil dibuat:",
        code: "php artisan serve",
        label: "bash",
      },
      {
        text: "Buka http://127.0.0.1:8000 — muncul halaman welcome Laravel. Matikan server dengan Ctrl + C dulu, database diatur di langkah berikutnya.",
        bukti: true,
      },
    ],
    tip: "APP_NAME dipakai di judul tab dan navbar lewat config('app.name'). Cukup diganti di satu tempat.",
  },
  {
    no: "01",
    title: "Nyalakan MySQL & Atur .env",
    fungsi: "Menghubungkan Laravel ke database MySQL.",
    kenapa:
      "Laravel perlu tahu database mana yang dipakai (alamat, nama database, user, password), dan semua itu dibaca dari file .env. Database harus dibuat dulu karena Laravel hanya membuat tabel, bukan databasenya.",
    actions: [
      {
        text: "XAMPP: buka XAMPP Control Panel, klik Start pada Apache dan MySQL sampai hijau. Laragon: buka Laragon, klik Start All.",
      },
      {
        text: "Buat database kosong bernama `perpus-mini`. XAMPP: buka http://localhost/phpmyadmin → New → isi nama → collation utf8mb4_unicode_ci → Create. Laragon: klik tombol Database (HeidiSQL) → klik kanan → Create new → Database.",
      },
      {
        text: "Buka `.env`, cari blok database, lalu ganti jadi:",
        code: `DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=perpus-mini
DB_USERNAME=root
DB_PASSWORD=`,
        label: ".env",
      },
      {
        text: "Bersihkan cache config, lalu jalankan server lagi:",
        code: `php artisan config:clear
php artisan serve`,
        label: "bash",
      },
      {
        text: "Server jalan tanpa error. Koneksi database akan benar-benar teruji saat migrate di langkah 02.",
        bukti: true,
      },
    ],
    tip: "DB_PASSWORD dikosongkan karena XAMPP/Laragon bawaannya user root tanpa password. Nama database di .env harus sama persis dengan yang dibuat, salah satu huruf saja muncul error 'Unknown database'. Tabel sessions sudah termasuk di migration bawaan dan terbuat otomatis saat migrate, jadi tidak perlu dicek manual.",
  },
  {
    no: "02",
    title: "Model, Migration, Role, Seeder",
    fungsi:
      "Membuat tabel books, menambah kolom role di tabel users, dan mengisi data awal (2 user + 5 buku).",
    kenapa:
      "Migration adalah catatan perubahan database dalam bentuk kode, jadi semua orang di kelas dapat struktur tabel yang sama. Seeder memberi data awal supaya langsung bisa diuji. Kolom role dipakai middleware untuk membedakan admin dan user.",
    actions: [
      {
        text: "Buat model + migration buku, dan migration kolom role:",
        code: `php artisan make:model Book -m
php artisan make:migration add_role_to_users_table --table=users`,
        label: "bash",
      },
      {
        text: "Buka migration `create_books_table`, isi method `up()`:",
        code: `Schema::create('books', function (Blueprint $table) {
    $table->id();
    $table->string('title');
    $table->string('author');
    $table->unsignedSmallInteger('year');
    $table->timestamps();
});`,
        label: "database/migrations/xxxx_create_books_table.php",
      },
      {
        text: "Buka migration `add_role_to_users_table`, isi method `up()` dan `down()`:",
        code: `public function up(): void
{
    Schema::table('users', function (Blueprint $table) {
        $table->string('role')->default('user')->after('email');
    });
}

public function down(): void
{
    Schema::table('users', function (Blueprint $table) {
        $table->dropColumn('role');
    });
}`,
        label: "database/migrations/xxxx_add_role_to_users_table.php",
      },
      {
        text: "Buka model Book, tambahkan di dalam class:",
        code: `protected $fillable = ['title', 'author', 'year'];`,
        label: "app/Models/Book.php",
      },
      {
        text: "Buka model User, tambahkan method ini di dalam class (di bawah method yang sudah ada). Jangan tambahkan `role` ke `$fillable`:",
        code: `public function isAdmin(): bool
{
    return $this->role === 'admin';
}`,
        label: "app/Models/User.php",
      },
      {
        text: "Ganti seluruh isi seeder:",
        code: `<?php

namespace Database\\Seeders;

use App\\Models\\Book;
use App\\Models\\User;
use Illuminate\\Database\\Seeder;
use Illuminate\\Support\\Facades\\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // forceCreate: melewati $fillable, dipakai khusus untuk mengisi 'role'
        User::forceCreate([
            'name'     => 'Admin',
            'email'    => 'admin@perpus.test',
            'password' => Hash::make('password'),
            'role'     => 'admin',
        ]);

        User::forceCreate([
            'name'     => 'Budi',
            'email'    => 'budi@perpus.test',
            'password' => Hash::make('password'),
            'role'     => 'user',
        ]);

        collect([
            ['title' => 'Laskar Pelangi',   'author' => 'Andrea Hirata',          'year' => 2005],
            ['title' => 'Bumi Manusia',     'author' => 'Pramoedya Ananta Toer',  'year' => 1980],
            ['title' => 'Negeri 5 Menara',  'author' => 'Ahmad Fuadi',            'year' => 2009],
            ['title' => 'Cantik Itu Luka',  'author' => 'Eka Kurniawan',          'year' => 2002],
            ['title' => 'Pulang',           'author' => 'Leila S. Chudori',       'year' => 2012],
        ])->each(fn (array $book) => Book::create($book));
    }
}`,
        label: "database/seeders/DatabaseSeeder.php",
      },
      {
        text: "Pastikan MySQL masih menyala, lalu jalankan migration dan seeder:",
        code: "php artisan migrate --seed",
        label: "bash",
      },
      {
        text: "Cek isinya lewat tinker:",
        code: `php artisan tinker

App\\Models\\User::all(['name', 'email', 'role']);
App\\Models\\Book::count();
exit`,
        label: "bash",
      },
      {
        text: "Ada 2 user (admin dan user) dan 5 buku. Di phpMyAdmin/HeidiSQL, database perpus-mini sekarang berisi tabel users, books, sessions, dan lainnya.",
        bukti: true,
      },
    ],
    tip: "Password tidak pernah disimpan sebagai teks asli. Hash::make menghasilkan hash searah, jadi kalau database bocor password asli tidak ikut terbaca. Kolom role sengaja tidak fillable, kalau fillable orang bisa menyelipkan role=admin lewat form register.",
  },
  {
    no: "03",
    title: "Layout & Komponen",
    fungsi:
      "Membuat kerangka tampilan yang dipakai bersama (navbar, notifikasi, kop halaman) dan komponen input yang bisa dipakai ulang.",
    kenapa:
      "Tanpa layout, setiap halaman harus menulis ulang head, navbar, dan footer. Dengan layout, ubah satu file dan semua halaman ikut berubah. Komponen x-input mencegah copy-paste kode input yang sama di setiap form.",
    actions: [
      {
        text: "Buat layout utama (untuk halaman setelah login):",
        code: `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>@yield('title', 'Beranda') · {{ config('app.name') }}</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    @stack('styles')
</head>
<body class="bg-light">
    @include('partials.navbar')

    <main class="container py-4">
        @include('partials.flash')
        @yield('content')
    </main>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
    @stack('scripts')
</body>
</html>`,
        label: "resources/views/layouts/app.blade.php",
      },
      {
        text: "Buat layout tamu (untuk halaman login/register):",
        code: `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>@yield('title') · {{ config('app.name') }}</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body class="bg-light d-flex align-items-center min-vh-100">
    <div class="container" style="max-width: 420px">
        <h1 class="h4 text-center mb-4">
            <a href="{{ route('home') }}" class="text-decoration-none text-dark">📚 {{ config('app.name') }}</a>
        </h1>

        @include('partials.flash')

        <div class="card shadow-sm">
            <div class="card-body p-4">
                @yield('content')
            </div>
        </div>
    </div>
</body>
</html>`,
        label: "resources/views/layouts/guest.blade.php",
      },
      {
        text: "Buat partial notifikasi (flash message):",
        code: `@foreach (['success' => 'success', 'error' => 'danger'] as $key => $type)
    @if (session($key))
        <div class="alert alert-{{ $type }}" role="alert">{{ session($key) }}</div>
    @endif
@endforeach`,
        label: "resources/views/partials/flash.blade.php",
      },
      {
        text: "Buat partial navbar:",
        code: `<nav class="navbar navbar-expand-md navbar-dark bg-dark">
    <div class="container">
        <a class="navbar-brand" href="{{ route('home') }}">📚 {{ config('app.name') }}</a>

        <ul class="navbar-nav me-auto">
            @auth
                <li class="nav-item">
                    <a class="nav-link {{ request()->routeIs('books.*') ? 'active' : '' }}"
                       href="{{ route('books.index') }}">Katalog</a>
                </li>

                @if (auth()->user()->isAdmin())
                    <li class="nav-item">
                        <a class="nav-link {{ request()->routeIs('admin.*') ? 'active' : '' }}"
                           href="{{ route('admin.books.index') }}">Kelola Buku</a>
                    </li>
                @endif
            @endauth
        </ul>

        <ul class="navbar-nav align-items-md-center gap-md-2">
            @auth
                <li class="nav-item">
                    <a class="nav-link" href="{{ route('dashboard') }}">
                        {{ auth()->user()->name }}
                        <span class="badge text-bg-secondary">{{ auth()->user()->role }}</span>
                    </a>
                </li>
                <li class="nav-item">
                    <form action="{{ route('logout') }}" method="POST">
                        @csrf
                        <button type="submit" class="btn btn-outline-light btn-sm">Logout</button>
                    </form>
                </li>
            @endauth

            @guest
                <li class="nav-item"><a class="nav-link" href="{{ route('login') }}">Login</a></li>
                <li class="nav-item"><a class="btn btn-light btn-sm" href="{{ route('register') }}">Register</a></li>
            @endguest
        </ul>
    </div>
</nav>`,
        label: "resources/views/partials/navbar.blade.php",
      },
      {
        text: "Buat komponen input supaya form tidak copy-paste berulang:",
        code: `@props(['name', 'label', 'type' => 'text', 'value' => null])

<div class="mb-3">
    <label for="{{ $name }}" class="form-label">{{ $label }}</label>
    <input
        type="{{ $type }}"
        id="{{ $name }}"
        name="{{ $name }}"
        @if ($type !== 'password') value="{{ old($name, $value) }}" @endif
        {{ $attributes->class(['form-control', 'is-invalid' => $errors->has($name)]) }}
    >
    @error($name)
        <div class="invalid-feedback">{{ $message }}</div>
    @enderror
</div>`,
        label: "resources/views/components/input.blade.php",
      },
      {
        text: "Buat halaman beranda:",
        code: `@extends('layouts.app')

@section('title', 'Beranda')

@section('content')
    <div class="text-center py-5">
        <h1 class="display-5 fw-bold">{{ config('app.name') }}</h1>
        <p class="lead text-muted">Latihan Layout, Session, Auth, dan Middleware di Laravel.</p>

        @guest
            <a href="{{ route('login') }}" class="btn btn-dark">Login</a>
            <a href="{{ route('register') }}" class="btn btn-outline-dark">Register</a>
        @endguest

        @auth
            <a href="{{ route('dashboard') }}" class="btn btn-dark">Ke Dashboard</a>
        @endauth
    </div>
@endsection`,
        label: "resources/views/home.blade.php",
      },
      {
        text: "Buat halaman error 403 (Laravel otomatis memakainya untuk error 403):",
        code: `@extends('layouts.app')

@section('title', 'Akses Ditolak')

@section('content')
    <div class="text-center py-5">
        <h1 class="display-1 fw-bold">403</h1>
        <p class="lead">{{ $exception->getMessage() ?: 'Akses ditolak.' }}</p>
        <a href="{{ route('home') }}" class="btn btn-dark">Kembali ke Beranda</a>
    </div>
@endsection`,
        label: "resources/views/errors/403.blade.php",
      },
    ],
    tip: "@yield itu lubang di kerangka, @section isi yang dimasukkan ke lubang, @include menyisipkan potongan file, @stack lubang untuk CSS/JS tambahan per halaman. Ganti tulisan di navbar sekali, semua halaman ikut berubah. Komponen dipakai dengan <x-input name='email' label='Email' type='email' />.",
  },
  {
    no: "04",
    title: "Middleware Role",
    fungsi:
      "Membuat 'satpam' yang memeriksa role user sebelum request sampai ke controller.",
    kenapa:
      "Aturan akses cukup ditulis sekali di middleware, lalu tinggal dipasang di route. Tanpa ini, kita harus mengecek role di setiap method controller dan gampang ada yang terlewat.",
    actions: [
      {
        text: "Buat file middleware:",
        code: "php artisan make:middleware RoleMiddleware",
        label: "bash",
      },
      {
        text: "Ganti isi file middleware:",
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

        if (! $user || ! in_array($user->role, $roles, true)) {
            abort(403, 'Kamu tidak punya akses ke halaman ini.');
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

    // User yang SUDAH login tapi membuka halaman login/register dilempar ke sini
    $middleware->redirectUsersTo(fn () => route('dashboard'));
})`,
        label: "bootstrap/app.php",
      },
    ],
    tip: "role:admin artinya 'pakai middleware role dengan parameter admin'. Karena memakai ...$roles, bisa juga role:admin,kasir untuk beberapa role sekaligus. Middleware auth otomatis melempar tamu ke route bernama login, karena itu route login wajib diberi nama itu.",
  },
  {
    no: "05",
    title: "Auth: Controller & View",
    fungsi: "Membuat proses register, login, dan logout beserta halamannya.",
    kenapa:
      "Ini inti autentikasi. Controller memvalidasi input, mencocokkan password, lalu membuat session. session()->regenerate() dan invalidate() dipakai untuk mencegah pembajakan session.",
    actions: [
      {
        text: "Buat controller:",
        code: "php artisan make:controller AuthController",
        label: "bash",
      },
      {
        text: "Ganti seluruh isi controller:",
        code: `<?php

namespace App\\Http\\Controllers;

use App\\Models\\User;
use Illuminate\\Http\\RedirectResponse;
use Illuminate\\Http\\Request;
use Illuminate\\Support\\Facades\\Auth;
use Illuminate\\Support\\Facades\\Hash;
use Illuminate\\View\\View;

class AuthController extends Controller
{
    public function showLogin(): View
    {
        return view('auth.login');
    }

    public function login(Request $request): RedirectResponse
    {
        $credentials = $request->validate([
            'email'    => ['required', 'email'],
            'password' => ['required'],
        ]);

        if (! Auth::attempt($credentials, $request->boolean('remember'))) {
            return back()
                ->withErrors(['email' => 'Email atau password salah.'])
                ->onlyInput('email');
        }

        // Ganti ID session setelah login (cegah session fixation)
        $request->session()->regenerate();

        return redirect()->intended(route('dashboard'));
    }

    public function showRegister(): View
    {
        return view('auth.register');
    }

    public function register(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'name'     => ['required', 'string', 'max:100'],
            'email'    => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ]);

        $user = User::create([
            'name'     => $data['name'],
            'email'    => $data['email'],
            'password' => Hash::make($data['password']),
        ]);

        Auth::login($user);
        $request->session()->regenerate();

        return redirect()->route('dashboard')->with('success', 'Registrasi berhasil, selamat datang!');
    }

    public function logout(Request $request): RedirectResponse
    {
        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('login')->with('success', 'Kamu sudah logout.');
    }
}`,
        label: "app/Http/Controllers/AuthController.php",
      },
      {
        text: "Buat view login:",
        code: `@extends('layouts.guest')

@section('title', 'Login')

@section('content')
    <h2 class="h5 mb-3">Masuk</h2>

    <form action="{{ route('login.process') }}" method="POST" novalidate>
        @csrf

        <x-input name="email" label="Email" type="email" autofocus />
        <x-input name="password" label="Password" type="password" />

        <div class="form-check mb-3">
            <input type="checkbox" id="remember" name="remember" class="form-check-input">
            <label for="remember" class="form-check-label">Ingat saya</label>
        </div>

        <button type="submit" class="btn btn-dark w-100">Masuk</button>
    </form>

    <p class="text-center mt-3 mb-0 small">
        Belum punya akun? <a href="{{ route('register') }}">Daftar</a>
    </p>
@endsection`,
        label: "resources/views/auth/login.blade.php",
      },
      {
        text: "Buat view register:",
        code: `@extends('layouts.guest')

@section('title', 'Register')

@section('content')
    <h2 class="h5 mb-3">Buat Akun</h2>

    <form action="{{ route('register.process') }}" method="POST" novalidate>
        @csrf

        <x-input name="name" label="Nama" autofocus />
        <x-input name="email" label="Email" type="email" />
        <x-input name="password" label="Password (min. 8 karakter)" type="password" />
        <x-input name="password_confirmation" label="Ulangi Password" type="password" />

        <button type="submit" class="btn btn-dark w-100">Daftar</button>
    </form>

    <p class="text-center mt-3 mb-0 small">
        Sudah punya akun? <a href="{{ route('login') }}">Login</a>
    </p>
@endsection`,
        label: "resources/views/auth/register.blade.php",
      },
    ],
    tip: "Alur login: form → Auth::attempt() (cari user dari email, cocokkan hash password) → session dibuat → redirect. intended() mengembalikan user ke halaman yang tadinya mau dia buka. confirmed mewajibkan field password_confirmation yang isinya sama.",
  },
  {
    no: "06",
    title: "Halaman User & Admin",
    fungsi:
      "Membuat dashboard + katalog untuk user, dan CRUD buku untuk admin.",
    kenapa:
      "Ini pemisahan hak akses yang nyata: user hanya boleh melihat, admin boleh mengubah data. Dashboard juga mendemonstrasikan session (buku terakhir yang dibuka disimpan lalu ditampilkan lagi). BookRequest memisahkan aturan validasi dari controller supaya controller tetap ringkas.",
    actions: [
      {
        text: "A. Dashboard + Katalog (user). Buat dua controller:",
        code: `php artisan make:controller DashboardController
php artisan make:controller BookController`,
        label: "bash",
      },
      {
        text: "Ganti seluruh isi DashboardController:",
        code: `<?php

namespace App\\Http\\Controllers;

use App\\Models\\Book;
use Illuminate\\Http\\Request;
use Illuminate\\View\\View;

class DashboardController extends Controller
{
    public function __invoke(Request $request): View
    {
        // Ambil dari SESSION: buku yang terakhir dibuka user ini
        $lastViewed = Book::find($request->session()->get('last_viewed_book'));

        return view('dashboard', compact('lastViewed'));
    }
}`,
        label: "app/Http/Controllers/DashboardController.php",
      },
      {
        text: "Ganti seluruh isi BookController (katalog):",
        code: `<?php

namespace App\\Http\\Controllers;

use App\\Models\\Book;
use Illuminate\\Http\\Request;
use Illuminate\\View\\View;

class BookController extends Controller
{
    public function index(): View
    {
        return view('books.index', ['books' => Book::latest()->get()]);
    }

    public function show(Request $request, Book $book): View
    {
        // Simpan ke SESSION supaya bisa ditampilkan lagi di dashboard
        $request->session()->put('last_viewed_book', $book->id);

        return view('books.show', compact('book'));
    }
}`,
        label: "app/Http/Controllers/BookController.php",
      },
      {
        text: "Buat view dashboard:",
        code: `@extends('layouts.app')

@section('title', 'Dashboard')

@section('content')
    <h1 class="h4">Halo, {{ auth()->user()->name }} 👋</h1>
    <p class="text-muted">Kamu login sebagai <strong>{{ auth()->user()->role }}</strong>.</p>

    <div class="card">
        <div class="card-body">
            <small class="text-muted">Terakhir kamu lihat (disimpan di session)</small>

            @if ($lastViewed)
                <h5 class="mb-1">{{ $lastViewed->title }}</h5>
                <a href="{{ route('books.show', $lastViewed) }}">Buka lagi</a>
            @else
                <p class="mb-0">
                    Belum ada. Buka salah satu buku di <a href="{{ route('books.index') }}">katalog</a>.
                </p>
            @endif
        </div>
    </div>
@endsection`,
        label: "resources/views/dashboard.blade.php",
      },
      {
        text: "Buat view katalog:",
        code: `@extends('layouts.app')

@section('title', 'Katalog Buku')

@section('content')
    <h1 class="h4 mb-3">Katalog Buku</h1>

    <div class="row g-3">
        @forelse ($books as $book)
            <div class="col-md-4">
                <div class="card h-100 shadow-sm">
                    <div class="card-body">
                        <h5 class="card-title">{{ $book->title }}</h5>
                        <p class="card-text text-muted mb-0">{{ $book->author }} · {{ $book->year }}</p>
                    </div>
                    <div class="card-footer bg-white border-0">
                        <a href="{{ route('books.show', $book) }}" class="btn btn-sm btn-outline-dark">Detail</a>
                    </div>
                </div>
            </div>
        @empty
            <p class="text-muted">Belum ada buku.</p>
        @endforelse
    </div>
@endsection`,
        label: "resources/views/books/index.blade.php",
      },
      {
        text: "Buat view detail buku:",
        code: `@extends('layouts.app')

@section('title', $book->title)

@section('content')
    <a href="{{ route('books.index') }}" class="btn btn-link px-0">← Kembali ke katalog</a>

    <div class="card">
        <div class="card-body">
            <h1 class="h4">{{ $book->title }}</h1>
            <dl class="row mb-0">
                <dt class="col-sm-3">Penulis</dt>
                <dd class="col-sm-9">{{ $book->author }}</dd>
                <dt class="col-sm-3">Tahun terbit</dt>
                <dd class="col-sm-9">{{ $book->year }}</dd>
            </dl>
        </div>
    </div>
@endsection`,
        label: "resources/views/books/show.blade.php",
      },
      {
        text: "B. CRUD Buku (admin). Buat controller dan form request:",
        code: `php artisan make:controller Admin/BookController
php artisan make:request BookRequest`,
        label: "bash",
      },
      {
        text: "Ganti seluruh isi BookRequest:",
        code: `<?php

namespace App\\Http\\Requests;

use Illuminate\\Foundation\\Http\\FormRequest;

class BookRequest extends FormRequest
{
    public function authorize(): bool
    {
        // Lapisan kedua setelah middleware: hanya admin yang boleh mengirim form ini
        return $this->user()?->isAdmin() ?? false;
    }

    public function rules(): array
    {
        return [
            'title'  => ['required', 'string', 'max:255'],
            'author' => ['required', 'string', 'max:255'],
            'year'   => ['required', 'integer', 'between:1000,' . date('Y')],
        ];
    }

    public function attributes(): array
    {
        return [
            'title'  => 'judul',
            'author' => 'penulis',
            'year'   => 'tahun terbit',
        ];
    }
}`,
        label: "app/Http/Requests/BookRequest.php",
      },
      {
        text: "Ganti seluruh isi Admin/BookController:",
        code: `<?php

namespace App\\Http\\Controllers\\Admin;

use App\\Http\\Controllers\\Controller;
use App\\Http\\Requests\\BookRequest;
use App\\Models\\Book;
use Illuminate\\Http\\RedirectResponse;
use Illuminate\\View\\View;

class BookController extends Controller
{
    public function index(): View
    {
        return view('admin.books.index', ['books' => Book::latest()->get()]);
    }

    public function create(): View
    {
        return view('admin.books.create');
    }

    public function store(BookRequest $request): RedirectResponse
    {
        Book::create($request->validated());

        return redirect()->route('admin.books.index')->with('success', 'Buku berhasil ditambahkan.');
    }

    public function edit(Book $book): View
    {
        return view('admin.books.edit', compact('book'));
    }

    public function update(BookRequest $request, Book $book): RedirectResponse
    {
        $book->update($request->validated());

        return redirect()->route('admin.books.index')->with('success', 'Buku berhasil diperbarui.');
    }

    public function destroy(Book $book): RedirectResponse
    {
        $book->delete();

        return redirect()->route('admin.books.index')->with('success', 'Buku berhasil dihapus.');
    }
}`,
        label: "app/Http/Controllers/Admin/BookController.php",
      },
      {
        text: "Buat view daftar buku admin:",
        code: `@extends('layouts.app')

@section('title', 'Kelola Buku')

@section('content')
    <div class="d-flex justify-content-between align-items-center mb-3">
        <h1 class="h4 mb-0">Kelola Buku</h1>
        <a href="{{ route('admin.books.create') }}" class="btn btn-dark btn-sm">+ Tambah Buku</a>
    </div>

    <div class="card">
        <table class="table table-hover align-middle mb-0">
            <thead class="table-light">
                <tr>
                    <th>#</th>
                    <th>Judul</th>
                    <th>Penulis</th>
                    <th>Tahun</th>
                    <th class="text-end">Aksi</th>
                </tr>
            </thead>
            <tbody>
                @forelse ($books as $book)
                    <tr>
                        <td>{{ $loop->iteration }}</td>
                        <td>{{ $book->title }}</td>
                        <td>{{ $book->author }}</td>
                        <td>{{ $book->year }}</td>
                        <td class="text-end">
                            <a href="{{ route('admin.books.edit', $book) }}"
                               class="btn btn-sm btn-outline-secondary">Edit</a>

                            <form action="{{ route('admin.books.destroy', $book) }}" method="POST"
                                  class="d-inline" onsubmit="return confirm('Hapus buku ini?')">
                                @csrf
                                @method('DELETE')
                                <button type="submit" class="btn btn-sm btn-outline-danger">Hapus</button>
                            </form>
                        </td>
                    </tr>
                @empty
                    <tr>
                        <td colspan="5" class="text-center text-muted py-4">Belum ada data.</td>
                    </tr>
                @endforelse
            </tbody>
        </table>
    </div>
@endsection`,
        label: "resources/views/admin/books/index.blade.php",
      },
      {
        text: "Buat form bersama (dipakai create dan edit):",
        code: `<x-input name="title" label="Judul" :value="$book?->title" />
<x-input name="author" label="Penulis" :value="$book?->author" />
<x-input name="year" label="Tahun Terbit" type="number" :value="$book?->year" />

<button type="submit" class="btn btn-dark">Simpan</button>
<a href="{{ route('admin.books.index') }}" class="btn btn-outline-secondary">Batal</a>`,
        label: "resources/views/admin/books/_form.blade.php",
      },
      {
        text: "Buat view tambah buku:",
        code: `@extends('layouts.app')

@section('title', 'Tambah Buku')

@section('content')
    <h1 class="h4 mb-3">Tambah Buku</h1>

    <div class="card">
        <div class="card-body">
            <form action="{{ route('admin.books.store') }}" method="POST" novalidate>
                @csrf
                @include('admin.books._form', ['book' => null])
            </form>
        </div>
    </div>
@endsection`,
        label: "resources/views/admin/books/create.blade.php",
      },
      {
        text: "Buat view edit buku:",
        code: `@extends('layouts.app')

@section('title', 'Edit Buku')

@section('content')
    <h1 class="h4 mb-3">Edit Buku</h1>

    <div class="card">
        <div class="card-body">
            <form action="{{ route('admin.books.update', $book) }}" method="POST" novalidate>
                @csrf
                @method('PUT')
                @include('admin.books._form')
            </form>
        </div>
    </div>
@endsection`,
        label: "resources/views/admin/books/edit.blade.php",
      },
    ],
    tip: "Form tambah dan edit memakai satu _form yang sama. Di create, $book diisi null. Di edit, $book berisi data buku, dan komponen x-input yang mengisi nilainya.",
  },
  {
    no: "07",
    title: "Rakit Route",
    fungsi:
      "Menghubungkan URL ke controller dan memasang middleware di tiap kelompok halaman.",
    kenapa:
      "Route adalah peta aplikasi. Dengan mengelompokkan route berdasarkan siapa yang boleh akses (publik, tamu, user login, admin), aturan keamanan terlihat jelas di satu file dan tidak perlu diulang di tiap halaman.",
    actions: [
      {
        text: "Ganti seluruh isi `routes/web.php`:",
        code: `<?php

use App\\Http\\Controllers\\Admin\\BookController as AdminBookController;
use App\\Http\\Controllers\\AuthController;
use App\\Http\\Controllers\\BookController;
use App\\Http\\Controllers\\DashboardController;
use Illuminate\\Support\\Facades\\Route;

// ── Publik: siapa saja boleh ──────────────────────────────
Route::view('/', 'home')->name('home');

// ── Tamu saja (belum login) ───────────────────────────────
Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
    Route::post('/login', [AuthController::class, 'login'])
        ->middleware('throttle:5,1')
        ->name('login.process');

    Route::get('/register', [AuthController::class, 'showRegister'])->name('register');
    Route::post('/register', [AuthController::class, 'register'])->name('register.process');
});

// ── Wajib login (user & admin) ────────────────────────────
Route::middleware('auth')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
    Route::get('/dashboard', DashboardController::class)->name('dashboard');

    Route::resource('books', BookController::class)->only(['index', 'show']);
});

// ── Wajib login + role admin ──────────────────────────────
Route::middleware(['auth', 'role:admin'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {
        Route::resource('books', AdminBookController::class)->except(['show']);
    });`,
        label: "routes/web.php",
      },
      {
        text: "Cek daftar route:",
        code: "php artisan route:list --except-vendor",
        label: "bash",
      },
      {
        text: "Muncul route books.* (2 buah) dan admin.books.* (6 buah). Delapan route itu hanya ditulis dengan dua baris Route::resource.",
        bukti: true,
      },
    ],
    tip: "throttle:5,1 membatasi login maksimal 5 kali per menit supaya password tidak bisa ditebak dengan brute force. ->prefix('admin') mengubah URL (/admin/books), sedangkan ->name('admin.') mengubah nama route (admin.books.index).",
  },
];

const checklist = [
  {
    text: "Buka / tanpa login",
    detail: "Beranda tampil, navbar menampilkan Login/Register.",
  },
  {
    text: "Buka /books tanpa login",
    detail: "Dilempar ke /login.",
  },
  {
    text: "Login budi@perpus.test / password",
    detail: "Kembali ke /books (itu kerja intended()).",
  },
  {
    text: "Buka salah satu buku, lalu klik nama di navbar",
    detail: "Dashboard menampilkan buku terakhir dilihat.",
  },
  {
    text: "Sebagai Budi, buka /admin/books",
    detail: "Muncul halaman 403.",
  },
  {
    text: "Sebagai Budi, buka /login",
    detail: "Dilempar ke /dashboard.",
  },
  {
    text: "Logout, login admin@perpus.test / password",
    detail: "Menu Kelola Buku muncul di navbar.",
  },
  {
    text: "Tambah, edit, hapus buku sebagai admin",
    detail: "Semua jalan, ada notifikasi hijau.",
  },
  {
    text: "Submit form tambah buku kosong",
    detail: "Error merah muncul di bawah tiap input.",
  },
  {
    text: "Register akun baru",
    detail: "Langsung login dengan role user.",
  },
];

export default function Praktikum1() {
  return (
    <div className="relative min-h-screen">
      <div className="pointer-events-none absolute left-1/2 top-0 h-64 w-[40rem] -translate-x-1/2 rounded-full bg-gold/10 blur-[120px]" />

      <div className="relative max-w-4xl px-6 py-12 mx-auto">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 mb-8 text-xs text-neutral-500">
          <Link to="/" className="hover:text-gold-soft">
            Home
          </Link>
          <span>/</span>
          <Link to="/pertemuan/9" className="hover:text-gold-soft">
            Pertemuan 9
          </Link>
          <span>/</span>
          <span className="text-gold-soft">Praktikum 1</span>
        </nav>

        {/* Header */}
        <div className="pb-6 mb-10 border-b border-gold/15">
          <span className="inline-block px-3 py-1 text-xs font-medium tracking-widest uppercase border rounded-full border-gold/25 bg-bg-card text-gold-soft">
            Pertemuan 09 · Praktikum 1
          </span>
          <h1 className="mt-4 text-4xl font-bold leading-tight font-display md:text-5xl">
            <span className="gold-gradient-text">
              Layout, Session, Auth & Middleware
            </span>
          </h1>
          <p className="max-w-2xl mt-3 text-sm leading-relaxed text-neutral-400">
            Membangun web <strong>Perpustakaan Mini</strong> dari nol:
            login/register, halaman admin (CRUD buku), dan halaman user (lihat
            katalog). Project ini <strong>terpisah</strong> dari praktikum
            sebelumnya.
          </p>

          <div className="flex flex-wrap gap-2 mt-5">
            <span className="px-3 py-1 text-xs border rounded-full border-gold/20 bg-bg-elevated text-neutral-300">
              ⚙️ Prasyarat: PHP 8.3+, Composer, XAMPP / Laragon
            </span>
            <span className="px-3 py-1 text-xs border rounded-full border-gold/20 bg-bg-elevated text-neutral-300">
              🎯 Tujuan: Layout → Session → Auth → Middleware → CRUD
            </span>
          </div>
        </div>

        {/* Konsep & analogi */}
        <section className="mb-10">
          <h2 className="flex items-center gap-3 mb-5 text-xl font-semibold font-display text-neutral-100">
            <span className="flex items-center justify-center border rounded-lg h-9 w-9 border-gold/30 bg-gold/10 text-gold-soft">
              🏤
            </span>
            Konsep: Analogi Kantor Pos
          </h2>

          <div className="grid gap-3 sm:grid-cols-2">
            {analogi.map((a) => (
              <div
                key={a.konsep}
                className="px-4 py-3 border rounded-xl border-gold/15 bg-bg-elevated"
              >
                <p className="text-sm font-semibold font-display text-gold-soft">
                  {a.konsep}
                </p>
                <p className="mt-1 text-sm text-neutral-400">{a.analogi}</p>
              </div>
            ))}
          </div>

          <div className="px-4 py-3 mt-4 border rounded-lg border-gold/20 bg-gold/5">
            <p className="text-xs text-gold-soft">
              💡 Kode baru bisa diuji setelah <strong>langkah 07</strong> (route
              dirakit di sana). Sebelum itu cukup ikuti dan tempel.
            </p>
          </div>
        </section>

        {/* Struktur file */}
        <section className="mb-14">
          <h2 className="flex items-center gap-3 mb-5 text-xl font-semibold font-display text-neutral-100">
            <span className="flex items-center justify-center border rounded-lg h-9 w-9 border-gold/30 bg-gold/10 text-gold-soft">
              🗂
            </span>
            Struktur File yang Akan Dibuat
          </h2>
          <CopyBlock code={struktur} label="struktur folder" />
        </section>

        {/* Alur */}
        <section className="mb-14">
          <h2 className="flex items-center gap-3 mb-6 text-xl font-semibold font-display text-neutral-100">
            <span className="flex items-center justify-center border rounded-lg h-9 w-9 border-gold/30 bg-gold/10 text-gold-soft">
              📚
            </span>
            Alur Praktikum — 9 Langkah
          </h2>

          <div className="space-y-6">
            {steps.map((s) => (
              <div
                key={s.no}
                className="overflow-hidden border rounded-xl border-gold/15 bg-bg-elevated"
              >
                {/* Header step */}
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

                {/* Fungsi & Kenapa */}
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

                {/* Alur aksi */}
                <div className="px-5 py-5 space-y-5">
                  {s.actions.map((a, i) => (
                    <div key={i} className="flex gap-3">
                      <div className="flex items-center justify-center w-6 h-6 font-mono text-xs border rounded-md shrink-0 border-gold/30 bg-bg-card text-gold-soft">
                        {i + 1}
                      </div>

                      <div className="flex-1 min-w-0 space-y-2">
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

                  {/* Tip */}
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

        {/* Checklist Akhir */}
        <section className="mb-14">
          <h2 className="flex items-center gap-3 mb-5 text-xl font-semibold font-display text-neutral-100">
            <span className="flex items-center justify-center border rounded-lg h-9 w-9 border-gold/30 bg-gold/10 text-gold-soft">
              ✅
            </span>
            Checklist Akhir — Uji Semua Fitur
          </h2>

          <div className="p-5 border rounded-xl border-gold/20 bg-gradient-to-br from-bg-card to-bg-elevated">
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

            <div className="px-4 py-3 mt-5 border rounded-lg border-gold/20 bg-gold/5">
              <p className="text-xs text-gold-soft">
                🎉 Kalau semua checklist beres, Praktikum 1 selesai. Kamu
                sekarang punya pola lengkap untuk project akhir:{" "}
                <strong>
                  layout → guest/auth/role → CRUD admin → read-only user
                </strong>
                . Tinggal ganti "buku" jadi domain masing-masing (produk, menu,
                tiket).
              </p>
            </div>
          </div>
        </section>

        {/* Navigasi bawah */}
        <div className="flex items-center justify-between pt-6 border-t border-gold/10">
          <Link
            to="/pertemuan/9"
            className="text-sm transition-colors text-neutral-500 hover:text-gold-soft"
          >
            ← Balik ke Pertemuan 9
          </Link>
        </div>
      </div>
    </div>
  );
}
