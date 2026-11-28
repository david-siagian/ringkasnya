import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import {
  AlertCircle,
  Check,
  CheckCircle2,
  Copy,
  ImageDown,
  Layers,
  LayoutGrid,
  Quote,
  X,
} from "lucide-react";
import type { BookKeyConcept } from "@/types/book";
import type { CopyFeedback } from "./BookReaderSections";

interface ReaderModalShellProps {
  open: boolean;
  onClose: () => void;
  titleId: string;
  maxWidthClass?: string;
  blurBackdrop?: boolean;
  children: ReactNode;
}

/** Pembungkus modal portal untuk pintasan cepat di reader (Esc, backdrop, scroll lock). */
function ReaderModalShell({
  open,
  onClose,
  titleId,
  maxWidthClass = "max-w-xl",
  blurBackdrop = true,
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
      className={`fixed inset-0 z-[75] flex items-center justify-center bg-slate-900/55 p-4 dark:bg-black/75 ${
        blurBackdrop ? "backdrop-blur-md" : ""
      }`}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <div
        className={`animate-fade-slide relative flex max-h-[88vh] w-full ${maxWidthClass} flex-col overflow-hidden rounded-3xl bg-surface shadow-2xl ring-1 ring-line`}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>,
    document.body
  );
}

interface QuickKeyConceptsModalProps {
  open: boolean;
  onClose: () => void;
  bookTitle: string;
  keyConcepts: BookKeyConcept[];
}

