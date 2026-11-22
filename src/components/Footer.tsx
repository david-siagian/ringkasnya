import { Clock, Layers, Sparkles } from "lucide-react";
import BrandLogo from "@/components/BrandLogo";

export default function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-900 text-slate-300 dark:border-line dark:bg-[#050506] dark:text-ink-secondary">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div>
            <a href="/" className="flex items-center gap-2.5 group">
              <BrandLogo className="h-10 w-10 transition-transform group-hover:scale-105" />
              <span className="text-lg font-extrabold tracking-tight text-white">
                ringkasnya<span className="text-emerald-400 font-bold">.com</span>
              </span>
            </a>
            <p className="mt-3 text-sm leading-relaxed text-slate-400">
              Platform ringkasan buku nonfiksi pilihan—dari sains, sejarah,
              ekonomi, hingga psikologi—dalam Bahasa Indonesia yang mengalir dan
              mudah dipahami siapa saja.
            </p>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              Keunggulan Metode Kami
            </h3>
            <ul className="mt-3 space-y-2.5 text-sm text-slate-300">
              <li className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Mode Kilat (5–7 Menit) &amp; Mode Mendalam (15–20 Menit)</span>
              </li>
              <li className="flex items-center gap-2">
                <Layers className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Konsep Kunci ringkas di akhir setiap buku</span>
              </li>
              <li className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Bahasa Indonesia mengalir, bukan terjemahan kaku</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              Bacaan Pilihan
            </h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-300">
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
                  href="/buku/thinking-fast-and-slow"
                  className="hover:text-emerald-400 transition-colors"
                >
                  Thinking, Fast and Slow — Daniel Kahneman
                </a>
              </li>
              <li>
                <a
                  href="/buku/why-nations-fail"
                  className="hover:text-emerald-400 transition-colors"
                >
                  Why Nations Fail — Daron Acemoglu &amp; James Robinson
                </a>
              </li>
              <li>
                <a
                  href="/buku/the-selfish-gene"
                  className="hover:text-emerald-400 transition-colors"
                >
                  The Selfish Gene — Richard Dawkins
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-slate-800 dark:border-line pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 dark:text-ink-muted gap-2">
          <p>© {new Date().getFullYear()} ringkasnya.com. Dibuat bertahap untuk pembelajar Indonesia.</p>
          <p>Baca Intinya, Pahami Dunianya</p>
        </div>
      </div>
    </footer>
  );
}
