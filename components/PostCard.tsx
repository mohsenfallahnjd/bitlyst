"use client";

import clsx from "clsx";
import { useRouter } from "next/navigation";
import type { DocMeta } from "@/lib/mdSource";
export default function PostCard({ post, className }: { post: DocMeta; className?: string }) {
  const router = useRouter();
  return (
    <a href={`/blog/${post.slug}`} className={clsx("block group", className)} onClick={(e) => e.stopPropagation()}>
      <article className="space-y-2">
        <h2 className="text-lg font-semibold tracking-tight group-hover:underline">{post.title}</h2>
        {post.summary && <p className="text-sm text-gray-600 dark:text-gray-300">{post.summary}</p>}

        <div className="text-xs flex items-center gap-3 text-gray-500 dark:text-gray-400">
          {post.publishedTime && (
            <time dateTime={post.publishedTime}>
              {new Date(post.publishedTime).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
          )}
          {post.tags && post.tags.length > 0 && (
            <span className="flex flex-wrap gap-2">
              {post.tags.map((t: string) => (
                <span
                  key={t}
                  // href={`/blog?tag=${encodeURIComponent(t)}`}
                  className="rounded-full border border-gray-200 dark:border-gray-800 px-2 py-0.5
                             hover:bg-gray-50 dark:hover:bg-gray-900"
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    router.push(`/blog?tag=${encodeURIComponent(t)}`);
                  }}
                >
                  #{t}
                </span>
              ))}
            </span>
          )}
        </div>
      </article>
    </a>
  );
}
