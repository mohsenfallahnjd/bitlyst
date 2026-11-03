import type { Metadata } from "next";
import { Suspense } from "react";
import { loadMarkdownDocs } from "@/lib/mdSource";
import { searchDocs } from "@/lib/search";
import { getAllViews } from "@/lib/stats";
import SearchClient from "./SearchClient";

export default function SearchPage({ searchParams }: PageProps<"/search">) {
  return (
    <div className="mx-auto max-w-[42rem] space-y-6">
      <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Search</h1>
      {/* the query is only known at request time — everything above prerenders */}
      <Suspense fallback={<div className="h-12 rounded-xl border border-gray-200 dark:border-gray-700 animate-pulse" />}>
        <SearchResults searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function SearchResults({ searchParams }: Pick<PageProps<"/search">, "searchParams">) {
  const awaited = await searchParams;
  const initialQuery = (awaited?.q || "").toString();
  const docs = loadMarkdownDocs();

  // Send minimal fields needed to the client
  const clientDocs = docs.map((d) => ({
    slug: d.slug,
    title: d.title,
    summary: d.summary || "",
    tags: d.tags || [],
    content: d.content || "",
    readingTime: d.readingTime,
  }));

  const views = await getAllViews();
  const ranked = [...docs].sort((a, b) => (views[b.slug] ?? 0) - (views[a.slug] ?? 0));
  const popular = ranked.slice(0, 5).map(({ slug, title, readingTime }) => ({ slug, title, readingTime }));

  // Server-side results for SEO + fast first paint
  const serverResults = initialQuery ? searchDocs(initialQuery, docs, 20) : [];
  // tokens are computed client-side; no need to keep on server

  return (
    <>
      {/* Hydrated client search with SSR initial state below */}
      <SearchClient docs={clientDocs} initialQuery={initialQuery} popular={popular} />

      {/* SSR results for crawlers / no-JS */}
      {initialQuery && (
        <div className="sr-only">
          <p>
            {serverResults.length} results for {initialQuery}
          </p>
          <ul>
            {serverResults.map((r) => (
              <li key={r.slug}>
                <a href={`/p/${r.slug}`}>{r.title}</a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}

export async function generateMetadata({ searchParams }: PageProps<"/search">): Promise<Metadata> {
  const awaited = await searchParams;
  const q = (awaited?.q || "").toString().trim();
  const title = q ? `Search: ${q}` : "Search";
  const description = q
    ? `Search results for "${q}" on Bitlyst. Find posts matching your query.`
    : "Search Bitlyst posts by title, tags and content.";
  const url = q ? `https://bitlyst.blog/search?q=${encodeURIComponent(q)}` : "https://bitlyst.blog/search";
  return {
    title,
    description,
    robots: { index: false, follow: false },
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "website",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}
