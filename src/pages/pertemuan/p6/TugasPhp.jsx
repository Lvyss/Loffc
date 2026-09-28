import { useState } from "react";
import { Link } from "react-router-dom";
import CopyBlock from "../../../components/ui/CopyBlock";

// ============================================
// Materi bacaan
// ============================================
const materi = [
  {
    no: "01",
    title: "Apa itu PHP? (Pengatur Logika di Balik Layar)",
    body: [
      "PHP adalah bahasa pemrograman yang bertugas mengatur logika di server.",
      "\"Logika\" di sini artinya semua hal yang perlu dipikirkan dan dikerjakan sebelum halaman ditampilkan:",
    ],
    list: [
      "Mengambil data dari database",
      "Menyimpan data baru ke database",
      "Memeriksa apakah data yang dikirim sudah benar (validasi)",
      "Mengambil keputusan, misalnya \"boleh masuk atau tidak?\"",
      "Menyusun halaman sesuai data yang ada",
    ],
    after: [
      "Kalau halaman web itu sebuah kantor pos, PHP adalah petugas yang bekerja di dalamnya. Pengunjung hanya melihat surat yang sudah jadi, sedangkan seluruh pekerjaan berpikirnya terjadi di belakang.",
      "Laravel yang kalian pakai dua pertemuan ini dibangun dengan PHP. Semua class, function, dan $variabel yang kalian ketik di Controller dan Model adalah kode PHP.",
    ],
  },
  {
    no: "02",
    title: "Kenapa HTML dan CSS Saja Tidak Cukup?",
    body: [
      "HTML dan CSS hanya mengurus tampilan. Mereka tidak bisa berpikir, tidak bisa menghitung, tidak bisa mengambil keputusan, dan tidak bisa terhubung ke database.",
      "Bayangkan halaman daftar buku yang dibuat dengan HTML saja. Setiap ada buku baru, seseorang harus mengetik ulang kode HTML-nya secara manual. Dengan PHP, halaman itu meminta data ke database, lalu HTML-nya tersusun otomatis.",
    ],
    table: {
      head: ["Kebutuhan Web", "Siapa yang Mengerjakan"],
      rows: [
        ["Menampilkan teks dan gambar", "HTML"],
        ["Mempercantik tampilan", "CSS"],
        ["Mengambil data dari database", "PHP"],
        ["Menyimpan data ke database", "PHP"],
        ["Memeriksa isian form (validasi)", "PHP"],
        ["Menentukan siapa boleh melihat apa", "PHP"],
      ],
    },
    after: [
      "Ini sudah kalian tulis sendiri di praktikum:",
    ],
    tableAfter: {
      head: ["Kode", "Pekerjaan PHP-nya"],
      rows: [
        ["Category::all()", "Meminta semua data ke database"],
        ["$request->validate(...)", "Memeriksa isian form"],
        ["Book::create($validated)", "Menyimpan data ke database"],
      ],
    },
  },
  {
    no: "03",
    title: "Cara Kerja PHP",
    body: ["Alur kerja PHP dari pengunjung sampai halaman tampil:"],
    list: [
      "Pengunjung membuka sebuah halaman.",
      "Server menjalankan PHP: mengambil data, mengolahnya, menyusun halaman.",
      "Server mengirim hasilnya berupa HTML ke browser.",
      "Browser menampilkan HTML itu.",
    ],
    after: [
      "Karena PHP selesai bekerja sebelum halaman sampai ke pengunjung, kode PHP tidak terlihat di \"View Source\". Yang terlihat hanya HTML hasilnya. Itu sebabnya hal rahasia seperti password dan koneksi database aman disimpan di PHP.",
      "Itu juga alasan kita menjalankan `php artisan serve`: file PHP butuh server yang menjalankannya, sehingga tidak bisa dibuka dengan klik dua kali seperti file HTML.",
    ],
  },
  {
    no: "04",
    title: "Bagaimana dengan JavaScript?",
    body: [
      "Kalian sudah belajar JavaScript, jadi wajar kalau muncul pertanyaan: \"Kenapa tidak pakai JS saja?\"",
      "JS yang kalian pelajari berjalan di browser. Di sana JS tidak boleh terhubung langsung ke database. Kalau boleh, password database akan terbuka untuk siapa pun yang melihat kodenya. Jadi JS di browser hanya mengurus interaksi di layar, seperti tombol, animasi, dan menampilkan atau menyembunyikan elemen.",
      "Namun JS juga bisa dijalankan di server lewat teknologi bernama Node.js. Di sisi server, JS mampu mengerjakan hal yang sama dengan PHP: mengurus database, validasi, dan logika. Jadi secara kemampuan, JS bisa menggantikan PHP di sisi server.",
      "Lalu kenapa Laravel memakai PHP?",
    ],
    list: [
      "Laravel dibangun dengan PHP. Framework-nya memang berbahasa PHP, jadi kita ikut memakai PHP.",
      "Ada framework JS yang setara (misalnya Express atau NestJS). Keduanya pilihan yang sah, tidak ada yang mutlak lebih baik.",
      "Keunggulan JS: satu bahasa bisa dipakai untuk sisi depan dan belakang.",
      "Keunggulan PHP: dirancang khusus untuk web, hosting-nya murah dan tersedia di mana-mana, dan Laravel sudah menyediakan banyak fitur siap pakai.",
    ],
    after: [
      "Analoginya seperti pergi ke kantor pos: bisa naik motor atau mobil, tujuannya sama. Laravel adalah mobilnya, dan PHP adalah mesinnya.",
    ],
  },
  {
    no: "05",
    title: "Sintaks Dasar",
    body: [
      "Tag PHP. Kode PHP ditulis di dalam `<?php ... ?>`. Setiap perintah diakhiri titik koma (`;`).",
      "Menampilkan tulisan dengan `echo`. Variabel diawali tanda `$` dan berfungsi seperti kotak penyimpan nilai.",
    ],
    code: `<?php
$nama = "Eka";
echo "Halo, " . $nama;   // hasil: Halo, Eka
?>`,
    codeLabel: "contoh-dasar.php",
    after: [
      "Tanda titik (`.`) dipakai untuk menyambung teks.",
      "Tipe data yang paling sering dipakai:",
    ],
    table: {
      head: ["Tipe", "Contoh", "Keterangan"],
      rows: [
        ["String", '"Laskar Pelangi"', "Teks"],
        ["Integer", "2005", "Angka bulat"],
        ["Float", "15000.50", "Angka desimal"],
        ["Boolean", "true / false", "Benar atau salah"],
        ["Array", '["a", "b"]', "Kumpulan nilai"],
      ],
    },
    after2: [
      "Komentar (catatan yang tidak dijalankan) ditulis dengan `//`.",
    ],
  },
  {
    no: "06",
    title: "Array",
    body: ["Array adalah satu variabel yang menyimpan banyak nilai."],
    code: `$buah = ["Apel", "Jeruk", "Mangga"];
echo $buah[0];   // Apel`,
    codeLabel: "array-biasa.php",
    after: [
      "Array asosiatif (nilai diambil lewat nama kunci, memakai tanda `=>`):",
    ],
    code2: `$buku = [
    "judul" => "Laskar Pelangi",
    "tahun" => 2005
];
echo $buku["judul"];   // Laskar Pelangi`,
    code2Label: "array-asosiatif.php",
    after2: [
      "Kalian sudah sering menulis yang kedua, misalnya `['name' => 'required']` dan `['name', 'image', 'category_id']`.",
    ],
  },
  {
    no: "07",
    title: "Percabangan dan Perulangan",
    body: ["`if` dipakai untuk mengambil keputusan:"],
    code: `$umur = 20;

if ($umur >= 17) {
    echo "Boleh membuat KTP";
} else {
    echo "Belum boleh";
}`,
    codeLabel: "if.php",
    after: [
      "`foreach` dipakai untuk mengulang, satu kali untuk setiap isi array:",
    ],
    code2: `$buah = ["Apel", "Jeruk", "Mangga"];

foreach ($buah as $b) {
    echo $b;
}`,
    code2Label: "foreach.php",
    after2: [
      "`@foreach` di Blade yang kalian pakai untuk menampilkan tabel adalah versi ringkas dari `foreach` ini.",
    ],
  },
  {
    no: "08",
    title: "Function",
    body: [
      "Function adalah kumpulan perintah yang diberi nama, supaya bisa dipakai berulang kali. Function bisa menerima bahan (parameter) dan mengembalikan hasil (return).",
    ],
    code: `function sapa($nama) {
    return "Halo, " . $nama;
}

echo sapa("Eka");    // Halo, Eka
echo sapa("Budi");   // Halo, Budi`,
    codeLabel: "function.php",
    after: [
      "`index()`, `store()`, dan `update()` di Controller juga function.",
    ],
  },
  {
    no: "09",
    title: "Pengenalan Class dan Object",
    body: [
      "Class adalah cetak biru, dan object adalah benda nyata yang dibuat dari cetak biru itu. Analoginya, cetak biru rumah dan rumah yang sudah berdiri.",
    ],
    code: `class Buku {
    public $judul;

    public function tampil() {
        return "Judul: " . $this->judul;
    }
}

$b = new Buku();              // membuat object dari class Buku
$b->judul = "Laskar Pelangi";
echo $b->tampil();            // Judul: Laskar Pelangi`,
    codeLabel: "class-object.php",
    after: ["Tiga simbol yang perlu dikenali:"],
    table: {
      head: ["Simbol", "Artinya", "Contoh di Laravel"],
      rows: [
        ["->", "Mengakses isi (properti atau method) milik sebuah object", "$book->category->name"],
        ["::", "Memanggil sesuatu langsung dari nama class, tanpa membuat object", "Category::all()"],
        ["$this", "\"Diri sendiri\", yaitu object yang sedang dipakai", "$this->hasMany(Book::class)"],
      ],
    },
    after2: [
      "Kata `public` dan `protected` menentukan siapa yang boleh mengakses. `public` boleh diakses dari mana saja, `protected` hanya dari dalam class itu sendiri (dan turunannya).",
    ],
  },
  {
    no: "10",
    title: "Kaitannya dengan Kode Laravel Kalian",
    body: ["Beberapa kode Laravel yang udah kalian tulis itu sebenarnya konsep PHP dasar:"],
    table: {
      head: ["Kode di Laravel", "Konsep PHP-nya"],
      rows: [
        ["$categories = Category::all();", "Variabel + memanggil method static dengan ::"],
        ["class BookController extends Controller", "Class"],
        ["public function index() { ... }", "Function di dalam class"],
        ["['name' => 'required']", "Array asosiatif"],
        ["$book->category->name", "Mengakses object dengan ->"],
        ["@foreach($books as $book)", "Perulangan foreach"],
      ],
    },
  },
];

