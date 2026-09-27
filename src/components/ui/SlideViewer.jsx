import { useState } from "react";

/**
 * Komponen buat nampilin slide PDF dari folder public/slides/.
 *
 * Cara pakai:
 * <SlideViewer
 *   pdf="/slides/pertemuan-6.pdf"
 *   title="Slide Pertemuan 6"
 * />
 */
export default function SlideViewer({ pdf, title = "Slide Presentasi" }) {
  const [fullscreen, setFullscreen] = useState(false);

  return (
    <>
      <div className="overflow-hidden rounded-xl border border-gold/20 bg-bg-elevated">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gold/15 bg-bg-card px-4 py-2.5">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-md border border-gold/30 bg-gold/10 text-[11px] text-gold-soft">
              📊
            </span>
            <span className="text-xs font-medium text-neutral-300">
              {title}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={pdf}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md border border-gold/25 bg-gold/10 px-2.5 py-1 text-[11px] font-medium text-gold-soft transition-colors hover:bg-gold/20"
            >
              Buka Tab Baru ↗
            </a>
            <button
              onClick={() => setFullscreen(true)}
              className="rounded-md border border-gold/25 bg-gold/10 px-2.5 py-1 text-[11px] font-medium text-gold-soft transition-colors hover:bg-gold/20"
            >
              Fullscreen
            </button>
          </div>
        </div>

        {/* Preview PDF */}
        <div className="aspect-video w-full bg-black/40">
          <iframe
            src={pdf}
            title={title}
            className="h-full w-full"
            loading="lazy"
          />
        </div>
      </div>

      {/* Modal fullscreen */}
      {fullscreen && (
        <div
          className="fixed inset-0 z-[100] flex flex-col bg-black/95 p-4 backdrop-blur-sm"
          onClick={() => setFullscreen(false)}
        >
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm font-medium text-neutral-200">
              {title}
            </span>
            <button
              onClick={() => setFullscreen(false)}
              className="rounded-md border border-gold/30 bg-gold/10 px-3 py-1.5 text-xs font-medium text-gold-soft transition-colors hover:bg-gold/20"
            >
              ✕ Tutup
            </button>
          </div>
          <div
            className="flex-1 overflow-hidden rounded-xl border border-gold/20"
            onClick={(e) => e.stopPropagation()}
          >
            <iframe
              src={pdf}
              title={title}
              className="h-full w-full"
            />
          </div>
        </div>
      )}
    </>
  );
}