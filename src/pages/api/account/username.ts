import type { APIRoute } from "astro";
import { validateUsername } from "@/lib/auth-helpers";

export const prerender = false;

export const POST: APIRoute = async (context) => {
  const user = context.locals.user;
  const session = context.locals.session;
  if (!user || !session) {
    return Response.json(
      { error: "Silakan masuk terlebih dahulu." },
      { status: 401 }
    );
  }

  const env = context.locals.runtime?.env;
  if (!env?.DB) {
    return Response.json(
      { error: "Database D1 belum terkonfigurasi pada runtime ini." },
      { status: 500 }
    );
  }

  let body: { username?: string };
  try {
    body = (await context.request.json()) as { username?: string };
  } catch {
    return Response.json({ error: "Format permintaan tidak valid." }, { status: 400 });
  }

  const check = validateUsername(body.username ?? "");
  if (!check.valid) {
    return Response.json(
      { error: check.error || "Format username tidak valid." },
      { status: 400 }
    );
  }

  const existing = await env.DB.prepare(
    "SELECT id FROM users WHERE username = ? AND id != ? LIMIT 1"
  )
    .bind(check.normalized, user.id)
    .first<{ id: string }>();

  if (existing) {
    return Response.json(
      { error: "Username ini sudah digunakan. Silakan pilih username lain." },
      { status: 409 }
    );
  }

  await env.DB.prepare(
    "UPDATE users SET username = ?, display_username = ?, updated_at = ? WHERE id = ?"
  )
    .bind(check.normalized, check.display, Date.now(), user.id)
    .run();

  if (env.SESSION_KV && session.token) {
    try {
      await env.SESSION_KV.delete(session.token);
    } catch (error) {
      console.warn("[account/username] Gagal membersihkan cache KV:", error);
    }
  }

  return Response.json({
    ok: true,
    username: check.normalized,
    displayUsername: check.display,
  });
};
