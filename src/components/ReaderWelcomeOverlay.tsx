import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { BookSummary } from "@/types/book";
import { BookOpen, Sparkles, Zap } from "lucide-react";

interface ReaderWelcomeOverlayProps {
  open: boolean;
  runId: number;
  mode: "quick" | "deep";
  book: Pick<
    BookSummary,
    "title" | "author" | "coverGradient" | "quickTimeMinutes" | "readingTimeMinutes"
  >;
  onComplete: () => void;
}

const HOLD_DURATION_MS = 1050;
const AUTO_EXIT_DURATION_MS = 340;
const FAST_EXIT_DURATION_MS = 200;

/**
 * Overlay sambutan editorial singkat saat pembaca mengklik tombol "Mulai".
 * Tidak mengunci scroll body agar smooth-scroll ke Poin Inti 1 langsung mulus di belakangnya,
 * bisa dilewati instan lewat klik/tap/Esc, dan otomatis dinonaktifkan untuk prefers-reduced-motion.
 */
export function ReaderWelcomeOverlay({
  open,
  runId,
  mode,
  book,
  onComplete,
}: ReaderWelcomeOverlayProps) {
  const [mounted, setMounted] = useState(false);
  const [phase, setPhase] = useState<"entering" | "exiting">("entering");
  const isExitingRef = useRef(false);
  const holdTimerRef = useRef<number | undefined>(undefined);
  const exitTimerRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    setMounted(true);
  }, []);

  const clearTimers = useCallback(() => {
    window.clearTimeout(holdTimerRef.current);
    window.clearTimeout(exitTimerRef.current);
  }, []);

  const startExit = useCallback(
    (exitDurationMs: number) => {
      if (isExitingRef.current) return;
      isExitingRef.current = true;
      clearTimers();
      setPhase("exiting");
      exitTimerRef.current = window.setTimeout(() => {
        onComplete();
      }, exitDurationMs);
    },
    [clearTimers, onComplete]
  );

  useEffect(() => {
    if (!open) {
      clearTimers();
      isExitingRef.current = false;
      setPhase("entering");
      return;
    }

    if (
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
    ) {
      onComplete();
      return;
    }

    isExitingRef.current = false;
    setPhase("entering");
    clearTimers();

    holdTimerRef.current = window.setTimeout(() => {
      startExit(AUTO_EXIT_DURATION_MS);
    }, HOLD_DURATION_MS);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.key === "Escape" ||
        event.key === "Enter" ||
        event.key === " "
      ) {
        if (event.key === " ") {
          event.preventDefault();
        }
        startExit(FAST_EXIT_DURATION_MS);
      }
    };

    const handleWheel = () => {
      startExit(FAST_EXIT_DURATION_MS);
    };

    document.addEventListener("keydown", handleKeyDown);
    window.addEventListener("wheel", handleWheel, { passive: true, once: true });

    return () => {
      clearTimers();
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("wheel", handleWheel);
    };
  }, [open, runId, clearTimers, startExit, onComplete]);

  if (!mounted || !open) return null;

  const isExiting = phase === "exiting";
  const readingMinutes =
    mode === "quick" ? book.quickTimeMinutes : book.readingTimeMinutes;
  const welcomeSubtitle =
    mode === "quick"
      ? "Siapkan fokus sejenak—intisari paling penting siap dinikmati."
      : "Tarik napas sejenak—mari selami gagasan buku ini bab demi bab.";

  return createPortal(
    <div
      key={runId}
      role="status"
      aria-live="polite"
      aria-label={`Selamat membaca ringkasan ${book.title}`}
      onClick={() => startExit(FAST_EXIT_DURATION_MS)}
      className={`fixed inset-0 z-[75] flex cursor-pointer items-center justify-center bg-slate-950/45 p-5 backdrop-blur-md dark:bg-black/65 ${
        isExiting
          ? "pointer-events-none animate-reader-welcome-backdrop-out"
          : "animate-reader-welcome-backdrop-in"
      }`}
    >
      <div
        className={`relative w-full max-w-sm sm:max-w-md overflow-hidden rounded-3xl bg-slate-900 bg-gradient-to-br ${book.coverGradient} p-7 sm:p-8 text-center text-white shadow-[0_28px_70px_-14px_rgba(0,0,0,0.55)] ring-1 ring-white/20 ${
          isExiting
            ? "animate-reader-welcome-card-out"
            : "animate-reader-welcome-card-in"
        }`}
      >
        {/* Cahaya lembut latar belakang */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-16 inset-x-0 mx-auto h-44 w-64 rounded-full bg-white/15 blur-3xl animate-reader-welcome-spark"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-20 right-0 h-40 w-40 rounded-full bg-emerald-300/15 blur-3xl"
        />

        {/* Emblem buku terbuka beranimasi */}
        <div className="relative mx-auto flex h-16 w-16 items-center justify-center">
          <span
            aria-hidden="true"
            className="animate-reader-welcome-ripple absolute inset-0 rounded-2xl border border-white/35"
          />
          <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 shadow-inner ring-1 ring-white/25 backdrop-blur-sm">
            <svg
              aria-hidden="true"
              viewBox="0 0 48 48"
              fill="none"
              className="h-9 w-9 text-white"
            >
              {/* Cahaya kecil di atas lipatan buku */}
              <g className="animate-reader-welcome-spark">
                <path
                  d="M24 6.5V11M18 9.2L20 12.2M30 9.2L28 12.2"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  opacity="0.85"
                />
              </g>
              {/* Halaman kiri membuka */}
              <g
                className="animate-reader-welcome-page-left"
                style={{ transformOrigin: "24px 36px" }}
              >
                <path
                  d="M24 18C20.5 15.5 14.5 15 9.5 16.5C8.67 16.75 8 17.5 8 18.4V34.2C8 35.3 9 36.1 10.1 35.8C14.8 34.5 20.5 35 24 37.5V18Z"
                  fill="currentColor"
                  fillOpacity="0.22"
                  stroke="currentColor"
                  strokeWidth="2.1"
                  strokeLinejoin="round"
                />
                <path
                  d="M12.5 22.5H19.5M12.5 27H18.5"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  opacity="0.75"
                />
              </g>
              {/* Halaman kanan membuka */}
              <g
                className="animate-reader-welcome-page-right"
                style={{ transformOrigin: "24px 36px" }}
              >
                <path
                  d="M24 18C27.5 15.5 33.5 15 38.5 16.5C39.33 16.75 40 17.5 40 18.4V34.2C40 35.3 39 36.1 37.9 35.8C33.2 34.5 27.5 35 24 37.5V18Z"
                  fill="currentColor"
                  fillOpacity="0.28"
                  stroke="currentColor"
                  strokeWidth="2.1"
                  strokeLinejoin="round"
                />
                <path
                  d="M28.5 22.5H35.5M29.5 27H35.5"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  opacity="0.75"
                />
              </g>
            </svg>
          </div>
        </div>

        {/* Sapaan editorial */}
        <div
          className="animate-reader-welcome-item mt-5 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-white/95 ring-1 ring-white/20 backdrop-blur-sm"
          style={{ animationDelay: "70ms" }}
        >
          <Sparkles className="h-3 w-3 text-amber-200" />
          <span>Selamat Membaca</span>
        </div>

        <h2
          className="animate-reader-welcome-item mt-3.5 line-clamp-2 text-2xl font-extrabold tracking-tight text-white sm:text-3xl"
          style={{ animationDelay: "130ms" }}
        >
          {book.title}
        </h2>

        <p
          className="animate-reader-welcome-item mt-1 text-xs font-medium text-white/75 sm:text-sm"
          style={{ animationDelay: "175ms" }}
        >
          {book.author}
        </p>

        <p
          className="animate-reader-welcome-item mx-auto mt-3.5 max-w-xs text-xs leading-relaxed text-white/90 sm:text-sm"
          style={{ animationDelay: "220ms" }}
        >
          {welcomeSubtitle}
        </p>

        {/* Pill Mode & Estimasi Durasi */}
        <div
          className="animate-reader-welcome-item mt-5 flex items-center justify-center"
          style={{ animationDelay: "265ms" }}
        >
          <span className="inline-flex items-center gap-1.5 rounded-full bg-black/25 px-3.5 py-1.5 text-xs font-semibold text-white ring-1 ring-white/15 backdrop-blur-sm">
            {mode === "quick" ? (
              <Zap className="h-3.5 w-3.5 text-amber-300" />
            ) : (
              <BookOpen className="h-3.5 w-3.5 text-emerald-300" />
            )}
            <span>
              {mode === "quick" ? "Mode Kilat" : "Mode Mendalam"} •{" "}
              {readingMinutes} menit
            </span>
          </span>
        </div>

        <p
          className="animate-reader-welcome-item mt-4 text-[11px] font-medium text-white/55"
          style={{ animationDelay: "320ms" }}
        >
          Ketuk di mana saja untuk langsung membaca
        </p>

        {/* Garis progres halus di sisi bawah kartu */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-1 bg-white/15"
        >
          <div
            className="animate-reader-welcome-progress h-full origin-left bg-white/80"
            style={{ animationDuration: `${HOLD_DURATION_MS}ms` }}
          />
        </div>
      </div>
    </div>,
    document.body
  );
}
