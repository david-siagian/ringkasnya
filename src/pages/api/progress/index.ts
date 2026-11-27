import type { APIRoute } from "astro";
import { desc, eq } from "drizzle-orm";
import { getDb, schema } from "@/lib/db";
import {
  type UserBookProgressItem,
  jsonNoStoreResponse,
  normalizeLastMode,
  parseChecklistJson,
} from "@/lib/progress";

export const prerender = false;

export const GET: APIRoute = async (context) => {
  const env = context.locals.runtime?.env;
  if (!env?.DB) {
    return jsonNoStoreResponse({ error: "Database belum terkonfigurasi." }, 500);
  }

  const currentUser = context.locals.user;
  if (!currentUser) {
    return jsonNoStoreResponse(
      { error: "Silakan masuk terlebih dahulu." },
      401
    );
  }

  try {
    const db = getDb(env.DB);
    const rows = await db
      .select()
      .from(schema.userBookProgress)
      .where(eq(schema.userBookProgress.userId, currentUser.id))
      .orderBy(desc(schema.userBookProgress.updatedAt));

    const items: UserBookProgressItem[] = rows.map((row) => ({
      bookSlug: row.bookSlug,
      isBookmarked: Boolean(row.isBookmarked),
      lastMode: normalizeLastMode(row.lastMode) ?? "quick",
      progressPercent: row.progressPercent,
      checklist: parseChecklistJson(row.checklistJson),
      updatedAt: row.updatedAt.getTime(),
    }));

    return jsonNoStoreResponse({ items });
  } catch (error) {
    console.error("[GET /api/progress] Gagal memuat progres:", error);
    return jsonNoStoreResponse({ error: "Gagal memuat progres baca." }, 500);
  }
};
