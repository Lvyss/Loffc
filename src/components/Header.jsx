import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-gold/15 bg-bg-base/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between ">
        <Link to="/" className="flex items-center gap-3">
        
            <img src="/img/logo.png" alt="Logo" className="h-20 w-20 rounded-lg" />

          <div className="leading-tight">
            <p className="font-display text-sm font-semibold text-neutral-100">
              Pemrograman Web
            </p>
            <p className="text-xs text-neutral-500">Jobsheet Praktikum</p>
          </div>
        </Link>

        <span className="rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-xs font-medium tracking-wide text-gold-soft">
          Offering C
        </span>
      </div>
    </header>
  );
}