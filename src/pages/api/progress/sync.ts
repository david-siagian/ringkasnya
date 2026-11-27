import type { APIRoute } from "astro";
import { and, desc, eq, inArray } from "drizzle-orm";
import { getDb, schema } from "@/lib/db";
import {
  type ProgressSyncPayload,
  type UserBookProgressItem,
  jsonNoStoreResponse,
  normalizeLastMode,
  normalizeSlugList,
  parseChecklistJson,
} from "@/lib/progress";

export const prerender = false;

export const POST: APIRoute = async (context) => {
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

  let body: ProgressSyncPayload | null = null;
  try {
    body = (await context.request.json()) as ProgressSyncPayload;
  } catch {
    return jsonNoStoreResponse({ error: "Format payload tidak valid." }, 400);
  }

  const bookmarkedSlugs = normalizeSlugList(body?.bookmarkedSlugs);
  const completedSlugs = normalizeSlugList(body?.completedSlugs);
  const allCandidateSlugs = Array.from(
    new Set([...bookmarkedSlugs, ...completedSlugs])
  );

  try {
    const db = getDb(env.DB);

    if (allCandidateSlugs.length > 0) {
      const placeholders = allCandidateSlugs.map(() => "?").join(", ");
      const publishedRows = await env.DB.prepare(
        `SELECT slug FROM books WHERE is_published = 1 AND slug IN (${placeholders})`
      )
        .bind(...allCandidateSlugs)
        .all<{ slug: string }>();

      const validSlugs = new Set(
        (publishedRows.results ?? []).map((r) => r.slug)
      );

      const validBookmarked = new Set(
        bookmarkedSlugs.filter((s) => validSlugs.has(s))
      );
      const validCompleted = new Set(
        completedSlugs.filter((s) => validSlugs.has(s))
      );

      const slugsToMerge = Array.from(
        new Set([...validBookmarked, ...validCompleted])
      );

      if (slugsToMerge.length > 0) {
        const existingRows = await db
          .select()
          .from(schema.userBookProgress)
          .where(
            and(
              eq(schema.userBookProgress.userId, currentUser.id),
              inArray(schema.userBookProgress.bookSlug, slugsToMerge)
            )
          );

        const existingMap = new Map(
          existingRows.map((row) => [row.bookSlug, row])
        );
        const now = new Date();

        for (const slug of slugsToMerge) {
          const existing = existingMap.get(slug);
          const wantBookmark = validBookmarked.has(slug);
          const wantCompleted = validCompleted.has(slug);

          if (!existing) {
            await db.insert(schema.userBookProgress).values({
              id: crypto.randomUUID(),
              userId: currentUser.id,
              bookSlug: slug,
              isBookmarked: wantBookmark,
              lastMode: "quick",
              progressPercent: wantCompleted ? 100 : 0,
              checklistJson: "[]",
              updatedAt: now,
            });
          } else {
            const nextBookmarked = existing.isBookmarked || wantBookmark;
            const nextPercent = wantCompleted
              ? 100
              : existing.progressPercent;

            if (
              nextBookmarked !== existing.isBookmarked ||
              nextPercent !== existing.progressPercent
            ) {
              await db
                .update(schema.userBookProgress)
                .set({
                  isBookmarked: nextBookmarked,
                  progressPercent: nextPercent,
                  updatedAt: now,
                })
                .where(eq(schema.userBookProgress.id, existing.id));
            }
          }
        }
      }
    }

    const updatedRows = await db
      .select()
      .from(schema.userBookProgress)
      .where(eq(schema.userBookProgress.userId, currentUser.id))
      .orderBy(desc(schema.userBookProgress.updatedAt));

    const items: UserBookProgressItem[] = updatedRows.map((row) => ({
      bookSlug: row.bookSlug,
      isBookmarked: Boolean(row.isBookmarked),
      lastMode: normalizeLastMode(row.lastMode) ?? "quick",
      progressPercent: row.progressPercent,
      checklist: parseChecklistJson(row.checklistJson),
      updatedAt: row.updatedAt.getTime(),
    }));

    return jsonNoStoreResponse({ items });
  } catch (error) {
    console.error("[POST /api/progress/sync] Gagal menyinkronkan:", error);
    return jsonNoStoreResponse(
      { error: "Gagal menyinkronkan progres baca." },
      500
    );
  }
};
