import type { APIRoute } from "astro";
import { validateUsername } from "@/lib/auth-helpers";

export const prerender = false;

export const GET: APIRoute = async (context) => {
  const env = context.locals.runtime?.env;
  if (!env?.DB) {
    return Response.json(
      { error: "Database D1 belum terkonfigurasi pada runtime ini." },
      { status: 500 }
    );
  }

  const raw = context.url.searchParams.get("u") ?? "";
  const check = validateUsername(raw);

  if (!check.valid) {
    return Response.json(
      {
        valid: false,
        available: false,
        error: check.error || "Format username tidak valid.",
      },
      { headers: { "Cache-Control": "no-store" } }
    );
  }

  const currentUser = context.locals.user;
  const existing = currentUser
    ? await env.DB.prepare(
        "SELECT id FROM users WHERE username = ? AND id != ? LIMIT 1"
      )
        .bind(check.normalized, currentUser.id)
        .first<{ id: string }>()
    : await env.DB.prepare("SELECT id FROM users WHERE username = ? LIMIT 1")
        .bind(check.normalized)
        .first<{ id: string }>();

  return Response.json(
    {
      valid: true,
      available: !existing,
      normalized: check.normalized,
      error: existing
        ? "Username ini sudah digunakan. Silakan pilih username lain."
        : undefined,
    },
    { headers: { "Cache-Control": "no-store" } }
  );
};
