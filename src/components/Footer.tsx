import { CheckCircle2, Clock, Sparkles } from "lucide-react";
import BrandLogo from "@/components/BrandLogo";

export default function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-900 text-slate-300 dark:border-line dark:bg-[#050506] dark:text-ink-secondary">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <a href="/" className="flex items-center gap-2.5 group">
              <BrandLogo className="h-10 w-10 transition-transform group-hover:scale-105" />
              <span className="text-lg font-extrabold tracking-tight text-white">
                Ringkasnya
              </span>
            </a>
            <p className="mt-3 text-sm leading-relaxed text-slate-400">
              Platform ringkasan buku populer dunia dalam Bahasa Indonesia yang
              luwes, praktis, dan dilengkapi daftar aksi nyata agar ilmu dari
              buku benar-benar berdampak di hidup Anda.
            </p>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              Keunggulan Metode Kami
            </h3>
            <ul className="mt-3 space-y-2.5 text-sm text-slate-300">
              <li className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Mode Kilat (6–10 Menit) & Mode Mendalam (20–30 Menit)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Action Checklist interaktif di setiap buku</span>
              </li>
              <li className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Bahasa Indonesia mengalir, bukan terjemahan kaku</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              Ringkasan Terpopuler
            </h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-300">
              <li>
                <a
                  href="/buku/atomic-habits"
                  className="hover:text-emerald-400 transition-colors"
                >
                  Atomic Habits — James Clear
                </a>
              </li>
              <li>
                <a
                  href="/buku/psychology-of-money"
                  className="hover:text-emerald-400 transition-colors"
                >
                  The Psychology of Money — Morgan Housel
                </a>
              </li>
              <li>
                <a
                  href="/buku/sapiens"
                  className="hover:text-emerald-400 transition-colors"
                >
                  Sapiens — Yuval Noah Harari
                </a>
              </li>
              <li>
                <a
                  href="/buku/deep-work"
                  className="hover:text-emerald-400 transition-colors"
                >
                  Deep Work — Cal Newport
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-slate-800 dark:border-line pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 dark:text-ink-muted gap-2">
          <p>© {new Date().getFullYear()} Ringkasnya. Dibuat bertahap untuk pembelajar Indonesia.</p>
          <p>Baca Intinya, Praktikkan Ilmunya</p>
        </div>
      </div>
    </footer>
  );
}
