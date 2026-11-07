import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export type DocMeta = {
  slug: string;
  title: string;
  summary?: string;
  publishedTime?: string;
  modifiedTime?: string;
  tags?: string[];
  content: string;
  authors: { name: string; url: string; avatar?: string }[];
  draft?: boolean;
  readingTime?: number;
  level?: "beginner" | "intermediate" | "advanced";
  /** key from lib/series.ts */
  series?: string;
  /** part number inside the series */
  seriesOrder?: number;
  /** position among posts with the same publish date; higher shows first (default 0) */
  publishOrder?: number;
  /** main image shown under the post header, on cards and as the share image; a path under public/ */
  cover?: string;
  /** caption for the cover (credit or a point the image can't make) */
  coverAlt?: string;
};

/** DocMeta without the body — what list UIs (and client components) need. */
export type PostSummary = Omit<DocMeta, "content">;

export function toSummary({ content: _content, ...rest }: DocMeta): PostSummary {
  return rest;
}

const BLOG_DIR = path.join(process.cwd(), "docs");
const DEFAULT_AUTHORS = [{ name: "Mohsen Fallahnejad", url: "https://themohsen.me", avatar: "/mohsen.JPEG" }];

function calcReadingTime(content: string): number {
  const words = content
    .replace(/[#*`\[\]<>]/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

function parseDoc(slug: string, src: string): DocMeta {
  const { data, content } = matter(src);
  return {
    slug,
    title: data.title ?? slug,
    summary: data.summary ?? "",
    publishedTime: data.publishedTime ?? "",
    modifiedTime: data.modifiedTime ?? data.publishedTime ?? "",
    tags: (data.tags as string[] | undefined) ?? [],
    authors: (data.authors as { name: string; url: string; avatar?: string }[] | undefined) ?? DEFAULT_AUTHORS,
    draft: data.draft ?? false,
    content,
    readingTime: calcReadingTime(content),
    level: (data.level as DocMeta["level"]) ?? undefined,
    series: (data.series as string | undefined) ?? undefined,
    seriesOrder: (data.seriesOrder as number | undefined) ?? undefined,
    publishOrder: (data.publishOrder as number | undefined) ?? undefined,
    cover: (data.cover as string | undefined) ?? undefined,
    coverAlt: (data.coverAlt as string | undefined) ?? undefined,
  };
}

/** Read all Markdown posts (already provided) */
export function loadMarkdownDocs(): DocMeta[] {
  const entries = fs.readdirSync(BLOG_DIR);
  return entries
    .filter((f) => f.endsWith(".md") || f.endsWith(".mdx"))
    .map((file) => {
      const slug = file.replace(/\.(md|mdx)$/, "");
      const src = fs.readFileSync(path.join(BLOG_DIR, file), "utf8");
      return parseDoc(slug, src);
    })
    .filter((p) => !p.draft)
    .sort(
      (a, b) =>
        new Date(b.publishedTime ?? "").getTime() - new Date(a.publishedTime ?? "").getTime() ||
        (b.publishOrder ?? 0) - (a.publishOrder ?? 0) ||
        a.slug.localeCompare(b.slug)
    );
}

/** ✅ Load a single post by its slug */
export function loadMarkdownBySlug(slug: string): DocMeta | null {
  // only top-level files in docs/ are published; rejects "_archive/x" and "../x"
  if (path.basename(slug) !== slug) {
    return null;
  }

  const file = ["md", "mdx"].map((ext) => path.join(BLOG_DIR, `${slug}.${ext}`)).find((f) => fs.existsSync(f));
  if (!file) {
    return null;
  }

  const src = fs.readFileSync(file, "utf8");
  const doc = parseDoc(slug, src);
  return doc.draft ? null : doc;
}
