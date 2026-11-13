@AGENTS.md

# Bitlyst

Personal tech blog (Next.js App Router + MDX). Posts live in `docs/*.mdx` — only top-level files are published; `docs/_archive/` holds old versions.

## Writing posts

The blog's purpose: **make technical ideas simple enough to remember and explain in an interview.** Model posts: `docs/docker-in-2-minutes.mdx`, `docs/solid-principles.mdx`.

Post ideas live in **[POST_IDEAS.md](POST_IDEAS.md)**. Save new suggestions there and check it for duplicates before suggesting topics. Move an idea to Writing when you start it and to Published when it ships.

When writing, rewriting or editing any post, follow **[WRITING_GUIDE.md](WRITING_GUIDE.md)**: short hook → one mental model (analogy or one sentence) → how it works in plain words → in practice with honest stakes → "Say it in an interview" pull quote → cheat sheet / TL;DR → optional `<DeepDive>` ("Going deeper" panel) for internals, full benchmarks and caveats (the core must make sense without it). Aim for 400–800 words before "Going deeper", one concept per post, plain words before jargon, only the numbers that make the point (measured, never invented). Titles carry the searchable topic plus a hook. First person only for real experiences (made-up scenarios use "picture…" / "you", no invented people), no emoji in headings, images in every post (licensed photos or AI art, captions never just describe the image), a cover in the shared blue AI-illustration template, diagrams only when they beat prose. Soft-skill/opinion posts are articles and skip the concept-post shape.

Book briefs (the **Book Bites** series, `series: "book-bites"`) follow **[BOOK_BRIEF_GUIDE.md](BOOK_BRIEF_GUIDE.md)** instead of the concept-post shape: hook → the book in one sentence → 3–5 big ideas → where it's weak → use it on Monday → interview quote → cheat sheet → should you read it. Paraphrase, at most two short verified quotes, no book cover art.

Deep-dive panel in MDX: `<DeepDive>` wraps the optional advanced section at the end of a post and renders its own "Going deeper" h2.

Diagrams in MDX: `<FlowDiagram>` (ordered steps that can fork into outcomes; supports `title`, `notes`, `caption`) and `<ParallelFlow>` (waterfall timeline of sequential vs concurrent work). Usage is documented at the top of each component in `components/`.

When a newsletter or site features a post, add it to the post's `featuredIn` frontmatter (list of `{ name, url }`). It shows as a badge on the post and in the "Featured in" list on `/about`.

Series are registered in `lib/series.ts` and joined via `series` + `seriesOrder` frontmatter.

Posts sharing a `publishedTime` date are ordered by `publishOrder` frontmatter (higher shows first, default 0), then by slug. Newest written goes on top: when a post shares its date with another, give it the next number above the highest one that day.

## Caching (Cache Components is on)

`cacheComponents: true` and `partialPrefetching: true` in `next.config.mjs`. Route segment configs (`revalidate`, `dynamic`, `dynamicParams`, `runtime`) are not allowed.

- Cache data reads with `"use cache"` + `cacheLife(...)` inside the function. Redis/Postgres stats and comments use the custom `stats` profile (30 min), but only behind `app/api/stats`: pages load counts in the browser with `useStats()` (`lib/useStats.ts`, `components/StatCounts.tsx`) so they stay fully static. Never call `getPostStats()` in a page; it makes every page re-render on that timer and burns function CPU. The comment list uses `cacheLife("max")` with no timer; comment reads use `cacheTag("comments")`, which `app/api/comment/[id]` invalidates with `revalidateTag("comments", "max")`.
- Read `cookies()`, `headers()` or `searchParams` only inside a component wrapped in `<Suspense>` (see `app/search/page.tsx`, `app/admin/page.tsx`).
- Don't read the clock (`new Date()`, `Date.now()`) or `Math.random()` in server components outside a `"use cache"` scope — it fails the prerender.
- Unknown dynamic params: call `notFound()` in the page.
- Pages that read `params`/`searchParams` need a Suspense boundary above the read — a `loading.tsx` next to the page does it (see `app/p/[...slug]`, `app/tags/[tag]`, `app/series/[slug]`). Otherwise dev logs an "URL data outside of Suspense" insight.
