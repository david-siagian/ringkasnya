import { useCallback, useEffect, useState } from "react";

export const BOOKMARKS_STORAGE_KEY = "ringkasnya_bookmarks";
const BOOKMARKS_EVENT = "ringkasnya:bookmarks-changed";

function readStoredBookmarks(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(BOOKMARKS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item): item is string => typeof item === "string");
  } catch {
    return [];
  }
}

function writeStoredBookmarks(slugs: string[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(BOOKMARKS_STORAGE_KEY, JSON.stringify(slugs));
    window.dispatchEvent(new CustomEvent(BOOKMARKS_EVENT, { detail: slugs }));
  } catch {
    // Abaikan jika localStorage penuh atau diblokir
  }
}

/** Hook terpusat untuk menyimpan, membaca, dan menyinkronkan daftar bookmark buku. */
export function useBookmarks() {
  const [bookmarkedSlugs, setBookmarkedSlugs] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setBookmarkedSlugs(readStoredBookmarks());
    setMounted(true);

    const handleStorage = (e: StorageEvent) => {
      if (e.key === BOOKMARKS_STORAGE_KEY) {
        setBookmarkedSlugs(readStoredBookmarks());
      }
    };

    const handleCustomSync = (e: Event) => {
      const customEvent = e as CustomEvent<string[]>;
      if (Array.isArray(customEvent.detail)) {
        setBookmarkedSlugs(customEvent.detail);
      } else {
        setBookmarkedSlugs(readStoredBookmarks());
      }
    };

    window.addEventListener("storage", handleStorage);
    window.addEventListener(BOOKMARKS_EVENT, handleCustomSync);
    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener(BOOKMARKS_EVENT, handleCustomSync);
    };
  }, []);

  const isBookmarked = useCallback(
    (slug: string) => mounted && bookmarkedSlugs.includes(slug),
    [bookmarkedSlugs, mounted]
  );

  const toggleBookmark = useCallback((slug: string) => {
    setBookmarkedSlugs((prev) => {
      const exists = prev.includes(slug);
      const next = exists ? prev.filter((s) => s !== slug) : [slug, ...prev];
      writeStoredBookmarks(next);
      return next;
    });
  }, []);

  return {
    bookmarkedSlugs,
    bookmarkedCount: mounted ? bookmarkedSlugs.length : 0,
    mounted,
    isBookmarked,
    toggleBookmark,
  };
}
