import type { Metadata } from "next";
import Link from "next/link";
import PixelSprite from "@/components/PixelSprite";
import SeriesProgress from "@/components/SeriesProgress";
import { getAllSeries } from "@/lib/series";

export const metadata: Metadata = {
  title: "Series",
  description:
    "Multi-part Bitlyst series: JavaScript Plot Twists, Next.js Field Notes and more — read them in order, one short story at a time.",
  alternates: { canonical: "/series" },
};

export default function SeriesIndexPage() {
  const all = getAllSeries();

  return (
    <div className="mx-auto max-w-[42rem] space-y-10">
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Series</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Posts that build on each other. Start at part 1, or jump in anywhere — every part stands on its own.
        </p>
      </div>

      <ul className="space-y-4">
        {all.map((s) => {
          const total = s.parts.length + s.upcoming.length;
          return (
            <li
              key={s.slug}
              className="rounded-2xl border border-gray-200/80 dark:border-gray-800 bg-surface-light dark:bg-surface-dark p-5 sm:p-6"
            >
              <div className="flex items-start gap-4">
                <Link
                  href={`/series/${s.slug}`}
                  className="shrink-0 rounded-xl bg-gray-50 dark:bg-gray-900 p-2"
                  tabIndex={-1}
                  aria-hidden
                >
                  <PixelSprite name={s.mascot.sprite} size={64} animate={false} />
                </Link>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h2 className="text-lg font-bold tracking-tight">
                      <Link
                        href={`/series/${s.slug}`}
                        className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
                      >
                        {s.name}
                      </Link>
                    </h2>
                    <span className="text-xs text-gray-400 dark:text-gray-500">
                      {s.parts.length > 0 ? `${s.parts.length} of ${total} parts published` : "Starting soon"}
                    </span>
                  </div>
                  <p className="mt-1.5 text-sm leading-relaxed text-gray-500 dark:text-gray-400">{s.description}</p>
                </div>
              </div>

              {s.parts.length > 0 ? (
                <>
                  <ol className="mt-4 space-y-1.5 text-sm">
                    {s.parts.slice(0, 3).map((p, i) => (
                      <li key={p.slug} className="flex gap-2">
                        <span className="w-5 shrink-0 text-right tabular-nums text-gray-400 dark:text-gray-500">
                          {i + 1}.
                        </span>
                        <Link
                          href={`/blog/${p.slug}`}
                          className="text-gray-700 dark:text-gray-300 hover:text-brand-600 dark:hover:text-brand-400"
                        >
                          {p.title}
                        </Link>
                      </li>
                    ))}
                  </ol>
                  <div className="mt-4">
                    <SeriesProgress parts={s.parts.map(({ slug, title }) => ({ slug, title }))} compact />
                  </div>
                </>
              ) : (
                <p className="mt-4 text-sm text-gray-400 dark:text-gray-500">First up: {s.upcoming[0]}</p>
              )}

              <Link
                href={`/series/${s.slug}`}
                className="mt-4 inline-block text-sm font-medium text-brand-600 dark:text-brand-400 hover:underline underline-offset-2"
              >
                View series →
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
