export type ThemeMode = "light" | "dark";

export const THEME_STORAGE_KEY = "ringkasnya_theme";

/** Read explicit user theme preference from localStorage, if valid. */
export function getStoredTheme(): ThemeMode | null {
  if (typeof window === "undefined") return null;
  try {
    const saved = window.localStorage.getItem(THEME_STORAGE_KEY);
    return saved === "dark" || saved === "light" ? saved : null;
  } catch {
    return null;
  }
}

/** Resolve the currently active theme from DOM class, storage, or system preference. */
export function getResolvedTheme(): ThemeMode {
  if (typeof document === "undefined") return "light";
  if (document.documentElement.classList.contains("dark")) return "dark";
  const stored = getStoredTheme();
  if (stored) return stored;
  if (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    return "dark";
  }
  return "light";
}

/** Apply theme class and color-scheme to documentElement, optionally persisting to localStorage. */
export function applyTheme(theme: ThemeMode, persist = true): void {
  if (typeof document === "undefined") return;
  const isDark = theme === "dark";
  document.documentElement.classList.toggle("dark", isDark);
  document.documentElement.style.colorScheme = theme;

  if (persist && typeof window !== "undefined") {
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // ignore storage error
    }
  }
}
