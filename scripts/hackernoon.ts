/**
 * Prepare blog posts for HackerNoon. It has no publishing API and stories go through editorial review,
 * so submitting stays manual.
 *
 *   bun scripts/hackernoon.ts <slug...>   write paste-ready pages to .hackernoon/
 *   bun scripts/hackernoon.ts --status    list which posts are on HackerNoon, with word counts
 *
 * For each post: open .hackernoon/<slug>.html, press Copy, paste into a new HackerNoon story, put the
 * URL shown on the page in the story's "First Seen At" setting, upload the featured image listed there (from
 * frontmatter `cover`), then submit for review. Once it is live,
 * record the result in frontmatter: `hackernoon: "<hackernoon url>"`. Frontmatter `hackernoon: false`
 * skips a post.
 */
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { type DocMeta, loadMarkdownBySlug, loadMarkdownDocs } from "@/lib/mdSource";
import { buildPastePage } from "./medium";

const SITE = "https://bitlyst.blog";
const OUT_DIR = path.join(process.cwd(), ".hackernoon");

/** No link-back footer: "First Seen At" carries the source, and editors reject promotional links. */
function buildPage(post: DocMeta): string {
  return buildPastePage(post, {
    platform: "HackerNoon",
    cover: "settings",
    fields: [
      ["First Seen At (story settings)", `${SITE}/p/${post.slug}`],
      ["TL;DR", post.summary ?? ""],
      ["Tags", (post.tags ?? []).join(", ")],
    ],
  });
}

/** The `hackernoon` frontmatter value: a URL once published, false to skip. */
function hackernoonField(slug: string): string | false | undefined {
  const file = ["mdx", "md"].map((e) => path.join("docs", `${slug}.${e}`)).find((f) => fs.existsSync(f));
  return file ? matter(fs.readFileSync(file, "utf8")).data.hackernoon : undefined;
}

const wordCount = (post: DocMeta) => post.content.split(/\s+/).filter(Boolean).length;

function status() {
  const posts = loadMarkdownDocs().map((p) => ({ slug: p.slug, words: wordCount(p), url: hackernoonField(p.slug) }));
  const done = posts.filter((p) => typeof p.url === "string");
  const pending = posts.filter((p) => p.url === undefined);
  console.log(`On HackerNoon (${done.length}):`);
  for (const p of done) {
    console.log(`  ${p.slug} → ${p.url}`);
  }
  console.log(`\nNot on HackerNoon, newest first (${pending.length}):`);
  for (const p of pending) {
    console.log(`  ${String(p.words).padStart(5)}w  ${p.slug}`);
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
    console.error("Usage: bun scripts/hackernoon.ts <slug|docs/file.mdx...> | --status");
    process.exit(1);
  }

  fs.mkdirSync(OUT_DIR, { recursive: true });
  for (const slug of slugs) {
    const post = loadMarkdownBySlug(slug);
    if (!post) {
      console.log(`skip  ${slug} (missing or draft)`);
      continue;
    }
    const field = hackernoonField(slug);
    if (field === false) {
      console.log(`skip  ${slug} (hackernoon: false)`);
      continue;
    }
    const out = path.join(OUT_DIR, `${slug}.html`);
    fs.writeFileSync(out, buildPage(post));
    console.log(`write ${slug} → ${out}${field ? ` (already on HackerNoon: ${field})` : ""}`);
  }
}

main();
