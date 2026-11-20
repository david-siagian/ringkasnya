import { useState, useEffect } from "react";
import { Menu, X, BookOpen, Compass, ArrowRight } from "lucide-react";
import { SmoothHashLink } from "@/components/SmoothNavigation";
import BrandLogo from "@/components/BrandLogo";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  // Close menu on Escape key press & lock body scroll when drawer is open
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5 sm:px-6">
          <a href="/" className="flex items-center gap-2.5 group">
            <BrandLogo className="h-11 w-11 transition-transform group-hover:scale-105" />
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
          </a>

          <div className="flex items-center gap-3 sm:gap-4">
            {/* Tombol Menu 3 Garis Horizontal */}
            <button
              type="button"
              onClick={() => setIsOpen(true)}
              aria-label="Buka menu navigasi"
              aria-expanded={isOpen}
              aria-controls="mobile-slide-drawer"
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 shadow-xs transition-colors hover:bg-slate-50 hover:text-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 active:scale-95"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Backdrop Overlay */}
      <div
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
        className={`fixed inset-0 z-[60] bg-slate-900/40 backdrop-blur-[2px] transition-opacity duration-300 ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Full-Height Slide-Over Drawer (geser dari kanan ke kiri) */}
      <aside
        id="mobile-slide-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Menu Navigasi"
        aria-hidden={!isOpen}
        className={`fixed top-0 right-0 z-[70] flex h-dvh w-72 max-w-[85vw] flex-col border-l border-slate-200 bg-white shadow-2xl transition-transform duration-300 ease-out ${
          isOpen
            ? "translate-x-0 pointer-events-auto"
            : "translate-x-full pointer-events-none"
        }`}
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div className="flex items-center gap-2">
            <BrandLogo className="h-8 w-8" />
            <span className="text-base font-extrabold tracking-tight text-slate-900">
              ringkasnya<span className="text-emerald-600">.id</span>
            </span>
          </div>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            aria-label="Tutup menu navigasi"
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-1.5 px-3 py-5">
          <p className="px-3 pb-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Navigasi
          </p>
          <div onClick={handleLinkClick}>
            <a
              href="/katalog"
              className="flex w-full items-center justify-between rounded-xl px-3.5 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-emerald-50 hover:text-emerald-700"
            >
              <span className="flex items-center gap-3">
                <BookOpen className="h-4 w-4 text-emerald-600" />
                <span>Katalog Buku</span>
              </span>
              <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
            </a>
          </div>

          <div onClick={handleLinkClick}>
            <SmoothHashLink
              targetId="metode"
              className="flex w-full items-center justify-between rounded-xl px-3.5 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-emerald-50 hover:text-emerald-700"
            >
              <span className="flex items-center gap-3">
                <Compass className="h-4 w-4 text-emerald-600" />
                <span>Cara Kerja</span>
              </span>
              <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
            </SmoothHashLink>
          </div>
        </nav>

        <div className="border-t border-slate-100 p-4">
          <p className="text-center text-[11px] text-slate-400">
            Baca Intinya, Praktikkan Ilmunya
          </p>
        </div>
      </aside>
    </>
  );
}
