import { useCallback, useEffect, useState } from "react";
import {
  BOOKMARKS_EVENT,
  BOOKMARKS_STORAGE_KEY,
  ensureProgressSynced,
  readStoredSlugList,
  syncBookProgressUpdate,
  writeStoredSlugList,
} from "@/lib/progress-sync";

export { BOOKMARKS_STORAGE_KEY };

/** Hook terpusat untuk menyimpan, membaca, dan menyinkronkan daftar bookmark buku. */
export function useBookmarks() {
  const [bookmarkedSlugs, setBookmarkedSlugs] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setBookmarkedSlugs(readStoredSlugList(BOOKMARKS_STORAGE_KEY));
    setMounted(true);
    void ensureProgressSynced();

    const handleStorage = (e: StorageEvent) => {
      if (e.key === BOOKMARKS_STORAGE_KEY) {
        setBookmarkedSlugs(readStoredSlugList(BOOKMARKS_STORAGE_KEY));
      }
    };

    const handleCustomSync = (e: Event) => {
      const customEvent = e as CustomEvent<string[]>;
      if (Array.isArray(customEvent.detail)) {
        setBookmarkedSlugs(customEvent.detail);
      } else {
        setBookmarkedSlugs(readStoredSlugList(BOOKMARKS_STORAGE_KEY));
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
      writeStoredSlugList(BOOKMARKS_STORAGE_KEY, BOOKMARKS_EVENT, next);
      void syncBookProgressUpdate(slug, { isBookmarked: !exists });
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
