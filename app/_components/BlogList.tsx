"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import PostCard from "@/components/PostCard";
import type { DocMeta } from "@/lib/mdSource";

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
        No posts for “{tag || author}”.{" "}
        <Link className="underline" href="/blog">
          See all posts
        </Link>
        .
      </p>
    );
  }

  return (
    <div className="grid gap-8">
      {filtered.map((post) => (
        <PostCard key={post.slug} post={post} />
      ))}
    </div>
  );
}
