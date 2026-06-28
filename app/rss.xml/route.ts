import { NextResponse } from "next/server";
import type { DocMeta } from "@/lib/mdSource";
import { loadMarkdownDocs } from "@/lib/mdSource";

export async function GET() {
  const posts = loadMarkdownDocs();
  const site = "https://bitlyst.vercel.app";
  const items = posts
    .map(
      (p: DocMeta) => `
    <item>
      <title><![CDATA[${p.title}]]></title>
      <link>${site}/blog/${p.slug}</link>
      <guid isPermaLink="true">${site}/blog/${p.slug}</guid>
      <description><![CDATA[${p.summary || ""}]]></description>
      <pubDate>${p.publishedTime ? new Date(p.publishedTime).toUTCString() : ""}</pubDate>
      ${p.authors?.map((a) => `<author>${a.url} (${a.name})</author>`).join("\n      ") ?? ""}
      ${p.tags?.map((t) => `<category>${t}</category>`).join("\n      ") ?? ""}
    </item>`,
    )
    .join("\n");

  const rss = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Bitlyst — JavaScript, React, and Next.js tips</title>
    <link>${site}</link>
    <description>Bite-sized tutorials and practical tips on JavaScript, React, and Next.js.</description>
    <language>en-us</language>
    <atom:link href="${site}/rss.xml" rel="self" type="application/rss+xml" />
    ${items}
  </channel>
</rss>`;

  return new NextResponse(rss, {
    headers: { "Content-Type": "application/rss+xml; charset=UTF-8" },
  });
}
