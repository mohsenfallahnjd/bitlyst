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

  const filtered = tag
    ? posts.filter((p) => (p.tags || []).some((t) => t.toLowerCase() === tag))
    : author
      ? posts.filter((p) => p.authors?.some((a) => a.name.toLowerCase().replaceAll(" ", "-") === author))
      : posts;

  if (filtered.length === 0) {
    return (
      <p className="text-sm text-gray-600 dark:text-gray-400">
        No posts for "{tag || author}".{" "}
        <Link className="underline" href="/blog">
          See all posts
        </Link>
        .
      </p>
    );
  }

  const isFiltered = !!(tag || author);

  if (isFiltered) {
    return (
      <div className="grid gap-2">
        {filtered.map((post, i) => (
          <div key={post.slug} style={{ animation: "fadeUp 0.5s ease-out both", animationDelay: `${i * 55}ms` }}>
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
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest">{year}</span>
            <div className="flex-1 h-px bg-gray-100 dark:bg-gray-800/60" />
            <span className="text-xs text-gray-400 dark:text-gray-600">{grouped[year].length}</span>
          </div>
          <div className="grid gap-1">
            {grouped[year].map((post) => {
              const idx = globalIndex++;
              return (
                <div key={post.slug} style={{ animation: "fadeUp 0.5s ease-out both", animationDelay: `${idx * 40}ms` }}>
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
