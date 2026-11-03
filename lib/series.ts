import type { SpriteName } from "@/components/PixelSprite";
import { type DocMeta, loadMarkdownDocs } from "@/lib/mdSource";

/**
 * Post series. A post joins one with frontmatter:
 *   series: "js-plot-twists"
 *   seriesOrder: 1
 * `upcoming` titles are shown as "coming next" so readers know to come back —
 * move a title out of the list once its post is published.
 */
export type Series = {
  name: string;
  description: string;
  upcoming: string[];
  /** pixel mascot from components/PixelSprite.tsx */
  mascot: { sprite: SpriteName; name: string; bio: string };
};

export const SERIES: Record<string, Series> = {
  "js-plot-twists": {
    name: "JavaScript Plot Twists",
    description: "Real bugs caused by JavaScript doing exactly what the spec says — and nothing you expected.",
    mascot: { sprite: "twisty", name: "Twisty", bio: "Has read the spec. Is still surprised every time." },
    upcoming: [
      "The birthday that showed up a day early",
      "The forEach that didn't wait for await",
      "The regex that matched every other time",
    ],
  },
  "nextjs-field-notes": {
    name: "Next.js Field Notes",
    description: "Tricks and traps from shipping Next.js App Router apps in production.",
    mascot: { sprite: "scout", name: "Scout", bio: "Takes notes in production so you don't have to." },
    upcoming: [
      "The redirect() that a try/catch swallowed",
      "The useSearchParams call that blanked half the page in the HTML",
    ],
  },
};

export type SeriesWithParts = Series & { slug: string; parts: DocMeta[] };

/** Every series with its published parts in reading order. */
export function getAllSeries(posts: DocMeta[] = loadMarkdownDocs()): SeriesWithParts[] {
  return Object.entries(SERIES).map(([slug, series]) => ({
    ...series,
    slug,
    parts: posts.filter((p) => p.series === slug).sort((a, b) => (a.seriesOrder ?? 0) - (b.seriesOrder ?? 0)),
  }));
}

export function getSeries(slug: string, posts?: DocMeta[]): SeriesWithParts | undefined {
  return getAllSeries(posts).find((s) => s.slug === slug);
}
