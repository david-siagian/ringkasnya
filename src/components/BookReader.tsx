import { useCallback, useState, useEffect, useRef } from "react";
import type { BookCatalogItem, BookSummary } from "@/types/book";
import type { ArticleTermEntry } from "@/types/article";
import { ARTICLE_TERMS } from "@/data/article-terms";
import { useBookmarks } from "@/hooks/useBookmarks";
import { useCompletedBooks } from "@/hooks/useCompletedBooks";
import {
  ensureProgressSynced,
  getCachedBookProgress,
  PROGRESS_UPDATED_EVENT,
  syncBookProgressUpdate,
} from "@/lib/progress-sync";
import type { UserBookProgressItem } from "@/lib/progress";
import {
  applyReaderTheme,
  clearReaderTheme,
  getGlobalTheme,
  getInitialReaderTheme,
  getStoredReaderTheme,
  type ReaderThemeMode,
} from "@/lib/theme";
import QuoteCardModal from "./QuoteCardModal";
import BookOpinionsSection from "./BookOpinionsSection";
import { ArticleTermPopover } from "./ArticleTermPopover";
import {
  BookCompletedModal,
  ConfirmUnmarkCompletedModal,
  ReaderToast,
} from "./BookReaderModals";
import {
  smoothScrollToElement,
  smoothScrollToY,
} from "./SmoothNavigation";
import {
  ConclusionSection,
  DeepReadingBottomBar,
  FONT_SCALES,
  IntroReadingBottomBar,
  IntroSection,
  KeyConceptsSection,
  QuotesSection,
  RelatedBooksSection,
  TakeawayCard,
  type CopyFeedback,
} from "./BookReaderSections";
import {
  ArrowLeft,
  Bookmark,
  BookOpen,
  Check,
  CheckCircle2,
  Clock,
  List,
  RotateCcw,
  Settings,
  X,
  Zap,
} from "lucide-react";

const READER_THEME_OPTIONS: ReadonlyArray<{
  value: ReaderThemeMode;
  label: string;
  swatchClass: string;
  checkClass: string;
}> = [
  {
    value: "light",
    label: "Putih",
    swatchClass: "bg-white border-slate-300",
    checkClass: "text-slate-800",
  },
  {
    value: "sepia",
    label: "Sepia",
    swatchClass: "bg-[#F4ECDD] border-[#C9B9A0]",
    checkClass: "text-[#3B2F25]",
  },
  {
    value: "dark",
    label: "Gelap",
    swatchClass: "bg-[#121214] border-zinc-600",
    checkClass: "text-zinc-100",
  },
];

interface BookReaderProps {
  book: BookSummary;
  relatedBooks: BookCatalogItem[];
}

interface ReaderNavState {
  mode: "quick" | "deep";
  startedQuick: boolean;
  deepStep: number;
  quickProgress?: number | null;
}

function parseProgressParam(raw: string | null): number | null {
  if (!raw) return null;
  const parsed = Number.parseInt(raw, 10);
  if (!Number.isFinite(parsed) || parsed <= 0) return null;
  return Math.min(99, parsed);
}

function parseReaderStateFromSearch(
  search: string,
  maxStep: number
): ReaderNavState {
  const params = new URLSearchParams(search);
  const modeParam = params.get("mode");
  if (modeParam === "deep") {
    const rawStep = params.get("step");
    let deepStep = 0;
    if (rawStep !== null) {
      const parsedStep = Number.parseInt(rawStep, 10);
      deepStep = Number.isFinite(parsedStep)
        ? Math.max(0, Math.min(maxStep, parsedStep))
        : 0;
    } else {
      const progressParam = parseProgressParam(params.get("progress"));
      if (progressParam !== null && maxStep > 0) {
        deepStep = Math.max(
          1,
          Math.min(maxStep, Math.round((progressParam / 100) * maxStep))
        );
      }
    }
    return { mode: "deep", startedQuick: false, deepStep, quickProgress: null };
  }

  const readParam = params.get("read");
  const startedQuick = readParam === "1";
  const quickProgress = startedQuick
    ? parseProgressParam(params.get("progress"))
    : null;
  return { mode: "quick", startedQuick, deepStep: 0, quickProgress };
}

function buildReaderSearch(
  state: ReaderNavState,
  currentSearch: string,
  maxStep: number
): string {
  const params = new URLSearchParams(currentSearch);
  params.delete("progress");
  if (state.mode === "deep") {
    const clampedStep = Math.max(0, Math.min(maxStep, state.deepStep));
    params.set("mode", "deep");
    params.delete("read");
    if (clampedStep > 0) {
      params.set("step", String(clampedStep));
    } else {
      params.delete("step");
    }
  } else if (state.startedQuick) {
    params.set("mode", "quick");
    params.set("read", "1");
    params.delete("step");
  } else {
    params.delete("mode");
    params.delete("read");
    params.delete("step");
  }

  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

/** Offset scroll untuk tiap Poin Inti: tinggi navbar + toolbar reader (keduanya sticky). */
const TAKEAWAY_SCROLL_MARGIN =
  "calc(var(--header-h) + var(--reader-toolbar-h) + 16px)";

/** Salin teks ke clipboard; fallback ke execCommand untuk browser/webview tanpa Clipboard API. */
async function copyTextToClipboard(text: string): Promise<boolean> {
  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // lanjut ke fallback
    }
  }

  try {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.top = "0";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    const copied = document.execCommand("copy");
    document.body.removeChild(textarea);
    return copied;
  } catch {
    return false;
  }
}

