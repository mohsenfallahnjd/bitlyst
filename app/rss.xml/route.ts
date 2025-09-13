import { NextResponse } from "next/server";
import { getAllPosts } from "@/lib/posts";

export async function GET() {
  const posts = getAllPosts();
  const site = "https://sniply.blog";
  const items = posts
    .map(
      (p) => `
    <item>
      <title><![CDATA[${p.title}]]></title>
      <link>${site}/blog/${p.slug}</link>
      <guid>${site}/blog/${p.slug}</guid>
      <description><![CDATA[${p.summary || ""}]]></description>
      <pubDate>${p.date ? new Date(p.date).toUTCString() : ""}</pubDate>
    </item>
  `
    )
    .join("\n");

  const rss = `<?xml version="1.0" encoding="UTF-8" ?>
  <rss version="2.0">
    <channel>
      <title>sniply.blog</title>
      <link>${site}</link>
      <description>Bite-sized tech tips—simple, minimal, useful.</description>
      ${items}
    </channel>
  </rss>`;

  return new NextResponse(rss, {
    headers: { "Content-Type": "application/rss+xml; charset=UTF-8" },
  });
}
