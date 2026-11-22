import type { APIRoute } from "astro";

export const prerender = false;

export const GET: APIRoute = async ({ locals }) => {
  let database: "connected" | "unavailable" = "unavailable";

  try {
    const db = locals.runtime?.env?.DB;
    if (db) {
      const result = await db.prepare("SELECT 1 AS ok").first<{ ok: number }>();
      if (result?.ok === 1) {
        database = "connected";
      }
    }
  } catch {
    database = "unavailable";
  }

  return new Response(
    JSON.stringify({
      status: "ok",
      service: "Ringkasnya",
      runtime: "cloudflare-workers",
      database,
      timestamp: new Date().toISOString(),
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};
