import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import {
  AlertCircle,
  Check,
  Copy,
  ImageDown,
  ListChecks,
  Quote,
  X,
} from "lucide-react";
import type { CopyFeedback } from "./BookReaderSections";

interface ReaderModalShellProps {
  open: boolean;
  onClose: () => void;
  titleId: string;
  children: ReactNode;
}

/** Pembungkus modal portal untuk pintasan cepat di reader (Esc, backdrop, scroll lock). */
function ReaderModalShell({
  open,
  onClose,
  titleId,
  children,
}: ReaderModalShellProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  if (!mounted || !open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[75] flex items-center justify-center bg-slate-900/55 p-4 backdrop-blur-md dark:bg-black/75"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <div
        className="animate-fade-slide relative flex max-h-[88vh] w-full max-w-xl flex-col overflow-hidden rounded-3xl bg-surface shadow-2xl ring-1 ring-line"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>,
    document.body
  );
}

interface QuickChecklistModalProps {
  open: boolean;
  onClose: () => void;
  bookTitle: string;
  actionChecklist: string[];
  checkedItems: Record<number, boolean>;
  onToggle: (index: number) => void;
}

/** Modal cepat untuk mencentang ulang Action Checklist pada buku yang sudah selesai dibaca. */
export function QuickChecklistModal({
  open,
  onClose,
  bookTitle,
  actionChecklist,
  checkedItems,
  onToggle,
}: QuickChecklistModalProps) {
  const completedCount = Object.values(checkedItems).filter(Boolean).length;
  const totalChecklist = actionChecklist.length;
  const progressPercent =
    totalChecklist > 0 ? Math.round((completedCount / totalChecklist) * 100) : 0;

  return (
    <ReaderModalShell
      open={open}
      onClose={onClose}
      titleId="quick-checklist-modal-title"
    >
      <div className="flex items-start justify-between gap-3 border-b border-line px-6 py-4">
        <div className="min-w-0">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-accent-text">
            <ListChecks className="h-4 w-4" />
            <span>Action Checklist</span>
          </div>
          <h2
            id="quick-checklist-modal-title"
            className="mt-1 truncate text-lg font-extrabold text-ink"
          >
            {bookTitle}
          </h2>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup modal checklist"
          className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface-subtle text-ink-muted transition hover:bg-page hover:text-ink"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="border-b border-line-subtle bg-page/60 px-6 py-3">
        <div className="flex items-center justify-between text-xs font-bold text-ink-secondary">
          <span>Progres Praktik</span>
          <span>
            {completedCount} dari {totalChecklist} Selesai ({progressPercent}%)
          </span>
        </div>
        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-surface-subtle">
          <div
            className="h-full rounded-full bg-emerald-600 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <div className="flex-1 space-y-2.5 overflow-y-auto p-6">
        {actionChecklist.map((action, idx) => {
          const isChecked = !!checkedItems[idx];
          return (
            <label
              key={idx}
              className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3.5 transition-all ${
                isChecked
                  ? "border-accent-line bg-accent-soft/70 text-ink-subtle line-through"
                  : "border-line bg-surface text-ink-secondary hover:border-accent-line hover:bg-page"
              }`}
            >
              <input
                type="checkbox"
                checked={isChecked}
                onChange={() => onToggle(idx)}
                className="mt-0.5 h-4 w-4 rounded border-line-strong bg-surface text-emerald-600 focus:ring-emerald-500"
              />
              <span className="text-sm font-medium leading-relaxed">
                {action}
              </span>
            </label>
          );
        })}
      </div>
    </ReaderModalShell>
  );
}

interface QuickQuotesModalProps {
  open: boolean;
  onClose: () => void;
  bookTitle: string;
  quotes: string[];
  copyFeedback: CopyFeedback;
  onCopyQuote: (quote: string, index: number) => void;
  onOpenQuoteCard: (quote: string) => void;
}

/** Modal cepat untuk melihat, menyalin, atau membuat kartu kutipan pada buku yang sudah selesai dibaca. */
export function QuickQuotesModal({
  open,
  onClose,
  bookTitle,
  quotes,
  copyFeedback,
  onCopyQuote,
  onOpenQuoteCard,
}: QuickQuotesModalProps) {
  return (
    <ReaderModalShell
      open={open}
      onClose={onClose}
      titleId="quick-quotes-modal-title"
    >
      <div className="flex items-start justify-between gap-3 border-b border-line px-6 py-4">
        <div className="min-w-0">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-accent-text">
            <Quote className="h-4 w-4" />
            <span>Kutipan Berkesan ({quotes.length})</span>
          </div>
          <h2
            id="quick-quotes-modal-title"
            className="mt-1 truncate text-lg font-extrabold text-ink"
          >
            {bookTitle}
          </h2>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup modal kutipan"
          className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface-subtle text-ink-muted transition hover:bg-page hover:text-ink"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto p-6">
        {quotes.map((quote, idx) => (
          <div
            key={idx}
            className="rounded-xl border border-line-subtle bg-page p-4"
          >
            <blockquote className="text-sm font-semibold italic leading-relaxed text-ink">
              &ldquo;{quote}&rdquo;
            </blockquote>
            <div className="mt-3 flex flex-wrap items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => onCopyQuote(quote, idx)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-surface px-3 py-1.5 text-xs font-semibold text-ink-secondary shadow-sm transition hover:border-accent-strong hover:text-accent-text"
              >
                {copyFeedback?.index === idx &&
                copyFeedback.status === "success" ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-accent-strong" />
                    <span className="text-accent-text">Tersalin!</span>
                  </>
                ) : copyFeedback?.index === idx &&
                  copyFeedback.status === "error" ? (
                  <>
                    <AlertCircle className="h-3.5 w-3.5 text-rose-500" />
                    <span className="text-rose-600 dark:text-rose-400">
                      Gagal menyalin
                    </span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span>Salin Kutipan</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenQuoteCard(quote);
                }}
                className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-600/30 bg-emerald-600/10 px-3 py-1.5 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-600 hover:text-white dark:border-emerald-400/30 dark:bg-emerald-400/10 dark:text-emerald-300 dark:hover:bg-emerald-500 dark:hover:text-white"
              >
                <ImageDown className="h-3.5 w-3.5" />
                <span>Buat Kartu</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </ReaderModalShell>
  );
}
