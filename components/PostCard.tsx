"use client";

import Link from "next/link";
import type { DocMeta } from "@/lib/mdSource";
import PublishTime from "./PublishTime";

export default function PostCard({ post, className }: { post: DocMeta; className?: string }) {
  return (
    <article className="post-card group/card">
      <Link
        href={`/blog/${post.slug}`}
        className={`block py-4 border-b border-gray-100 dark:border-gray-800/60 ${className ?? ""}`}
      >
        {/* Meta */}
        <div className="flex items-center gap-2 mb-1.5 text-[11px] text-gray-400 dark:text-gray-500">
          {post.publishedTime && <PublishTime publishedTime={post.publishedTime} />}
          {post.readingTime && <><span aria-hidden>·</span><span>{post.readingTime} min</span></>}
          {post.level && <><span aria-hidden>·</span><span className="capitalize">{post.level}</span></>}
        </div>

        {/* Title */}
        <h2 className="text-sm sm:text-[15px] font-semibold tracking-tight leading-snug text-gray-900 dark:text-gray-100 group-hover/card:text-gray-600 dark:group-hover/card:text-gray-300 transition-colors">
          {post.title}
        </h2>

        {/* Summary */}
        {post.summary && (
          <p className="mt-1 text-xs sm:text-[13px] text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-1 sm:line-clamp-2">
            {post.summary}
          </p>
        )}
      </Link>
    </article>
  );
}
