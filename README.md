# sniply.blog — Minimal Next.js + MDX Blog

A clean, minimal starter for short tech tips. Built with **Next.js (App Router)**, **Tailwind**, and **MDX**.

## Features

- App Router (Next.js 14)
- MDX posts as routes: `app/blog/<slug>/page.tsx`
- Auto blog index using filesystem
- RSS feed at `/rss.xml`
- Sitemap & robots
- Minimal, responsive layout

## Quickstart

```bash
pnpm i   # or npm i / yarn
pnpm dev # or npm run dev
```

Open <http://localhost:3000>

## Write a post

Create a .mdx under `docs` like `/<your-slug>.mdx`:

```mdx
---
title: "Your title"
summary: "Short summary."
date: "2025-09-13"
tags: ["tag1", "tag2"]
---

Your MDX content here.
```
