import { Link } from "react-router-dom";
import SlideViewer from "../../components/ui/SlideViewer";

const praktikumList = [
  {
    id: 1,
    title: "Praktikum 1 — Fondasi Toko Mini",
    desc: "Buat project baru, migration lengkap (users+categories+items+orders+order_items), seeder, Auth login/register, layout, dan middleware role.",
    tag: "Laravel · Database · Auth",
    path: "/pertemuan/10/praktikum-1",
  },
  {
    id: 2,
    title: "Praktikum 2 — Admin Panel & Alur Customer",
    desc: "CRUD kategori & item (upload gambar), kelola pesanan admin, katalog publik, keranjang session, checkout dengan DB::transaction.",
    tag: "CRUD · Upload · Cart · Checkout",
    path: "/pertemuan/10/praktikum-2",
  },
];

const tugasList = [

];

function CardLink({ item, label }) {
  return (
    <Link
      to={item.path}
      className="relative p-5 overflow-hidden border card-hover group rounded-xl border-gold/15 bg-bg-elevated"
    >
      <div className="absolute w-24 h-24 transition-opacity rounded-full opacity-0 pointer-events-none -right-8 -top-8 bg-gold/10 blur-2xl group-hover:opacity-100" />

      <span className="inline-block rounded-full border border-gold/25 bg-bg-card px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-gold-soft">
        {item.tag}
      </span>

      <h3 className="mt-3 text-lg font-semibold font-display text-neutral-100">
        {item.title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-neutral-400">
        {item.desc}
      </p>

      <div className="flex items-center gap-2 mt-4 text-xs font-medium text-gold-soft">
        {label}
        <svg
          className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 7l5 5m0 0l-5 5m5-5H6"
          />
        </svg>
      </div>
    </Link>
  );
}

function SectionHeader({ icon, title, subtitle }) {
  return (
    <div className="flex items-center gap-3 pb-3 mb-5 border-b border-gold/15">
      <span className="flex items-center justify-center border rounded-lg h-9 w-9 border-gold/30 bg-gold/10 text-gold-soft">
        {icon}
      </span>
      <div>
        <h2 className="text-xl font-semibold font-display text-neutral-100">
          {title}
        </h2>
        <p className="text-xs text-neutral-500">{subtitle}</p>
      </div>
    </div>
  );
}

export default function Pertemuan10() {
  return (
    <div className="relative min-h-screen">
      <div className="pointer-events-none absolute left-1/2 top-0 h-64 w-[40rem] -translate-x-1/2 rounded-full bg-gold/10 blur-[120px]" />

      <div className="relative max-w-4xl px-6 py-12 mx-auto">
        <Link
          to="/"
          className="inline-flex items-center gap-2 mb-8 text-sm transition-colors text-neutral-500 hover:text-gold-soft"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Kembali ke daftar pertemuan
        </Link>

        <div className="pb-6 mb-10 border-b border-gold/15">
          <span className="inline-block px-3 py-1 text-xs font-medium tracking-widest uppercase border rounded-full border-gold/25 bg-bg-card text-gold-soft">
            Pertemuan 10
          </span>
          <h1 className="mt-4 text-4xl font-bold leading-tight font-display md:text-5xl">
            <span className="gold-gradient-text">
              Project Toko Mini: Admin & Customer
            </span>
          </h1>
          <p className="max-w-2xl mt-3 text-sm leading-relaxed text-neutral-400">
            Project besar: dari database sampai alur belanja. Pengunjung lihat
            katalog, customer belanja lewat keranjang (session) & checkout
            (transaction), admin kelola kategori/item/pesanan. Ini kerangka
            untuk project akhir.
          </p>
        </div>

        <section className="mb-12">
          <h2 className="flex items-center gap-3 mb-4 text-xl font-semibold font-display text-neutral-100">
            <span className="flex items-center justify-center border rounded-lg h-9 w-9 border-gold/30 bg-gold/10 text-gold-soft">
              📊
            </span>
            Slide Materi
          </h2>

          <SlideViewer
            pdf="/slides/pertemuan-10.pdf"
            title="Pertemuan 10 — Project Toko Mini (Laravel 13)"
          />
        </section>

        <section className="mb-12">
          <SectionHeader
            icon="⚙️"
            title="Praktikum"
            subtitle="Kerjakan berurutan: Praktikum 1 → Praktikum 2"
          />
          <div className="grid gap-4 md:grid-cols-2">
            {praktikumList.map((p) => (
              <CardLink key={p.id} item={p} label="Buka Praktikum" />
            ))}
          </div>
        </section>

        {tugasList.length > 0 && (
          <section className="mb-12">
            <SectionHeader
              icon="📝"
              title="Tugas"
              subtitle="Pilih minimal 2 fitur lanjutan sesuai mitra kelompok"
            />
            <div className="grid gap-4 md:grid-cols-2">
              {tugasList.map((t) => (
                <CardLink key={t.id} item={t} label="Buka Tugas" />
              ))}
            </div>
          </section>
        )}

        <div className="pt-6 mt-16 text-center border-t border-gold/10">
          <Link
            to="/"
            className="text-sm transition-colors text-neutral-500 hover:text-gold-soft"
          >
            ← Balik ke Home
          </Link>
        </div>
      </div>
    </div>
  );
}