export default function BookReader({ book, relatedBooks }: BookReaderProps) {
  const [readMode, setReadMode] = useState<"quick" | "deep">("quick");
  const [hasStartedQuick, setHasStartedQuick] = useState(false);
  const [deepStep, setDeepStep] = useState(0);
  const [fontSize, setFontSize] = useState<"sm" | "base" | "lg">("base");
  const [readerTheme, setReaderTheme] = useState<ReaderThemeMode>("light");
  const [hasHydratedReaderTheme, setHasHydratedReaderTheme] = useState(false);
  const [isAppearanceOpen, setIsAppearanceOpen] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState<CopyFeedback>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeQuoteForCard, setActiveQuoteForCard] = useState<string | null>(
    null
  );
  const [isCompletionModalOpen, setIsCompletionModalOpen] = useState(false);
  const [isUnmarkConfirmOpen, setIsUnmarkConfirmOpen] = useState(false);
  const [unmarkToastMessage, setUnmarkToastMessage] = useState<string | null>(
    null
  );
  const [modeToast, setModeToast] = useState<"quick" | "deep" | null>(null);
  const [activeArticleTerm, setActiveArticleTerm] =
    useState<ArticleTermEntry | null>(null);
  const [isLeavingView, setIsLeavingView] = useState(false);
  const [isStartingSession, setIsStartingSession] = useState(false);
  const [savedProgress, setSavedProgress] =
    useState<UserBookProgressItem | null>(null);

  const copyTimerRef = useRef<number | undefined>(undefined);
  const viewExitTimerRef = useRef<number | undefined>(undefined);
  const unmarkToastTimerRef = useRef<number | undefined>(undefined);
  const modeToastTimerRef = useRef<number | undefined>(undefined);
  const toolbarRef = useRef<HTMLDivElement>(null);
  const appearanceMenuRef = useRef<HTMLDivElement>(null);
  const readingAreaRef = useRef<HTMLDivElement>(null);
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(
    null
  );
  const pendingScrollTargetRef = useRef<string | null>(null);
  const pendingScrollToReadingTopRef = useRef(false);
  const pendingInstantTopRef = useRef(false);
  const readerNavStateRef = useRef<ReaderNavState>({
    mode: "quick",
    startedQuick: false,
    deepStep: 0,
  });
  const pendingQuickStepRef = useRef<number | null>(null);
  const pendingQuickStepTimerRef = useRef<number | undefined>(undefined);
  const pendingQuickProgressRef = useRef<number | null>(null);

  const { isBookmarked, toggleBookmark } = useBookmarks();
  const { isCompleted, markCompleted, unmarkCompleted } = useCompletedBooks();
  const saved = isBookmarked(book.slug);
  const completed = isCompleted(book.slug);
  const unreadCandidates = relatedBooks.filter(
    (other) => other.slug !== book.slug && !isCompleted(other.slug)
  );
  const recommendedBooks = [
    ...unreadCandidates.filter((other) => other.category === book.category),
    ...unreadCandidates.filter((other) => other.category !== book.category),
  ].slice(0, 2);

  const totalTakeaways = book.keyTakeaways.length;
  const conclusionStep = totalTakeaways + 1;
  const clampedDeepStep = Math.max(0, Math.min(conclusionStep, deepStep));
  readerNavStateRef.current = {
    mode: readMode,
    startedQuick: hasStartedQuick,
    deepStep: clampedDeepStep,
  };
  const isIntroView =
    (readMode === "quick" && !hasStartedQuick) ||
    (readMode === "deep" && clampedDeepStep === 0);
  const showDeepBottomBar = readMode === "deep" && !isIntroView;

  // Sembunyikan navbar utama saat sesi baca dimulai agar tampilan reader lebih bersih
  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent("ringkasnya:navbar-visibility", {
        detail: { hidden: !isIntroView },
      })
    );
    return () => {
      window.dispatchEvent(
        new CustomEvent("ringkasnya:navbar-visibility", {
          detail: { hidden: false },
        })
      );
    };
  }, [isIntroView]);

  // Baca preferensi warna latar baca sekali saat mount di sisi klien
  useEffect(() => {
    setReaderTheme(getInitialReaderTheme());
    setHasHydratedReaderTheme(true);
  }, []);

  // Terapkan tema baca khusus saat berada di dalam mode baca; pulihkan tema global saat keluar
  useEffect(() => {
    if (!hasHydratedReaderTheme) return;
    if (!isIntroView) {
      if (!getStoredReaderTheme()) {
        const globalTheme = getGlobalTheme();
        if (globalTheme !== readerTheme) {
          setReaderTheme(globalTheme);
          applyReaderTheme(globalTheme, false);
          return;
        }
      }
      applyReaderTheme(readerTheme, false);
    } else {
      clearReaderTheme();
    }
  }, [isIntroView, readerTheme, hasHydratedReaderTheme]);

  // Pulihkan tema global ketika komponen reader di-unmount (pindah halaman)
  useEffect(() => {
    return () => {
      clearReaderTheme();
    };
  }, []);

  // Tutup popover tampilan baca saat keluar mode baca, klik di luar, atau tekan Escape
  useEffect(() => {
    if (isIntroView) {
      setIsAppearanceOpen(false);
    }
  }, [isIntroView]);

  useEffect(() => {
    if (!isAppearanceOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (
        appearanceMenuRef.current &&
        !appearanceMenuRef.current.contains(event.target as Node)
      ) {
        setIsAppearanceOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsAppearanceOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isAppearanceOpen]);

  const handleSelectReaderTheme = useCallback((nextTheme: ReaderThemeMode) => {
    setReaderTheme(nextTheme);
    applyReaderTheme(nextTheme, true);
  }, []);

  const readingProgress =
    readMode === "deep"
      ? Math.round((clampedDeepStep / Math.max(1, conclusionStep)) * 100)
      : hasStartedQuick
        ? scrollProgress
        : 0;

  // Sinkronkan progres baca (mode terakhir & persentase) ke D1 secara debounced saat sesi baca aktif
  useEffect(() => {
    if (isIntroView) return;
    const targetPercent = completed
      ? 100
      : readMode === "deep"
        ? Math.max(1, Math.min(99, readingProgress))
        : Math.max(5, Math.min(99, Math.round(scrollProgress)));

    const timer = window.setTimeout(() => {
      void syncBookProgressUpdate(book.slug, {
        lastMode: readMode,
        progressPercent: targetPercent,
      });
    }, 1500);

    return () => {
      window.clearTimeout(timer);
    };
  }, [book.slug, completed, isIntroView, readMode, readingProgress, scrollProgress]);

  const cancelViewExit = useCallback(() => {
    window.clearTimeout(viewExitTimerRef.current);
    setIsLeavingView(false);
  }, []);

  // Sinkronkan state awal dari URL query & reset modal saat berpindah buku
  useEffect(() => {
    const initial =
      typeof window !== "undefined"
        ? parseReaderStateFromSearch(window.location.search, conclusionStep)
        : { mode: "quick" as const, startedQuick: false, deepStep: 0 };

    cancelViewExit();
    setIsStartingSession(false);
    setReadMode(initial.mode);
    setHasStartedQuick(initial.startedQuick);
    setDeepStep(initial.deepStep);
    setScrollProgress(initial.quickProgress ?? 0);
    pendingQuickProgressRef.current = initial.quickProgress ?? null;
    setIsCompletionModalOpen(false);
    setIsUnmarkConfirmOpen(false);
    setUnmarkToastMessage(null);
    window.clearTimeout(unmarkToastTimerRef.current);
    setActiveArticleTerm(null);
    pendingQuickStepRef.current = null;
    window.clearTimeout(pendingQuickStepTimerRef.current);
  }, [book.slug, conclusionStep, cancelViewExit]);

  // Pulihkan state reader saat tombol Back/Forward browser ditekan
  useEffect(() => {
    const handlePopState = () => {
      const parsed = parseReaderStateFromSearch(
        window.location.search,
        conclusionStep
      );
      const current = readerNavStateRef.current;
      const hasNavChanged =
        parsed.mode !== current.mode ||
        parsed.startedQuick !== current.startedQuick ||
        parsed.deepStep !== current.deepStep;

      if (!hasNavChanged) return;

      cancelViewExit();
      setIsStartingSession(false);
      window.clearTimeout(pendingQuickStepTimerRef.current);
      pendingQuickStepRef.current = null;
      pendingScrollTargetRef.current = null;
      setReadMode(parsed.mode);
      setHasStartedQuick(parsed.startedQuick);
      setDeepStep(parsed.deepStep);
      setIsCompletionModalOpen(false);
      pendingInstantTopRef.current = true;
      pendingScrollToReadingTopRef.current = true;
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [conclusionStep, cancelViewExit]);

  // Sinkronkan tinggi toolbar sticky (bisa 2 baris di mobile) ke CSS var `--reader-toolbar-h`
  useEffect(() => {
    const root = document.documentElement;
    const toolbar = toolbarRef.current;
    if (!toolbar) {
      root.style.setProperty("--reader-toolbar-h", "0px");
      return () => {
        root.style.removeProperty("--reader-toolbar-h");
      };
    }

    const updateToolbarHeight = () => {
      root.style.setProperty("--reader-toolbar-h", `${toolbar.offsetHeight}px`);
    };

    updateToolbarHeight();
    const observer = new ResizeObserver(updateToolbarHeight);
    observer.observe(toolbar);
    return () => {
      observer.disconnect();
      root.style.removeProperty("--reader-toolbar-h");
    };
  }, [isIntroView]);

  useEffect(() => {
    return () => {
      window.clearTimeout(copyTimerRef.current);
      window.clearTimeout(pendingQuickStepTimerRef.current);
      window.clearTimeout(viewExitTimerRef.current);
      window.clearTimeout(unmarkToastTimerRef.current);
      window.clearTimeout(modeToastTimerRef.current);
    };
  }, []);

  // Muat progres baca tersimpan dari cache/D1 untuk Soft Resume Banner di halaman intro
  useEffect(() => {
    const refreshSavedProgress = () => {
      setSavedProgress(getCachedBookProgress(book.slug) ?? null);
    };

    refreshSavedProgress();
    void ensureProgressSynced().then(refreshSavedProgress);

    window.addEventListener(PROGRESS_UPDATED_EVENT, refreshSavedProgress);
    return () => {
      window.removeEventListener(PROGRESS_UPDATED_EVENT, refreshSavedProgress);
    };
  }, [book.slug]);

  // Hitung progres membaca berbasis scroll saat berada di Mode Kilat (setelah klik Mulai)
  useEffect(() => {
    if (readMode !== "quick" || !hasStartedQuick) return;

    let rafId = 0;
    let restoreTimerId = 0;

    const calculateProgress = () => {
      rafId = 0;
      const area = readingAreaRef.current;
      if (!area) return;

      const rect = area.getBoundingClientRect();
      const stickyBottom =
        toolbarRef.current?.getBoundingClientRect().bottom ?? 0;
      const startY = window.scrollY + rect.top - stickyBottom;
      const endY = window.scrollY + rect.bottom - window.innerHeight;

      if (endY <= startY) {
        setScrollProgress(window.scrollY >= startY ? 100 : 0);
        return;
      }

      const raw = ((window.scrollY - startY) / (endY - startY)) * 100;
      const clamped = Math.min(100, Math.max(0, Math.round(raw)));
      setScrollProgress(clamped);
    };

    const scheduleUpdate = () => {
      if (rafId) return;
      rafId = window.requestAnimationFrame(calculateProgress);
    };

    const pendingQuickProgress = pendingQuickProgressRef.current;
    if (pendingQuickProgress !== null) {
      pendingQuickProgressRef.current = null;
      restoreTimerId = window.setTimeout(() => {
        const area = readingAreaRef.current;
        if (!area) return;
        const rect = area.getBoundingClientRect();
        const stickyBottom =
          toolbarRef.current?.getBoundingClientRect().bottom ?? 0;
        const startY = window.scrollY + rect.top - stickyBottom;
        const endY = window.scrollY + rect.bottom - window.innerHeight;
        if (endY > startY) {
          const targetY =
            startY + (pendingQuickProgress / 100) * (endY - startY);
          smoothScrollToY(Math.max(0, targetY), 480);
        }
      }, 80);
    } else {
      calculateProgress();
    }

    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate, { passive: true });

    return () => {
      window.clearTimeout(restoreTimerId);
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, [readMode, hasStartedQuick, fontSize, book.slug]);

  // Jalankan scroll tertunda setelah perpindahan mode, halaman bab, atau navigasi Back/Forward
  useEffect(() => {
    if (
      readMode === "quick" &&
      hasStartedQuick &&
      pendingScrollTargetRef.current
    ) {
      const targetId = pendingScrollTargetRef.current;
      pendingScrollTargetRef.current = null;
      const timer = window.setTimeout(() => {
        smoothScrollToElement(targetId, 520);
      }, 60);
      return () => window.clearTimeout(timer);
    }

    if (pendingScrollToReadingTopRef.current) {
      const useInstantTop = pendingInstantTopRef.current;
      pendingScrollToReadingTopRef.current = false;
      pendingInstantTopRef.current = false;
      if (!readingAreaRef.current) return;

      if (useInstantTop) {
        const scrollToTop = () => {
          window.scrollTo({
            top: 0,
            behavior: "instant" as ScrollBehavior,
          });
        };
        scrollToTop();
        const rafId = window.requestAnimationFrame(scrollToTop);
        return () => window.cancelAnimationFrame(rafId);
      }

      smoothScrollToY(0, 420);
    }
  }, [readMode, hasStartedQuick, clampedDeepStep]);

  const handleCopyQuote = async (quote: string, index: number) => {
    const textToCopy = `"${quote}" — ${book.title} (${book.author}) via ringkasnya.com`;
    const copied = await copyTextToClipboard(textToCopy);
    setCopyFeedback({ index, status: copied ? "success" : "error" });
    window.clearTimeout(copyTimerRef.current);
    copyTimerRef.current = window.setTimeout(
      () => setCopyFeedback(null),
      copied ? 2000 : 3500
    );
  };

  const setPendingQuickStep = (step: number | null) => {
    window.clearTimeout(pendingQuickStepTimerRef.current);
    pendingQuickStepRef.current = step;
    if (step !== null) {
      pendingQuickStepTimerRef.current = window.setTimeout(() => {
        pendingQuickStepRef.current = null;
      }, 750);
    }
  };

  const detectActiveQuickStep = (): number => {
    if (pendingQuickStepRef.current !== null) {
      return pendingQuickStepRef.current;
    }

    const stickyBottom = toolbarRef.current?.getBoundingClientRect().bottom ?? 0;
    const anchorY =
      stickyBottom + Math.min(120, Math.max(64, window.innerHeight * 0.16));

    let detectedStep = 0;
    book.keyTakeaways.forEach((takeaway, idx) => {
      const el = document.getElementById(`poin-${takeaway.number}`);
      if (el && el.getBoundingClientRect().top <= anchorY) {
        detectedStep = idx + 1;
      }
    });

    const conclusionEl = document.getElementById("kesimpulan-akhir");
    if (
      (conclusionEl && conclusionEl.getBoundingClientRect().top <= anchorY) ||
      scrollProgress >= 95
    ) {
      detectedStep = conclusionStep;
    }

    return detectedStep;
  };

  const syncUrlHistory = useCallback(
    (nextState: ReaderNavState) => {
      if (typeof window === "undefined") return;
      const nextSearch = buildReaderSearch(
        nextState,
        window.location.search,
        conclusionStep
      );
      if (nextSearch === window.location.search) return;
      const nextUrl = `${window.location.pathname}${nextSearch}${window.location.hash}`;
      window.history.pushState(null, "", nextUrl);
    },
    [conclusionStep]
  );

  const goToDeepStep = useCallback(
    (nextStep: number, scrollAfter = true) => {
      cancelViewExit();
      const target = Math.max(0, Math.min(conclusionStep, nextStep));
      setDeepStep(target);
      if (scrollAfter) {
        pendingScrollToReadingTopRef.current = true;
      }
      syncUrlHistory({ mode: "deep", startedQuick: false, deepStep: target });
    },
    [cancelViewExit, conclusionStep, syncUrlHistory]
  );

  const transitionAfterFadeOut = useCallback(
    (onReady: () => void, fadeOutMs = 200) => {
      if (isLeavingView) return;

      const enterNextView = () => {
        // Posisikan scroll instan ke puncak halaman saat layar masih opacity-0 agar tidak
        // terlihat menggulir dan tidak meleset ketika Banner Header di-unmount saat sesi baca dimulai
        window.scrollTo({
          top: 0,
          behavior: "instant" as ScrollBehavior,
        });
        onReady();
      };

      if (
        typeof window !== "undefined" &&
        window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
      ) {
        enterNextView();
        return;
      }

      setIsLeavingView(true);
      window.clearTimeout(viewExitTimerRef.current);
      viewExitTimerRef.current = window.setTimeout(() => {
        setIsLeavingView(false);
        enterNextView();
      }, fadeOutMs);
    },
    [isLeavingView]
  );

  const transitionToDeepStep = useCallback(
    (nextStep: number) => {
      const target = Math.max(0, Math.min(conclusionStep, nextStep));
      if (target === clampedDeepStep) return;
      transitionAfterFadeOut(() => {
        setIsStartingSession(false);
        goToDeepStep(target, false);
      });
    },
    [clampedDeepStep, conclusionStep, goToDeepStep, transitionAfterFadeOut]
  );

  // Navigasi keyboard (ArrowLeft / ArrowRight) di Mode Mendalam
  useEffect(() => {
    if (!showDeepBottomBar) return;
    const isAnyModalOpen =
      isCompletionModalOpen ||
      isUnmarkConfirmOpen ||
      Boolean(activeQuoteForCard) ||
      Boolean(activeArticleTerm);
    if (isAnyModalOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) {
        return;
      }
      const target = event.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT" ||
          target.isContentEditable)
      ) {
        return;
      }

      if (event.key === "ArrowLeft" && clampedDeepStep > 0) {
        event.preventDefault();
        transitionToDeepStep(clampedDeepStep - 1);
      } else if (
        event.key === "ArrowRight" &&
        clampedDeepStep < conclusionStep
      ) {
        event.preventDefault();
        transitionToDeepStep(clampedDeepStep + 1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    showDeepBottomBar,
    isCompletionModalOpen,
    isUnmarkConfirmOpen,
    activeQuoteForCard,
    activeArticleTerm,
    clampedDeepStep,
    conclusionStep,
    transitionToDeepStep,
  ]);

  const handleDeepTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    if (event.touches.length !== 1) {
      touchStartRef.current = null;
      return;
    }
    const touch = event.touches[0];
    touchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now(),
    };
  };

  const handleDeepTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
    const start = touchStartRef.current;
    touchStartRef.current = null;
    if (!start || event.changedTouches.length !== 1) return;
    if (window.getSelection()?.toString()) return;

    const touch = event.changedTouches[0];
    const dx = touch.clientX - start.x;
    const dy = touch.clientY - start.y;
    const dt = Date.now() - start.time;

    if (dt < 600 && Math.abs(dx) > 64 && Math.abs(dx) > Math.abs(dy) * 1.5) {
      if (dx < 0 && clampedDeepStep < conclusionStep) {
        transitionToDeepStep(clampedDeepStep + 1);
      } else if (dx > 0 && clampedDeepStep > 0) {
        transitionToDeepStep(clampedDeepStep - 1);
      }
    }
  };

  const handleReadTakeawayDeep = (step: number) => {
    setIsStartingSession(false);
    setPendingQuickStep(null);
    goToDeepStep(step);
    setReadMode("deep");
  };

  const activeTakeaway =
    clampedDeepStep >= 1 && clampedDeepStep <= totalTakeaways
      ? book.keyTakeaways[clampedDeepStep - 1]
      : null;

  const backToQuickIntro = () => {
    cancelViewExit();
    setIsStartingSession(false);
    setPendingQuickStep(null);
    setHasStartedQuick(false);
    pendingScrollToReadingTopRef.current = true;
    syncUrlHistory({
      mode: "quick",
      startedQuick: false,
      deepStep: 0,
    });
  };

  const handleExitReadingMode = useCallback(() => {
    if (readMode === "deep") {
      transitionToDeepStep(0);
      return;
    }

    transitionAfterFadeOut(() => {
      setIsStartingSession(false);
      setPendingQuickStep(null);
      setHasStartedQuick(false);
      syncUrlHistory({
        mode: "quick",
        startedQuick: false,
        deepStep: 0,
      });
    });
  }, [readMode, syncUrlHistory, transitionAfterFadeOut, transitionToDeepStep]);

  const handleFinishReading = useCallback(() => {
    markCompleted(book.slug);
    transitionAfterFadeOut(() => {
      setIsStartingSession(false);
      setPendingQuickStep(null);
      setReadMode("quick");
      setHasStartedQuick(false);
      setDeepStep(0);
      setIsCompletionModalOpen(true);
      syncUrlHistory({
        mode: "quick",
        startedQuick: false,
        deepStep: 0,
      });
    });
  }, [book.slug, markCompleted, syncUrlHistory, transitionAfterFadeOut]);

  const handleModeChange = (nextMode: "quick" | "deep") => {
    if (nextMode === readMode) return;
    cancelViewExit();
    setIsStartingSession(false);

    setModeToast(nextMode);
    window.clearTimeout(modeToastTimerRef.current);
    modeToastTimerRef.current = window.setTimeout(() => {
      setModeToast(null);
    }, 2200);

    if (nextMode === "quick") {
      let nextStartedQuick = false;
      if (activeTakeaway) {
        nextStartedQuick = true;
        pendingScrollTargetRef.current = `poin-${activeTakeaway.number}`;
        setPendingQuickStep(clampedDeepStep);
      } else if (clampedDeepStep === conclusionStep) {
        nextStartedQuick = true;
        pendingScrollTargetRef.current = "kesimpulan-akhir";
        setPendingQuickStep(conclusionStep);
      } else {
        setPendingQuickStep(0);
      }
      setHasStartedQuick(nextStartedQuick);
      setReadMode("quick");
      syncUrlHistory({
        mode: "quick",
        startedQuick: nextStartedQuick,
        deepStep: 0,
      });
      return;
    }

    const targetStep = hasStartedQuick ? detectActiveQuickStep() : 0;
    setPendingQuickStep(null);
    setDeepStep(targetStep);
    if (targetStep > 0) {
      pendingScrollToReadingTopRef.current = true;
    }
    setReadMode("deep");
    syncUrlHistory({ mode: "deep", startedQuick: false, deepStep: targetStep });
  };

  const fs = FONT_SCALES[fontSize];

  const prevTakeaway =
    clampedDeepStep >= 2 && clampedDeepStep <= conclusionStep
      ? book.keyTakeaways[clampedDeepStep - 2] ?? null
      : null;
  const nextTakeaway =
    clampedDeepStep < totalTakeaways
      ? book.keyTakeaways[clampedDeepStep] ?? null
      : null;

  const prevLabel = prevTakeaway
    ? `Poin Inti ${prevTakeaway.number}`
    : "Pengantar";
  const prevTitle = prevTakeaway?.title ?? null;

  const nextLabel =
    clampedDeepStep === conclusionStep
      ? "Selesai"
      : nextTakeaway
        ? `Poin Inti ${nextTakeaway.number}`
        : "Kesimpulan Akhir";
  const nextTitle = nextTakeaway?.title ?? null;

  const explorationTabsSection = (
    <div className="mt-8 space-y-6">
      <QuotesSection
        quotes={book.quotes}
        copyFeedback={copyFeedback}
        onCopyQuote={handleCopyQuote}
        onOpenQuoteCard={(quote) => setActiveQuoteForCard(quote)}
        fs={fs}
        isChildModalOpen={Boolean(activeQuoteForCard)}
      />
      <BookOpinionsSection bookSlug={book.slug} />
    </div>
  );

  const resumeCandidate =
    isIntroView &&
    !completed &&
    savedProgress &&
    savedProgress.progressPercent > 0 &&
    savedProgress.progressPercent < 100
      ? savedProgress
      : null;

  const resumeDeepStep =
    resumeCandidate && resumeCandidate.lastMode === "deep" && conclusionStep > 0
      ? Math.max(
          1,
          Math.min(
            conclusionStep,
            Math.round((resumeCandidate.progressPercent / 100) * conclusionStep)
          )
        )
      : 1;

  const handleResumeFromBanner = useCallback(() => {
    if (!resumeCandidate) return;
    cancelViewExit();
    setIsStartingSession(true);

    if (resumeCandidate.lastMode === "deep") {
      setReadMode("deep");
      setHasStartedQuick(false);
      setDeepStep(resumeDeepStep);
      pendingScrollToReadingTopRef.current = true;
      syncUrlHistory({
        mode: "deep",
        startedQuick: false,
        deepStep: resumeDeepStep,
      });
      return;
    }

    pendingQuickProgressRef.current = resumeCandidate.progressPercent;
    setScrollProgress(resumeCandidate.progressPercent);
    setReadMode("quick");
    setHasStartedQuick(true);
    syncUrlHistory({ mode: "quick", startedQuick: true, deepStep: 0 });
  }, [resumeCandidate, resumeDeepStep, cancelViewExit, syncUrlHistory]);

  return (
    <div className="flex min-h-screen flex-col bg-page">
      {/* Banner Header Buku (tampil di halaman Pengantar saja agar sesi baca bersih) */}
      {isIntroView && (
        <div
          className={`bg-slate-900 bg-gradient-to-br ${book.coverGradient} text-white`}
        >
        <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
          <div className="flex items-start justify-between gap-2.5">
            <a
              href="/katalog"
              className="inline-flex items-center gap-1.5 rounded-full bg-black/20 px-3.5 py-1.5 text-xs font-medium text-white/90 backdrop-blur-sm transition hover:bg-black/30"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Kembali ke Katalog
            </a>

            <div className="ml-auto flex flex-col items-end gap-2">
              <button
                type="button"
                onClick={() => toggleBookmark(book.slug)}
                aria-pressed={saved}
                className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold backdrop-blur-sm transition ${
                  saved
                    ? "bg-emerald-500 text-white shadow-sm hover:bg-emerald-600"
                    : "bg-black/20 text-white/90 hover:bg-black/30"
                }`}
              >
                <Bookmark
                  className={`h-3.5 w-3.5 ${saved ? "fill-current" : ""}`}
                />
                <span>{saved ? "Tersimpan" : "Simpan Buku"}</span>
              </button>

              {completed && (
                <button
                  type="button"
                  onClick={() => setIsUnmarkConfirmOpen(true)}
                  title="Klik untuk hapus tanda selesai dibaca"
                  aria-label="Hapus tanda selesai dibaca"
                  className="group inline-flex items-center gap-1.5 rounded-full bg-emerald-500/90 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm backdrop-blur-sm transition hover:bg-emerald-600 active:scale-[0.98]"
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>Selesai Dibaca</span>
                  <X className="h-3.5 w-3.5 opacity-80 transition group-hover:opacity-100" />
                </button>
              )}
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-8">
            {book.coverImage && (
              <div className="relative aspect-[3/4] w-36 shrink-0 overflow-hidden rounded-2xl bg-black/20 shadow-[0_18px_36px_-8px_rgba(0,0,0,0.45)] ring-1 ring-white/25 sm:w-44">
                <img
                  src={book.coverImage}
                  alt={`Ilustrasi sampul buku ${book.title}`}
                  className="h-full w-full object-cover"
                />
              </div>
            )}

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur-sm">
                  {book.category}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-black/25 px-3 py-1 text-xs font-medium">
                  <Zap className="h-3.5 w-3.5 text-amber-300" />
                  Mode Kilat: {book.quickTimeMinutes} Mnt
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-black/25 px-3 py-1 text-xs font-medium">
                  <Clock className="h-3.5 w-3.5" />
                  Mode Mendalam: {book.readingTimeMinutes} Mnt
                </span>
              </div>

              <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl">
                {book.title}
              </h1>
              {book.originalTitle && (
                <p className="mt-1 text-sm text-white/80 italic">
                  {book.originalTitle}
                </p>
              )}
              <p className="mt-2 text-base font-semibold text-white/95">
                {book.author} ({book.year})
              </p>

              <p className="mt-4 max-w-2xl text-sm sm:text-base leading-relaxed text-white/90">
                {book.tagline}
              </p>
            </div>
          </div>
        </div>
      </div>
      )}

      {/* Sticky Reader Toolbar (Mode Baca & Ukuran Huruf) — tampil setelah masuk poin bacaan */}
      {!isIntroView && (
      <div
        ref={toolbarRef}
        style={{ top: "var(--header-h)" }}
        className="sticky z-40 border-b border-line bg-surface/95 shadow-sm backdrop-blur-md"
      >
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-2.5 px-4 py-2.5 sm:px-6 sm:py-3">
          {/* Kiri-Tengah: Tombol Keluar Mode Baca, Progres, & Judul Buku */}
          <div className="flex min-w-0 flex-1 items-center gap-2.5">
            <button
              type="button"
              onClick={handleExitReadingMode}
              disabled={isLeavingView}
              aria-label="Keluar dari mode baca"
              title="Kembali ke halaman pengantar"
              className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-line bg-surface text-ink-muted transition hover:border-accent-line hover:bg-page hover:text-ink active:scale-[0.98] disabled:opacity-50"
            >
              <X className="h-4 w-4" />
            </button>

            <span
              className="shrink-0 min-w-[2.25rem] text-xs font-semibold tabular-nums text-ink-muted"
              title="Progres membaca"
            >
              {readingProgress}%
            </span>

            <span
              className="min-w-0 truncate text-sm font-bold text-ink sm:text-base"
              title={book.title}
            >
              {book.title}
            </span>
          </div>

          {/* Kanan: Toggle Mode (1 ikon), Pengaturan Tampilan (Gerigi), & Bookmark (paling kanan) */}
          <div className="flex shrink-0 items-center justify-end gap-2">
            <button
              type="button"
              onClick={() =>
                handleModeChange(readMode === "quick" ? "deep" : "quick")
              }
              aria-label={
                readMode === "quick"
                  ? `Mode Kilat (${book.quickTimeMinutes} mnt) — Klik untuk pindah ke Mode Mendalam`
                  : `Mode Mendalam (${book.readingTimeMinutes} mnt) — Klik untuk pindah ke Mode Kilat`
              }
              title={
                readMode === "quick"
                  ? `Mode Kilat (${book.quickTimeMinutes} mnt) • Klik untuk Mode Mendalam`
                  : `Mode Mendalam (${book.readingTimeMinutes} mnt) • Klik untuk Mode Kilat`
              }
              className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border transition active:scale-[0.98] ${
                readMode === "quick"
                  ? "border-amber-500/40 bg-amber-500/15 text-amber-500 hover:bg-amber-500/20"
                  : "border-accent-line bg-accent-soft text-accent-strong hover:bg-accent-soft/80"
              }`}
            >
              {readMode === "quick" ? (
                <Zap className="h-4 w-4" />
              ) : (
                <BookOpen className="h-4 w-4" />
              )}
            </button>

            <div ref={appearanceMenuRef} className="sm:relative">
              <button
                type="button"
                onClick={() => setIsAppearanceOpen((prev) => !prev)}
                aria-expanded={isAppearanceOpen}
                aria-haspopup="dialog"
                aria-label="Pengaturan tampilan baca"
                title="Ukuran huruf & warna latar baca"
                className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border transition active:scale-[0.98] ${
                  isAppearanceOpen
                    ? "border-accent-strong bg-accent-soft text-accent-text"
                    : "border-line bg-surface text-ink-muted hover:bg-page hover:text-ink"
                }`}
              >
                <Settings className="h-4 w-4" />
              </button>

              {isAppearanceOpen && (
                <div
                  role="dialog"
                  aria-label="Pengaturan tampilan baca"
                  className="absolute inset-x-4 top-full z-50 mt-2 rounded-2xl border border-line bg-surface p-4 shadow-xl sm:inset-x-auto sm:right-0 sm:w-64"
                >
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-ink-subtle">
                      Ukuran Huruf
                    </p>
                    <div className="mt-2 grid grid-cols-3 gap-1.5">
                      {(
                        [
                          { value: "sm", label: "A-" },
                          { value: "base", label: "A" },
                          { value: "lg", label: "A+" },
                        ] as const
                      ).map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => setFontSize(opt.value)}
                          aria-pressed={fontSize === opt.value}
                          className={`rounded-xl border py-1.5 text-xs font-semibold transition ${
                            fontSize === opt.value
                              ? "border-accent-strong bg-accent-soft text-accent-text"
                              : "border-line bg-page/50 text-ink-muted hover:bg-page hover:text-ink"
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 border-t border-line-subtle pt-3.5">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-ink-subtle">
                      Warna Latar
                    </p>
                    <div className="mt-2 grid grid-cols-3 gap-2">
                      {READER_THEME_OPTIONS.map((opt) => {
                        const isActive = readerTheme === opt.value;
                        return (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => handleSelectReaderTheme(opt.value)}
                            aria-pressed={isActive}
                            className={`flex flex-col items-center gap-1.5 rounded-xl border px-2 py-2.5 text-xs font-semibold transition ${
                              isActive
                                ? "border-accent-strong bg-accent-soft text-accent-text"
                                : "border-line bg-page/50 text-ink-muted hover:bg-page hover:text-ink"
                            }`}
                          >
                            <span
                              className={`flex h-7 w-7 items-center justify-center rounded-full border shadow-sm ${opt.swatchClass} ${
                                isActive
                                  ? "ring-2 ring-accent-strong ring-offset-1 ring-offset-[rgb(var(--color-bg-surface))]"
                                  : ""
                              }`}
                            >
                              {isActive && (
                                <Check
                                  className={`h-3.5 w-3.5 stroke-[2.5] ${opt.checkClass}`}
                                />
                              )}
                            </span>
                            <span>{opt.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => toggleBookmark(book.slug)}
              aria-pressed={saved}
              aria-label={saved ? "Hapus dari tersimpan" : "Simpan buku"}
              title={saved ? "Tersimpan" : "Simpan buku"}
              className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border transition active:scale-[0.98] ${
                saved
                  ? "border-emerald-500/40 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                  : "border-line bg-surface text-ink-muted hover:bg-page hover:text-ink"
              }`}
            >
              <Bookmark className={`h-4 w-4 ${saved ? "fill-current" : ""}`} />
            </button>
          </div>
        </div>

        {/* Reading Progress Bar */}
        <div
          role="progressbar"
          aria-label="Progres membaca"
          aria-valuenow={readingProgress}
          aria-valuemin={0}
          aria-valuemax={100}
          className="h-[3px] w-full bg-surface-subtle"
        >
          <div
            className={`h-full transition-[width] duration-200 ease-out ${
              readMode === "quick" ? "bg-amber-500" : "bg-accent-strong"
            }`}
            style={{ width: `${readingProgress}%` }}
          />
        </div>
      </div>
      )}

      {/* Konten Utama Ringkasan */}
      <main
        className={`mx-auto w-full max-w-4xl flex-1 px-4 pt-8 sm:px-6 ${
          showDeepBottomBar || isIntroView ? "pb-28" : "pb-20"
        }`}
      >
        <div ref={readingAreaRef}>
          {isIntroView ? (
            <div
              className={`transition-opacity duration-[380ms] ease-out ${
                isLeavingView ? "pointer-events-none opacity-0" : "opacity-100"
              }`}
            >
              {resumeCandidate && (
                <div className="mb-6 flex items-center justify-between gap-3 rounded-2xl border border-accent-line bg-accent-soft/60 px-3.5 py-3 shadow-sm sm:px-4 sm:py-3.5">
                  <div className="flex min-w-0 flex-1 items-center gap-2.5 sm:gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-surface text-accent-text shadow-xs sm:h-9 sm:w-9">
                      {resumeCandidate.lastMode === "deep" ? (
                        <BookOpen className="h-4 w-4" />
                      ) : (
                        <Zap className="h-4 w-4 text-amber-500" />
                      )}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-bold text-ink sm:text-sm">
                        Lanjutkan bacaan ({resumeCandidate.progressPercent}%)
                      </p>
                      <p className="truncate text-[11px] text-ink-muted sm:text-xs">
                        {resumeCandidate.lastMode === "deep"
                          ? resumeDeepStep === conclusionStep
                            ? "Mode Mendalam • Kesimpulan Akhir"
                            : `Mode Mendalam • Poin Inti ${resumeDeepStep}`
                          : "Mode Kilat"}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleResumeFromBanner}
                    className="shrink-0 whitespace-nowrap rounded-xl bg-emerald-600 px-3 py-2 text-xs font-bold text-white shadow-xs transition hover:bg-emerald-700 active:scale-[0.98] sm:px-3.5"
                  >
                    Lanjut Baca
                  </button>
                </div>
              )}
              <IntroSection
                book={book}
                fs={fs}
                mode={readMode}
                completed={completed}
                articleTerms={ARTICLE_TERMS}
                onSelectArticleTerm={setActiveArticleTerm}
                onSelectTakeaway={(num) => {
                  cancelViewExit();
                  setIsStartingSession(false);
                  if (readMode === "deep") {
                    goToDeepStep(num);
                    return;
                  }
                  const idx = book.keyTakeaways.findIndex(
                    (t) => t.number === num
                  );
                  if (idx >= 0) setPendingQuickStep(idx + 1);
                  pendingScrollTargetRef.current = `poin-${num}`;
                  setHasStartedQuick(true);
                  syncUrlHistory({
                    mode: "quick",
                    startedQuick: true,
                    deepStep: 0,
                  });
                }}
              />
              {completed && (
                <div
                  id="eksplorasi-buku"
                  style={{
                    scrollMarginTop: "calc(var(--header-h, 73px) + 16px)",
                  }}
                >
                  {explorationTabsSection}
                  <RelatedBooksSection relatedBooks={recommendedBooks} />
                </div>
              )}
            </div>
          ) : readMode === "quick" ? (
            /* MODE KILAT: Halaman Baca Vertikal Penuh (setelah Mulai) */
            <div
              className={`transition-opacity duration-200 ease-out ${
                isLeavingView ? "pointer-events-none opacity-0" : "opacity-100"
              }`}
            >
              <div
                className={
                  isStartingSession
                    ? "animate-reader-start-fade-in"
                    : "animate-reader-fade-in"
                }
                key="quick-reading-view"
              >
                {/* Bar Navigasi Atas Mode Kilat */}
                <div className="relative z-20 mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-line bg-surface px-4 py-2.5 shadow-sm">
                  <button
                    type="button"
                    onClick={backToQuickIntro}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink-muted transition hover:text-accent-text"
                  >
                    <List className="h-4 w-4" />
                    <span>Daftar Poin</span>
                  </button>

                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-600 dark:text-amber-400">
                    <Zap className="h-3.5 w-3.5" />
                    <span>Mode Kilat • {book.keyTakeaways.length} Poin Inti</span>
                  </span>
                </div>

                <div className="space-y-6">
                  {book.keyTakeaways.map((takeaway, idx) => (
                    <TakeawayCard
                      key={takeaway.number}
                      takeaway={takeaway}
                      fs={fs}
                      showDeepContent={false}
                      scrollMarginTop={TAKEAWAY_SCROLL_MARGIN}
                      onReadDeep={() => handleReadTakeawayDeep(idx + 1)}
                      articleTerms={ARTICLE_TERMS}
                      onSelectArticleTerm={setActiveArticleTerm}
                    />
                  ))}
                </div>

                <div className="mt-8 space-y-6">
                  <ConclusionSection
                    conclusion={book.conclusion}
                    fs={fs}
                    scrollMarginTop={TAKEAWAY_SCROLL_MARGIN}
                    articleTerms={ARTICLE_TERMS}
                    onSelectArticleTerm={setActiveArticleTerm}
                  />
                  {book.keyConcepts.length > 0 && (
                    <KeyConceptsSection
                      keyConcepts={book.keyConcepts}
                      fs={fs}
                      articleTerms={ARTICLE_TERMS}
                      onSelectArticleTerm={setActiveArticleTerm}
                    />
                  )}
                </div>

                <div className="mt-6 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={backToQuickIntro}
                    className="inline-flex items-center gap-2 rounded-xl border border-line bg-surface px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-ink shadow-sm transition hover:border-accent-line hover:bg-page active:scale-[0.98]"
                  >
                    <RotateCcw className="h-4 w-4 shrink-0 text-ink-muted" />
                    <span>Pengantar</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleFinishReading}
                    className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-sm shadow-emerald-600/20 transition hover:bg-emerald-700 active:scale-[0.98]"
                  >
                    <span>Selesai</span>
                    <CheckCircle2 className="h-4 w-4 shrink-0" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* MODE MENDALAM: Alur Halaman Per Halaman (Poin Inti 1..N -> Kesimpulan Akhir) */
            <div
              onTouchStart={handleDeepTouchStart}
              onTouchEnd={handleDeepTouchEnd}
              className={`transition-opacity duration-200 ease-out ${
                isLeavingView ? "pointer-events-none opacity-0" : "opacity-100"
              }`}
            >
              <div
                className={
                  isStartingSession
                    ? "animate-reader-start-fade-in"
                    : "animate-reader-fade-in"
                }
                key={`deep-step-${clampedDeepStep}`}
              >
                {/* Konten Halaman Aktif */}
                {activeTakeaway ? (
                  <TakeawayCard
                    takeaway={activeTakeaway}
                    fs={fs}
                    showDeepContent={true}
                    articleTerms={ARTICLE_TERMS}
                    onSelectArticleTerm={setActiveArticleTerm}
                  />
                ) : (
                  <div className="space-y-6">
                    <ConclusionSection
                      conclusion={book.conclusion}
                      fs={fs}
                      articleTerms={ARTICLE_TERMS}
                      onSelectArticleTerm={setActiveArticleTerm}
                    />
                    {book.keyConcepts.length > 0 && (
                      <KeyConceptsSection
                        keyConcepts={book.keyConcepts}
                        fs={fs}
                        articleTerms={ARTICLE_TERMS}
                        onSelectArticleTerm={setActiveArticleTerm}
                      />
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      {isIntroView && (
        <IntroReadingBottomBar
          quickTimeMinutes={book.quickTimeMinutes}
          readingTimeMinutes={book.readingTimeMinutes}
          disabled={isLeavingView}
          onStartQuickReading={() => {
            transitionAfterFadeOut(() => {
              setIsStartingSession(true);
              setReadMode("quick");
              const firstTakeaway = book.keyTakeaways[0];
              setPendingQuickStep(firstTakeaway ? 1 : conclusionStep);
              setHasStartedQuick(true);
              syncUrlHistory({
                mode: "quick",
                startedQuick: true,
                deepStep: 0,
              });
            }, 380);
          }}
          onStartDeepReading={() => {
            transitionAfterFadeOut(() => {
              setIsStartingSession(true);
              setReadMode("deep");
              setHasStartedQuick(false);
              goToDeepStep(1, false);
            }, 380);
          }}
        />
      )}

      {showDeepBottomBar && (
        <DeepReadingBottomBar
          currentStep={clampedDeepStep}
          keyTakeaways={book.keyTakeaways}
          conclusionStep={conclusionStep}
          readingTimeMinutes={book.readingTimeMinutes}
          prevLabel={prevLabel}
          prevTitle={prevTitle}
          nextLabel={nextLabel}
          nextTitle={nextTitle}
          onSelectStep={transitionToDeepStep}
          onComplete={handleFinishReading}
        />
      )}

      <BookCompletedModal
        open={isCompletionModalOpen}
        onClose={() => setIsCompletionModalOpen(false)}
        bookTitle={book.title}
        onExploreQuotesAndOpinions={() => {
          setIsCompletionModalOpen(false);
          window.setTimeout(() => {
            smoothScrollToElement("eksplorasi-buku", 520);
          }, 80);
        }}
        onRequestUnmark={() => {
          setIsCompletionModalOpen(false);
          setIsUnmarkConfirmOpen(true);
        }}
      />

      <ConfirmUnmarkCompletedModal
        open={isUnmarkConfirmOpen}
        onClose={() => setIsUnmarkConfirmOpen(false)}
        onConfirm={() => {
          unmarkCompleted(book.slug);
          setIsUnmarkConfirmOpen(false);
          setUnmarkToastMessage(
            `Berhasil menghapus tanda selesai untuk "${book.title}".`
          );
          window.clearTimeout(unmarkToastTimerRef.current);
          unmarkToastTimerRef.current = window.setTimeout(() => {
            setUnmarkToastMessage(null);
          }, 3000);
        }}
        bookTitle={book.title}
      />

      <ReaderToast
        open={Boolean(unmarkToastMessage)}
        message={unmarkToastMessage ?? ""}
        bottomOffsetClass={
          showDeepBottomBar || isIntroView ? "bottom-24" : "bottom-5"
        }
      />

      <ReaderToast
        open={Boolean(modeToast) && !isIntroView}
        message={modeToast === "quick" ? "Mode Kilat" : "Mode Mendalam"}
        bottomOffsetClass="top-[calc(var(--header-h)+var(--reader-toolbar-h)+12px)]"
        compact
        icon={
          modeToast === "quick" ? (
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-500/15 text-amber-500">
              <Zap className="h-3 w-3" />
            </span>
          ) : (
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent-strong">
              <BookOpen className="h-3 w-3" />
            </span>
          )
        }
      />

      <QuoteCardModal
        quote={activeQuoteForCard}
        bookTitle={book.title}
        bookAuthor={book.author}
        bookCategory={book.category}
        bookSlug={book.slug}
        onClose={() => setActiveQuoteForCard(null)}
      />

      <ArticleTermPopover
        term={activeArticleTerm}
        bookSlug={book.slug}
        onClose={() => setActiveArticleTerm(null)}
      />
    </div>
  );
}
