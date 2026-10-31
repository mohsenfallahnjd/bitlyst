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
      "Why ['1', '7', '11'].map(parseInt) returns [1, NaN, 3]",
      "The return statement that returned undefined",
      "0.1 + 0.2 and the invoice that was off by one cent",
      "The object key that reordered itself",
    ],
  },
  "nextjs-field-notes": {
    name: "Next.js Field Notes",
    description: "Tricks and traps from shipping Next.js App Router apps in production.",
    mascot: { sprite: "scout", name: "Scout", bio: "Takes notes in production so you don't have to." },
    upcoming: [
      "The page that was static until one cookie made it dynamic",
      "Why your Server Action runs twice in development",
      "Prefetching: the hidden cost of a long list of <Link>s",
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
