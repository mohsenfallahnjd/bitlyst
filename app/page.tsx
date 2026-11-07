import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import CoverArt from "@/components/CoverArt";
import NewsletterForm from "@/components/NewsletterForm";
import PixelSprite from "@/components/PixelSprite";
import PostCard, { PostStatsLine } from "@/components/PostCard";
import PostTransition from "@/components/PostTransition";
import { formatCount } from "@/lib/format";
import { loadMarkdownDocs, toSummary } from "@/lib/mdSource";
import { getAllSeries } from "@/lib/series";
import { getPostStats } from "@/lib/stats";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

// Covers are 1200×630 with the left half empty and the scene on the right. On mobile the cover keeps its own
// ratio; side by side it fills the column height, cropped from the left so only empty background is lost.
const FEATURED_COVER = "aspect-[1200/630] w-full object-cover object-right md:aspect-auto md:h-full";

function SectionTitle({ children, href, more }: { children: React.ReactNode; href?: string; more?: string }) {
  return (
    <div className="flex items-baseline justify-between mb-1">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">{children}</h2>
      {href && (
        <Link
          href={href}
          className="text-xs text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
        >
          {more ?? "View all"} →
        </Link>
      )}
    </div>
  );
}

export default async function HomePage() {
  const all = loadMarkdownDocs();
  const stats = await getPostStats();

  const [featured, ...rest] = all;
  const latest = rest.slice(0, 8);
  const series = getAllSeries(all).filter((s) => s.parts.length > 0);
  const totalViews = Object.values(stats.views).reduce((s, n) => s + n, 0);

  return (
    <div className="space-y-14">
      {/* Hero */}
      <section className="space-y-3 pt-2">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight text-gray-900 dark:text-gray-50">
          Understand JavaScript, React & Next.js —{" "}
          <span className="text-gray-400 dark:text-gray-500">one short post at a time.</span>
        </h1>
        <p className="text-gray-500 dark:text-gray-400 max-w-lg">
          Practical, diagram-first explanations you can read over coffee. {all.length} posts
          {totalViews >= 100 && <>, {formatCount(totalViews)} reads</>} and counting.
        </p>
      </section>

      {/* Newest */}
      {featured && (
        <section aria-labelledby="newest-title">
          <Link
            href={`/p/${featured.slug}`}
            // prefetch the post itself, not just the shared route shell, so the header renders in the same
            // commit as the click and the cover/title/summary morph instead of passing through loading.tsx
            prefetch={true}
            className="group grid overflow-hidden rounded-2xl border border-gray-200/80 dark:border-gray-800 bg-white dark:bg-gray-900/40 shadow-sm hover:border-gray-300 dark:hover:border-gray-700 hover:shadow-md transition md:grid-cols-[1.15fr_1fr]"
          >
            <PostTransition slug={featured.slug} part="cover">
              {featured.cover ? (
                <Image
                  src={featured.cover}
                  alt=""
                  width={1200}
                  height={630}
                  priority
                  sizes="(min-width: 768px) 40rem, 100vw"
                  className={FEATURED_COVER}
                />
              ) : (
                <CoverArt tags={featured.tags} variant="hero" className={FEATURED_COVER} />
              )}
            </PostTransition>
            <div className="flex flex-col justify-center p-5 sm:p-7">
              <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-[var(--accent-soft)] px-2.5 py-1 text-xs font-semibold text-[var(--accent)]">
                <span className="size-1.5 rounded-full bg-[var(--accent)]" aria-hidden />
                Newest post
              </span>
              <PostTransition slug={featured.slug} part="title">
                <h2
                  id="newest-title"
                  className="mt-4 text-2xl sm:text-[1.75rem] font-bold tracking-tight leading-tight text-balance text-gray-900 dark:text-gray-50 group-hover:text-[var(--accent)] transition-colors"
                >
                  {featured.title}
                </h2>
              </PostTransition>
              {featured.summary && (
                <PostTransition slug={featured.slug} part="summary">
                  <p className="mt-3 text-[15px] text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-3">
                    {featured.summary}
                  </p>
                </PostTransition>
              )}
              <div className="mt-4">
                <PostStatsLine
                  post={toSummary(featured)}
                  views={stats.views[featured.slug]}
                  comments={stats.comments[featured.slug]}
                />
              </div>
              <span className="mt-5 text-sm font-semibold text-[var(--accent)]">
                Read post <span className="inline-block transition-transform group-hover:translate-x-0.5">→</span>
              </span>
            </div>
          </Link>
        </section>
      )}

      {/* Latest */}
      <section>
        <SectionTitle href="/posts" more={`All ${all.length} posts`}>
          Latest
        </SectionTitle>
        {latest.map((p) => (
          <PostCard key={p.slug} post={toSummary(p)} views={stats.views[p.slug]} comments={stats.comments[p.slug]} />
        ))}
        <Link
          href="/posts"
          className="mt-4 flex items-center justify-center rounded-xl border border-gray-200/80 dark:border-gray-800 py-3 text-sm font-medium text-gray-600 dark:text-gray-300 hover:border-gray-300 hover:text-[var(--accent)] dark:hover:border-gray-700 transition-colors"
        >
          Browse all {all.length} posts →
        </Link>
      </section>

      {/* Series */}
      {series.length > 0 && (
        <section>
          <SectionTitle href="/series">Series</SectionTitle>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Short posts on one theme, meant to be read in order. Each part stands alone, and together they build the
            full picture.
          </p>
          <ul className="mt-4 grid gap-3 sm:grid-cols-3">
            {series.map((s) => (
              <li key={s.slug}>
                <Link
                  href={`/series/${s.slug}`}
                  className="group flex items-center gap-3 rounded-xl border border-gray-200/80 dark:border-gray-800 p-3 hover:border-gray-300 dark:hover:border-gray-700 transition-colors"
                >
                  <PixelSprite name={s.mascot.sprite} size={32} animate={false} className="shrink-0" />
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold text-gray-800 dark:text-gray-200 group-hover:text-[var(--accent)] transition-colors">
                      {s.name}
                    </span>
                    <span className="text-xs text-gray-400 dark:text-gray-500">
                      {s.parts.length} part{s.parts.length > 1 ? "s" : ""}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <NewsletterForm />
    </div>
  );
}
