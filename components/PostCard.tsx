"use client";

import Link from "next/link";
import type { DocMeta } from "@/lib/mdSource";
import DifficultyBadge from "./DifficultyBadge";
import PublishTime from "./PublishTime";

export default function PostCard({ post, className }: { post: DocMeta; className?: string }) {
  const isNew = post.publishedTime && new Date(post.publishedTime) > new Date(Date.now() - 1000 * 60 * 60 * 24 * 3);

  return (
    <article className="post-card group/card relative -mx-3 rounded-xl px-3 py-3 sm:px-4 sm:py-3.5 hover:bg-gray-50 dark:hover:bg-gray-900/60 border border-transparent hover:border-gray-100 dark:hover:border-gray-800/60">
      <Link href={`/blog/${post.slug}`} className={`block ${className ?? ""}`}>
        {/* Meta row — top */}
        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
          <div className="flex items-center gap-1.5 text-[11px] text-gray-400 dark:text-gray-500">
            {post.publishedTime && <PublishTime publishedTime={post.publishedTime} />}
            {post.readingTime && (
              <>
                <span>·</span>
                <span>{post.readingTime} min</span>
              </>
            )}
          </div>

          {isNew && (
            <span className="badge-new inline-flex items-center rounded-full bg-emerald-100 dark:bg-emerald-900/40 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-700 dark:text-emerald-400">
              New
            </span>
          )}
        </div>

        {/* Title + badge */}
        <div className="flex items-start gap-2 justify-between">
          <h2 className="flex-1 min-w-0 text-sm sm:text-[15px] font-semibold tracking-tight leading-snug text-gray-900 dark:text-gray-100 group-hover/card:text-cyan-700 dark:group-hover/card:text-cyan-300 transition-colors">
            {post.title}
          </h2>
          <div className="shrink-0 mt-0.5">
            <DifficultyBadge level={post.level} />
          </div>
        </div>

        {/* Summary — 1 line on mobile, 2 on sm+ */}
        {post.summary && (
          <p className="mt-1 text-xs sm:text-sm text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-1 sm:line-clamp-2">
            {post.summary}
          </p>
        )}

        {/* Tags row */}
        {post.tags && post.tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {post.tags.slice(0, 3).map((t: string) => (
              <span
                key={t}
                className="rounded-full border border-gray-100 dark:border-gray-800 px-2 py-0.5 text-[10px] text-gray-400 dark:text-gray-500"
              >
                #{t}
              </span>
            ))}
          </div>
        )}
      </Link>
    </article>
  );
}
