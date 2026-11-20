import { useState, useEffect } from "react";
import {
  Menu,
  X,
  BookOpen,
  ArrowRight,
  Search,
  Moon,
  Sun,
  LogIn,
} from "lucide-react";
import BrandLogo from "@/components/BrandLogo";
import { useTheme } from "@/hooks/useTheme";

const NAV_ITEMS = [
  { label: "Katalog Buku", href: "/katalog", icon: BookOpen },
] as const;

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { isDark, mounted, toggleTheme } = useTheme();

  // Close menu on Escape key press, resize to desktop, & lock body scroll when drawer is open
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    function handleResize() {
      if (window.innerWidth >= 768) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      window.addEventListener("resize", handleResize);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("resize", handleResize);
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  const iconButtonClass =
    "inline-flex h-9 w-9 items-center justify-center rounded-lg border border-line bg-surface text-ink-secondary shadow-xs transition-colors hover:bg-page hover:text-accent-strong focus:outline-none focus:ring-2 focus:ring-emerald-500/20 active:scale-95";

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-line/80 bg-surface/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3.5 sm:px-6">
          {/* Kiri: Brand Logo */}
          <a href="/" className="flex items-center gap-2.5 group shrink-0">
            <BrandLogo className="h-11 w-11 transition-transform group-hover:scale-105" />
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-extrabold tracking-tight text-ink">
                  ringkasnya<span className="text-accent-strong">.id</span>
                </span>
                <span className="rounded-full border border-accent-line bg-accent-soft px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-accent-text">
                  MVP
                </span>
              </div>
              <span className="text-[11px] text-ink-subtle hidden sm:inline">
                Baca Intinya, Praktikkan Ilmunya
              </span>
            </div>
          </a>

          {/* Tengah: Menu Navigasi Desktop */}
          <nav
            aria-label="Menu Navigasi Utama"
            className="hidden md:flex items-center gap-1"
          >
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.label}
                  href={item.href}
                  className="inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-semibold text-ink-secondary transition-colors hover:bg-accent-soft hover:text-accent-text"
                >
                  <Icon className="h-4 w-4 text-accent-strong" />
                  <span>{item.label}</span>
                </a>
              );
            })}
          </nav>

          {/* Kanan: Pencarian, Mode Gelap/Terang, Masuk/Daftar (Desktop), & Menu Mobile */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Tombol Pencarian Judul Buku */}
            <button
              type="button"
              aria-label="Cari judul buku"
              title="Cari judul buku"
              className={iconButtonClass}
            >
              <Search className="h-4 w-4" />
            </button>

            {/* Tombol Mode Gelap / Terang */}
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={isDark ? "Ubah ke mode terang" : "Ubah ke mode gelap"}
              aria-pressed={mounted ? isDark : undefined}
              title={isDark ? "Mode Terang" : "Mode Gelap"}
              className={iconButtonClass}
            >
              {isDark ? (
                <Sun className="h-4 w-4 text-amber-400" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </button>

            {/* Pemisah & Tombol Masuk/Daftar (Desktop) */}
            <div className="hidden md:flex items-center gap-2 pl-1">
              <span className="h-5 w-px bg-line" aria-hidden="true" />
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-3.5 py-2 text-sm font-semibold text-white shadow-xs transition-colors hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 active:scale-95"
              >
                <LogIn className="h-4 w-4" />
                <span>Masuk / Daftar</span>
              </button>
            </div>

            {/* Tombol Menu 3 Garis Horizontal (Mobile) */}
            <button
              type="button"
              onClick={() => setIsOpen(true)}
              aria-label="Buka menu navigasi"
              aria-expanded={isOpen}
              aria-controls="mobile-slide-drawer"
              className={`${iconButtonClass} md:hidden`}
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
        className={`fixed inset-0 z-[60] bg-slate-900/40 dark:bg-black/65 backdrop-blur-[2px] transition-opacity duration-300 md:hidden ${
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
        className={`fixed top-0 right-0 z-[70] flex h-dvh w-72 max-w-[85vw] flex-col border-l border-line bg-surface shadow-2xl transition-transform duration-300 ease-out md:hidden ${
          isOpen
            ? "translate-x-0 pointer-events-auto"
            : "translate-x-full pointer-events-none"
        }`}
      >
        <div className="flex items-center justify-between border-b border-line-subtle px-5 py-4">
          <div className="flex items-center gap-2">
            <BrandLogo className="h-8 w-8" />
            <span className="text-base font-extrabold tracking-tight text-ink">
              ringkasnya<span className="text-accent-strong">.id</span>
            </span>
          </div>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            aria-label="Tutup menu navigasi"
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-line text-ink-subtle transition-colors hover:bg-page hover:text-ink focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-1.5 px-3 py-5">
          <p className="px-3 pb-1 text-[11px] font-semibold uppercase tracking-wider text-ink-faint">
            Navigasi
          </p>
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} onClick={handleLinkClick}>
                <a
                  href={item.href}
                  className="flex w-full items-center justify-between rounded-xl px-3.5 py-3 text-sm font-semibold text-ink-secondary transition-colors hover:bg-accent-soft hover:text-accent-text"
                >
                  <span className="flex items-center gap-3">
                    <Icon className="h-4 w-4 text-accent-strong" />
                    <span>{item.label}</span>
                  </span>
                  <ArrowRight className="h-3.5 w-3.5 text-ink-faint" />
                </a>
              </div>
            );
          })}
        </nav>

        <div className="border-t border-line-subtle p-4 space-y-3">
          <button
            type="button"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-xs transition-colors hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 active:scale-95"
          >
            <LogIn className="h-4 w-4" />
            <span>Masuk / Daftar</span>
          </button>
          <p className="text-center text-[11px] text-ink-faint">
            Baca Intinya, Praktikkan Ilmunya
          </p>
        </div>
      </aside>
    </>
  );
}
