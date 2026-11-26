import { useCallback, useEffect, useRef, useState } from "react";
import {
  ChevronDown,
  Edit3,
  Loader2,
  MessageSquare,
  Send,
  ThumbsUp,
  Trash2,
} from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { openAuthModal } from "@/lib/auth-modal";
import {
  type BookOpinionItem,
  type BookOpinionsResponse,
  type OpinionSortOption,
  OPINION_MAX_LENGTH,
  OPINION_PAGE_SIZE,
} from "@/lib/opinions";

interface BookOpinionsSectionProps {
  bookSlug: string;
}

function formatRelativeTime(timestampMs: number): string {
  const diffSec = Math.max(0, Math.floor((Date.now() - timestampMs) / 1000));
  if (diffSec < 60) return "Baru saja";
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin} menit lalu`;
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour} jam lalu`;
  const diffDay = Math.floor(diffHour / 24);
  if (diffDay < 30) return `${diffDay} hari lalu`;

  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(timestampMs));
}

function getStickyTopOffset(): number {
  if (typeof window === "undefined") return 73;
  const styles = getComputedStyle(document.documentElement);
  const parsedHeaderH = parseFloat(styles.getPropertyValue("--header-h"));
  const headerH = Number.isFinite(parsedHeaderH) ? parsedHeaderH : 73;
  const toolbarH =
    parseFloat(styles.getPropertyValue("--reader-toolbar-h")) || 0;
  return headerH + toolbarH;
}

function AuthorAvatar({ name, image }: { name: string; image: string | null }) {
  const initial = (name.trim().charAt(0) || "P").toUpperCase();
  if (image) {
    return (
      <img
        src={image}
        alt={name}
        className="h-8 w-8 shrink-0 rounded-full border border-line object-cover"
        loading="lazy"
      />
    );
  }
  return (
    <span
      aria-hidden="true"
      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent-soft text-xs font-bold text-accent-text"
    >
      {initial}
    </span>
  );
}

