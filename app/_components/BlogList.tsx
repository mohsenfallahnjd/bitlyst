"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import PostCard from "@/components/PostCard";
import type { PostSummary } from "@/lib/mdSource";
import type { PostStats } from "@/lib/stats";

function getYear(publishedTime?: string) {
  if (!publishedTime) { return "Unknown"; }
  return new Date(publishedTime).getFullYear().toString();
}

const SORTS = [
  { key: "", label: "Latest" },
  { key: "popular", label: "Most read" },
  { key: "discussed", label: "Most discussed" },
];

export default function BlogList({ posts, stats }: { posts: PostSummary[]; stats: PostStats }) {
  const sp = useSearchParams();
  const level = (sp.get("level") || "").toLowerCase();
  const sort = sp.get("sort") || "";

  let filtered = level ? posts.filter((p) => p.level === level) : posts;
  if (sort === "popular") {
    filtered = [...filtered].sort((a, b) => (stats.views[b.slug] ?? 0) - (stats.views[a.slug] ?? 0));
  } else if (sort === "discussed") {
    filtered = [...filtered].sort((a, b) => (stats.comments[b.slug] ?? 0) - (stats.comments[a.slug] ?? 0));
  }

  const hrefFor = (next: { sort?: string; level?: string }) => {
    const q = new URLSearchParams();
    const s = next.sort ?? sort;
    const l = next.level ?? level;
    if (s) { q.set("sort", s); }
    if (l) { q.set("level", l); }
    const qs = q.toString();
    return qs ? `/blog?${qs}` : "/blog";
  };

  const card = (post: PostSummary) => (
    <PostCard key={post.slug} post={post} views={stats.views[post.slug]} comments={stats.comments[post.slug]} />
  );

  // Group by year only in the default chronological view
  const grouped: Record<string, PostSummary[]> = {};
  if (!sort) {
    for (const post of filtered) {
      const year = getYear(post.publishedTime);
      grouped[year] ??= [];
      grouped[year].push(post);
    }
  }
  const years = Object.keys(grouped).sort((a, b) => Number(b) - Number(a));

  return (
    <div className="space-y-6">
      <div className="flex gap-1 rounded-lg border border-gray-200 dark:border-gray-800 p-0.5 w-fit text-xs">
        {SORTS.map((s) => (
          <Link
            key={s.key}
            href={hrefFor({ sort: s.key })}
            scroll={false}
            className={`rounded-md px-3 py-1.5 transition-colors ${
              sort === s.key
                ? "bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900 font-medium"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
            }`}
          >
            {s.label}
          </Link>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="py-16 text-center space-y-3">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">No {level} posts yet.</p>
          <Link href="/blog" className="text-xs underline underline-offset-2 text-gray-500">
            See all posts
          </Link>
        </div>
      ) : sort ? (
        <div>{filtered.map(card)}</div>
      ) : (
        <div className="space-y-10">
          {years.map((year) => (
            <section key={year}>
              <div className="flex items-center gap-3 mb-1">
                <h2 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest">{year}</h2>
                <div className="flex-1 h-px bg-gray-200/70 dark:bg-gray-800/60" />
                <span className="text-xs text-gray-400 dark:text-gray-600">{grouped[year].length}</span>
              </div>
              <div>{grouped[year].map(card)}</div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
