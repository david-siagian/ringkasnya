import { useState, useEffect, useRef } from "react";
import { Zap, Menu, X, BookOpen, Compass } from "lucide-react";
import { SmoothHashLink } from "@/components/SmoothNavigation";
import BrandLogo from "@/components/BrandLogo";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Close menu on Escape key press
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
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
          <a
            href="/buku/atomic-habits"
            className="inline-flex items-center gap-1.5 rounded-full bg-slate-900 px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-emerald-600 active:scale-95"
          >
            <Zap className="h-3.5 w-3.5 text-amber-400" />
            <span>Mulai Baca</span>
          </a>

          {/* Menu 3 Garis Horizontal (Hamburger Menu) */}
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setIsOpen((prev) => !prev)}
              aria-label={isOpen ? "Tutup menu navigasi" : "Buka menu navigasi"}
              aria-expanded={isOpen}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 shadow-xs transition-colors hover:bg-slate-50 hover:text-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 active:scale-95"
            >
              {isOpen ? (
                <X className="h-5 w-5 transition-transform duration-150 rotate-90" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
              <div
                role="menu"
                className="absolute right-0 mt-2 w-52 origin-top-right rounded-xl border border-slate-200/90 bg-white p-1.5 shadow-xl ring-1 ring-black/5 animate-in fade-in zoom-in-95 duration-150 z-50"
              >
                <div onClick={handleLinkClick}>
                  <SmoothHashLink
                    targetId="katalog"
                    className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-emerald-50 hover:text-emerald-700"
                  >
                    <BookOpen className="h-4 w-4 text-emerald-600" />
                    <span>Katalog Buku</span>
                  </SmoothHashLink>
                </div>
                <div onClick={handleLinkClick}>
                  <SmoothHashLink
                    targetId="metode"
                    className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-emerald-50 hover:text-emerald-700"
                  >
                    <Compass className="h-4 w-4 text-emerald-600" />
                    <span>Cara Kerja</span>
                  </SmoothHashLink>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
