import Link from "next/link";
import { CheckCircle2, Clock, Sparkles } from "lucide-react";
import BrandLogo from "@/components/BrandLogo";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <Link href="/" className="flex items-center gap-2.5 group">
              <BrandLogo className="h-8 w-8 rounded-lg shadow-sm transition-transform group-hover:scale-105" />
              <span className="text-lg font-extrabold tracking-tight text-slate-900">
                ringkasnya<span className="text-emerald-600">.id</span>
              </span>
            </Link>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              Platform ringkasan buku populer dunia dalam Bahasa Indonesia yang
              luwes, praktis, dan dilengkapi daftar aksi nyata agar ilmu dari
              buku benar-benar berdampak di hidup Anda.
            </p>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Keunggulan Metode Kami
            </h3>
            <ul className="mt-3 space-y-2.5 text-sm text-slate-600">
              <li className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Mode Kilat (6–10 Menit) & Mode Mendalam (20–30 Menit)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Action Checklist interaktif di setiap buku</span>
              </li>
              <li className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Bahasa Indonesia mengalir, bukan terjemahan kaku</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Ringkasan Terpopuler
            </h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              <li>
                <Link
                  href="/buku/atomic-habits"
                  className="hover:text-emerald-600 transition-colors"
                >
                  Atomic Habits — James Clear
                </Link>
              </li>
              <li>
                <Link
                  href="/buku/psychology-of-money"
                  className="hover:text-emerald-600 transition-colors"
                >
                  The Psychology of Money — Morgan Housel
                </Link>
              </li>
              <li>
                <Link
                  href="/buku/filosofi-teras"
                  className="hover:text-emerald-600 transition-colors"
                >
                  Filosofi Teras — Henry Manampiring
                </Link>
              </li>
              <li>
                <Link
                  href="/buku/deep-work"
                  className="hover:text-emerald-600 transition-colors"
                >
                  Deep Work — Cal Newport
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-slate-200/80 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <p>© {new Date().getFullYear()} ringkasnya.id. Dibuat bertahap untuk pembelajar Indonesia.</p>
          <p>Fase 1 (MVP) — Baca Intinya, Praktikkan Ilmunya</p>
        </div>
      </div>
    </footer>
  );
}
