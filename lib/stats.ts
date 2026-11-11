import "server-only";

import { createHash } from "node:crypto";
import { cacheLife, cacheTag } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getRedis } from "@/lib/redis";

const VIEWS_KEY = "views";
const DAY_KEY = (day: string) => `views:day:${day}`;
const SEEN_KEY = (slug: string, visitor: string) => `views:seen:${slug}:${visitor}`;

export const SLUG_RE = /^[a-zA-Z0-9][a-zA-Z0-9_-]{0,120}$/;
const BOT_RE = /bot|crawl|spider|slurp|preview|facebookexternalhit|headless|lighthouse|vercel-screenshot/i;

export type PostStats = { views: Record<string, number>; comments: Record<string, number> };

function today(offsetDays = 0) {
  return new Date(Date.now() - offsetDays * 86_400_000).toISOString().slice(0, 10);
}

// Reads below are cached with the "stats" profile (next.config.mjs) so pages stay prerendered
// and refresh in the background; recordView() writes and is never cached.

/** All-time view counts keyed by slug. */
export async function getAllViews(): Promise<Record<string, number>> {
  "use cache";
  cacheLife("stats");
  try {
    const redis = await getRedis();
    if (!redis) {
      return {};
    }
    const raw = await redis.hGetAll(VIEWS_KEY);
    return Object.fromEntries(Object.entries(raw).map(([slug, n]) => [slug, Number(n) || 0]));
  } catch (err) {
    console.error("getAllViews failed:", err);
    return {};
  }
}

export async function getViews(slug: string): Promise<number> {
  "use cache";
  cacheLife("stats");
  try {
    const redis = await getRedis();
    if (!redis) {
      return 0;
    }
    return Number(await redis.hGet(VIEWS_KEY, slug)) || 0;
  } catch {
    return 0;
  }
}

/** Approved comment counts keyed by slug. */
export async function getCommentCounts(): Promise<Record<string, number>> {
  "use cache";
  cacheLife("stats");
  cacheTag("comments");
  try {
    const rows = await prisma.comment.groupBy({ by: ["slug"], where: { approved: true }, _count: { _all: true } });
    return Object.fromEntries(rows.map((r) => [r.slug, r._count._all]));
  } catch (err) {
    console.error("getCommentCounts failed:", err);
    return {};
  }
}

export async function getPostStats(): Promise<PostStats> {
  const [views, comments] = await Promise.all([getAllViews(), getCommentCounts()]);
  return { views, comments };
}

/** Most-read slugs over the last `days` days, highest first. */
export async function getTrending(days = 7, limit = 5): Promise<{ slug: string; views: number }[]> {
  "use cache";
  cacheLife("stats");
  try {
    const redis = await getRedis();
    if (!redis) {
      return [];
    }
    const perDay = await Promise.all(
      Array.from({ length: days }, (_, i) => redis.zRangeWithScores(DAY_KEY(today(i)), 0, -1))
    );
    const totals: Record<string, number> = {};
    for (const day of perDay) {
      for (const { value, score } of day) {
        totals[value] = (totals[value] ?? 0) + score;
      }
    }
    return Object.entries(totals)
      .map(([slug, views]) => ({ slug, views }))
      .sort((a, b) => b.views - a.views)
      .slice(0, limit);
  } catch (err) {
    console.error("getTrending failed:", err);
    return [];
  }
}

/** Per-slug reads for each of the last `days` days, newest first. Uncached, for /admin. Day keys expire after 60 days. */
export async function getDailyViews(days: number): Promise<{ day: string; bySlug: Record<string, number> }[]> {
  const redis = await getRedis();
  if (!redis) {
    return [];
  }
  const dates = Array.from({ length: days }, (_, i) => today(i));
  const perDay = await Promise.all(dates.map((d) => redis.zRangeWithScores(DAY_KEY(d), 0, -1)));
  return dates.map((day, i) => ({
    day,
    bySlug: Object.fromEntries(perDay[i].map(({ value, score }) => [value, score])),
  }));
}

/** Uncached all-time counts for /admin, which shouldn't lag behind the public 30 minute cache. */
export async function getAllViewsFresh(): Promise<Record<string, number>> {
  const redis = await getRedis();
  if (!redis) {
    return {};
  }
  const raw = await redis.hGetAll(VIEWS_KEY);
  return Object.fromEntries(Object.entries(raw).map(([slug, n]) => [slug, Number(n) || 0]));
}

/**
 * Count one read per visitor per post per day. The visitor id is a salted daily
 * hash of IP + user agent, so nothing identifying is stored and no cookie is set.
 */
export async function recordView(slug: string, ip: string, userAgent: string): Promise<number> {
  const redis = await getRedis();
  if (!redis) {
    return 0;
  }
  if (BOT_RE.test(userAgent)) {
    return Number(await redis.hGet(VIEWS_KEY, slug)) || 0;
  }

  const day = today();
  const visitor = createHash("sha256")
    .update(`${day}|${ip}|${userAgent}|${process.env.VIEWS_SALT ?? "bitlyst"}`)
    .digest("hex")
    .slice(0, 24);

  const firstToday = await redis.set(SEEN_KEY(slug, visitor), "1", { NX: true, EX: 86_400 });
  if (!firstToday) {
    return Number(await redis.hGet(VIEWS_KEY, slug)) || 0;
  }

  const [count] = await Promise.all([
    redis.hIncrBy(VIEWS_KEY, slug, 1),
    redis.zIncrBy(DAY_KEY(day), 1, slug),
    redis.expire(DAY_KEY(day), 60 * 86_400),
  ]);
  return count;
}
