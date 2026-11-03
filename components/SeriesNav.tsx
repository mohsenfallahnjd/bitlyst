import Link from "next/link";
import type { DocMeta } from "@/lib/mdSource";
import { getSeries } from "@/lib/series";
import PixelSprite from "./PixelSprite";

/** "Part N of a series" box: published parts in order, then what's coming next. */
export default function SeriesNav({ post, variant = "full" }: { post: DocMeta; variant?: "full" | "compact" }) {
  const series = post.series ? getSeries(post.series) : undefined;
  if (!series) {
    return null;
  }

  const { parts } = series;
  const index = parts.findIndex((p) => p.slug === post.slug);
  const next = parts[index + 1];

  if (variant === "compact") {
    return (
      <p className="text-xs text-gray-500 dark:text-gray-400">
        Part {index + 1} of{" "}
        <Link
          href={`/series/${series.slug}`}
          className="font-medium text-brand-600 dark:text-brand-400 hover:underline underline-offset-2"
        >
          {series.name}
        </Link>
      </p>
    );
  }

  return (
    <section
      id="series"
      className="scroll-mt-24 mt-10 rounded-2xl border border-brand-200/70 dark:border-brand-900/70 bg-brand-50/50 dark:bg-brand-950/30 p-5"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-brand-700 dark:text-brand-300">
            Series
          </p>
          <h2 className="mt-1 text-base font-bold text-gray-900 dark:text-gray-50">
            <Link href={`/series/${series.slug}`} className="hover:text-brand-600 dark:hover:text-brand-400">
              {series.name}
            </Link>
          </h2>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{series.description}</p>
        </div>
        <PixelSprite name={series.mascot.sprite} size={56} className="shrink-0" />
      </div>

      <ol className="mt-4 space-y-2">
        {parts.map((p, i) => {
          const current = p.slug === post.slug;
          return (
            <li key={p.slug} className="flex gap-3 text-sm">
              <span
                className={`flex size-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${
                  current
                    ? "bg-brand-600 text-white"
                    : "bg-white dark:bg-gray-900 text-gray-500 border border-gray-200 dark:border-gray-700"
                }`}
              >
                {i + 1}
              </span>
              {current ? (
                <span className="pt-0.5 font-semibold text-gray-900 dark:text-gray-50">{p.title} · you are here</span>
              ) : (
                <Link
                  href={`/p/${p.slug}`}
                  className="pt-0.5 text-gray-700 dark:text-gray-300 hover:text-brand-600 dark:hover:text-brand-400"
                >
                  {p.title}
                </Link>
              )}
            </li>
          );
        })}
        {series.upcoming.map((title, i) => (
          <li key={title} className="flex gap-3 text-sm text-gray-400 dark:text-gray-500">
            <span className="flex size-6 shrink-0 items-center justify-center rounded-full border border-dashed border-gray-300 dark:border-gray-700 text-[11px]">
              {parts.length + i + 1}
            </span>
            <span className="pt-0.5">
              {title} <span className="text-[11px] uppercase tracking-wide">· coming soon</span>
            </span>
          </li>
        ))}
      </ol>

      {next ? (
        <Link
          href={`/p/${next.slug}`}
          className="mt-4 inline-block text-sm font-medium text-brand-600 dark:text-brand-400 hover:underline underline-offset-2"
        >
          Next part: {next.title} →
        </Link>
      ) : (
        series.upcoming.length > 0 && (
          <p className="mt-4 text-xs text-gray-500 dark:text-gray-400">
            New parts land here first — subscribe below to get them in your inbox.
          </p>
        )
      )}
    </section>
  );
}
