import Link from "next/link";
import { BookOpen, Sparkles, Zap } from "lucide-react";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm shadow-emerald-600/20 transition-transform group-hover:scale-105">
            <BookOpen className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-extrabold tracking-tight text-slate-900">
                ringkasnya<span className="text-emerald-600">.id</span>
              </span>
              <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-700 border border-emerald-200">
                MVP
              </span>
            </div>
            <span className="text-[11px] text-slate-500 hidden sm:inline">
              Baca Intinya, Praktikkan Ilmunya
            </span>
          </div>
        </Link>

        <nav className="flex items-center gap-3 sm:gap-6">
          <Link
            href="/#katalog"
            className="text-sm font-medium text-slate-600 transition-colors hover:text-emerald-600"
          >
            Katalog Buku
          </Link>
          <Link
            href="/#metode"
            className="hidden text-sm font-medium text-slate-600 transition-colors hover:text-emerald-600 sm:inline-block"
          >
            Cara Kerja
          </Link>
          <Link
            href="/buku/atomic-habits"
            className="inline-flex items-center gap-1.5 rounded-full bg-slate-900 px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-white shadow-sm transition-all hover:bg-emerald-600"
          >
            <Zap className="h-3.5 w-3.5 text-amber-400" />
            <span>Mulai Baca</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
