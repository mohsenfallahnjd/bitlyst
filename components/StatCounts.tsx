"use client";

import { formatCount } from "@/lib/format";
import { sumCounts, useStats } from "@/lib/useStats";
import { CommentIcon, EyeIcon } from "./StatIcons";

/** Read + comment counts for one post, loaded in the browser. Renders nothing until they arrive. */
export function PostCounts({ slug }: { slug: string }) {
  const stats = useStats();
  const views = stats?.views[slug];
  const comments = stats?.comments[slug];
  return (
    <>
      {!!views && (
        <span className="inline-flex items-center gap-1" title={`${views.toLocaleString("en-US")} reads`}>
          <EyeIcon className="size-3" />
          {formatCount(views)}
        </span>
      )}
      {!!comments && (
        <span className="inline-flex items-center gap-1" title={`${comments} comments`}>
          <CommentIcon className="size-3" />
          {comments}
        </span>
      )}
    </>
  );
}

/** Comment count for one post, or `fallback` when there are none yet. */
export function CommentCount({ slug, fallback = "" }: { slug: string; fallback?: string }) {
  const n = useStats()?.comments[slug] ?? 0;
  return <>{n > 0 ? n : fallback}</>;
}

/** Site-wide read total as `${prefix}<n> reads`, shown once it reaches `min`. */
export function TotalReads({
  prefix = "",
  min = 100,
  exact = false,
}: {
  prefix?: string;
  min?: number;
  exact?: boolean;
}) {
  const total = sumCounts(useStats()?.views);
  if (total < min) {
    return null;
  }
  return (
    <>
      {prefix}
      {exact ? total.toLocaleString("en-US") : formatCount(total)} reads
    </>
  );
}

/** Extra stat tiles for /about (reads, comments), appended once counts load. */
export function StatTiles({
  tileClass,
  labelClass,
  valueClass,
}: {
  tileClass: string;
  labelClass: string;
  valueClass: string;
}) {
  const stats = useStats();
  const reads = sumCounts(stats?.views);
  const comments = sumCounts(stats?.comments);
  const tiles = [
    ...(reads >= 100 ? [{ value: formatCount(reads), label: "reads" }] : []),
    ...(comments >= 10 ? [{ value: String(comments), label: "comments" }] : []),
  ];
  return tiles.map(({ value, label }) => (
    <div key={label} className={tileClass}>
      <dt className={labelClass}>{label}</dt>
      <dd className={valueClass}>{value}</dd>
    </div>
  ));
}
