import type { MetadataRoute } from "next";
import type { DocMeta } from "@/lib/mdSource";
import { loadMarkdownDocs } from "@/lib/mdSource";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const site = "https://bitlyst.vercel.app";
  const base = [
    { url: site, lastModified: new Date() },
    { url: `${site}/blog`, lastModified: new Date() },
  ];
  const posts = loadMarkdownDocs().map((p: DocMeta) => ({
    url: `${site}/blog/${p.slug}`,
    lastModified: p.publishedTime ? new Date(p.publishedTime) : new Date(),
  }));
  return [...base, ...posts];
}
