import { useCallback, useEffect, useState } from "react";

export const COMPLETED_BOOKS_STORAGE_KEY = "ringkasnya_completed_books";
const COMPLETED_BOOKS_EVENT = "ringkasnya:completed-books-changed";

function readStoredCompleted(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(COMPLETED_BOOKS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item): item is string => typeof item === "string");
  } catch {
    return [];
  }
}

function writeStoredCompleted(slugs: string[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      COMPLETED_BOOKS_STORAGE_KEY,
      JSON.stringify(slugs)
    );
    window.dispatchEvent(
      new CustomEvent(COMPLETED_BOOKS_EVENT, { detail: slugs })
    );
  } catch {
    // Abaikan jika localStorage penuh atau diblokir
  }
}

/** Hook terpusat untuk menyimpan, membaca, dan menyinkronkan daftar buku yang sudah selesai dibaca. */
export function useCompletedBooks() {
  const [completedSlugs, setCompletedSlugs] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setCompletedSlugs(readStoredCompleted());
    setMounted(true);

    const handleStorage = (e: StorageEvent) => {
      if (e.key === COMPLETED_BOOKS_STORAGE_KEY) {
        setCompletedSlugs(readStoredCompleted());
      }
    };

    const handleCustomSync = (e: Event) => {
      const customEvent = e as CustomEvent<string[]>;
      if (Array.isArray(customEvent.detail)) {
        setCompletedSlugs(customEvent.detail);
      } else {
        setCompletedSlugs(readStoredCompleted());
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
      writeStoredCompleted(next);
      return next;
    });
  }, []);

  const unmarkCompleted = useCallback((slug: string) => {
    setCompletedSlugs((prev) => {
      if (!prev.includes(slug)) return prev;
      const next = prev.filter((s) => s !== slug);
      writeStoredCompleted(next);
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
