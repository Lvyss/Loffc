import { Link } from "react-router-dom";
import CopyBlock from "../../../components/ui/CopyBlock";

// Teks dengan `kode` di antara backtick akan tampil sebagai <code>
function Rich({ text }) {
  return text.split("`").map((part, i) =>
    i % 2 === 1 ? (
      <code
        key={i}
        className="rounded bg-bg-card px-1.5 py-0.5 text-[0.85em] text-gold-soft"
      >
        {part}
      </code>
    ) : (
      <span key={i}>{part}</span>
    ),
  );
}

const peran = [
  { role: "Tamu", bisa: "Lihat Home, register, login" },
  {
    role: "User",
    bisa: "Sama seperti tamu, header menampilkan nama + Logout",
  },
  {
    role: "Admin",
    bisa: "Masuk `/admin`, mengubah isi Home dan mengelola user",
  },
];

const aturan = [
  {
    text: "Buat project Laravel baru. Pakai file mentahan FoodMart, bukan project Pertemuan 2.",
    code: "composer create-project laravel/laravel:^13.0 foodmart",
  },
  {
    text: "Template diubah jadi Blade: layout + partial (header dan footer). Semua path CSS, JS, dan gambar memakai `asset()`.",
  },
  {
    text: "Register, login, logout, dan role (`admin` / `user`) dibuat seperti Praktikum 3. Setelah login: admin → `/admin`, user → `/`.",
  },
  {
    text: "Semua halaman admin hanya untuk admin (middleware `auth` + `role:admin`). User biasa mendapat 403, tamu dilempar ke login.",
  },
  {
    text: "Route admin memakai `Route::resource`, `prefix('admin')`, dan nama `admin.*`. Pakai route model binding, dan semua link/form memakai `route()`.",
  },
  {
    text: "Validasi memakai Form Request. Pesan error, `old()`, dan flash message harus tampil.",
  },
  {
    text: "`role` tidak boleh bisa diisi dari form register. Password harus ter-hash.",
  },
  {
    text: "Home tidak boleh error saat data kosong. Bagian yang kosong disembunyikan.",
  },
  {
    text: "Gambar upload lama dihapus saat diganti atau saat datanya dihapus. Gambar bawaan template tidak boleh ikut terhapus.",
  },
  {
    text: "Home tampil sama seperti template aslinya, dan tersedia akun admin dan user untuk uji.",
  },
  {
    text: "Bagian Home di luar poin 3, termasuk keranjang, wishlist, dan tombol Add to Cart, dibiarkan statis.",
  },
];

const dinamis = [
  {
    bagian: "Hero slider (3 slide)",
    sumber: "Banner",
    dikelola: "Admin → Banner",
  },
  {
    bagian: "Tab Trending Products",
    sumber: "Kategori + Produk",
    dikelola: "Admin → Kategori, Produk",
  },
];

const halamanAdmin = [
  {
    halaman: "Dashboard",
    isi: "4 kartu jumlah: banner, kategori, produk, user",
  },
  {
    halaman: "Banner",
    isi: "CRUD: label, judul, deskripsi, teks tombol, gambar (upload), status aktif",
  },
  {
    halaman: "Kategori",
    isi: "CRUD. Kategori yang masih punya produk tidak boleh dihapus.",
  },
  {
    halaman: "Produk",
    isi: "CRUD: nama, harga, gambar (upload), kategori",
  },
  {
    halaman: "Pengguna",
    isi: "Daftar user, ubah role, hapus user. Admin tidak boleh mengubah role atau menghapus dirinya sendiri.",
  },
];

const skenario = [
  {
    uji: "Admin mengubah judul slide 1",
    hasil: "Home berubah setelah refresh",
  },
  {
    uji: "Admin upload gambar baru di banner",
    hasil:
      "Gambar baru tampil, file upload lama terhapus, gambar template tidak terhapus",
  },
  {
    uji: "Admin menonaktifkan semua banner",
    hasil: "Home tidak error, slider hilang",
  },
  {
    uji: "Admin menambah kategori + 2 produk",
    hasil: "Muncul di tab Trending Products",
  },
  {
    uji: "Admin menghapus kategori yang masih punya produk",
    hasil: "Ditolak dengan pesan",
  },
  {
    uji: "Register akun baru, lalu admin mengubah rolenya jadi admin",
    hasil: "Awalnya role user. Setelah diubah, akun itu bisa masuk `/admin`",
  },
  {
    uji: "User biasa membuka `/admin`, lalu tamu membuka `/admin`",
    hasil: "User → 403, tamu → halaman login",
  },
  {
    uji: "Admin mengubah role atau menghapus dirinya sendiri",
    hasil: "Ditolak dengan pesan",
  },
  {
    uji: "Login sebagai admin, lalu sebagai user",
    hasil: "Admin → `/admin`, user → `/`",
  },
];

function SectionTitle({ icon, children }) {
  return (
    <h2 className="flex items-center gap-3 mb-5 text-xl font-semibold font-display text-neutral-100">
      <span className="flex items-center justify-center border rounded-lg h-9 w-9 border-gold/30 bg-gold/10 text-gold-soft">
        {icon}
      </span>
      {children}
    </h2>
  );
}

