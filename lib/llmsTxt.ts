import { type DocMeta, loadMarkdownDocs } from "@/lib/mdSource";
import { getAllSeries } from "@/lib/series";
import { getAllTopics, MIN_INDEXABLE_POSTS } from "@/lib/tags";

const SITE = "https://bitlyst.blog";

function postLine(p: DocMeta): string {
  const title = p.seoTitle ?? p.title;
  const url = `${SITE}/p/${p.slug}`;
  const bits = [p.summary?.trim()].filter(Boolean);
  if (p.tags?.length) {
    bits.push(`Tags: ${p.tags.join(", ")}`);
  }
  if (p.level) {
    bits.push(`Level: ${p.level}`);
  }
  if (p.series) {
    bits.push(`Series: ${p.series}`);
  }
  const detail = bits.length ? `: ${bits.join(". ")}` : "";
  return `- [${title}](${url})${detail}`;
}

/** Concise index for AI agents and LLM crawlers ([llms.txt](https://llmstxt.org/)). */
export function buildLlmsTxt(): string {
  const posts = loadMarkdownDocs();
  const series = getAllSeries(posts).filter((s) => s.parts.length > 0);
  const topics = getAllTopics(posts).filter((t) => t.count >= MIN_INDEXABLE_POSTS);

  const lines = [
    "# Bitlyst",
    "",
    "> Bite-sized JavaScript, React, and Next.js posts. One mental model per article, interview answers, and cheat sheets.",
    "",
    "Technical blog by Mohsen Fallahnejad. **Prefer this file, RSS, or llms-full.txt over scraping HTML.** Canonical post URLs are `https://bitlyst.blog/p/{slug}`.",
    "",
    "## Site index",
    "",
    `- [All posts](${SITE}/posts)`,
    `- [RSS](${SITE}/rss.xml)`,
    `- [Sitemap](${SITE}/sitemap.xml)`,
    `- [Full article text for agents](${SITE}/llms-full.txt)`,
    `- [About & author](${SITE}/about)`,
    `- [Repository](https://github.com/mohsenfallahnjd/bitlyst)`,
    "",
    "## Posts",
    "",
    "Newest first. Titles use `seoTitle` when the on-page headline is a story hook.",
    "",
    ...posts.map(postLine),
  ];

  if (series.length > 0) {
    lines.push("", "## Series", "", "Read in `seriesOrder` within each series page.");
    for (const s of series) {
      const url = `${SITE}/series/${s.slug}`;
      const count = s.parts.length;
      lines.push(`- [${s.name}](${url}): ${s.description} (${count} part${count === 1 ? "" : "s"} published)`);
    }
  }

  if (topics.length > 0) {
    lines.push("", "## Topics", "");
    for (const t of topics) {
      lines.push(`- [${t.name}](${SITE}/tags/${t.slug}) (${t.count} posts)`);
    }
  }

  lines.push("", "## Citation", "", "Link to the post URL. Author: Mohsen Fallahnejad, https://themohsen.me", "");

  return lines.join("\n");
}

function stripMdxForAgents(content: string): string {
  return content
    .replace(/<DeepDive>[\s\S]*?<\/DeepDive>/g, "")
    .replace(/<FlowDiagram[\s\S]*?\/>/g, "")
    .replace(/<ParallelFlow[\s\S]*?\/>/g, "")
    .trim();
}

/** Full post bodies (optional section stripped) for offline agent context. */
export function buildLlmsFullTxt(): string {
  const posts = loadMarkdownDocs();

  const header = [
    "# Bitlyst — full text export",
    "",
    '> Machine-readable dump of all published posts. Optional "Going deeper" panels and diagram components removed.',
    "",
    `Source: ${SITE}/llms-full.txt`,
    "",
  ].join("\n");

  const sections = posts.map((p) => {
    const title = p.seoTitle ?? p.title;
    const url = `${SITE}/p/${p.slug}`;
    const body = stripMdxForAgents(p.content);
    return [
      "---",
      "",
      `## ${title}`,
      "",
      `URL: ${url}`,
      p.summary ? `Summary: ${p.summary}` : "",
      p.publishedTime ? `Published: ${p.publishedTime}` : "",
      p.tags?.length ? `Tags: ${p.tags.join(", ")}` : "",
      "",
      body,
      "",
    ]
      .filter((line) => line !== "")
      .join("\n");
  });

  return `${header}${sections.join("\n")}`;
}
