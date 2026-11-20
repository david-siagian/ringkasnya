import { useCallback, useEffect, useState } from "react";
import {
  applyTheme,
  getResolvedTheme,
  getStoredTheme,
  THEME_STORAGE_KEY,
  type ThemeMode,
} from "@/lib/theme";

/** Centralized React hook for theme state, toggle, and system/tab synchronization. */
export function useTheme() {
  const [theme, setTheme] = useState<ThemeMode>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTheme(getResolvedTheme());
    setMounted(true);

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      if (getStoredTheme() !== null) return;
      const nextTheme: ThemeMode = e.matches ? "dark" : "light";
      applyTheme(nextTheme, false);
      setTheme(nextTheme);
    };

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key !== THEME_STORAGE_KEY) return;
      const nextTheme: ThemeMode =
        e.newValue === "dark" || e.newValue === "light"
          ? e.newValue
          : getResolvedTheme();
      applyTheme(nextTheme, false);
      setTheme(nextTheme);
    };

    mediaQuery.addEventListener("change", handleSystemThemeChange);
    window.addEventListener("storage", handleStorageChange);

    return () => {
      mediaQuery.removeEventListener("change", handleSystemThemeChange);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const nextTheme: ThemeMode = prev === "dark" ? "light" : "dark";
      applyTheme(nextTheme, true);
      return nextTheme;
    });
  }, []);

  return {
    theme,
    isDark: mounted && theme === "dark",
    mounted,
    toggleTheme,
  };
}
