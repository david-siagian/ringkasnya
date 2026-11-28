import { useCallback, useEffect, useState } from "react";
import {
  ensureProgressSynced,
  getAllCachedBookProgress,
  getProgressSyncUserId,
  PROGRESS_UPDATED_EVENT,
} from "@/lib/progress-sync";
import type { UserBookProgressItem } from "@/lib/progress";

function toProgressMap(items: UserBookProgressItem[]): Record<string, number> {
  const map: Record<string, number> = {};
  for (const item of items) {
    map[item.bookSlug] = item.progressPercent;
  }
  return map;
}

/** Hook untuk membaca persentase progres baca per buku bagi pengguna yang sudah login. */
export function useReadingProgress() {
  const [progressBySlug, setProgressBySlug] = useState<Record<string, number>>({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setProgressBySlug(toProgressMap(getAllCachedBookProgress()));

    void getProgressSyncUserId().then((userId) => {
      setIsLoggedIn(Boolean(userId));
    });
    void ensureProgressSynced();

    const handleProgressUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<UserBookProgressItem[]>;
      if (Array.isArray(customEvent.detail)) {
        setProgressBySlug(toProgressMap(customEvent.detail));
      } else {
        setProgressBySlug(toProgressMap(getAllCachedBookProgress()));
      }
    };

    window.addEventListener(PROGRESS_UPDATED_EVENT, handleProgressUpdate);
    return () => {
      window.removeEventListener(PROGRESS_UPDATED_EVENT, handleProgressUpdate);
    };
  }, []);

  const getProgressPercent = useCallback(
    (slug: string) => (mounted ? (progressBySlug[slug] ?? 0) : 0),
    [progressBySlug, mounted]
  );

  return {
    progressBySlug,
    isLoggedIn,
    mounted,
    getProgressPercent,
  };
}
