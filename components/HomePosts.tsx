"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import PostCard from "@/components/PostCard";
import type { DocMeta } from "@/lib/mdSource";

export default function HomePosts({ posts }: { posts: DocMeta[] }) {
  const searchParams = useSearchParams();
  const tag = (searchParams.get("tag") || "").toLowerCase();

  const filtered = tag ? posts.filter((p) => (p.tags || []).some((t) => t.toLowerCase() === tag)) : posts;

  return (
    <>
      <div className="grid gap-6">
        {filtered.slice(0, 6).map((p) => (
          <PostCard key={p.slug} post={p} />
        ))}
      </div>

      <div className="pt-2 flex items-center gap-3 text-sm">
        {tag && (
          <Link
            href="/"
            className="rounded-full border border-gray-200 dark:border-gray-800 px-2 py-0.5 hover:bg-gray-50 dark:hover:bg-gray-900"
          >
            Clear “{tag}”
          </Link>
        )}
      </div>
    </>
  );
}
