# Jobsheet Praktikum — Pemrograman Web (Kelas C)

Template halaman jobsheet praktikum, dibangun dengan React + Vite + Tailwind CSS v4.
Tema visual: hitam–emas, gaya "letterhead" akademik, dengan daftar pertemuan yang bisa dibuka/tutup (accordion).

## Menjalankan proyek

```bash
npm install
npm run dev
```

Lalu buka alamat yang muncul di terminal (biasanya `http://localhost:5173`).

## Struktur penting

```
src/
  data/pertemuanData.js     <- isi semua pertemuan, praktikum, dan tugas ada di sini
  components/
    Header.jsx               <- bar atas (nama matkul + badge kelas)
    Hero.jsx                 <- halaman sambutan (welcome)
    PertemuanIndex.jsx       <- daftar pertemuan + logic accordion
    PertemuanRow.jsx         <- satu baris pertemuan (bisa dibuka/tutup)
    Footer.jsx
  App.jsx                    <- menyusun semua komponen di atas
  index.css                  <- palet warna & font (edit di sini kalau mau ganti tema)
```

## Menambah / mengedit pertemuan

Cukup edit array `pertemuanList` di `src/data/pertemuanData.js`. Setiap pertemuan:

```js
{
  id: 5,
  topik: "Judul topik pertemuan",
  ringkasan: "Deskripsi singkat satu kalimat.",
  praktikum: [
    { judul: "Praktikum 5.1 — ...", deskripsi: "...", tautan: "#" },
  ],
  tugas: {
    judul: "Tugas 5 — ...",
    deskripsi: "...",
    tenggat: "Sebelum pertemuan berikutnya",
  },
}
```

Tinggal tambah objek baru ke array, halaman akan otomatis menampilkan pertemuan baru — tidak perlu ubah komponen lain.
Kalau pertemuan tertentu belum ada tugas, hapus saja properti `tugas` atau isi `tugas: null`.

## Mengubah warna / font

Semua token warna dan font ada di `src/index.css` di dalam blok `@theme`. Ganti nilai hex di sana untuk menyesuaikan tema.
