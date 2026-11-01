import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import NewsletterForm from "@/components/NewsletterForm";
import PixelSprite from "@/components/PixelSprite";
import { PostStatsLine } from "@/components/PostCard";
import SeriesProgress from "@/components/SeriesProgress";
import { toSummary } from "@/lib/mdSource";
import { getAllSeries, getSeries } from "@/lib/series";
import { getPostStats } from "@/lib/stats";


export function generateStaticParams() {
  return getAllSeries().map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps<"/series/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const series = getSeries(slug);
  if (!series) {
    return {};
  }
  return {
    title: `${series.name} — ${series.parts.length} part series`,
    description: series.description,
    alternates: { canonical: `/series/${slug}` },
    // a series with no published parts yet is a thin page
    robots: series.parts.length === 0 ? { index: false, follow: true } : undefined,
    openGraph: { title: series.name, description: series.description, url: `/series/${slug}`, type: "website" },
  };
}

export default async function SeriesPage({ params }: PageProps<"/series/[slug]">) {
  const { slug } = await params;
  const series = getSeries(slug);
  if (!series) {
    notFound();
  }
  const stats = await getPostStats();
  const total = series.parts.length + series.upcoming.length;
  const minutes = series.parts.reduce((n, p) => n + (p.readingTime ?? 0), 0);

  return (
    <div className="mx-auto max-w-[42rem] space-y-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: series.name,
            description: series.description,
            url: `https://bitlyst.vercel.app/series/${slug}`,
            mainEntity: {
              "@type": "ItemList",
              itemListOrder: "https://schema.org/ItemListOrderAscending",
              itemListElement: series.parts.map((p, i) => ({
                "@type": "ListItem",
                position: i + 1,
                url: `https://bitlyst.vercel.app/blog/${p.slug}`,
                name: p.title,
              })),
            },
          }),
        }}
      />

      <header className="space-y-4 pb-8 border-b border-gray-200/70 dark:border-gray-800/60">
        <Link
          href="/series"
          className="text-xs text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
        >
          ← All series
        </Link>
        <div className="flex items-end justify-between gap-4">
          <div className="space-y-2">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-brand-600 dark:text-brand-400">
              Series
            </p>
            <h1 className="text-[2rem] sm:text-[2.4rem] font-extrabold tracking-tight leading-[1.15] text-balance">
              {series.name}
            </h1>
          </div>
          <PixelSprite
            name={series.mascot.sprite}
            size={104}
            title={`${series.mascot.name}, the series mascot`}
            className="shrink-0 max-sm:w-[76px] max-sm:h-auto"
          />
        </div>
        <p className="text-lg leading-relaxed text-gray-500 dark:text-gray-400">{series.description}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Your guide: <strong className="font-semibold text-gray-800 dark:text-gray-200">{series.mascot.name}</strong>.{" "}
          {series.mascot.bio}
        </p>
        <p className="text-sm text-gray-400 dark:text-gray-500">
          {series.parts.length} of {total} parts published
          {minutes > 0 && <> · {minutes} min total</>}
        </p>
        <SeriesProgress parts={series.parts.map(({ slug: s, title }) => ({ slug: s, title }))} />
      </header>

      <ol className="space-y-3">
        {series.parts.map((p, i) => (
          <li key={p.slug}>
            <Link
              href={`/blog/${p.slug}`}
              className="group flex gap-4 rounded-2xl border border-gray-200/80 dark:border-gray-800 bg-surface-light dark:bg-surface-dark p-5 hover:border-brand-300 dark:hover:border-brand-800 transition-colors"
            >
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-brand-600 text-sm font-bold text-white">
                {i + 1}
              </span>
              <span className="min-w-0 space-y-1.5">
                <span className="block font-semibold leading-snug text-gray-900 dark:text-gray-50 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                  {p.title}
                </span>
                {p.summary && (
                  <span className="block text-sm leading-relaxed text-gray-500 dark:text-gray-400">{p.summary}</span>
                )}
                <PostStatsLine post={toSummary(p)} views={stats.views[p.slug]} comments={stats.comments[p.slug]} />
              </span>
            </Link>
          </li>
        ))}

        {series.upcoming.map((title, i) => (
          <li
            key={title}
            className="flex gap-4 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 p-5 text-gray-400 dark:text-gray-500"
          >
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-dashed border-gray-300 dark:border-gray-700 text-sm font-semibold">
              {series.parts.length + i + 1}
            </span>
            <span className="min-w-0">
              <span className="block font-medium leading-snug">{title}</span>
              <span className="text-xs uppercase tracking-wide">Coming soon</span>
            </span>
          </li>
        ))}
      </ol>

      {series.upcoming.length > 0 && <NewsletterForm />}
    </div>
  );
}
