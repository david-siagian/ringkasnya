import { authClient } from "@/lib/auth-client";
import type {
  ProgressUpdateInput,
  UserBookProgressItem,
} from "@/lib/progress";

export const BOOKMARKS_STORAGE_KEY = "ringkasnya_bookmarks";
export const BOOKMARKS_EVENT = "ringkasnya:bookmarks-changed";

export const COMPLETED_BOOKS_STORAGE_KEY = "ringkasnya_completed_books";
export const COMPLETED_BOOKS_EVENT = "ringkasnya:completed-books-changed";

export const PROGRESS_UPDATED_EVENT = "ringkasnya:progress-updated";

const SYNCED_USER_PREFIX = "ringkasnya_progress_synced_";

let cachedUserId: string | null | undefined = undefined;
let syncPromise: Promise<void> | null = null;
const progressMap = new Map<string, UserBookProgressItem>();

export function readStoredSlugList(storageKey: string): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item): item is string => typeof item === "string");
  } catch {
    return [];
  }
}

export function writeStoredSlugList(
  storageKey: string,
  eventName: string,
  slugs: string[]
): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(storageKey, JSON.stringify(slugs));
    window.dispatchEvent(new CustomEvent(eventName, { detail: slugs }));
  } catch {
    // Abaikan jika localStorage penuh atau diblokir
  }
}

function applyServerItemsToLocal(items: UserBookProgressItem[]): void {
  progressMap.clear();
  for (const item of items) {
    progressMap.set(item.bookSlug, item);
  }

  const bookmarkedSlugs = items
    .filter((item) => item.isBookmarked)
    .map((item) => item.bookSlug);
  const completedSlugs = items
    .filter((item) => item.progressPercent >= 100)
    .map((item) => item.bookSlug);

  writeStoredSlugList(BOOKMARKS_STORAGE_KEY, BOOKMARKS_EVENT, bookmarkedSlugs);
  writeStoredSlugList(
    COMPLETED_BOOKS_STORAGE_KEY,
    COMPLETED_BOOKS_EVENT,
    completedSlugs
  );

  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent(PROGRESS_UPDATED_EVENT, { detail: items })
    );
  }
}

async function resolveSessionUserId(): Promise<string | null> {
  if (cachedUserId !== undefined) return cachedUserId;
  try {
    const sessionResult = await authClient.getSession();
    const userId = sessionResult?.data?.user?.id ?? null;
    cachedUserId = userId;
    return userId;
  } catch {
    cachedUserId = null;
    return null;
  }
}

/**
 * Menarik dan menyinkronkan progres baca dari D1 sekali per sesi halaman.
 * Aman dipanggil dari banyak komponen sekaligus (deduplikasi via syncPromise).
 */
export function ensureProgressSynced(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (syncPromise) return syncPromise;

  syncPromise = (async () => {
    const userId = await resolveSessionUserId();
    if (!userId) return;

    const syncedKey = `${SYNCED_USER_PREFIX}${userId}`;
    let hasSyncedOnce = false;
    try {
      hasSyncedOnce = window.localStorage.getItem(syncedKey) === "1";
    } catch {
      hasSyncedOnce = false;
    }

    try {
      let response: Response;
      if (!hasSyncedOnce) {
        const localBookmarks = readStoredSlugList(BOOKMARKS_STORAGE_KEY);
        const localCompleted = readStoredSlugList(COMPLETED_BOOKS_STORAGE_KEY);
        response = await fetch("/api/progress/sync", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            bookmarkedSlugs: localBookmarks,
            completedSlugs: localCompleted,
          }),
        });
      } else {
        response = await fetch("/api/progress", {
          method: "GET",
          cache: "no-store",
        });
      }

      if (!response.ok) return;
      const data = (await response.json()) as {
        items?: UserBookProgressItem[];
      };
      if (Array.isArray(data.items)) {
        applyServerItemsToLocal(data.items);
        if (!hasSyncedOnce) {
          try {
            window.localStorage.setItem(syncedKey, "1");
          } catch {
            // Abaikan jika localStorage diblokir
          }
        }
      }
    } catch {
      // Tetap gunakan state localStorage jika jaringan gagal
    }
  })();

  return syncPromise;
}

/** Mengirim pembaruan progres satu buku ke D1 jika pengguna sudah masuk. */
export async function syncBookProgressUpdate(
  slug: string,
  payload: ProgressUpdateInput
): Promise<void> {
  if (typeof window === "undefined") return;
  const userId = await resolveSessionUserId();
  if (!userId) return;

  try {
    const response = await fetch(
      `/api/progress/${encodeURIComponent(slug)}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );
    if (!response.ok) return;
    const data = (await response.json()) as { item?: UserBookProgressItem };
    if (data.item) {
      progressMap.set(slug, data.item);
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent(PROGRESS_UPDATED_EVENT, {
            detail: Array.from(progressMap.values()),
          })
        );
      }
    }
  } catch {
    // Abaikan kegagalan jaringan sementara; localStorage tetap menyimpan state
  }
}

export function getCachedBookProgress(
  slug: string
): UserBookProgressItem | undefined {
  return progressMap.get(slug);
}

export function getAllCachedBookProgress(): UserBookProgressItem[] {
  return Array.from(progressMap.values());
}

export function getProgressSyncUserId(): Promise<string | null> {
  if (typeof window === "undefined") return Promise.resolve(null);
  return resolveSessionUserId();
}
