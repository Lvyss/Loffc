import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function PertemuanRow({ item }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div
      className={`card-hover overflow-hidden rounded-xl border bg-bg-elevated ${
        open ? "border-gold/40" : "border-gold/10"
      }`}
    >
      <div className="flex items-center gap-4 px-5 py-4">
        <button
          onClick={() => setOpen((v) => !v)}
          className="flex flex-1 items-center gap-4 text-left"
        >
          <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border font-display font-bold transition-colors ${
              open
                ? "border-gold/50 bg-gold/20 text-gold-soft"
                : "border-gold/20 bg-bg-card text-gold/70"
            }`}
          >
            {String(item.id).padStart(2, "0")}
          </div>

          <div className="min-w-0 flex-1">
            <p className="font-display text-base font-semibold text-neutral-100">
              {item.title}
            </p>
            <p className="truncate text-sm text-neutral-500">{item.topic}</p>
          </div>

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

        <button
          onClick={() => navigate(`/pertemuan/${item.id}`)}
          className="shrink-0 rounded-lg border border-gold/25 bg-gold/10 px-3 py-1.5 text-xs font-medium text-gold-soft transition-colors hover:bg-gold/20"
        >
          Buka →
        </button>
      </div>

      <div
        className={`grid transition-all duration-300 ease-in-out ${
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="space-y-4 border-t border-gold/10 px-5 py-5">
            <div>
              <h4 className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gold-soft">
                <span className="h-1.5 w-1.5 rounded-full bg-gold" />
                Praktikum
              </h4>
              <ul className="space-y-1.5 pl-1">
                {item.praktikum.map((p, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-sm text-neutral-300"
                  >
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-gold/50" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gold-soft">
                <span className="h-1.5 w-1.5 rounded-full bg-gold" />
                Tugas
              </h4>
              <ul className="space-y-1.5 pl-1">
                {item.tugas.map((t, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-sm text-neutral-300"
                  >
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-gold/50" />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}