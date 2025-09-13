import type { MetadataRoute } from "next";
import { getAllPosts, type PostMeta } from "@/lib/posts";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const site = "https://sniply.blog";
  const base = [
    { url: site, lastModified: new Date() },
    { url: `${site}/blog`, lastModified: new Date() },
  ];
  const posts = getAllPosts().map((p: PostMeta) => ({
    url: `${site}/blog/${p.slug}`,
    lastModified: p.date ? new Date(p.date) : new Date(),
  }));
  return [...base, ...posts];
}
