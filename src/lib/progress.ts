export type ProgressReadMode = "quick" | "deep";

export interface UserBookProgressItem {
  bookSlug: string;
  isBookmarked: boolean;
  lastMode: ProgressReadMode;
  progressPercent: number;
  checklist: number[];
  updatedAt: number;
}

export interface ProgressUpdateInput {
  isBookmarked?: boolean;
  lastMode?: ProgressReadMode;
  progressPercent?: number;
  checklist?: number[];
}

export interface ProgressSyncPayload {
  bookmarkedSlugs?: unknown;
  completedSlugs?: unknown;
}

const SLUG_REGEX = /^[a-z0-9][a-z0-9-_]{0,119}$/i;
const MAX_CHECKLIST_ITEMS = 100;
const MAX_SYNC_SLUGS = 200;

export function jsonNoStoreResponse(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}

export function isValidBookSlug(raw: unknown): raw is string {
  return typeof raw === "string" && SLUG_REGEX.test(raw.trim());
}

export function normalizeSlugList(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  const seen = new Set<string>();
  for (const item of raw) {
    if (!isValidBookSlug(item)) continue;
    seen.add(item.trim());
    if (seen.size >= MAX_SYNC_SLUGS) break;
  }
  return Array.from(seen);
}

export function normalizeLastMode(raw: unknown): ProgressReadMode | null {
  if (raw === "quick" || raw === "deep") return raw;
  return null;
}

export function normalizeProgressPercent(raw: unknown): number | null {
  if (typeof raw !== "number" || !Number.isFinite(raw)) return null;
  return Math.max(0, Math.min(100, Math.round(raw)));
}

export function normalizeChecklist(raw: unknown): number[] | null {
  if (!Array.isArray(raw)) return null;
  const unique = new Set<number>();
  for (const item of raw) {
    if (typeof item !== "number" || !Number.isInteger(item) || item < 0) {
      return null;
    }
    unique.add(item);
    if (unique.size >= MAX_CHECKLIST_ITEMS) break;
  }
  return Array.from(unique).sort((a, b) => a - b);
}

export function parseChecklistJson(raw: string): number[] {
  try {
    const parsed = JSON.parse(raw);
    return normalizeChecklist(parsed) ?? [];
  } catch {
    return [];
  }
}
