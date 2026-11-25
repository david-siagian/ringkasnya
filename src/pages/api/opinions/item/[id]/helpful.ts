import type { APIRoute } from "astro";
import { and, eq, sql } from "drizzle-orm";
import { getDb, schema } from "@/lib/db";
import { jsonResponse } from "@/lib/opinions";

export const prerender = false;

export const POST: APIRoute = async (context) => {
  const env = context.locals.runtime?.env;
  if (!env?.DB) {
    return jsonResponse({ error: "Database belum terkonfigurasi." }, 500);
  }

  const currentUser = context.locals.user;
  if (!currentUser) {
    return jsonResponse(
      { error: "Silakan masuk terlebih dahulu untuk memberi apresiasi." },
      401
    );
  }

  const opinionId = context.params.id?.trim();
  if (!opinionId) {
    return jsonResponse({ error: "ID opini tidak valid." }, 400);
  }

  try {
    const db = getDb(env.DB);
    const [existingOpinion] = await db
      .select({ id: schema.bookOpinions.id })
      .from(schema.bookOpinions)
      .where(eq(schema.bookOpinions.id, opinionId))
      .limit(1);

    if (!existingOpinion) {
      return jsonResponse({ error: "Opini tidak ditemukan." }, 404);
    }

    const [existingVote] = await db
      .select({ id: schema.bookOpinionVotes.id })
      .from(schema.bookOpinionVotes)
      .where(
        and(
          eq(schema.bookOpinionVotes.opinionId, opinionId),
          eq(schema.bookOpinionVotes.userId, currentUser.id)
        )
      )
      .limit(1);

    if (existingVote) {
      await db
        .delete(schema.bookOpinionVotes)
        .where(eq(schema.bookOpinionVotes.id, existingVote.id));

      const [updated] = await db
        .update(schema.bookOpinions)
        .set({
          helpfulCount: sql`MAX(0, ${schema.bookOpinions.helpfulCount} - 1)`,
        })
        .where(eq(schema.bookOpinions.id, opinionId))
        .returning({ helpfulCount: schema.bookOpinions.helpfulCount });

      return jsonResponse({
        helpfulCount: updated?.helpfulCount ?? 0,
        hasVoted: false,
      });
    }

    await db.insert(schema.bookOpinionVotes).values({
      id: crypto.randomUUID(),
      opinionId,
      userId: currentUser.id,
      createdAt: new Date(),
    });

    const [updated] = await db
      .update(schema.bookOpinions)
      .set({
        helpfulCount: sql`${schema.bookOpinions.helpfulCount} + 1`,
      })
      .where(eq(schema.bookOpinions.id, opinionId))
      .returning({ helpfulCount: schema.bookOpinions.helpfulCount });

    return jsonResponse({
      helpfulCount: updated?.helpfulCount ?? 1,
      hasVoted: true,
    });
  } catch (error) {
    console.error("[POST /api/opinions/helpful] Gagal memproses vote:", error);
    return jsonResponse({ error: "Gagal memproses apresiasi." }, 500);
  }
};
