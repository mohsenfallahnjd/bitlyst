import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export type DocMeta = {
  slug: string;
  title: string;
  summary?: string;
  publishedTime?: string;
  tags?: string[];
  content: string;
  authors: { name: string; url: string }[];
  pinned?: boolean;
  draft?: boolean;
};

const BLOG_DIR = path.resolve("docs");
const DEFAULT_AUTHORS = [{ name: "Mohsen Fallahnejad", url: "https://www.linkedin.com/in/mohsenfallahnjd/" }];

/** Read all Markdown posts (already provided) */
export function loadMarkdownDocs(dir: string = BLOG_DIR): DocMeta[] {
  const entries = fs.readdirSync(dir);
  return entries
    .filter((f) => f.endsWith(".md") || f.endsWith(".mdx"))
    .map((file) => {
      const slug = file.replace(/\.(md|mdx)$/, "");
      const src = fs.readFileSync(path.join(dir, file), "utf8");
      const { data, content } = matter(src);
      return {
        slug,
        title: data.title ?? slug,
        summary: data.summary ?? "",
        publishedTime: data.publishedTime ?? "",
        tags: (data.tags as string[] | undefined) ?? [],
        authors: (data.authors as { name: string; url: string }[] | undefined) ?? DEFAULT_AUTHORS,
        pinned: data.pinned ?? false,
        draft: data.draft ?? false,
        content,
      };
    })
    .filter((p) => !p.draft)
    .sort((a, b) => (a.pinned ? -1 : 1))
    .sort((a, b) => new Date(b.publishedTime).getTime() - new Date(a.publishedTime).getTime());
}

/** ✅ Load a single post by its slug */
export function loadMarkdownBySlug(slug: string, dir: string = BLOG_DIR): DocMeta | null {
  const file = ["md", "mdx"].map((ext) => path.join(dir, `${slug}.${ext}`)).find((f) => fs.existsSync(f));
  if (!file) {
    return null;
  }

  const src = fs.readFileSync(file, "utf8");
  const { data, content } = matter(src);

  if (data.draft) {
    return null;
  }

  return {
    slug,
    title: data.title ?? slug,
    summary: data.summary ?? "",
    publishedTime: data.publishedTime ?? "",
    tags: (data.tags as string[] | undefined) ?? [],
    authors: (data.authors as { name: string; url: string }[] | undefined) ?? DEFAULT_AUTHORS,
    pinned: data.pinned ?? false,
    draft: data.draft ?? false,
    content,
  };
}
