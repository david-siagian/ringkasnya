import type { APIRoute } from "astro";
import { and, eq } from "drizzle-orm";
import { getDb, schema } from "@/lib/db";
import {
  type UserBookProgressItem,
  isValidBookSlug,
  jsonNoStoreResponse,
  normalizeChecklist,
  normalizeLastMode,
  normalizeProgressPercent,
  parseChecklistJson,
} from "@/lib/progress";

export const prerender = false;

interface PutProgressBody {
  isBookmarked?: unknown;
  lastMode?: unknown;
  progressPercent?: unknown;
  checklist?: unknown;
}

export const PUT: APIRoute = async (context) => {
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

  const rawSlug = context.params.slug?.trim();
  if (!isValidBookSlug(rawSlug)) {
    return jsonNoStoreResponse({ error: "Slug buku tidak valid." }, 400);
  }
  const slug = rawSlug;

  let body: PutProgressBody | null = null;
  try {
    body = (await context.request.json()) as PutProgressBody;
  } catch {
    return jsonNoStoreResponse({ error: "Format payload tidak valid." }, 400);
  }

  if (!body || typeof body !== "object") {
    return jsonNoStoreResponse({ error: "Payload tidak valid." }, 400);
  }

  let nextBookmarked: boolean | undefined;
  if (body.isBookmarked !== undefined) {
    if (typeof body.isBookmarked !== "boolean") {
      return jsonNoStoreResponse(
        { error: "Nilai isBookmarked harus boolean." },
        400
      );
    }
    nextBookmarked = body.isBookmarked;
  }

  let nextLastMode: "quick" | "deep" | undefined;
  if (body.lastMode !== undefined) {
    const parsed = normalizeLastMode(body.lastMode);
    if (!parsed) {
      return jsonNoStoreResponse(
        { error: "Nilai lastMode harus 'quick' atau 'deep'." },
        400
      );
    }
    nextLastMode = parsed;
  }

  let nextProgressPercent: number | undefined;
  if (body.progressPercent !== undefined) {
    const parsed = normalizeProgressPercent(body.progressPercent);
    if (parsed === null) {
      return jsonNoStoreResponse(
        { error: "Nilai progressPercent harus angka 0–100." },
        400
      );
    }
    nextProgressPercent = parsed;
  }

  let nextChecklist: number[] | undefined;
  if (body.checklist !== undefined) {
    const parsed = normalizeChecklist(body.checklist);
    if (!parsed) {
      return jsonNoStoreResponse(
        { error: "Nilai checklist harus array bilangan bulat non-negatif." },
        400
      );
    }
    nextChecklist = parsed;
  }

  if (
    nextBookmarked === undefined &&
    nextLastMode === undefined &&
    nextProgressPercent === undefined &&
    nextChecklist === undefined
  ) {
    return jsonNoStoreResponse(
      { error: "Tidak ada field progres yang diperbarui." },
      400
    );
  }

  try {
    const existingBook = await env.DB.prepare(
      "SELECT slug FROM books WHERE slug = ? AND is_published = 1 LIMIT 1"
    )
      .bind(slug)
      .first<{ slug: string }>();

    if (!existingBook) {
      return jsonNoStoreResponse({ error: "Buku tidak ditemukan." }, 404);
    }

    const db = getDb(env.DB);
    const [existing] = await db
      .select()
      .from(schema.userBookProgress)
      .where(
        and(
          eq(schema.userBookProgress.userId, currentUser.id),
          eq(schema.userBookProgress.bookSlug, slug)
        )
      )
      .limit(1);

    const now = new Date();

    if (!existing) {
      const created: UserBookProgressItem = {
        bookSlug: slug,
        isBookmarked: nextBookmarked ?? false,
        lastMode: nextLastMode ?? "quick",
        progressPercent: nextProgressPercent ?? 0,
        checklist: nextChecklist ?? [],
        updatedAt: now.getTime(),
      };

      await db.insert(schema.userBookProgress).values({
        id: crypto.randomUUID(),
        userId: currentUser.id,
        bookSlug: slug,
        isBookmarked: created.isBookmarked,
        lastMode: created.lastMode,
        progressPercent: created.progressPercent,
        checklistJson: JSON.stringify(created.checklist),
        updatedAt: now,
      });

      return jsonNoStoreResponse({ item: created });
    }

    const updated: UserBookProgressItem = {
      bookSlug: slug,
      isBookmarked: nextBookmarked ?? Boolean(existing.isBookmarked),
      lastMode: nextLastMode ?? normalizeLastMode(existing.lastMode) ?? "quick",
      progressPercent: nextProgressPercent ?? existing.progressPercent,
      checklist:
        nextChecklist ?? parseChecklistJson(existing.checklistJson),
      updatedAt: now.getTime(),
    };

    await db
      .update(schema.userBookProgress)
      .set({
        isBookmarked: updated.isBookmarked,
        lastMode: updated.lastMode,
        progressPercent: updated.progressPercent,
        checklistJson: JSON.stringify(updated.checklist),
        updatedAt: now,
      })
      .where(eq(schema.userBookProgress.id, existing.id));

    return jsonNoStoreResponse({ item: updated });
  } catch (error) {
    console.error("[PUT /api/progress] Gagal menyimpan progres:", error);
    return jsonNoStoreResponse(
      { error: "Gagal menyimpan progres baca." },
      500
    );
  }
};
