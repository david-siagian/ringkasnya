import type { APIRoute } from "astro";
import { and, desc, eq, inArray, sql } from "drizzle-orm";
import { getDb, schema } from "@/lib/db";
import {
  type BookOpinionItem,
  OPINION_PAGE_SIZE,
  jsonResponse,
  validateOpinionContent,
} from "@/lib/opinions";

export const prerender = false;

export const GET: APIRoute = async (context) => {
  const env = context.locals.runtime?.env;
  if (!env?.DB) {
    return jsonResponse({ error: "Database belum terkonfigurasi." }, 500);
  }

  const slug = context.params.slug?.trim();
  if (!slug) {
    return jsonResponse({ error: "Slug buku tidak valid." }, 400);
  }

  const url = new URL(context.request.url);
  const sort = url.searchParams.get("sort") === "helpful" ? "helpful" : "newest";
  const rawLimit = Number.parseInt(
    url.searchParams.get("limit") ?? String(OPINION_PAGE_SIZE),
    10
  );
  const rawOffset = Number.parseInt(url.searchParams.get("offset") ?? "0", 10);
  const limit = Number.isFinite(rawLimit)
    ? Math.max(1, Math.min(20, rawLimit))
    : OPINION_PAGE_SIZE;
  const offset = Number.isFinite(rawOffset) ? Math.max(0, rawOffset) : 0;

  try {
    const db = getDb(env.DB);
    const currentUser = context.locals.user;

    const [countRow] = await db
      .select({ total: sql<number>`count(*)` })
      .from(schema.bookOpinions)
      .where(eq(schema.bookOpinions.bookSlug, slug));

    const total = Number(countRow?.total ?? 0);

    const rows = await db
      .select({
        id: schema.bookOpinions.id,
        bookSlug: schema.bookOpinions.bookSlug,
        userId: schema.bookOpinions.userId,
        content: schema.bookOpinions.content,
        helpfulCount: schema.bookOpinions.helpfulCount,
        createdAt: schema.bookOpinions.createdAt,
        updatedAt: schema.bookOpinions.updatedAt,
        authorName: schema.users.name,
        authorImage: schema.users.image,
      })
      .from(schema.bookOpinions)
      .innerJoin(schema.users, eq(schema.bookOpinions.userId, schema.users.id))
      .where(eq(schema.bookOpinions.bookSlug, slug))
      .orderBy(
        ...(sort === "helpful"
          ? [
              desc(schema.bookOpinions.helpfulCount),
              desc(schema.bookOpinions.createdAt),
            ]
          : [desc(schema.bookOpinions.createdAt)])
      )
      .limit(limit)
      .offset(offset);

    const votedSet = new Set<string>();
    if (currentUser && rows.length > 0) {
      const opinionIds = rows.map((row) => row.id);
      const votes = await db
        .select({ opinionId: schema.bookOpinionVotes.opinionId })
        .from(schema.bookOpinionVotes)
        .where(
          and(
            eq(schema.bookOpinionVotes.userId, currentUser.id),
            inArray(schema.bookOpinionVotes.opinionId, opinionIds)
          )
        );
      for (const vote of votes) {
        votedSet.add(vote.opinionId);
      }
    }

    const opinions: BookOpinionItem[] = rows.map((row) => {
      const isOwner = Boolean(currentUser && row.userId === currentUser.id);
      const canModerate = Boolean(
        currentUser &&
          (row.userId === currentUser.id || currentUser.role === "admin")
      );
      return {
        id: row.id,
        bookSlug: row.bookSlug,
        content: row.content,
        helpfulCount: row.helpfulCount,
        hasVoted: votedSet.has(row.id),
        isOwner,
        canModerate,
        createdAt: row.createdAt.getTime(),
        updatedAt: row.updatedAt.getTime(),
        author: {
          id: row.userId,
          name: row.authorName,
          image: row.authorImage,
        },
      };
    });

    return jsonResponse({
      opinions,
      total,
      hasMore: offset + opinions.length < total,
    });
  } catch (error) {
    console.error("[GET /api/opinions] Gagal memuat opini:", error);
    return jsonResponse({ error: "Gagal memuat opini." }, 500);
  }
};

export const POST: APIRoute = async (context) => {
  const env = context.locals.runtime?.env;
  if (!env?.DB) {
    return jsonResponse({ error: "Database belum terkonfigurasi." }, 500);
  }

  const currentUser = context.locals.user;
  if (!currentUser) {
    return jsonResponse(
      { error: "Silakan masuk terlebih dahulu untuk mengirim opini." },
      401
    );
  }

  const slug = context.params.slug?.trim();
  if (!slug) {
    return jsonResponse({ error: "Slug buku tidak valid." }, 400);
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
    const existingBook = await env.DB.prepare(
      "SELECT slug FROM books WHERE slug = ? AND is_published = 1 LIMIT 1"
    )
      .bind(slug)
      .first<{ slug: string }>();

    if (!existingBook) {
      return jsonResponse({ error: "Buku tidak ditemukan." }, 404);
    }

    const now = new Date();
    const id = crypto.randomUUID();
    const db = getDb(env.DB);

    await db.insert(schema.bookOpinions).values({
      id,
      bookSlug: slug,
      userId: currentUser.id,
      content: validation.content,
      helpfulCount: 0,
      createdAt: now,
      updatedAt: now,
    });

    const opinion: BookOpinionItem = {
      id,
      bookSlug: slug,
      content: validation.content,
      helpfulCount: 0,
      hasVoted: false,
      isOwner: true,
      canModerate: true,
      createdAt: now.getTime(),
      updatedAt: now.getTime(),
      author: {
        id: currentUser.id,
        name: currentUser.name,
        image: currentUser.image ?? null,
      },
    };

    return jsonResponse({ opinion }, 201);
  } catch (error) {
    console.error("[POST /api/opinions] Gagal menyimpan opini:", error);
    return jsonResponse({ error: "Gagal menyimpan opini. Coba lagi." }, 500);
  }
};
