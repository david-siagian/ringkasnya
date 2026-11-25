import type { APIRoute } from "astro";
import { eq } from "drizzle-orm";
import { getDb, schema } from "@/lib/db";
import { jsonResponse, validateOpinionContent } from "@/lib/opinions";

export const prerender = false;

export const PATCH: APIRoute = async (context) => {
  const env = context.locals.runtime?.env;
  if (!env?.DB) {
    return jsonResponse({ error: "Database belum terkonfigurasi." }, 500);
  }

  const currentUser = context.locals.user;
  if (!currentUser) {
    return jsonResponse(
      { error: "Silakan masuk terlebih dahulu untuk menyunting opini." },
      401
    );
  }

  const id = context.params.id?.trim();
  if (!id) {
    return jsonResponse({ error: "ID opini tidak valid." }, 400);
  }

  let body: { content?: unknown } | null = null;
  try {
    body = (await context.request.json()) as { content?: unknown };
  } catch {
    return jsonResponse({ error: "Format payload tidak valid." }, 400);
  }

  const validation = validateOpinionContent(body?.content);
  if (!validation.ok) {
    return jsonResponse({ error: validation.error }, 400);
  }

  try {
    const db = getDb(env.DB);
    const [existing] = await db
      .select({
        id: schema.bookOpinions.id,
        userId: schema.bookOpinions.userId,
      })
      .from(schema.bookOpinions)
      .where(eq(schema.bookOpinions.id, id))
      .limit(1);

    if (!existing) {
      return jsonResponse({ error: "Opini tidak ditemukan." }, 404);
    }

    if (existing.userId !== currentUser.id) {
      return jsonResponse(
        { error: "Anda tidak memiliki izin untuk menyunting opini ini." },
        403
      );
    }

    const now = new Date();
    await db
      .update(schema.bookOpinions)
      .set({
        content: validation.content,
        updatedAt: now,
      })
      .where(eq(schema.bookOpinions.id, id));

    return jsonResponse({
      id,
      content: validation.content,
      updatedAt: now.getTime(),
    });
  } catch (error) {
    console.error("[PATCH /api/opinions/item] Gagal menyunting opini:", error);
    return jsonResponse({ error: "Gagal memperbarui opini." }, 500);
  }
};

export const DELETE: APIRoute = async (context) => {
  const env = context.locals.runtime?.env;
  if (!env?.DB) {
    return jsonResponse({ error: "Database belum terkonfigurasi." }, 500);
  }

  const currentUser = context.locals.user;
  if (!currentUser) {
    return jsonResponse(
      { error: "Silakan masuk terlebih dahulu untuk menghapus opini." },
      401
    );
  }

  const id = context.params.id?.trim();
  if (!id) {
    return jsonResponse({ error: "ID opini tidak valid." }, 400);
  }

  try {
    const db = getDb(env.DB);
    const [existing] = await db
      .select({
        id: schema.bookOpinions.id,
        userId: schema.bookOpinions.userId,
      })
      .from(schema.bookOpinions)
      .where(eq(schema.bookOpinions.id, id))
      .limit(1);

    if (!existing) {
      return jsonResponse({ error: "Opini tidak ditemukan." }, 404);
    }

    const canDelete =
      existing.userId === currentUser.id || currentUser.role === "admin";
    if (!canDelete) {
      return jsonResponse(
        { error: "Anda tidak memiliki izin untuk menghapus opini ini." },
        403
      );
    }

    await db
      .delete(schema.bookOpinions)
      .where(eq(schema.bookOpinions.id, id));

    return jsonResponse({ deleted: true, id });
  } catch (error) {
    console.error("[DELETE /api/opinions/item] Gagal menghapus opini:", error);
    return jsonResponse({ error: "Gagal menghapus opini." }, 500);
  }
};
