"use client";

import clsx from "clsx";
import Link from "next/link";
import type { DocMeta } from "@/lib/mdSource";
import PublishTime from "./PublishTime";

export default function PostCard({ post, className }: { post: DocMeta; className?: string }) {
  return (
    <article className="space-y-2 relative h-full">
      <Link href={`/blog/${post.slug}`} className={clsx("block group", className)} onClick={(e) => e.stopPropagation()}>
        <h2 className="text-lg font-semibold tracking-tight group-hover:underline">
          {post.title}

          {post.publishedTime && new Date(post.publishedTime) > new Date(Date.now() - 1000 * 60 * 60 * 24 * 7) && (
            <span className="text-green-500 text-xs uppercase font-bold ml-2">New</span>
          )}
        </h2>

        {post.summary && <p className="text-sm text-gray-600 dark:text-gray-300">{post.summary}</p>}
      </Link>

      <div className="text-xs flex md:items-center gap-3 text-gray-500 dark:text-gray-400 md:flex-row flex-col flex-wrap-reverse">
        {post.publishedTime && <PublishTime publishedTime={post.publishedTime} />}

        {post.tags && post.tags.length > 0 && (
          <span className="flex flex-wrap gap-2">
            {post.tags.map((t: string) => (
              <Link
                key={t}
                href={`/blog?tag=${encodeURIComponent(t)}`}
                className="rounded-full border border-gray-200 dark:border-gray-800 px-2 py-0.5 hover:bg-gray-50 dark:hover:bg-gray-900"
              >
                #{t}
              </Link>
            ))}
          </span>
        )}

        {/* {post.authors && post.authors.length > 0 && (
          <span className="flex flex-wrap gap-2">
            {" • "}
            {post.authors.map((a: { name: string; url: string }) => (
              <Link
                key={a.name}
                href={`/blog?author=${encodeURIComponent(a.name.toLowerCase().replaceAll(" ", "-"))}`}
                className="text-brand-dark dark:text-brand-dark hover:text-white
                dark:hover:text-brand-dark flex items-center gap-1
                rounded-full hover:bg-brand-dark dark:hover:bg-brand-dark px-2 py-0.5"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                  />
                </svg>
                {a.name}
              </Link>
            ))}
          </span>
        )} */}
      </div>
    </article>
  );
}
