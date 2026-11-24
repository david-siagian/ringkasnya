import { useState, useEffect, useRef } from "react";
import type { BookCatalogItem, BookSummary } from "@/types/book";
import type { ArticleTermEntry } from "@/types/article";
import { ARTICLE_TERMS } from "@/data/article-terms";
import { useBookmarks } from "@/hooks/useBookmarks";
import { useCompletedBooks } from "@/hooks/useCompletedBooks";
import QuoteCardModal from "./QuoteCardModal";
import { ArticleTermPopover } from "./ArticleTermPopover";
import {
  QuickKeyConceptsModal,
  QuickQuotesModal,
} from "./BookReaderModals";
import {
  smoothScrollToElement,
  smoothScrollToY,
} from "./SmoothNavigation";
import {
  ConclusionSection,
  DeepStepDropdown,
  FONT_SCALES,
  IntroSection,
  KeyConceptsSection,
  QuotesSection,
  RelatedBooksSection,
  TakeawayCard,
  type CopyFeedback,
} from "./BookReaderSections";
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  BookOpen,
  CheckCircle2,
  Clock,
  Layers,
  List,
  Quote,
  RotateCcw,
  Type,
  X,
  Zap,
} from "lucide-react";

interface BookReaderProps {
  book: BookSummary;
  relatedBooks: BookCatalogItem[];
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
  const [copyFeedback, setCopyFeedback] = useState<CopyFeedback>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeQuoteForCard, setActiveQuoteForCard] = useState<string | null>(
    null
  );
  const [isConceptsModalOpen, setIsConceptsModalOpen] = useState(false);
  const [isQuotesModalOpen, setIsQuotesModalOpen] = useState(false);
  const [activeArticleTerm, setActiveArticleTerm] =
    useState<ArticleTermEntry | null>(null);

  const copyTimerRef = useRef<number | undefined>(undefined);
  const toolbarRef = useRef<HTMLDivElement>(null);
  const readingAreaRef = useRef<HTMLDivElement>(null);
  const pendingScrollTargetRef = useRef<string | null>(null);
  const pendingScrollToReadingTopRef = useRef(false);
  const pendingQuickStepRef = useRef<number | null>(null);
  const pendingQuickStepTimerRef = useRef<number | undefined>(undefined);
  const wasAtCompletionEndRef = useRef(false);

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
  const finalStep = totalTakeaways + 1;
  const clampedDeepStep = Math.max(0, Math.min(finalStep, deepStep));

  const readingProgress =
    readMode === "deep"
      ? Math.round((clampedDeepStep / Math.max(1, finalStep)) * 100)
      : hasStartedQuick
        ? scrollProgress
        : 0;

  // Reset step Mode Mendalam, status mulai Mode Kilat, & modal cepat bila berpindah buku
  useEffect(() => {
    setHasStartedQuick(false);
    setScrollProgress(0);
    setDeepStep(0);
    setIsConceptsModalOpen(false);
    setIsQuotesModalOpen(false);
    setActiveArticleTerm(null);
    pendingQuickStepRef.current = null;
    window.clearTimeout(pendingQuickStepTimerRef.current);
    wasAtCompletionEndRef.current = false;
  }, [book.slug]);

  // Tandai buku selesai dibaca otomatis hanya saat transisi baru mencapai bagian akhir
  useEffect(() => {
    const isAtCompletionEnd =
      (readMode === "deep" && clampedDeepStep === finalStep) ||
      (readMode === "quick" && hasStartedQuick && scrollProgress >= 90);

    if (isAtCompletionEnd && !wasAtCompletionEndRef.current) {
      markCompleted(book.slug);
    }
    wasAtCompletionEndRef.current = isAtCompletionEnd;
  }, [
    readMode,
    hasStartedQuick,
    clampedDeepStep,
    finalStep,
    scrollProgress,
    book.slug,
    markCompleted,
  ]);

  // Sinkronkan tinggi toolbar sticky (bisa 2 baris di mobile) ke CSS var `--reader-toolbar-h`
  useEffect(() => {
    const toolbar = toolbarRef.current;
    if (!toolbar) return;

    const root = document.documentElement;
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
  }, []);

  useEffect(() => {
    return () => {
      window.clearTimeout(copyTimerRef.current);
      window.clearTimeout(pendingQuickStepTimerRef.current);
    };
  }, []);

  // Hitung progres membaca berbasis scroll saat berada di Mode Kilat (setelah klik Mulai)
  useEffect(() => {
    if (readMode !== "quick" || !hasStartedQuick) return;

    let rafId = 0;

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

    calculateProgress();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate, { passive: true });

    return () => {
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, [readMode, hasStartedQuick, fontSize, book.slug]);

  // Jalankan smooth scroll tertunda setelah perpindahan mode atau halaman bab
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
      pendingScrollToReadingTopRef.current = false;
      const area = readingAreaRef.current;
      if (!area) return;
      const stickyBottom =
        toolbarRef.current?.getBoundingClientRect().bottom ?? 0;
      const targetY = Math.max(
        0,
        window.scrollY + area.getBoundingClientRect().top - stickyBottom - 16
      );
      smoothScrollToY(targetY, 420);
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
      detectedStep = finalStep;
    }

    return detectedStep;
  };

  const goToDeepStep = (nextStep: number) => {
    const target = Math.max(0, Math.min(finalStep, nextStep));
    setDeepStep(target);
    pendingScrollToReadingTopRef.current = true;
  };

  const handleReadTakeawayDeep = (step: number) => {
    setPendingQuickStep(null);
    goToDeepStep(step);
    setReadMode("deep");
  };

  const activeTakeaway =
    clampedDeepStep >= 1 && clampedDeepStep <= totalTakeaways
      ? book.keyTakeaways[clampedDeepStep - 1]
      : null;

  const backToQuickIntro = () => {
    setPendingQuickStep(null);
    setHasStartedQuick(false);
    pendingScrollToReadingTopRef.current = true;
  };

  const handleModeChange = (nextMode: "quick" | "deep") => {
    if (nextMode === readMode) return;

    if (nextMode === "quick") {
      if (activeTakeaway) {
        setHasStartedQuick(true);
        pendingScrollTargetRef.current = `poin-${activeTakeaway.number}`;
        setPendingQuickStep(clampedDeepStep);
      } else if (clampedDeepStep === finalStep) {
        setHasStartedQuick(true);
        pendingScrollTargetRef.current = "kesimpulan-akhir";
        setPendingQuickStep(finalStep);
      } else {
        setHasStartedQuick(false);
        setPendingQuickStep(0);
      }
      setReadMode("quick");
      return;
    }

    const targetStep = hasStartedQuick ? detectActiveQuickStep() : 0;
    setPendingQuickStep(null);
    setDeepStep(targetStep);
    if (targetStep > 0) {
      pendingScrollToReadingTopRef.current = true;
    }
    setReadMode("deep");
  };

  const fs = FONT_SCALES[fontSize];

  const prevTakeaway =
    clampedDeepStep >= 2
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

  const nextLabel = nextTakeaway
    ? `Poin Inti ${nextTakeaway.number}`
    : "Kesimpulan Akhir";
  const nextTitle = nextTakeaway?.title ?? null;

  return (
    <div className="min-h-screen bg-page pb-20">
      {/* Banner Header Buku */}
      <div
        className={`bg-slate-900 bg-gradient-to-br ${book.coverGradient} text-white`}
      >
        <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
          <div className="flex items-center justify-between gap-3">
            <a
              href="/katalog"
              className="inline-flex items-center gap-1.5 rounded-full bg-black/20 px-3.5 py-1.5 text-xs font-medium text-white/90 backdrop-blur-sm transition hover:bg-black/30"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Kembali ke Katalog
            </a>

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
                {completed && (
                  <button
                    type="button"
                    onClick={() => {
                      unmarkCompleted(book.slug);
                      setIsConceptsModalOpen(false);
                      setIsQuotesModalOpen(false);
                    }}
                    title="Klik untuk hapus tanda selesai dibaca"
                    aria-label="Hapus tanda selesai dibaca"
                    className="group inline-flex items-center gap-1.5 rounded-full bg-emerald-500/90 px-3 py-1 text-xs font-bold text-white shadow-sm transition hover:bg-emerald-600 active:scale-[0.98]"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>Selesai Dibaca</span>
                    <X className="h-3 w-3 opacity-80 transition group-hover:opacity-100" />
                  </button>
                )}
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

              {completed && (
                <div className="mt-5 flex flex-wrap items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => setIsConceptsModalOpen(true)}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-white/95 px-3.5 py-2 text-xs font-bold text-emerald-900 shadow-sm transition hover:bg-white active:scale-[0.98]"
                  >
                    <Layers className="h-4 w-4 text-emerald-600" />
                    <span>
                      Konsep Kunci ({book.keyConcepts.length})
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsQuotesModalOpen(true)}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-black/30 px-3.5 py-2 text-xs font-bold text-white ring-1 ring-white/25 backdrop-blur-sm transition hover:bg-black/45 active:scale-[0.98]"
                  >
                    <Quote className="h-4 w-4 text-emerald-300" />
                    <span>Kutipan ({book.quotes.length})</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Reader Toolbar (Mode Baca & Ukuran Huruf) */}
      <div
        ref={toolbarRef}
        style={{ top: "var(--header-h)" }}
        className="sticky z-40 border-b border-line bg-surface/95 shadow-sm backdrop-blur-md"
      >
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
          {/* Toggle Mode Kilat (kiri, default) vs Mendalam (kanan) */}
          <div className="flex items-center rounded-xl bg-surface-subtle p-1">
            <button
              type="button"
              onClick={() => handleModeChange("quick")}
              aria-pressed={readMode === "quick"}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs sm:text-sm font-semibold transition-all ${
                readMode === "quick"
                  ? "bg-amber-500 text-white shadow-sm"
                  : "text-ink-muted hover:text-ink"
              }`}
            >
              <Zap className="h-4 w-4" />
              <span>Kilat ({book.quickTimeMinutes} mnt)</span>
            </button>
            <button
              type="button"
              onClick={() => handleModeChange("deep")}
              aria-pressed={readMode === "deep"}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs sm:text-sm font-semibold transition-all ${
                readMode === "deep"
                  ? "bg-surface text-ink shadow-sm"
                  : "text-ink-muted hover:text-ink"
              }`}
            >
              <BookOpen className="h-4 w-4 text-accent-strong" />
              <span>Mendalam ({book.readingTimeMinutes} mnt)</span>
            </button>
          </div>

          {/* Kontrol Ukuran Teks */}
          <div className="flex items-center gap-1.5">
            <Type className="h-4 w-4 text-ink-faint mr-1 hidden sm:inline" />
            <button
              type="button"
              onClick={() => setFontSize("sm")}
              className={`rounded-lg px-2.5 py-1 text-xs font-semibold border ${
                fontSize === "sm"
                  ? "border-accent-strong bg-accent-soft text-accent-text"
                  : "border-line text-ink-muted hover:bg-page"
              }`}
            >
              A-
            </button>
            <button
              type="button"
              onClick={() => setFontSize("base")}
              className={`rounded-lg px-2.5 py-1 text-xs font-semibold border ${
                fontSize === "base"
                  ? "border-accent-strong bg-accent-soft text-accent-text"
                  : "border-line text-ink-muted hover:bg-page"
              }`}
            >
              A
            </button>
            <button
              type="button"
              onClick={() => setFontSize("lg")}
              className={`rounded-lg px-2.5 py-1 text-xs font-semibold border ${
                fontSize === "lg"
                  ? "border-accent-strong bg-accent-soft text-accent-text"
                  : "border-line text-ink-muted hover:bg-page"
              }`}
            >
              A+
            </button>
            <span
              className="ml-1.5 min-w-[2.5rem] text-right text-xs font-semibold tabular-nums text-ink-muted"
              title="Progres membaca"
            >
              {readingProgress}%
            </span>
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

      {/* Konten Utama Ringkasan */}
      <main className="mx-auto max-w-4xl px-4 pt-8 sm:px-6">
        <div ref={readingAreaRef}>
          {(readMode === "quick" && !hasStartedQuick) ||
          (readMode === "deep" && clampedDeepStep === 0) ? (
            <IntroSection
              book={book}
              fs={fs}
              mode={readMode}
              articleTerms={ARTICLE_TERMS}
              onSelectArticleTerm={setActiveArticleTerm}
              onStartReading={() => {
                if (readMode === "deep") {
                  goToDeepStep(1);
                  return;
                }
                const firstTakeaway = book.keyTakeaways[0];
                setPendingQuickStep(firstTakeaway ? 1 : finalStep);
                pendingScrollToReadingTopRef.current = true;
                setHasStartedQuick(true);
              }}
              onSelectTakeaway={(num) => {
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
              }}
            />
          ) : readMode === "quick" ? (
            /* MODE KILAT: Halaman Baca Vertikal Penuh (setelah Mulai) */
            <div className="animate-fade-slide" key="quick-reading-view">
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

                <div className="mt-8">
                  <ConclusionSection
                    conclusion={book.conclusion}
                    fs={fs}
                    scrollMarginTop={TAKEAWAY_SCROLL_MARGIN}
                    articleTerms={ARTICLE_TERMS}
                    onSelectArticleTerm={setActiveArticleTerm}
                  />
                </div>

                <KeyConceptsSection
                  keyConcepts={book.keyConcepts}
                  fs={fs}
                  articleTerms={ARTICLE_TERMS}
                  onSelectArticleTerm={setActiveArticleTerm}
                />

                <QuotesSection
                  quotes={book.quotes}
                  copyFeedback={copyFeedback}
                  onCopyQuote={handleCopyQuote}
                  onOpenQuoteCard={(quote) => setActiveQuoteForCard(quote)}
                  fs={fs}
                />

                <div className="mt-6 flex justify-end">
                  <button
                    type="button"
                    onClick={backToQuickIntro}
                    className="inline-flex items-center gap-2 rounded-xl border border-accent-line bg-accent-soft px-3.5 py-2 text-xs font-semibold text-accent-text shadow-sm transition hover:bg-accent-tint active:scale-[0.98]"
                  >
                    <span>Kembali ke Pengantar</span>
                    <RotateCcw className="h-4 w-4 shrink-0" />
                  </button>
                </div>
              </div>
          ) : (
            /* MODE MENDALAM: Alur Halaman Per Halaman (Poin Inti 1..N -> Penutup) */
            <div className="animate-fade-slide" key={`deep-step-${clampedDeepStep}`}>
              {/* Bar Navigasi Atas Stepper Mode Mendalam */}
                  <div className="relative z-20 mb-4 flex items-center justify-between gap-2 sm:gap-3 rounded-xl border border-line bg-surface px-3.5 py-2.5 sm:px-4 shadow-sm">
                    <button
                      type="button"
                      onClick={() => goToDeepStep(0)}
                      className="inline-flex shrink-0 items-center gap-1.5 text-xs font-semibold text-ink-muted transition hover:text-accent-text"
                    >
                      <List className="h-4 w-4" />
                      <span>Daftar Poin</span>
                    </button>

                    <DeepStepDropdown
                      currentStep={clampedDeepStep}
                      keyTakeaways={book.keyTakeaways}
                      finalStep={finalStep}
                      onSelectStep={goToDeepStep}
                    />
                  </div>

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
                    <>
                      <ConclusionSection
                        conclusion={book.conclusion}
                        fs={fs}
                        articleTerms={ARTICLE_TERMS}
                        onSelectArticleTerm={setActiveArticleTerm}
                      />
                      <KeyConceptsSection
                        keyConcepts={book.keyConcepts}
                        fs={fs}
                        articleTerms={ARTICLE_TERMS}
                        onSelectArticleTerm={setActiveArticleTerm}
                      />
                      <QuotesSection
                        quotes={book.quotes}
                        copyFeedback={copyFeedback}
                        onCopyQuote={handleCopyQuote}
                        onOpenQuoteCard={(quote) => setActiveQuoteForCard(quote)}
                        fs={fs}
                      />
                    </>
                  )}

                  {/* Navigasi Panah Sebelumnya / Selanjutnya */}
                  <nav
                    aria-label="Navigasi halaman Mode Mendalam"
                    className="mt-6 flex items-center justify-between gap-3"
                  >
                    <button
                      type="button"
                      onClick={() => goToDeepStep(clampedDeepStep - 1)}
                      aria-label={
                        prevTitle
                          ? `Sebelumnya: ${prevLabel} — ${prevTitle}`
                          : `Sebelumnya: ${prevLabel}`
                      }
                      className="inline-flex max-w-[48%] sm:max-w-xs items-center gap-2 rounded-xl border border-line bg-surface px-3 py-2 text-left text-xs font-semibold text-ink shadow-sm transition hover:border-accent-line hover:bg-page active:scale-[0.98]"
                    >
                      <ArrowLeft className="h-4 w-4 shrink-0 text-ink-muted" />
                      <span className="min-w-0">
                        <span className="block truncate text-[10px] font-medium leading-tight text-ink-subtle">
                          {prevTitle ? `Sebelumnya • ${prevLabel}` : "Sebelumnya"}
                        </span>
                        <span className="block truncate text-xs font-semibold leading-snug text-ink">
                          {prevTitle ?? prevLabel}
                        </span>
                      </span>
                    </button>

                    {clampedDeepStep < finalStep ? (
                      <button
                        type="button"
                        onClick={() => goToDeepStep(clampedDeepStep + 1)}
                        aria-label={
                          nextTitle
                            ? `Selanjutnya: ${nextLabel} — ${nextTitle}`
                            : `Selanjutnya: ${nextLabel}`
                        }
                        className="inline-flex max-w-[48%] sm:max-w-xs items-center gap-2 rounded-xl bg-emerald-600 px-3 py-2 text-right text-xs font-semibold text-white shadow-sm shadow-emerald-600/20 transition hover:bg-emerald-700 active:scale-[0.98]"
                      >
                        <span className="min-w-0">
                          <span className="block truncate text-[10px] font-medium leading-tight text-emerald-100">
                            {nextTitle
                              ? `Selanjutnya • ${nextLabel}`
                              : "Selanjutnya"}
                          </span>
                          <span className="block truncate text-xs font-semibold leading-snug">
                            {nextTitle ?? nextLabel}
                          </span>
                        </span>
                        <ArrowRight className="h-4 w-4 shrink-0" />
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => goToDeepStep(0)}
                        className="inline-flex max-w-[48%] sm:max-w-xs items-center gap-2 rounded-xl border border-accent-line bg-accent-soft px-3 py-2 text-xs font-semibold text-accent-text shadow-sm transition hover:bg-accent-tint active:scale-[0.98]"
                      >
                        <span className="truncate">Kembali ke Pengantar</span>
                        <RotateCcw className="h-4 w-4 shrink-0" />
                      </button>
                    )}
                  </nav>
            </div>
          )}
        </div>

        {(readMode === "quick" ? hasStartedQuick : clampedDeepStep === finalStep) && (
          <RelatedBooksSection relatedBooks={recommendedBooks} />
        )}
      </main>

      <QuickKeyConceptsModal
        open={isConceptsModalOpen}
        onClose={() => setIsConceptsModalOpen(false)}
        bookTitle={book.title}
        keyConcepts={book.keyConcepts}
      />

      <QuickQuotesModal
        open={isQuotesModalOpen}
        onClose={() => setIsQuotesModalOpen(false)}
        bookTitle={book.title}
        quotes={book.quotes}
        copyFeedback={copyFeedback}
        onCopyQuote={handleCopyQuote}
        onOpenQuoteCard={(quote) => setActiveQuoteForCard(quote)}
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
