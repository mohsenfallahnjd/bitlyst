import type { MetadataRoute } from "next";
import type { DocMeta } from "@/lib/mdSource";
import { loadMarkdownDocs } from "@/lib/mdSource";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const site = "https://bitlyst.vercel.app";
  const base = [
    { url: site, lastModified: new Date(), changeFrequency: "daily" as const, priority: 1 },
    { url: `${site}/blog`, lastModified: new Date(), changeFrequency: "daily" as const, priority: 0.9 },
    { url: `${site}/search`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.5 },
  ];
  const posts = loadMarkdownDocs().map((p: DocMeta) => ({
    url: `${site}/blog/${p.slug}`,
    lastModified: p.publishedTime ? new Date(p.publishedTime) : new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));
  return [...base, ...posts];
}
