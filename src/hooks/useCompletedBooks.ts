import { useCallback, useEffect, useState } from "react";
import {
  COMPLETED_BOOKS_EVENT,
  COMPLETED_BOOKS_STORAGE_KEY,
  ensureProgressSynced,
  readStoredSlugList,
  syncBookProgressUpdate,
  writeStoredSlugList,
} from "@/lib/progress-sync";

export { COMPLETED_BOOKS_STORAGE_KEY };

/** Hook terpusat untuk menyimpan, membaca, dan menyinkronkan daftar buku yang sudah selesai dibaca. */
export function useCompletedBooks() {
  const [completedSlugs, setCompletedSlugs] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setCompletedSlugs(readStoredSlugList(COMPLETED_BOOKS_STORAGE_KEY));
    setMounted(true);
    void ensureProgressSynced();

    const handleStorage = (e: StorageEvent) => {
      if (e.key === COMPLETED_BOOKS_STORAGE_KEY) {
        setCompletedSlugs(readStoredSlugList(COMPLETED_BOOKS_STORAGE_KEY));
      }
    };

    const handleCustomSync = (e: Event) => {
      const customEvent = e as CustomEvent<string[]>;
      if (Array.isArray(customEvent.detail)) {
        setCompletedSlugs(customEvent.detail);
      } else {
        setCompletedSlugs(readStoredSlugList(COMPLETED_BOOKS_STORAGE_KEY));
      }
    };

    window.addEventListener("storage", handleStorage);
    window.addEventListener(COMPLETED_BOOKS_EVENT, handleCustomSync);
    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener(COMPLETED_BOOKS_EVENT, handleCustomSync);
    };
  }, []);

  const isCompleted = useCallback(
    (slug: string) => mounted && completedSlugs.includes(slug),
    [completedSlugs, mounted]
  );

  const markCompleted = useCallback((slug: string) => {
    setCompletedSlugs((prev) => {
      if (prev.includes(slug)) return prev;
      const next = [slug, ...prev];
      writeStoredSlugList(
        COMPLETED_BOOKS_STORAGE_KEY,
        COMPLETED_BOOKS_EVENT,
        next
      );
      void syncBookProgressUpdate(slug, { progressPercent: 100 });
      return next;
    });
  }, []);

  const unmarkCompleted = useCallback((slug: string) => {
    setCompletedSlugs((prev) => {
      if (!prev.includes(slug)) return prev;
      const next = prev.filter((s) => s !== slug);
      writeStoredSlugList(
        COMPLETED_BOOKS_STORAGE_KEY,
        COMPLETED_BOOKS_EVENT,
        next
      );
      void syncBookProgressUpdate(slug, { progressPercent: 0 });
      return next;
    });
  }, []);

  return {
    completedSlugs,
    completedCount: mounted ? completedSlugs.length : 0,
    mounted,
    isCompleted,
    markCompleted,
    unmarkCompleted,
  };
}
