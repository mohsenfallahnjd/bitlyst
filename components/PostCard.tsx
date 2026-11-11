import Image from "next/image";
import { COVER_PLACEHOLDER_BG } from "@/lib/cover";
import type { PostSummary } from "@/lib/mdSource";
import CoverArt from "./CoverArt";
import PostTransition from "./PostTransition";
import PreloadCoverLink from "./PreloadCoverLink";
import ReadBadge from "./ReadBadge";
import { PostCounts } from "./StatCounts";

export function shortDate(iso?: string) {
  if (!iso) {
    return "";
  }
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function PostStatsLine({ post }: { post: PostSummary }) {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-400 dark:text-gray-500">
      {post.publishedTime && <time dateTime={post.publishedTime}>{shortDate(post.publishedTime)}</time>}
      {post.readingTime && <span>{post.readingTime} min read</span>}
      <PostCounts slug={post.slug} />
      <ReadBadge slug={post.slug} publishedTime={post.publishedTime} />
    </div>
  );
}

const THUMB =
  "mt-0.5 aspect-[3/2] w-[88px] sm:w-[120px] shrink-0 rounded-lg border border-gray-200/70 dark:border-gray-800 object-cover";

export default function PostCard({ post }: { post: PostSummary }) {
  return (
    <article className="post-card group/card border-b border-gray-200/70 dark:border-gray-800/60 last:border-b-0">
      <PreloadCoverLink href={`/p/${post.slug}`} cover={post.cover} className="flex items-start gap-4 py-5">
        <div className="min-w-0 flex-1">
          <PostTransition slug={post.slug} part="title">
            <h3 className="text-[15px] sm:text-base font-semibold tracking-tight leading-snug text-gray-900 dark:text-gray-100 group-hover/card:text-[var(--accent)] transition-colors">
              {post.title}
            </h3>
          </PostTransition>
          {post.summary && (
            <PostTransition slug={post.slug} part="summary">
              <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-2">
                {post.summary}
              </p>
            </PostTransition>
          )}
          <div className="mt-2.5">
            <PostStatsLine post={post} />
          </div>
        </div>
        <PostTransition slug={post.slug} part="cover">
          {post.cover ? (
            <Image
              src={post.cover}
              alt=""
              width={240}
              height={160}
              sizes="(min-width: 640px) 120px, 88px"
              className={`${THUMB} ${COVER_PLACEHOLDER_BG}`}
            />
          ) : (
            <CoverArt tags={post.tags} variant="thumb" className={THUMB} />
          )}
        </PostTransition>
      </PreloadCoverLink>
    </article>
  );
}
