/**
 * Cross-post blog posts to dev.to.
 *
 *   bun scripts/devto.ts <slug...>            create (as draft) or update on dev.to
 *   bun scripts/devto.ts <slug...> --publish  new articles go live instead of draft
 *   bun scripts/devto.ts <slug...> --dry      write converted markdown to .devto/ only
 *   bun scripts/devto.ts --all --dry          convert every post (preview)
 *   bun scripts/devto.ts --all --plan         list what would be created/updated, change nothing
 *
 * Needs DEVTO_API_KEY (dev.to → Settings → Extensions → DEV Community API Keys).
 * Existing articles are matched by canonical_url, then by title (RSS imports may lack canonical_url),
 * so re-running updates instead of duplicating. An update also sets canonical_url on the dev.to copy.
 * Updates never change an article's published/draft state.
 * Frontmatter `devto: false` skips a post; `devto: "<dev.to url>"` pins it to that dev.to article.
 */
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { type DocMeta, loadMarkdownBySlug, loadMarkdownDocs } from "@/lib/mdSource";
import { SERIES } from "@/lib/series";

const SITE = "https://bitlyst.blog";
const API = "https://dev.to/api";
const OUT_DIR = path.join(process.cwd(), ".devto");

// ---------- MDX → dev.to markdown ----------

const attrs = (raw: string) => Object.fromEntries([...raw.matchAll(/(\w+)="([^"]*)"/g)].map((m) => [m[1], m[2]]));
const steps = (s: string) =>
  s
    .split(/\s*→\s*/)
    .map((x) => x.trim())
    .filter(Boolean);

function flowDiagram(a: Record<string, string>): string {
  const nodes = a.nodes ? steps(a.nodes) : [];
  const notes = a.notes ? a.notes.split("|").map((n) => n.trim()) : [];
  const branches = [a.branch1, a.branch2, a.branch3, a.branch4]
    .filter(Boolean)
    .map((b) => steps((b as string).replace(/^\s*\[\w+\]\s*/, "")).join(" → "));

  const lines: string[] = [];
  if (notes.some(Boolean)) {
    const w = Math.max(...nodes.map((n) => n.length));
    nodes.forEach((n, i) => lines.push(`${i + 1}. ${notes[i] ? `${n.padEnd(w)}  — ${notes[i]}` : n}`));
  } else if (nodes.length) {
    lines.push(nodes.join(" → "));
  }
  branches.forEach((b, i) => lines.push(`  ${i === branches.length - 1 ? "└─" : "├─"} ${b}`));

  return [a.title && `**${a.title}**\n`, `\`\`\`text\n${lines.join("\n")}\n\`\`\``, a.caption && `\n*${a.caption}*`]
    .filter(Boolean)
    .join("\n");
}

function parallelFlow(a: Record<string, string>): string {
  const tracks = (a.tracks ?? "")
    .split("|")
    .map((t) => t.trim())
    .filter(Boolean);
  const lens = tracks.map((_, i) => Number(a.durations?.split("|")[i]) || 1);
  const w = Math.max(...tracks.map((t) => t.length));
  const unit = 4;
  let offset = 0;
  const lines = tracks.map((t, i) => {
    const start = a.merge ? 0 : offset;
    offset += lens[i];
    return `${t.padEnd(w)}  ${" ".repeat(start * unit)}${"█".repeat(lens[i] * unit)}`;
  });
  if (a.merge) {
    lines.push(`${" ".repeat(w + 2)}└─ ${a.merge}`);
  }
  return [a.label && `**${a.label}**\n`, `\`\`\`text\n${lines.join("\n")}\n\`\`\``].filter(Boolean).join("\n");
}

const absolute = (url: string) => (url.startsWith("/") ? `${SITE}${url}` : url);

/** Transform prose only — fenced code blocks are left untouched. */
function convertProse(md: string): string {
  return md
    .replace(/<FlowDiagram\b([\s\S]*?)\/>/g, (_, raw) => flowDiagram(attrs(raw)))
    .replace(/<ParallelFlow\b([\s\S]*?)\/>/g, (_, raw) => parallelFlow(attrs(raw)))
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, "") // MDX comments
    .replace(/(!?\[[^\]]*\])\((\/[^)\s]*)/g, (_, label, url) => `${label}(${absolute(url)}`) // relative links/images
    .replace(/(src|href)="(\/[^"]*)"/g, (_, attr, url) => `${attr}="${absolute(url)}"`);
}