function DataTable({ head, rows }) {
  return (
    <div className="overflow-x-auto border rounded-xl border-gold/15 bg-bg-elevated">
      <table className="w-full text-sm text-left">
        <thead>
          <tr className="border-b border-gold/15 bg-gold/10">
            {head.map((h) => (
              <th
                key={h}
                className="px-4 py-3 text-xs font-semibold tracking-wider uppercase text-gold-soft"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr
              key={i}
              className="align-top border-b border-gold/10 last:border-0"
            >
              {r.map((cell, j) => (
                <td
                  key={j}
                  className={`px-4 py-3 leading-relaxed ${
                    j === 0
                      ? "font-medium text-neutral-200"
                      : "text-neutral-400"
                  }`}
                >
                  <Rich text={cell} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function Tugas() {
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
          <span className="text-gold-soft">Tugas</span>
        </nav>

        {/* Header */}
        <div className="pb-6 mb-10 border-b border-gold/15">
          <span className="inline-block px-3 py-1 text-xs font-medium tracking-widest uppercase border rounded-full border-gold/25 bg-bg-card text-gold-soft">
            Pertemuan 09 · Tugas
          </span>
          <h1 className="mt-4 text-4xl font-bold leading-tight font-display md:text-5xl">
            <span className="gold-gradient-text">
              FoodMart Dinamis: Home + Panel Admin
            </span>
          </h1>
          <p className="max-w-2xl mt-3 text-sm leading-relaxed text-neutral-400">
            Ubah template FoodMart statis menjadi aplikasi Laravel yang isi
            Home-nya diambil dari database dan bisa diubah admin lewat panel.
          </p>

          <div className="flex flex-wrap gap-2 mt-5">
            <span className="px-3 py-1 text-xs border rounded-full border-gold/20 bg-bg-elevated text-neutral-300">
              ⚙️ Prasyarat: Praktikum 3 selesai + file mentahan FoodMart
              (index.html, css, js, images)
            </span>
            <span className="px-3 py-1 text-xs border rounded-full border-gold/20 bg-bg-elevated text-neutral-300">
              ⏱ Waktu: 2 minggu
            </span>
            <span className="px-3 py-1 text-xs border rounded-full border-gold/20 bg-bg-elevated text-neutral-300">
              🎤 Dipresentasikan satu per satu
            </span>
          </div>
        </div>

        {/* 1. Tujuan */}
        <section className="mb-14">
          <SectionTitle icon="🎯">1. Tujuan</SectionTitle>

          <DataTable
            head={["Peran", "Bisa apa"]}
            rows={peran.map((p) => [p.role, p.bisa])}
          />

          <div className="px-4 py-3 mt-4 border rounded-lg border-gold/20 bg-gold/5">
            <p className="text-xs text-gold-soft">
              📦 <strong>Hasil akhir:</strong> admin mengganti judul banner atau
              produk di panel, lalu Home langsung berubah tanpa menyentuh kode.
            </p>
          </div>
        </section>

        {/* 2. Aturan */}
        <section className="mb-14">
          <SectionTitle icon="📏">2. Aturan</SectionTitle>

          <div className="p-5 border rounded-xl border-gold/15 bg-bg-elevated">
            <ol className="space-y-4">
              {aturan.map((a, i) => (
                <li key={i} className="flex gap-3">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-gold/30 bg-bg-card font-mono text-xs text-gold-soft">
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0 space-y-2">
                    <p className="text-sm leading-relaxed text-neutral-300">
                      <Rich text={a.text} />
                    </p>
                    {a.code && <CopyBlock code={a.code} label="bash" />}
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* 3. Yang dinamis */}
        <section className="mb-14">
          <SectionTitle icon="⚡">3. Yang Dinamis</SectionTitle>

          <DataTable
            head={["Bagian Home", "Sumber data", "Dikelola di"]}
            rows={dinamis.map((d) => [d.bagian, d.sumber, d.dikelola])}
          />

          <h3 className="mt-8 mb-3 text-base font-semibold font-display text-neutral-100">
            Halaman admin yang wajib ada
          </h3>
          <DataTable
            head={["Halaman", "Isi"]}
            rows={halamanAdmin.map((h) => [h.halaman, h.isi])}
          />

          <div className="px-4 py-3 mt-4 border rounded-lg border-gold/20 bg-gold/5">
            <p className="text-xs text-gold-soft">
              💡 Rancangan tabel dan kolom di luar daftar ini bebas kamu
              tentukan.
            </p>
          </div>
        </section>

        {/* 4. Skenario uji */}
        <section className="mb-14">
          <SectionTitle icon="✅">4. Skenario Uji Kerja</SectionTitle>

          <p className="mb-4 text-sm text-neutral-400">
            Pastikan semua skenario ini berjalan sebelum presentasi.
          </p>

          <div className="p-5 border rounded-xl border-gold/20 bg-gradient-to-br from-bg-card to-bg-elevated">
            <ol className="space-y-3">
              {skenario.map((s, i) => (
                <li key={i} className="flex gap-3">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-gold/30 bg-bg-base font-mono text-xs text-gold-soft">
                    {i + 1}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-neutral-200">
                      <Rich text={s.uji} />
                    </p>
                    <p className="mt-0.5 text-xs text-neutral-500">
                      → <Rich text={s.hasil} />
                    </p>
                  </div>
                </li>
              ))}
            </ol>

            <div className="px-4 py-3 mt-5 border rounded-lg border-gold/20 bg-gold/5">
              <p className="text-xs text-gold-soft">
                🎉 Kalau semua skenario di atas lolos, tugas siap
                dipresentasikan.
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
          <Link
            to="/pertemuan/9/praktikum-3"
            className="text-sm transition-colors text-neutral-500 hover:text-gold-soft"
          >
            Lihat Praktikum 3
          </Link>
        </div>
      </div>
    </div>
  );
}
