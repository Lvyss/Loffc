import { pertemuanData } from "../data/pertemuanData";
import PertemuanRow from "./PertemuanRow";

export default function PertemuanIndex() {
  return (
    <section className="mx-auto max-w-3xl px-6 pb-20">
      <div className="mb-6 flex items-end justify-between border-b border-gold/15 pb-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-neutral-100">
            Daftar Pertemuan
          </h2>
          <p className="mt-1 text-sm text-neutral-500">
            Klik tiap pertemuan buat lihat praktikum & tugasnya.
          </p>
        </div>
        <span className="hidden text-xs text-neutral-600 md:block">
          {pertemuanData.length} pertemuan
        </span>
      </div>

      <div className="space-y-3">
        {pertemuanData.map((item) => (
          <PertemuanRow key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}