/** Modal cepat untuk melihat ulang daftar Konsep Kunci pada buku yang sudah selesai dibaca. */
export function QuickKeyConceptsModal({
  open,
  onClose,
  bookTitle,
  keyConcepts,
}: QuickKeyConceptsModalProps) {
  return (
    <ReaderModalShell
      open={open}
      onClose={onClose}
      titleId="quick-concepts-modal-title"
    >
      <div className="flex items-start justify-between gap-3 border-b border-line px-6 py-4">
        <div className="min-w-0">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-accent-text">
            <Layers className="h-4 w-4" />
            <span>Konsep Kunci ({keyConcepts.length})</span>
          </div>
          <h2
            id="quick-concepts-modal-title"
            className="mt-1 truncate text-lg font-extrabold text-ink"
          >
            {bookTitle}
          </h2>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup modal konsep kunci"
          className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface-subtle text-ink-muted transition hover:bg-page hover:text-ink"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto p-6">
        {keyConcepts.map((concept, idx) => (
          <div
            key={idx}
            className="rounded-xl border border-line-subtle bg-page p-4"
          >
            <div className="flex items-start gap-3">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-emerald-600 text-xs font-bold text-white">
                {idx + 1}
              </span>
              <div className="min-w-0">
                <h3 className="text-sm font-extrabold text-ink">
                  {concept.title}
                </h3>
                <p className="mt-1 text-xs sm:text-sm leading-relaxed text-ink-secondary">
                  {concept.explanation}
                </p>
              </div>
            </div>
          </div>
        ))}
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

interface BookCompletedModalProps {
  open: boolean;
  onClose: () => void;
  bookTitle: string;
  onExploreQuotesAndOpinions: () => void;
  onRequestUnmark: () => void;
}

/** Modal selebrasi sesaat setelah pembaca menekan tombol Selesai di akhir sesi baca. */
export function BookCompletedModal({
  open,
  onClose,
  bookTitle,
  onExploreQuotesAndOpinions,
  onRequestUnmark,
}: BookCompletedModalProps) {
  return (
    <ReaderModalShell
      open={open}
      onClose={onClose}
      titleId="book-completed-modal-title"
      maxWidthClass="max-w-md"
    >
      <div className="relative px-6 pb-6 pt-7 text-center sm:px-7">
        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup modal buku selesai dibaca"
          className="absolute right-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-full bg-surface-subtle text-ink-muted transition hover:bg-page hover:text-ink"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-600/15 text-emerald-600 ring-1 ring-emerald-500/25 dark:bg-emerald-400/15 dark:text-emerald-400">
          <CheckCircle2 className="h-7 w-7" />
        </div>

        <span className="mt-4 inline-block text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
          Selesai Dibaca
        </span>
        <h2
          id="book-completed-modal-title"
          className="mt-1 text-xl font-extrabold tracking-tight text-ink"
        >
          Buku Ini Telah Selesai Dibaca!
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-ink-muted">
          Selamat, Anda telah menuntaskan ringkasan{" "}
          <span className="font-semibold text-ink">{bookTitle}</span>. Progres
          bacaan Anda sudah tersimpan.
        </p>

        <div className="mt-6 flex flex-col gap-2.5">
          <button
            type="button"
            onClick={onExploreQuotesAndOpinions}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white shadow-sm shadow-emerald-600/20 transition hover:bg-emerald-700 active:scale-[0.98]"
          >
            <Quote className="h-4 w-4 shrink-0" />
            <span>Lihat Kutipan &amp; Opini</span>
          </button>

          <a
            href="/katalog"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-line bg-page px-4 py-2.5 text-sm font-semibold text-ink transition hover:border-accent-line hover:bg-surface-subtle active:scale-[0.98]"
          >
            <LayoutGrid className="h-4 w-4 shrink-0 text-ink-muted" />
            <span>Jelajahi Katalog Buku</span>
          </a>
        </div>

        <div className="mt-4 flex items-center justify-center gap-4 text-xs">
          <button
            type="button"
            onClick={onClose}
            className="font-semibold text-ink-muted transition hover:text-ink"
          >
            Tutup
          </button>
          <span className="text-line" aria-hidden="true">
            •
          </span>
          <button
            type="button"
            onClick={onRequestUnmark}
            className="font-medium text-ink-subtle transition hover:text-rose-600 dark:hover:text-rose-400"
          >
            Batalkan tanda selesai
          </button>
        </div>
      </div>
    </ReaderModalShell>
  );
}

interface ConfirmUnmarkCompletedModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  bookTitle: string;
}

/** Modal konfirmasi sebelum menghapus penanda selesai dibaca pada buku. */
export function ConfirmUnmarkCompletedModal({
  open,
  onClose,
  onConfirm,
  bookTitle,
}: ConfirmUnmarkCompletedModalProps) {
  return (
    <ReaderModalShell
      open={open}
      onClose={onClose}
      titleId="confirm-unmark-completed-title"
      maxWidthClass="max-w-md"
      blurBackdrop={false}
    >
      <div className="flex items-start justify-between gap-3 border-b border-line px-6 py-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400">
            <AlertCircle className="h-5 w-5" />
          </div>
          <h2
            id="confirm-unmark-completed-title"
            className="text-base font-extrabold text-ink sm:text-lg"
          >
            Hapus Tanda Selesai?
          </h2>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup modal konfirmasi"
          className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface-subtle text-ink-muted transition hover:bg-page hover:text-ink"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="px-6 py-5">
        <p className="text-sm leading-relaxed text-ink-muted">
          Apakah Anda yakin ingin menghapus tanda selesai dibaca untuk{" "}
          <span className="font-semibold text-ink">{bookTitle}</span>?
        </p>

        <div className="mt-6 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center justify-center rounded-xl border border-line bg-surface-subtle px-4 py-2 text-xs font-semibold text-ink transition hover:bg-page active:scale-[0.98]"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="inline-flex items-center justify-center rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-rose-700 active:scale-[0.98]"
          >
            Ya, Hapus
          </button>
        </div>
      </div>
    </ReaderModalShell>
  );
}

interface ReaderToastProps {
  open: boolean;
  message: string;
  bottomOffsetClass?: string;
}

/** Notifikasi toast ringan di bagian bawah layar untuk konfirmasi aksi di reader. */
export function ReaderToast({
  open,
  message,
  bottomOffsetClass = "bottom-5",
}: ReaderToastProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !open || !message) return null;

  return createPortal(
    <div
      role="status"
      aria-live="polite"
      className={`pointer-events-none fixed inset-x-0 ${bottomOffsetClass} z-[85] flex justify-center px-4`}
    >
      <div className="animate-fade-slide flex max-w-md items-center gap-2.5 rounded-2xl border border-line bg-surface px-4 py-3 text-sm font-medium leading-snug text-ink shadow-xl">
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
          <Check className="h-3.5 w-3.5" />
        </span>
        <span className="line-clamp-2">{message}</span>
      </div>
    </div>,
    document.body
  );
}