// ============================================
// Soal esai — ditampilin sebagai checklist buat self-check
// ============================================
const soalEsai = [
  {
    no: 1,
    text: "Pengertian PHP dan fungsinya untuk apa.",
  },
  {
    no: 2,
    text: "Mengapa HTML dan CSS saja tidak cukup, dan apa peran PHP sebagai pengatur logika (sebutkan minimal 2 pekerjaan yang ditangani PHP).",
  },
  {
    no: 3,
    text: "Cara kerja PHP dari pengunjung membuka halaman sampai halaman tampil, dan alasan kode PHP tidak terlihat di \"View Source\".",
  },
  {
    no: 4,
    text: "Minimal 3 konsep dasar PHP yang kamu pahami (pilih dari: variabel, array, if, foreach, function, class/object). Untuk tiap konsep, tulis penjelasan singkat dan satu contoh kode buatanmu sendiri (bukan salinan dari penjelasan di atas).",
  },
  {
    no: 5,
    text: "Hubungan PHP dengan Laravel, dengan menyebut minimal 1 contoh kode Laravel yang pernah kamu tulis dan konsep PHP apa yang dipakai. Jelaskan juga mengapa Laravel memakai PHP, padahal JavaScript juga bisa dipakai untuk logika di server.",
  },
];

// ============================================
// Komponen StepCard (materi bisa di-expand)
// ============================================
function MateriCard({ item }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className={`overflow-hidden rounded-xl border bg-bg-elevated transition-colors ${
        open ? "border-gold/40" : "border-gold/15"
      }`}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center w-full gap-4 px-5 py-4 text-left"
      >
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border font-mono text-xs font-bold transition-colors ${
            open
              ? "border-gold/50 bg-gold/20 text-gold-soft"
              : "border-gold/30 bg-gold/10 text-gold-soft"
          }`}
        >
          {item.no}
        </div>
        <h3 className="flex-1 min-w-0 text-base font-semibold font-display text-neutral-100">
          {item.title}
        </h3>
        <svg
          className={`h-5 w-5 shrink-0 text-gold/60 transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      <div
        className={`grid transition-all duration-300 ${
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="px-5 py-5 space-y-3 text-sm leading-relaxed border-t border-gold/10 text-neutral-300">
            {item.body?.map((p, i) => (
              <p key={i}>{p}</p>
            ))}

            {item.list && (
              <ul className="space-y-1.5 pl-1">
                {item.list.map((l, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-gold/60" />
                    <span>{l}</span>
                  </li>
                ))}
              </ul>
            )}

            {item.code && (
              <CopyBlock code={item.code} label={item.codeLabel} />
            )}

            {item.after?.map((p, i) => (
              <p key={i}>{p}</p>
            ))}

            {item.table && (
              <div className="overflow-x-auto border rounded-lg border-gold/15">
                <table className="w-full text-sm">
                  <thead className="bg-bg-base/60">
                    <tr className="text-left">
                      {item.table.head.map((h, i) => (
                        <th
                          key={i}
                          className="px-3 py-2 text-xs font-semibold tracking-wider uppercase text-gold-soft"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {item.table.rows.map((r, i) => (
                      <tr
                        key={i}
                        className="border-t border-gold/10 text-neutral-300"
                      >
                        {r.map((cell, j) => (
                          <td key={j} className="px-3 py-2">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {item.tableAfter && (
              <div className="overflow-x-auto border rounded-lg border-gold/15">
                <table className="w-full text-sm">
                  <thead className="bg-bg-base/60">
                    <tr className="text-left">
                      {item.tableAfter.head.map((h, i) => (
                        <th
                          key={i}
                          className="px-3 py-2 text-xs font-semibold tracking-wider uppercase text-gold-soft"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {item.tableAfter.rows.map((r, i) => (
                      <tr
                        key={i}
                        className="border-t border-gold/10 text-neutral-300"
                      >
                        {r.map((cell, j) => (
                          <td key={j} className="px-3 py-2">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {item.code2 && (
              <CopyBlock code={item.code2} label={item.code2Label} />
            )}

            {item.after2?.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// Halaman utama
// ============================================
export default function TugasPhp() {
  return (
    <div className="relative min-h-screen">
      <div className="pointer-events-none absolute left-1/2 top-0 h-64 w-[40rem] -translate-x-1/2 rounded-full bg-gold/10 blur-[120px]" />

      <div className="relative max-w-4xl px-6 py-12 mx-auto">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 mb-8 text-xs text-neutral-500">
          <Link to="/" className="hover:text-gold-soft">Home</Link>
          <span>/</span>
          <Link to="/pertemuan/6" className="hover:text-gold-soft">Pertemuan 6</Link>
          <span>/</span>
          <span className="text-gold-soft">Tugas PHP</span>
        </nav>

        {/* Header */}
        <div className="pb-6 mb-10 border-b border-gold/15">
          <span className="inline-block px-3 py-1 text-xs font-medium tracking-widest uppercase border rounded-full border-gold/25 bg-bg-card text-gold-soft">
            Pertemuan 06 · Tugas Tambahan
          </span>
          <h1 className="mt-4 text-4xl font-bold leading-tight font-display md:text-5xl">
            <span className="gold-gradient-text">Mengenal PHP</span>
          </h1>
          <p className="max-w-2xl mt-3 text-sm leading-relaxed text-neutral-400">
            Bacalah seluruh penjelasan di bawah ini sampai selesai. Setelah
            itu, kerjakan tugas di bagian paling akhir — menjelaskan apa itu
            PHP dengan bahasamu sendiri, berdasarkan apa yang kamu pahami
            dari penjelasan ini.
          </p>

          <div className="flex flex-wrap gap-2 mt-5">
            <span className="px-3 py-1 text-xs border rounded-full border-gold/20 bg-bg-elevated text-neutral-300">
              📖 Bacaan + Esai
            </span>
            <span className="px-3 py-1 text-xs border rounded-full border-gold/20 bg-bg-elevated text-neutral-300">
              ✍️ 5 Poin Jawaban Wajib
            </span>
          </div>
        </div>

        {/* Materi Bacaan */}
        <section className="mb-14">
          <h2 className="flex items-center gap-3 mb-6 text-xl font-semibold font-display text-neutral-100">
            <span className="flex items-center justify-center border rounded-lg h-9 w-9 border-gold/30 bg-gold/10 text-gold-soft">
              📖
            </span>
            Materi Bacaan — 10 Poin
          </h2>

          <p className="mb-5 text-sm text-neutral-500">
            Klik tiap poin buat buka penjelasannya. Baca dulu semuanya
            sebelum mengerjakan tugas di bawah.
          </p>

          <div className="space-y-3">
            {materi.map((m) => (
              <MateriCard key={m.no} item={m} />
            ))}
          </div>
        </section>

{/* Tugas Video */}
<section className="mb-14">
  <h2 className="flex items-center gap-3 mb-6 text-xl font-semibold font-display text-neutral-100">
    <span className="flex items-center justify-center border rounded-lg h-9 w-9 border-gold/30 bg-gold/10 text-gold-soft">
      🎥
    </span>
    Tugas — Video Penjelasan
  </h2>

  <div className="p-5 border rounded-xl border-gold/20 bg-gradient-to-br from-bg-card to-bg-elevated">
    <p className="text-sm leading-relaxed text-neutral-300">
      Rekam video <strong>maksimal 5 menit</strong> — jelaskan apa itu PHP
      dengan bahasamu sendiri, berdasarkan pemahamanmu dari materi di atas.
      Boleh sambil nampilin slide atau tulisan di layar.
    </p>

    {/* Poin yang wajib ada di video */}
    <h3 className="mt-6 mb-3 text-xs font-semibold tracking-wider uppercase text-gold-soft">
      Yang harus ada di videomu
    </h3>

    <ol className="space-y-3">
      {soalEsai.map((s) => (
        <li key={s.no} className="flex gap-3">
          <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-gold/30 bg-bg-base font-mono text-xs text-gold-soft">
            {s.no}
          </span>
          <p className="text-sm text-neutral-300">{s.text}</p>
        </li>
      ))}
    </ol>



    {/* Info durasi */}
    <div className="flex flex-wrap gap-2 mt-6 text-xs">
      <span className="px-3 py-1 border rounded-full border-gold/20 bg-bg-base text-neutral-300">
        ⏱ Durasi: maks 5 menit
      </span>
    </div>

    <div className="px-4 py-3 mt-6 border rounded-lg border-gold/20 bg-gold/5">
      <p className="text-xs text-gold-soft">
        💡 Yang dinilai bukan kualitas rekaman — tapi seberapa paham kamu
        menjelaskan konsepnya dengan bahasa sendiri. Lebih baik sederhana
        tapi jelas, daripada bagus tapi cuma baca slide.
      </p>
    </div>
  </div>
</section>


        {/* Navigasi bawah */}
        <div className="flex items-center justify-between pt-6 border-t border-gold/10">
          <Link
            to="/pertemuan/6"
            className="text-sm transition-colors text-neutral-500 hover:text-gold-soft"
          >
            ← Balik ke Pertemuan 6
          </Link>
          <Link
            to="/pertemuan/6/tugas"
            className="text-sm transition-colors text-neutral-500 hover:text-gold-soft"
          >
            Tugas FoodMart →
          </Link>
        </div>
      </div>
    </div>
  );
}