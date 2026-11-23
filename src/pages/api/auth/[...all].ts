import type { APIRoute } from "astro";
import { createAuth } from "@/lib/auth";

export const prerender = false;

export const ALL: APIRoute = async (context) => {
  const env = context.locals.runtime?.env;
  if (!env?.DB) {
    return new Response(
      JSON.stringify({
        error: "Database D1 belum terkonfigurasi pada runtime ini.",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  const auth = createAuth(env, context.request.url);
  return auth.handler(context.request);
};