export function toDevtoMarkdown(content: string): string {
  // split on fenced code blocks (``` or ~~~), convert only the parts outside them
  const parts = content.split(/(^(?:```|~~~)[^\n]*\n[\s\S]*?^(?:```|~~~)[ \t]*$)/m);
  return parts
    .map((part, i) => (i % 2 === 1 ? part.replace(/^((?:```|~~~)\w*)[^\n]*/, "$1") : convertProse(part))) // drop fence meta (twoslash etc.)
    .join("")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/** dev.to: max 4 tags, lowercase alphanumeric only. */
const devtoTags = (tags: string[] = []) =>
  [...new Set(tags.map((t) => t.toLowerCase().replace(/[^a-z0-9]/g, "")).filter(Boolean))].slice(0, 4);

function buildArticle(post: DocMeta) {
  const url = `${SITE}/p/${post.slug}`;
  const body = `${toDevtoMarkdown(post.content)}\n\n---\n\n*Originally published on [Bitlyst](${url}).*\n`;
  return {
    title: post.title,
    body_markdown: body,
    description: post.summary || undefined,
    tags: devtoTags(post.tags),
    canonical_url: url,
    series: post.series ? SERIES[post.series]?.name : undefined,
  };
}

// ---------- dev.to API ----------

type DevtoArticle = { id: number; title: string; canonical_url: string | null; url: string; published: boolean };

const normUrl = (u?: string | null) =>
  (u ?? "")
    .replace(/^https?:\/\/(www\.)?/, "")
    .replace(/^bitlyst\.vercel\.app(?=\/|$)/, "bitlyst.blog") // pre-move canonical URLs
    .replace(/^bitlyst\.blog\/blog\/(?=.)/, "bitlyst.blog/p/") // posts used to live under /blog/
    .replace(/[?#].*$/, "")
    .replace(/\/+$/, "");
const normTitle = (t: string) =>
  t
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

/** Find the dev.to copy of a post: by canonical URL first, then by title (RSS imports may lack canonical_url). */
function findExisting(existing: DevtoArticle[], article: { title: string; canonical_url: string }) {
  const byUrl = existing.find((a) => a.canonical_url && normUrl(a.canonical_url) === normUrl(article.canonical_url));
  if (byUrl) {
    return { match: byUrl, by: "url" as const };
  }
  const byTitle = existing.find((a) => normTitle(a.title) === normTitle(article.title));
  return byTitle ? { match: byTitle, by: "title" as const } : undefined;
}

async function api<T>(method: string, route: string, body?: unknown): Promise<T> {
  const key = process.env.DEVTO_API_KEY;
  if (!key) {
    throw new Error("DEVTO_API_KEY is not set");
  }
  for (let attempt = 0; ; attempt++) {
    const res = await fetch(`${API}${route}`, {
      method,
      headers: { "api-key": key, "Content-Type": "application/json", Accept: "application/vnd.forem.api-v1+json" },
      body: body ? JSON.stringify(body) : undefined,
    });
    if (res.status === 429 && attempt < 3) {
      await new Promise((r) => setTimeout(r, 30_000)); // dev.to rate limit window
      continue;
    }
    if (!res.ok) {
      throw new Error(`${method} ${route} → ${res.status}: ${await res.text()}`);
    }
    return (await res.json()) as T;
  }
}

async function myArticles(): Promise<DevtoArticle[]> {
  const all: DevtoArticle[] = [];
  for (let page = 1; ; page++) {
    const batch = await api<DevtoArticle[]>("GET", `/articles/me/all?per_page=1000&page=${page}`);
    all.push(...batch);
    if (batch.length < 1000) {
      return all;
    }
  }
}

// ---------- CLI ----------

async function main() {
  const args = process.argv.slice(2);
  const dry = args.includes("--dry");
  const plan = args.includes("--plan");
  const publish = args.includes("--publish") || process.env.DEVTO_PUBLISH === "true";
  const slugs = args.includes("--all")
    ? loadMarkdownDocs().map((p) => p.slug)
    : args.filter((a) => !a.startsWith("--")).map((a) => path.basename(a).replace(/\.mdx?$/, ""));

  if (!slugs.length) {
    console.error("Usage: bun scripts/devto.ts <slug|docs/file.mdx...>|--all [--publish] [--dry] [--plan]");
    process.exit(1);
  }

  const existing = dry ? [] : await myArticles();
  const matched = new Set<number>();
  let failed = 0;

  for (const slug of slugs) {
    const post = loadMarkdownBySlug(slug);
    if (!post) {
      console.log(`skip  ${slug} (missing or draft)`);
      continue;
    }
    const file = ["mdx", "md"].map((e) => path.join("docs", `${slug}.${e}`)).find((f) => fs.existsSync(f));
    const devtoField = file ? matter(fs.readFileSync(file, "utf8")).data.devto : undefined;
    if (devtoField === false) {
      console.log(`skip  ${slug} (devto: false)`);
      continue;
    }

    const article = buildArticle(post);
    if (dry) {
      fs.mkdirSync(OUT_DIR, { recursive: true });
      const out = path.join(OUT_DIR, `${slug}.md`);
      fs.writeFileSync(
        out,
        `<!-- ${JSON.stringify({ ...article, body_markdown: undefined })} -->\n\n${article.body_markdown}`
      );
      console.log(`dry   ${slug} → ${out}`);
      continue;
    }

    try {
      const pinned =
        typeof devtoField === "string" ? existing.find((a) => normUrl(a.url) === normUrl(devtoField)) : undefined;
      if (typeof devtoField === "string" && !pinned) {
        throw new Error(`frontmatter devto: "${devtoField}" is not one of your dev.to articles`);
      }
      const found = pinned ? { match: pinned, by: "frontmatter" as const } : findExisting(existing, article);
      if (found) {
        matched.add(found.match.id);
      }
      if (plan) {
        console.log(
          found
            ? `update ${slug} ← ${found.match.url}${found.match.published ? "" : " (draft)"} [matched by ${found.by}]`
            : `create ${slug} (new ${publish ? "published" : "draft"})`
        );
        continue;
      }
      if (found) {
        const { match } = found;
        const res = await api<DevtoArticle>("PUT", `/articles/${match.id}`, { article });
        console.log(`update ${slug} → ${res.url}${match.published ? "" : " (draft)"} [matched by ${found.by}]`);
      } else {
        const res = await api<DevtoArticle>("POST", "/articles", { article: { ...article, published: publish } });
        console.log(`create ${slug} → ${res.url}${publish ? "" : " (draft)"}`);
      }
    } catch (err) {
      failed++;
      console.error(`fail  ${slug}: ${(err as Error).message}`);
    }
  }

  if (plan) {
    const orphans = existing.filter((a) => !matched.has(a.id));
    if (orphans.length) {
      console.log(`\n${orphans.length} dev.to article(s) not matched to any post (old title?):`);
      for (const a of orphans) {
        console.log(`  ${a.published ? "live " : "draft"}  ${a.title}\n         ${a.url}`);
      }
      console.log('\nLink one to its post with frontmatter: devto: "<dev.to url>"');
    }
  }

  if (failed) {
    process.exit(1);
  }
}

// medium.ts imports the converter from this file
if (import.meta.main) {
  main();
}
