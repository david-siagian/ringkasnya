export type ThemeMode = "light" | "dark";
export type ReaderThemeMode = "light" | "sepia" | "dark";

export const THEME_STORAGE_KEY = "ringkasnya_theme";
export const READER_THEME_STORAGE_KEY = "ringkasnya_reader_theme";

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

/** Resolve the global site theme from storage or system preference (ignoring temporary reader overrides). */
export function getGlobalTheme(): ThemeMode {
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

/** Resolve the currently active theme from DOM class, storage, or system preference. */
export function getResolvedTheme(): ThemeMode {
  if (typeof document === "undefined") return "light";
  if (document.documentElement.classList.contains("dark")) return "dark";
  return getGlobalTheme();
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

/** Read explicit reading-mode background theme preference from localStorage, if valid. */
export function getStoredReaderTheme(): ReaderThemeMode | null {
  if (typeof window === "undefined") return null;
  try {
    const saved = window.localStorage.getItem(READER_THEME_STORAGE_KEY);
    return saved === "light" || saved === "sepia" || saved === "dark"
      ? saved
      : null;
  } catch {
    return null;
  }
}

/** Resolve initial reading-mode theme: saved preference or fallback to global site theme. */
export function getInitialReaderTheme(): ReaderThemeMode {
  return getStoredReaderTheme() ?? getGlobalTheme();
}

/** Apply reading-mode background theme (scoped to active reading session) without altering global theme storage. */
export function applyReaderTheme(theme: ReaderThemeMode, persist = true): void {
  if (typeof document === "undefined") return;
  const root = document.documentElement;

  if (theme === "dark") {
    root.classList.add("dark");
    root.removeAttribute("data-reader-theme");
    root.style.colorScheme = "dark";
  } else if (theme === "sepia") {
    root.classList.remove("dark");
    root.setAttribute("data-reader-theme", "sepia");
    root.style.colorScheme = "light";
  } else {
    root.classList.remove("dark");
    root.removeAttribute("data-reader-theme");
    root.style.colorScheme = "light";
  }

  if (persist && typeof window !== "undefined") {
    try {
      window.localStorage.setItem(READER_THEME_STORAGE_KEY, theme);
    } catch {
      // ignore storage error
    }
  }
}

/** Clear reading-mode override and restore the user's global site theme. */
export function clearReaderTheme(): void {
  if (typeof document === "undefined") return;
  document.documentElement.removeAttribute("data-reader-theme");
  applyTheme(getGlobalTheme(), false);
}
