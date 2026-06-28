"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import PostCard from "@/components/PostCard";
import type { DocMeta } from "@/lib/mdSource";

function getYear(publishedTime?: string) {
  if (!publishedTime) { return "Unknown"; }
  return new Date(publishedTime).getFullYear().toString();
}

export default function BlogList({ posts }: { posts: DocMeta[] }) {
  const sp = useSearchParams();
  const tag = (sp.get("tag") || "").toLowerCase();
  const author = (sp.get("author") || "").toLowerCase().replaceAll(" ", "-");
  const level = (sp.get("level") || "").toLowerCase();

  let filtered = tag
    ? posts.filter((p) => (p.tags || []).some((t) => t.toLowerCase() === tag))
    : author
      ? posts.filter((p) => p.authors?.some((a) => a.name.toLowerCase().replaceAll(" ", "-") === author))
      : posts;

  if (level) {
    filtered = filtered.filter((p) => p.level === level);
  }

  const label = tag || level || author;

  if (filtered.length === 0) {
    return (
      <div className="py-16 text-center space-y-3">
        <div className="text-4xl opacity-30">📭</div>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
          No posts for &ldquo;{label}&rdquo;
        </p>
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-xs rounded-full border border-gray-200 dark:border-gray-700 px-4 py-1.5 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
        >
          ← See all posts
        </Link>
      </div>
    );
  }

  const isFiltered = !!(tag || author || level);

  if (isFiltered) {
    return (
      <div className="grid gap-1">
        {filtered.map((post, i) => (
          <div key={post.slug} style={{ animation: "fadeUp 0.5s ease-out both", animationDelay: `${i * 45}ms` }}>
            <PostCard post={post} />
          </div>
        ))}
      </div>
    );
  }

  // Group by year
  const grouped: Record<string, DocMeta[]> = {};
  for (const post of filtered) {
    const year = getYear(post.publishedTime);
    if (!grouped[year]) { grouped[year] = []; }
    grouped[year].push(post);
  }
  const years = Object.keys(grouped).sort((a, b) => Number(b) - Number(a));

  let globalIndex = 0;
  return (
    <div className="space-y-10">
      {years.map((year) => (
        <div key={year}>
          <div className="flex items-center gap-3 mb-3">
            <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest">{year}</span>
            <div className="flex-1 h-px bg-gray-100 dark:bg-gray-800/60" />
            <span className="text-xs text-gray-400 dark:text-gray-600">{grouped[year].length}</span>
          </div>
          <div className="grid gap-0.5">
            {grouped[year].map((post) => {
              const idx = globalIndex++;
              return (
                <div key={post.slug} style={{ animation: "fadeUp 0.5s ease-out both", animationDelay: `${idx * 35}ms` }}>
                  <PostCard post={post} />
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
