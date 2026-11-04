import "server-only";

import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { loadMarkdownDocs } from "@/lib/mdSource";
import { getRedis } from "@/lib/redis";
import { SLUG_RE } from "@/lib/stats";

let knownSlugs: Set<string> | undefined;

/** True only for a published post, so public routes can't create rows or keys for made-up slugs. */
export function isPost(slug: string) {
  if (!SLUG_RE.test(slug)) {
    return false;
  }
  knownSlugs ??= new Set(loadMarkdownDocs().map((p) => p.slug));
  return knownSlugs.has(slug);
}

export function clientIp(req: Request) {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? req.headers.get("x-real-ip") ?? "unknown";
}

/** Parsed JSON object body, or an empty object when the body is malformed. */
export async function readJsonBody(req: Request): Promise<Record<string, unknown>> {
  const body: unknown = await req.json().catch(() => null);
  return body && typeof body === "object" && !Array.isArray(body) ? (body as Record<string, unknown>) : {};
}

/**
 * Fixed-window limit per client IP, stored hashed in Redis. Returns a 429 response once the
 * limit is passed, otherwise null. Fails open without Redis so local dev and outages keep working.
 */
export async function rateLimit(req: Request, bucket: string, limit: number, windowSeconds: number) {
  try {
    const redis = await getRedis();
    if (!redis) {
      return null;
    }
    const visitor = createHash("sha256")
      .update(`${clientIp(req)}|${process.env.VIEWS_SALT ?? "bitlyst"}`)
      .digest("hex")
      .slice(0, 24);
    const key = `ratelimit:${bucket}:${visitor}`;
    const count = await redis.incr(key);
    if (count === 1) {
      await redis.expire(key, windowSeconds);
    }
    if (count > limit) {
      return NextResponse.json(
        { error: "Too many requests" },
        { status: 429, headers: { "Retry-After": String(windowSeconds) } }
      );
    }
    return null;
  } catch (err) {
    console.error("rateLimit failed:", err);
    return null;
  }
}
