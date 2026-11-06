/**
 * Prepare blog posts for Medium. Medium's API is closed to new integrations, so publishing stays manual.
 *
 *   bun scripts/medium.ts <slug...>   write paste-ready pages to .medium/
 *   bun scripts/medium.ts --status    list which posts are on Medium
 *
 * For each post: open .medium/<slug>.html, press Copy, paste into a new Medium story, and set the
 * canonical link shown on the page in the story's settings. Then record the result in frontmatter:
 * `medium: "<medium url>"`. Frontmatter `medium: false` skips a post.
 */
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { type DocMeta, loadMarkdownBySlug, loadMarkdownDocs } from "@/lib/mdSource";
import { toDevtoMarkdown } from "./devto";

const SITE = "https://bitlyst.blog";
const OUT_DIR = path.join(process.cwd(), ".medium");

const escapeHtml = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** Split a table row on unescaped pipes and strip inline markdown, since cells end up in a code block. */
const tableCells = (row: string) =>
  row
    .trim()
    .replace(/^\||\|$/g, "")
    .split(/(?<!\\)\|/)
    .map((c) =>
      c
        .trim()
        .replace(/\\\|/g, "|")
        .replace(/\*\*|`/g, "")
    );

/** Medium has no tables, so render them as aligned text in a code block. */
function tableToText(table: string): string {
  const [header, , ...body] = table.trim().split("\n");
  const rows = [header, ...body].map(tableCells);
  const widths = rows[0].map((_, i) => Math.max(...rows.map((r) => (r[i] ?? "").length)));
  const line = (r: string[]) =>
    widths
      .map((w, i) => (r[i] ?? "").padEnd(w))
      .join("  ")
      .trimEnd();
  const rule = widths.map((w) => "-".repeat(w)).join("  ");
  return `\`\`\`text\n${[line(rows[0]), rule, ...rows.slice(1).map(line)].join("\n")}\n\`\`\`\n`;
}

/** Convert a post to Medium-safe markdown. Tables inside fenced code blocks are left alone. */
export function toMediumMarkdown(content: string): string {
  return toDevtoMarkdown(content)
    .split(/(^(?:```|~~~)[^\n]*\n[\s\S]*?^(?:```|~~~)[ \t]*$)/m)
    .map((part, i) =>
      i % 2 === 1 ? part : part.replace(/^\|.*\|[ \t]*\n\|[-:| \t]+\|[ \t]*\n(?:\|.*\|[ \t]*(?:\n|$))*/gm, tableToText)
    )
    .join("");
}

const postUrl = (post: DocMeta) => `${SITE}/p/${post.slug}`;

function buildPage(post: DocMeta): string {
  return buildPastePage(post, {
    platform: "Medium",
    footer: `*Originally published on [Bitlyst](${postUrl(post)}).*`,
    fields: [
      ["Canonical link (story settings)", postUrl(post)],
      ["Subtitle", post.summary ?? ""],
      ["Tags (Medium allows 5)", (post.tags ?? []).slice(0, 5).join(", ")],
    ],
  });
}

/** A standalone page with a Copy button, for platforms that only accept pasted stories. */
export function buildPastePage(
  post: DocMeta,
  target: { platform: string; fields: [label: string, value: string][]; footer?: string }
): string {
  const content = post.content.replace(/^\s*# .*\n/, ""); // some posts open with their own H1; the title is added below
  const footer = target.footer ? `\n\n---\n\n${target.footer}\n` : "\n";
  const markdown = `# ${post.title}\n\n${toMediumMarkdown(content)}${footer}`;
  const body = renderToStaticMarkup(createElement(Markdown, { remarkPlugins: [remarkGfm] }, markdown));
  const fields = target.fields.map(([label, value]) => `<dt>${escapeHtml(label)}</dt><dd>${escapeHtml(value)}</dd>`);

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>${escapeHtml(post.title)}: ${escapeHtml(target.platform)} copy</title>
<style>
body { max-width: 720px; margin: 2rem auto; padding: 0 1rem; font: 16px/1.6 system-ui, sans-serif; }
aside { padding: 1rem; margin-bottom: 2rem; border: 1px solid #8884; border-radius: 8px; }
dt { font-weight: 600; } dd { margin: 0 0 .5rem; overflow-wrap: anywhere; }
pre { overflow-x: auto; padding: 1rem; background: #8882; }
button { padding: .5rem 1rem; font: inherit; cursor: pointer; }
</style>
</head>
<body>
<aside>
<dl>
${fields.join("\n")}
</dl>
<button id="copy" type="button">Copy story</button>
</aside>
<article id="story">
${body}
</article>
<script>
document.getElementById("copy").addEventListener("click", (e) => {
  const range = document.createRange();
  range.selectNodeContents(document.getElementById("story"));
  const selection = getSelection();
  selection.removeAllRanges();
  selection.addRange(range);
  e.target.textContent = document.execCommand("copy") ? "Copied" : "Press Cmd+C to copy";
});
</script>
</body>
</html>
`;
}

/** The `medium` frontmatter value: a URL once published, false to skip. */
function mediumField(slug: string): string | false | undefined {
  const file = ["mdx", "md"].map((e) => path.join("docs", `${slug}.${e}`)).find((f) => fs.existsSync(f));
  return file ? matter(fs.readFileSync(file, "utf8")).data.medium : undefined;
}

function status() {
  const posts = loadMarkdownDocs().map((p) => ({ slug: p.slug, medium: mediumField(p.slug) }));
  const done = posts.filter((p) => typeof p.medium === "string");
  const pending = posts.filter((p) => p.medium === undefined);
  console.log(`On Medium (${done.length}):`);
  for (const p of done) {
    console.log(`  ${p.slug} → ${p.medium}`);
  }
  console.log(`\nNot on Medium, newest first (${pending.length}):`);
  for (const p of pending) {
    console.log(`  ${p.slug}`);
  }
}

function main() {
  const args = process.argv.slice(2);
  if (args.includes("--status")) {
    status();
    return;
  }
  const slugs = args.filter((a) => !a.startsWith("--")).map((a) => path.basename(a).replace(/\.mdx?$/, ""));
  if (!slugs.length) {
    console.error("Usage: bun scripts/medium.ts <slug|docs/file.mdx...> | --status");
    process.exit(1);
  }

  fs.mkdirSync(OUT_DIR, { recursive: true });
  for (const slug of slugs) {
    const post = loadMarkdownBySlug(slug);
    if (!post) {
      console.log(`skip  ${slug} (missing or draft)`);
      continue;
    }
    const field = mediumField(slug);
    if (field === false) {
      console.log(`skip  ${slug} (medium: false)`);
      continue;
    }
    const out = path.join(OUT_DIR, `${slug}.html`);
    fs.writeFileSync(out, buildPage(post));
    console.log(`write ${slug} → ${out}${field ? ` (already on Medium: ${field})` : ""}`);
  }
}

if (import.meta.main) {
  main();
}
