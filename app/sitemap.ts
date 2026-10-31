import type { MetadataRoute } from "next";
import { loadMarkdownDocs } from "@/lib/mdSource";
import { getAllSeries } from "@/lib/series";
import { getAllTopics, getPostsByTopic, MIN_INDEXABLE_POSTS } from "@/lib/tags";

const site = "https://bitlyst.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = loadMarkdownDocs();
  const latest = posts[0]?.modifiedTime || posts[0]?.publishedTime;
  const lastPost = latest ? new Date(latest) : new Date();

  const base: MetadataRoute.Sitemap = [
    { url: site, lastModified: lastPost, changeFrequency: "daily", priority: 1 },
    { url: `${site}/blog`, lastModified: lastPost, changeFrequency: "daily", priority: 0.9 },
    { url: `${site}/tags`, lastModified: lastPost, changeFrequency: "weekly", priority: 0.6 },
    { url: `${site}/series`, lastModified: lastPost, changeFrequency: "weekly", priority: 0.7 },
    { url: `${site}/about`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${site}/links`, changeFrequency: "monthly", priority: 0.3 },
  ];

  const postEntries: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${site}/blog/${p.slug}`,
    lastModified: new Date(p.modifiedTime || p.publishedTime || Date.now()),
    changeFrequency: "monthly",
    priority: 0.8,
    images: [`${site}/og?slug=${p.slug}`],
  }));

  // only topics with enough posts — single-post topic pages are noindex
  const topicEntries: MetadataRoute.Sitemap = getAllTopics(posts)
    .filter((t) => t.count >= MIN_INDEXABLE_POSTS)
    .map((t) => {
      const newest = getPostsByTopic(t.slug, posts)[0];
      return {
        url: `${site}/tags/${t.slug}`,
        lastModified: new Date(newest?.modifiedTime || newest?.publishedTime || Date.now()),
        changeFrequency: "weekly",
        priority: 0.6,
      };
    });

  // series with at least one published part (empty ones are noindex)
  const seriesEntries: MetadataRoute.Sitemap = getAllSeries(posts)
    .filter((s) => s.parts.length > 0)
    .map((s) => {
      const newest = [...s.parts].sort((a, b) => (b.publishedTime ?? "").localeCompare(a.publishedTime ?? ""))[0];
      return {
        url: `${site}/series/${s.slug}`,
        lastModified: new Date(newest.modifiedTime || newest.publishedTime || Date.now()),
        changeFrequency: "weekly",
        priority: 0.7,
      };
    });

  return [...base, ...postEntries, ...topicEntries, ...seriesEntries];
}
