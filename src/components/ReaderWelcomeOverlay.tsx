import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { BookSummary } from "@/types/book";
import { BookOpen } from "lucide-react";

interface ReaderWelcomeOverlayProps {
  open: boolean;
  runId: number;
  book: Pick<
    BookSummary,
    "title" | "author" | "coverGradient" | "coverImage"
  >;
  onComplete: () => void;
}

const HOLD_DURATION_MS = 2500;
const AUTO_EXIT_DURATION_MS = 520;
const FAST_EXIT_DURATION_MS = 220;

/**
 * Overlay sambutan editorial singkat (~3 detik) saat pembaca mengklik tombol "Mulai".
 * Menampilkan sampul buku, judul, penulis, dan petunjuk ketuk dengan transisi fade in / fade out,
 * tanpa mengunci scroll body dan dapat dilewati instan lewat klik/tap/Esc.
 */
export function ReaderWelcomeOverlay({
  open,
  runId,
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

  return createPortal(
    <div
      key={runId}
      role="status"
      aria-live="polite"
      aria-label={`Selamat membaca ringkasan ${book.title}`}
      onClick={() => startExit(FAST_EXIT_DURATION_MS)}
      className={`fixed inset-0 z-[75] flex cursor-pointer items-center justify-center bg-slate-950/55 p-5 backdrop-blur-md dark:bg-black/70 ${
        isExiting
          ? "pointer-events-none animate-reader-welcome-backdrop-out"
          : "animate-reader-welcome-backdrop-in"
      }`}
    >
      <div
        className={`relative w-full max-w-xs sm:max-w-sm overflow-hidden rounded-3xl bg-slate-900 bg-gradient-to-br ${book.coverGradient} px-7 py-8 sm:px-8 sm:py-9 text-center text-white shadow-[0_28px_70px_-14px_rgba(0,0,0,0.6)] ring-1 ring-white/20 ${
          isExiting
            ? "animate-reader-welcome-card-out"
            : "animate-reader-welcome-card-in"
        }`}
      >
        {/* Cahaya lembut latar belakang */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-16 inset-x-0 mx-auto h-44 w-64 rounded-full bg-white/15 blur-3xl"
        />

        {/* Sampul Buku */}
        <div
          className="animate-reader-welcome-item relative mx-auto aspect-[3/4] w-36 sm:w-40 overflow-hidden rounded-2xl bg-black/25 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.55)] ring-1 ring-white/25"
          style={{ animationDelay: "60ms" }}
        >
          {book.coverImage ? (
            <img
              src={book.coverImage}
              alt={`Sampul buku ${book.title}`}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-black/20">
              <BookOpen className="h-10 w-10 text-white/80" />
            </div>
          )}
        </div>

        {/* Judul & Penulis */}
        <h2
          className="animate-reader-welcome-item mt-6 line-clamp-2 text-xl font-extrabold tracking-tight text-white sm:text-2xl"
          style={{ animationDelay: "140ms" }}
        >
          {book.title}
        </h2>

        <p
          className="animate-reader-welcome-item mt-1.5 text-xs font-medium text-white/80 sm:text-sm"
          style={{ animationDelay: "210ms" }}
        >
          {book.author}
        </p>

        <p
          className="animate-reader-welcome-item mt-6 text-[11px] font-medium text-white/60"
          style={{ animationDelay: "300ms" }}
        >
          Ketuk di mana saja untuk langsung membaca
        </p>
      </div>
    </div>,
    document.body
  );
}
