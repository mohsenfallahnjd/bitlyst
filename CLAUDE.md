@AGENTS.md

# Bitlyst

Personal tech blog (Next.js App Router + MDX). Posts live in `docs/*.mdx` — only top-level files are published; `docs/_archive/` holds old versions.

## Writing posts

When writing, rewriting or editing any post, follow **[WRITING_GUIDE.md](WRITING_GUIDE.md)**: story-first voice (hook → wrong turn → reveal → fix → takeaway), first person only for real experiences (made-up scenarios use "picture…" / "you", no invented people), no emoji in headings, measured numbers only, one concept per post, images in every post (licensed photos or AI art, captions never just describe the image), a cover in the shared blue AI-illustration template, diagrams only when they beat prose, TL;DR at the end.

Diagrams in MDX: `<FlowDiagram>` (ordered steps that can fork into outcomes; supports `title`, `notes`, `caption`) and `<ParallelFlow>` (waterfall timeline of sequential vs concurrent work). Usage is documented at the top of each component in `components/`.

Series are registered in `lib/series.ts` and joined via `series` + `seriesOrder` frontmatter.

Posts sharing a `publishedTime` date are ordered by `publishOrder` frontmatter (higher shows first, default 0), then by slug. Newest written goes on top: when a post shares its date with another, give it the next number above the highest one that day.

## Caching (Cache Components is on)

`cacheComponents: true` and `partialPrefetching: true` in `next.config.mjs`. Route segment configs (`revalidate`, `dynamic`, `dynamicParams`, `runtime`) are not allowed.

- Cache data reads with `"use cache"` + `cacheLife(...)` inside the function. Redis/Postgres stats and comments use the custom `stats` profile (5 min); comment reads also use `cacheTag("comments")`, which `app/api/comment/[id]` invalidates with `revalidateTag("comments", "max")`.
- Read `cookies()`, `headers()` or `searchParams` only inside a component wrapped in `<Suspense>` (see `app/search/page.tsx`, `app/admin/page.tsx`).
- Don't read the clock (`new Date()`, `Date.now()`) or `Math.random()` in server components outside a `"use cache"` scope — it fails the prerender.
- Unknown dynamic params: call `notFound()` in the page.
- Pages that read `params`/`searchParams` need a Suspense boundary above the read — a `loading.tsx` next to the page does it (see `app/p/[...slug]`, `app/tags/[tag]`, `app/series/[slug]`). Otherwise dev logs an "URL data outside of Suspense" insight.
