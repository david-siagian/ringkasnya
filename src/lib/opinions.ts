export const OPINION_MAX_LENGTH = 1000;
export const OPINION_PAGE_SIZE = 10;

export type OpinionSortOption = "newest" | "helpful";

export interface BookOpinionItem {
  id: string;
  bookSlug: string;
  content: string;
  helpfulCount: number;
  hasVoted: boolean;
  isOwner: boolean;
  canModerate: boolean;
  createdAt: number;
  updatedAt: number;
  author: {
    id: string;
    name: string;
    image: string | null;
  };
}

export interface BookOpinionsResponse {
  opinions: BookOpinionItem[];
  total: number;
  hasMore: boolean;
}

/**
 * Validasi dan normalisasi isi opini sebagai plain-text murni.
 */
export function validateOpinionContent(
  raw: unknown
): { ok: true; content: string } | { ok: false; error: string } {
  if (typeof raw !== "string") {
    return { ok: false, error: "Isi opini harus berupa teks." };
  }

  const normalized = raw
    .replace(/\r\n?/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  if (normalized.length === 0) {
    return {
      ok: false,
      error: "Opini tidak boleh kosong.",
    };
  }

  if (normalized.length > OPINION_MAX_LENGTH) {
    return {
      ok: false,
      error: `Opini maksimal ${OPINION_MAX_LENGTH} karakter.`,
    };
  }

  return { ok: true, content: normalized };
}

export function jsonResponse(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    },
  });
}
