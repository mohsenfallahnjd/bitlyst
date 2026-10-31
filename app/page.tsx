import type { Metadata } from "next";
import Link from "next/link";
import NewsletterForm from "@/components/NewsletterForm";
import PixelSprite from "@/components/PixelSprite";
import PostCard, { PostStatsLine } from "@/components/PostCard";
import ReaderPanel from "@/components/ReaderPanel";
import TopicRequest from "@/components/TopicRequest";
import { formatCount } from "@/lib/format";
import { type DocMeta, loadMarkdownDocs, toSummary } from "@/lib/mdSource";
import { getPostStats, getTrending } from "@/lib/stats";
import { getAllSeries } from "@/lib/series";
import { getAllTopics } from "@/lib/tags";

// Static, refreshed every 10 minutes: trending, read counts and "today's pick" stay fresh
export const revalidate = 600;

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

/** Rotates daily through older posts so there's always something to (re)discover. */
function todaysPick(posts: DocMeta[], exclude: Set<string>) {
  const pool = posts.filter((p) => !exclude.has(p.slug));
  if (pool.length === 0) {
    return undefined;
  }
  const day = Math.floor(Date.now() / 86_400_000);
  return pool[day % pool.length];
}

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
  const [stats, trendingRaw] = await Promise.all([getPostStats(), getTrending(7, 5)]);

  const bySlug = new Map(all.map((p) => [p.slug, p]));
  const [featured, ...rest] = all;
  const latest = rest.slice(0, 5);
  const trending = trendingRaw.flatMap((t) => {
    const post = bySlug.get(t.slug);
    return post ? [{ post, views: t.views }] : [];
  });
  // all-time most read as fallback while weekly data builds up
  const popular =
    trending.length >= 3
      ? trending
      : all
          .filter((p) => stats.views[p.slug])
          .sort((a, b) => (stats.views[b.slug] ?? 0) - (stats.views[a.slug] ?? 0))
          .slice(0, 5)
          .map((post) => ({ post, views: stats.views[post.slug] }));

  const pick = todaysPick(all, new Set([featured?.slug, ...latest.map((p) => p.slug)]));
  const topics = getAllTopics(all).slice(0, 12);
  const series = getAllSeries(all);
  const totalViews = Object.values(stats.views).reduce((s, n) => s + n, 0);

  return (
    <div className="space-y-14">
      {/* Hero */}
      <section className="space-y-5 pt-2">
        <div className="space-y-3">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight text-gray-900 dark:text-gray-50">
            Understand JavaScript, React & Next.js —{" "}
            <span className="text-gray-400 dark:text-gray-500">one short post at a time.</span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400 max-w-lg">
            Practical, diagram-first explanations you can read over coffee. {all.length} posts
            {totalViews >= 100 && <>, {formatCount(totalViews)} reads</>} and counting.
          </p>
        </div>
        <ReaderPanel posts={all.map(({ slug, title, publishedTime }) => ({ slug, title, publishedTime }))} />
      </section>

      {/* Featured / newest */}
      {featured && (
        <section>
          <SectionTitle>Newest</SectionTitle>
          <Link href={`/blog/${featured.slug}`} className="group block py-4">
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight leading-snug text-gray-900 dark:text-gray-50 group-hover:text-[var(--accent)] transition-colors">
              {featured.title}
            </h3>
            {featured.summary && (
              <p className="mt-2 text-[15px] text-gray-500 dark:text-gray-400 leading-relaxed">{featured.summary}</p>
            )}
            <div className="mt-3">
              <PostStatsLine
                post={toSummary(featured)}
                views={stats.views[featured.slug]}
                comments={stats.comments[featured.slug]}
              />
            </div>
          </Link>
        </section>
      )}

      <div className="grid gap-14 md:grid-cols-[minmax(0,1fr)_16rem] md:gap-10">
        {/* Latest */}
        <section>
          <SectionTitle href="/blog" more={`All ${all.length} posts`}>
            Latest
          </SectionTitle>
          {latest.map((p) => (
            <PostCard key={p.slug} post={toSummary(p)} views={stats.views[p.slug]} comments={stats.comments[p.slug]} />
          ))}
        </section>

        <aside className="space-y-10">
          {popular.length > 0 && (
            <section>
              <SectionTitle href="/blog?sort=popular">
                {trending.length >= 3 ? "Trending this week" : "Most read"}
              </SectionTitle>
              <ol className="mt-3 space-y-4">
                {popular.map(({ post, views }, i) => (
                  <li key={post.slug}>
                    <Link href={`/blog/${post.slug}`} className="group flex gap-3">
                      <span className="text-lg font-bold tabular-nums leading-tight text-gray-300 dark:text-gray-700">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="min-w-0">
                        <span className="block text-sm font-medium leading-snug text-gray-800 dark:text-gray-200 group-hover:text-[var(--accent)] transition-colors">
                          {post.title}
                        </span>
                        <span className="text-xs text-gray-400 dark:text-gray-500">{formatCount(views)} reads</span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ol>
            </section>
          )}

          {pick && (
            <section>
              <SectionTitle>Today&rsquo;s pick</SectionTitle>
              <Link
                href={`/blog/${pick.slug}`}
                className="group mt-3 block rounded-xl border border-gray-200/80 dark:border-gray-800 p-4 hover:border-gray-300 dark:hover:border-gray-700 transition-colors"
              >
                <span className="block text-sm font-semibold leading-snug text-gray-900 dark:text-gray-100 group-hover:text-[var(--accent)] transition-colors">
                  {pick.title}
                </span>
                {pick.summary && (
                  <span className="mt-1.5 block text-xs text-gray-500 dark:text-gray-400 line-clamp-3">
                    {pick.summary}
                  </span>
                )}
                <span className="mt-2 block text-[11px] text-gray-400 dark:text-gray-500">
                  {pick.readingTime} min · new pick every day
                </span>
              </Link>
            </section>
          )}

          <section>
            <SectionTitle href="/series">Series</SectionTitle>
            <ul className="mt-3 space-y-3">
              {series.map((s) => (
                <li key={s.slug}>
                  <Link href={`/series/${s.slug}`} className="group flex items-center gap-3">
                    <PixelSprite name={s.mascot.sprite} size={36} animate={false} className="shrink-0" />
                    <span className="min-w-0">
                      <span className="block text-sm font-semibold text-gray-800 dark:text-gray-200 group-hover:text-[var(--accent)] transition-colors">
                        {s.name}
                      </span>
                      <span className="text-xs text-gray-400 dark:text-gray-500">
                        {s.parts.length > 0
                          ? `${s.parts.length} part${s.parts.length > 1 ? "s" : ""} · ${s.upcoming.length} coming`
                          : "Starting soon"}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <SectionTitle href="/tags">Topics</SectionTitle>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {topics.map((t) => (
                <Link
                  key={t.slug}
                  href={`/tags/${t.slug}`}
                  className="rounded-full border border-gray-200 dark:border-gray-800 px-2.5 py-1 text-xs text-gray-500 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-600 transition-colors"
                >
                  #{t.name} <span className="text-gray-300 dark:text-gray-600">{t.count}</span>
                </Link>
              ))}
            </div>
          </section>
        </aside>
      </div>

      {/* Stay in touch */}
      <section className="grid gap-4 md:grid-cols-2">
        <NewsletterForm />
        <TopicRequest />
      </section>
    </div>
  );
}
