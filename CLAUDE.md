@AGENTS.md

# Bitlyst

Personal tech blog (Next.js App Router + MDX). Posts live in `docs/*.mdx` — only top-level files are published; `docs/_archive/` holds old versions.

## Writing posts

When writing, rewriting or editing any post, follow **[WRITING_GUIDE.md](WRITING_GUIDE.md)**: story-first voice (hook → wrong turn → reveal → fix → takeaway), first person, no emoji in headings, measured numbers only, one concept per post, TL;DR at the end.

Diagrams in MDX: `<FlowDiagram>` (ordered steps that can fork into outcomes; supports `title`, `notes`, `caption`) and `<ParallelFlow>` (waterfall timeline of sequential vs concurrent work). Usage is documented at the top of each component in `components/`.

Series are registered in `lib/series.ts` and joined via `series` + `seriesOrder` frontmatter.
