import { NextResponse } from "next/server";
import type { DocMeta } from "@/lib/mdSource";
import { loadMarkdownDocs } from "@/lib/mdSource";

export async function GET() {
  const posts = loadMarkdownDocs();
  const site = "https://bitlyst.vercel.app/";
  const items = posts
    .map(
      (p: DocMeta) => `
    <item>
      <title><![CDATA[${p.title}]]></title>
      <link>${site}/blog/${p.slug}</link>
      <guid>${site}/blog/${p.slug}</guid>
      <description><![CDATA[${p.summary || ""}]]></description>
      <pubDate>${p.publishedTime ? new Date(p.publishedTime).toUTCString() : ""}</pubDate>
    </item>
  `
    )
    .join("\n");

  const rss = `<?xml version="1.0" encoding="UTF-8" ?>
  <rss version="2.0">
    <channel>
      <title>Bitlyst</title>
      <link>${site}</link>
      <description>Bite-sized tech tips—simple, minimal, useful.</description>
      ${items}
    </channel>
  </rss>`;

  return new NextResponse(rss, {
    headers: { "Content-Type": "application/rss+xml; charset=UTF-8" },
  });
}
