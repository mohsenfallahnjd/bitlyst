import "server-only";

import { loadMarkdownDocs } from "@/lib/mdSource";
import { prisma } from "@/lib/prisma";
import { getRedis } from "@/lib/redis";
import { getAllViewsFresh, getDailyViews } from "@/lib/stats";

export type PostRow = {
  slug: string;
  title: string;
  publishedTime: string;
  views: number;
  views7: number;
  views30: number;
  comments: number;
  reactions: number;
};

export type AdminReport = {
  /** False when Redis is missing or failing, so the panel can say why views read zero. */
  statsAvailable: boolean;
  rows: PostRow[];
  /** Oldest first, one entry per day, for the chart. */
  daily: { day: string; views: number }[];
  totals: { allTime: number; last7: number; prev7: number; last30: number };
  tags: { tag: string; views: number; posts: number }[];
};

async function getReactionTotals(slugs: string[]): Promise<Record<string, number>> {
  const redis = await getRedis();
  if (!redis) {
    return {};
  }
  const hashes = await Promise.all(slugs.map((slug) => redis.hGetAll(`reactions:${slug}`)));
  return Object.fromEntries(
    slugs.map((slug, i) => [slug, Object.values(hashes[i]).reduce((sum, n) => sum + (Number(n) || 0), 0)])
  );
}

export async function getAdminReport(): Promise<AdminReport> {
  const posts = loadMarkdownDocs();
  const slugs = posts.map((p) => p.slug);

  let statsAvailable = Boolean(process.env.REDIS_URL);
  const [allTime, days, reactions] = await Promise.all([
    getAllViewsFresh(),
    getDailyViews(30),
    getReactionTotals(slugs),
  ]).catch((err): [Record<string, number>, Awaited<ReturnType<typeof getDailyViews>>, Record<string, number>] => {
    console.error("getAdminReport stats failed:", err);
    statsAvailable = false;
    return [{}, [], {}];
  });

  const commentRows = await prisma.comment.groupBy({
    by: ["slug"],
    where: { approved: true },
    _count: { _all: true },
  });
  const comments = Object.fromEntries(commentRows.map((r) => [r.slug, r._count._all]));

  const sumDays = (slug: string, from: number, to: number) =>
    days.slice(from, to).reduce((sum, d) => sum + (d.bySlug[slug] ?? 0), 0);

  const rows: PostRow[] = posts.map((p) => ({
    slug: p.slug,
    title: p.title,
    publishedTime: p.publishedTime ?? "",
    views: allTime[p.slug] ?? 0,
    views7: sumDays(p.slug, 0, 7),
    views30: sumDays(p.slug, 0, 30),
    comments: comments[p.slug] ?? 0,
    reactions: reactions[p.slug] ?? 0,
  }));

  const dayTotal = (bySlug: Record<string, number>) => Object.values(bySlug).reduce((sum, n) => sum + n, 0);
  const totalOf = (from: number, to: number) => days.slice(from, to).reduce((sum, d) => sum + dayTotal(d.bySlug), 0);

  const tagTotals = new Map<string, { views: number; posts: number }>();
  for (const post of posts) {
    for (const tag of new Set(post.tags)) {
      const entry = tagTotals.get(tag) ?? { views: 0, posts: 0 };
      tagTotals.set(tag, { views: entry.views + (allTime[post.slug] ?? 0), posts: entry.posts + 1 });
    }
  }

  return {
    statsAvailable,
    rows,
    daily: days.map((d) => ({ day: d.day, views: dayTotal(d.bySlug) })).reverse(),
    totals: {
      allTime: Object.values(allTime).reduce((sum, n) => sum + n, 0),
      last7: totalOf(0, 7),
      prev7: totalOf(7, 14),
      last30: totalOf(0, 30),
    },
    tags: [...tagTotals.entries()]
      .map(([tag, t]) => ({ tag, ...t }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 10),
  };
}