export default function BookOpinionsSection({
  bookSlug,
}: BookOpinionsSectionProps) {
  const { data: session } = useSession();
  const currentUser = session?.user ?? null;

  const [opinions, setOpinions] = useState<BookOpinionItem[]>([]);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const sectionRef = useRef<HTMLElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const [sort, setSort] = useState<OpinionSortOption>("newest");
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const [draft, setDraft] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState("");
  const [editError, setEditError] = useState<string | null>(null);
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [votingIds, setVotingIds] = useState<Set<string>>(() => new Set());

  const loadOpinions = useCallback(
    async (
      targetSort: OpinionSortOption,
      offset = 0,
      append = false
    ): Promise<void> => {
      if (append) {
        setIsLoadingMore(true);
      } else {
        setIsLoading(true);
      }
      setFetchError(null);

      try {
        const params = new URLSearchParams({
          sort: targetSort,
          limit: String(OPINION_PAGE_SIZE),
          offset: String(offset),
        });
        const res = await fetch(
          `/api/opinions/${encodeURIComponent(bookSlug)}?${params.toString()}`
        );
        const data = (await res.json()) as BookOpinionsResponse & {
          error?: string;
        };
        if (!res.ok) {
          throw new Error(data.error || "Gagal memuat opini.");
        }

        setOpinions((prev) =>
          append ? [...prev, ...data.opinions] : data.opinions
        );
        setTotal(data.total);
        setHasMore(data.hasMore);
      } catch (error) {
        setFetchError(
          error instanceof Error ? error.message : "Gagal memuat opini."
        );
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    },
    [bookSlug]
  );

  useEffect(() => {
    void loadOpinions(sort, 0, false);
  }, [loadOpinions, sort, currentUser?.id]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (
      window.location.hash === "#opini-pembaca" ||
      window.location.hash === "#opini"
    ) {
      setIsExpanded(true);
    }
  }, []);

  const promptAuth = () => {
    const redirectTo =
      typeof window !== "undefined"
        ? window.location.pathname + window.location.search
        : `/buku/${bookSlug}`;
    openAuthModal("login", redirectTo);
  };

  const trimmedDraft = draft.trim();
  const canSubmitDraft =
    trimmedDraft.length > 0 &&
    trimmedDraft.length <= OPINION_MAX_LENGTH &&
    !isSubmitting;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!currentUser) {
      promptAuth();
      return;
    }

    if (trimmedDraft.length === 0) {
      setSubmitError("Opini tidak boleh kosong.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/opinions/${encodeURIComponent(bookSlug)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: draft }),
      });
      const data = (await res.json()) as {
        opinion?: BookOpinionItem;
        error?: string;
      };

      if (res.status === 401) {
        promptAuth();
        return;
      }
      if (!res.ok || !data.opinion) {
        throw new Error(data.error || "Gagal mengirim opini.");
      }

      setDraft("");
      setTotal((prev) => prev + 1);
      setIsExpanded(true);
      if (sort === "newest") {
        setOpinions((prev) => [data.opinion!, ...prev]);
      } else {
        setSort("newest");
      }
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "Gagal mengirim opini."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleHelpful = async (opinionId: string) => {
    if (!currentUser) {
      promptAuth();
      return;
    }
    if (votingIds.has(opinionId)) return;

    setVotingIds((prev) => new Set(prev).add(opinionId));
    try {
      const res = await fetch(
        `/api/opinions/item/${encodeURIComponent(opinionId)}/helpful`,
        { method: "POST" }
      );
      const data = (await res.json()) as {
        helpfulCount?: number;
        hasVoted?: boolean;
        error?: string;
      };

      if (res.status === 401) {
        promptAuth();
        return;
      }
      if (!res.ok || typeof data.helpfulCount !== "number") {
        throw new Error(data.error || "Gagal memproses apresiasi.");
      }

      setOpinions((prev) =>
        prev.map((item) =>
          item.id === opinionId
            ? {
                ...item,
                helpfulCount: data.helpfulCount!,
                hasVoted: Boolean(data.hasVoted),
              }
            : item
        )
      );
    } catch (error) {
      console.error("[helpful]", error);
    } finally {
      setVotingIds((prev) => {
        const next = new Set(prev);
        next.delete(opinionId);
        return next;
      });
    }
  };

  const handleSaveEdit = async (opinionId: string) => {
    setEditError(null);
    const trimmed = editDraft.trim();
    if (trimmed.length === 0) {
      setEditError("Opini tidak boleh kosong.");
      return;
    }

    setIsSavingEdit(true);
    try {
      const res = await fetch(
        `/api/opinions/item/${encodeURIComponent(opinionId)}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: editDraft }),
        }
      );
      const data = (await res.json()) as {
        content?: string;
        updatedAt?: number;
        error?: string;
      };

      if (!res.ok || !data.content) {
        throw new Error(data.error || "Gagal memperbarui opini.");
      }

      setOpinions((prev) =>
        prev.map((item) =>
          item.id === opinionId
            ? {
                ...item,
                content: data.content!,
                updatedAt: data.updatedAt ?? Date.now(),
              }
            : item
        )
      );
      setEditingId(null);
      setEditDraft("");
    } catch (error) {
      setEditError(
        error instanceof Error ? error.message : "Gagal memperbarui opini."
      );
    } finally {
      setIsSavingEdit(false);
    }
  };

  const handleDelete = async (opinionId: string) => {
    setDeletingId(opinionId);
    try {
      const res = await fetch(
        `/api/opinions/item/${encodeURIComponent(opinionId)}`,
        { method: "DELETE" }
      );
      const data = (await res.json()) as { deleted?: boolean; error?: string };
      if (!res.ok || !data.deleted) {
        throw new Error(data.error || "Gagal menghapus opini.");
      }

      setOpinions((prev) => prev.filter((item) => item.id !== opinionId));
      setTotal((prev) => Math.max(0, prev - 1));
      setConfirmDeleteId(null);
    } catch (error) {
      console.error("[delete opinion]", error);
    } finally {
      setDeletingId(null);
    }
  };

  const handleExpandOpinions = () => {
    setIsExpanded(true);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const panel = panelRef.current;
        if (!panel) return;
        const targetY =
          window.scrollY +
          panel.getBoundingClientRect().top -
          getStickyTopOffset();
        window.scrollTo({ top: Math.max(0, targetY), behavior: "smooth" });
      });
    });
  };

  const handleCollapseOpinions = () => {
    setIsExpanded(false);
    requestAnimationFrame(() => {
      const section = sectionRef.current;
      if (!section) return;
      const targetY =
        window.scrollY +
        section.getBoundingClientRect().top -
        getStickyTopOffset() -
        16;
      window.scrollTo({ top: Math.max(0, targetY), behavior: "smooth" });
    });
  };

  return (
    <section
      ref={sectionRef}
      id="opini-pembaca"
      aria-labelledby="opini-heading"
      className="mx-auto mt-12 max-w-3xl"
    >
      <div className="rounded-2xl border border-line bg-surface shadow-sm">
        <div className="flex items-center justify-between gap-3 rounded-t-2xl px-4 pt-3.5 pb-1.5 sm:px-5">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-4.5 w-4.5 shrink-0 text-accent-text sm:h-5 sm:w-5" />
            <h2
              id="opini-heading"
              className="text-base font-extrabold text-ink sm:text-lg"
            >
              Opini
            </h2>
            <span className="rounded-full bg-accent-soft px-2 py-0.5 text-xs font-bold text-accent-text">
              {isLoading && total === 0 ? "..." : total}
            </span>
          </div>
        </div>

        {/* Form Opini */}
        <form onSubmit={handleSubmit} className="px-4 pt-1 pb-3.5 sm:px-5 sm:pb-4">
        <textarea
          id="opini-input"
          aria-label="Bagikan opini Anda tentang buku ini"
          rows={2}
          maxLength={OPINION_MAX_LENGTH}
          value={draft}
          onChange={(e) => {
            setDraft(e.target.value);
            if (submitError) setSubmitError(null);
          }}
          placeholder="Bagikan opini Anda tentang buku ini"
          className="min-h-[64px] w-full resize-y rounded-xl border border-line bg-page px-3 py-2 text-sm leading-relaxed text-ink placeholder:text-ink-subtle focus:border-accent-line focus:outline-none focus:ring-2 focus:ring-accent-soft"
        />

        {submitError && (
          <p className="mt-1.5 text-xs font-medium text-rose-600 dark:text-rose-400">
            {submitError}
          </p>
        )}

        <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2.5">
          <div className="text-xs text-ink-subtle">
            {currentUser ? (
              <span>
                Mengirim sebagai{" "}
                <strong className="font-semibold text-ink-muted">
                  {currentUser.name}
                </strong>{" "}
                • {trimmedDraft.length}/{OPINION_MAX_LENGTH}
              </span>
            ) : (
              <span>
                <button
                  type="button"
                  onClick={promptAuth}
                  className="font-semibold text-accent-text underline-offset-2 hover:underline"
                >
                  Masuk
                </button>{" "}
                untuk mengirim opini • {trimmedDraft.length}/
                {OPINION_MAX_LENGTH}
              </span>
            )}
          </div>

          {currentUser ? (
            <button
              type="submit"
              disabled={!canSubmitDraft}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-sm shadow-emerald-600/20 transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Send className="h-3.5 w-3.5" />
              )}
              <span>{isSubmitting ? "Mengirim..." : "Kirim Opini"}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={promptAuth}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-sm shadow-emerald-600/20 transition hover:bg-emerald-700"
            >
              <Send className="h-3.5 w-3.5" />
              <span>Masuk &amp; Kirim</span>
            </button>
          )}
        </div>
      </form>

      {/* Accordion Daftar Opini */}
      {!isExpanded ? (
        <button
          type="button"
          aria-expanded={false}
          aria-controls="opini-panel"
          onClick={handleExpandOpinions}
          className="flex w-full items-center justify-between gap-3 rounded-b-2xl border-t border-line bg-page/40 px-4 py-2.5 text-left transition hover:bg-page/80 sm:px-5"
        >
          <span className="text-xs font-semibold text-ink-muted">
            {total > 0
              ? `Lihat ${total} opini`
              : isLoading
                ? "Memuat opini..."
                : "Lihat daftar opini (0)"}
          </span>
          <ChevronDown className="h-4 w-4 shrink-0 text-ink-muted" />
        </button>
      ) : (
        <div
          ref={panelRef}
          id="opini-panel"
          className="rounded-b-2xl border-t border-line"
        >
          <button
            type="button"
            aria-expanded={true}
            aria-controls="opini-panel"
            onClick={handleCollapseOpinions}
            style={{ top: "calc(var(--header-h, 73px) + var(--reader-toolbar-h, 0px))" }}
            className="sticky z-30 flex w-full items-center justify-between gap-3 border-b border-line bg-surface/95 px-4 py-2.5 text-left backdrop-blur-sm transition hover:bg-page/80 sm:px-5"
          >
            <span className="text-xs font-semibold text-ink-muted">
              Sembunyikan opini ({isLoading && total === 0 ? "..." : total})
            </span>
            <ChevronDown className="h-4 w-4 shrink-0 rotate-180 text-ink-muted" />
          </button>

          <div className="flex items-center justify-between gap-2 border-b border-line px-4 py-2 sm:px-5">
            <span className="text-xs font-semibold text-ink-subtle">
              {total > 0 ? `${total} opini` : "Daftar opini"}
            </span>
            <div
              role="group"
              aria-label="Urutkan opini"
              className="inline-flex rounded-xl border border-line bg-page p-0.5 text-xs"
            >
              <button
                type="button"
                onClick={() => setSort("newest")}
                className={`rounded-lg px-2.5 py-1 font-semibold transition ${
                  sort === "newest"
                    ? "bg-accent-soft text-accent-text"
                    : "text-ink-muted hover:text-ink"
                }`}
              >
                Terbaru
              </button>
              <button
                type="button"
                onClick={() => setSort("helpful")}
                className={`rounded-lg px-2.5 py-1 font-semibold transition ${
                  sort === "helpful"
                    ? "bg-accent-soft text-accent-text"
                    : "text-ink-muted hover:text-ink"
                }`}
              >
                Paling Bermanfaat
              </button>
            </div>
          </div>

          <div>

        {isLoading ? (
          <div className="divide-y divide-line">
            {[0, 1].map((idx) => (
              <div key={idx} className="animate-pulse px-4 py-4 sm:px-5">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-line" />
                  <div className="h-3.5 w-32 rounded bg-line" />
                </div>
                <div className="mt-3 h-3.5 w-full rounded bg-line" />
                <div className="mt-2 h-3.5 w-2/3 rounded bg-line" />
              </div>
            ))}
          </div>
        ) : fetchError ? (
          <div className="px-4 py-6 text-center sm:px-5">
            <p className="text-sm text-ink-muted">{fetchError}</p>
            <button
              type="button"
              onClick={() => void loadOpinions(sort, 0, false)}
              className="mt-3 inline-flex items-center rounded-xl border border-accent-line bg-accent-soft px-3.5 py-1.5 text-xs font-semibold text-accent-text transition hover:bg-accent-tint"
            >
              Coba Lagi
            </button>
          </div>
        ) : opinions.length === 0 ? (
          <div className="px-4 py-6 text-center sm:px-5">
            <p className="text-sm font-medium text-ink-muted">
              Belum ada opini tentang buku ini
            </p>
          </div>
        ) : (
          <div className="divide-y divide-line">
          {opinions.map((item) => {
            const isEdited = item.updatedAt > item.createdAt + 1500;
            const isEditing = editingId === item.id;
            const isConfirmingDelete = confirmDeleteId === item.id;
            const isVoting = votingIds.has(item.id);

            return (
              <article
                key={item.id}
                className="px-4 py-3 sm:px-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-2.5">
                    <AuthorAvatar
                      name={item.author.name}
                      image={item.author.image}
                    />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-ink">
                        {item.author.name}
                      </p>
                      <p className="text-xs text-ink-subtle">
                        {formatRelativeTime(item.createdAt)}
                        {isEdited && " • disunting"}
                      </p>
                    </div>
                  </div>

                  {(item.isOwner || item.canModerate) && !isEditing && (
                    <div className="flex shrink-0 items-center gap-1">
                      {item.isOwner && (
                        <button
                          type="button"
                          onClick={() => {
                            setEditingId(item.id);
                            setEditDraft(item.content);
                            setEditError(null);
                            setConfirmDeleteId(null);
                          }}
                          aria-label="Sunting opini"
                          className="rounded-lg p-1.5 text-ink-subtle transition hover:bg-page hover:text-ink"
                        >
                          <Edit3 className="h-3.5 w-3.5" />
                        </button>
                      )}
                      {item.canModerate && (
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteId(item.id)}
                          aria-label="Hapus opini"
                          className="rounded-lg p-1.5 text-ink-subtle transition hover:bg-page hover:text-rose-600 dark:hover:text-rose-400"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {isConfirmingDelete && (
                  <div className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs dark:border-rose-900/60 dark:bg-rose-950/40">
                    <span className="font-medium text-rose-700 dark:text-rose-300">
                      Hapus opini ini secara permanen?
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setConfirmDeleteId(null)}
                        disabled={deletingId === item.id}
                        className="rounded-lg px-2.5 py-1 font-semibold text-ink-muted hover:text-ink"
                      >
                        Batal
                      </button>
                      <button
                        type="button"
                        onClick={() => void handleDelete(item.id)}
                        disabled={deletingId === item.id}
                        className="rounded-lg bg-rose-600 px-2.5 py-1 font-semibold text-white hover:bg-rose-700 disabled:opacity-50"
                      >
                        {deletingId === item.id ? "Menghapus..." : "Ya, Hapus"}
                      </button>
                    </div>
                  </div>
                )}

                {isEditing ? (
                  <div className="mt-3">
                    <textarea
                      rows={3}
                      maxLength={OPINION_MAX_LENGTH}
                      value={editDraft}
                      onChange={(e) => {
                        setEditDraft(e.target.value);
                        if (editError) setEditError(null);
                      }}
                      className="w-full resize-y rounded-xl border border-line bg-page px-3 py-2 text-sm leading-relaxed text-ink focus:border-accent-line focus:outline-none"
                    />
                    {editError && (
                      <p className="mt-1.5 text-xs font-medium text-rose-600 dark:text-rose-400">
                        {editError}
                      </p>
                    )}
                    <div className="mt-2.5 flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingId(null);
                          setEditDraft("");
                          setEditError(null);
                        }}
                        disabled={isSavingEdit}
                        className="rounded-xl border border-line px-3 py-1.5 text-xs font-semibold text-ink-muted hover:text-ink"
                      >
                        Batal
                      </button>
                      <button
                        type="button"
                        onClick={() => void handleSaveEdit(item.id)}
                        disabled={isSavingEdit}
                        className="rounded-xl bg-emerald-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
                      >
                        {isSavingEdit ? "Menyimpan..." : "Simpan"}
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="mt-3 whitespace-pre-line break-words text-sm leading-relaxed text-ink">
                    {item.content}
                  </p>
                )}

                <div className="mt-3.5 flex items-center">
                  <button
                    type="button"
                    onClick={() => void handleToggleHelpful(item.id)}
                    disabled={isVoting}
                    aria-pressed={item.hasVoted}
                    aria-label={
                      item.hasVoted
                        ? "Batalkan tanda bermanfaat"
                        : "Tandai bermanfaat"
                    }
                    title="Bermanfaat"
                    className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition ${
                      item.hasVoted
                        ? "border-accent-line bg-accent-soft text-accent-text"
                        : "border-line bg-page text-ink-muted hover:border-accent-line hover:text-ink"
                    } disabled:opacity-60`}
                  >
                    <ThumbsUp className="h-3.5 w-3.5" />
                    {item.helpfulCount > 0 && (
                      <span className="font-bold">{item.helpfulCount}</span>
                    )}
                  </button>
                </div>
              </article>
            );
          })}
          </div>
        )}

        {hasMore && !isLoading && (
          <div className="rounded-b-2xl border-t border-line px-4 py-2.5 text-center sm:px-5">
            <button
              type="button"
              onClick={() => void loadOpinions(sort, opinions.length, true)}
              disabled={isLoadingMore}
              className="inline-flex items-center gap-2 rounded-xl border border-line bg-page px-4 py-1.5 text-xs font-semibold text-ink transition hover:border-accent-line hover:bg-surface disabled:opacity-50"
            >
              {isLoadingMore && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              <span>
                {isLoadingMore ? "Memuat..." : "Opini lainnya"}
              </span>
            </button>
          </div>
        )}
      </div>
          </div>
        )}
      </div>
    </section>
  );
}
