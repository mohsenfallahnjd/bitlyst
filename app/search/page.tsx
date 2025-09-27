import type { Metadata } from "next";
import { loadMarkdownDocs } from "@/lib/mdSource";
import { searchDocs } from "@/lib/search";
import SearchClient from "./SearchClient";

export default async function SearchPage({ searchParams }: PageProps<"/search">) {
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
  }));

  // Server-side results for SEO + fast first paint
  const serverResults = initialQuery ? searchDocs(initialQuery, docs, 20) : [];
  // tokens are computed client-side; no need to keep on server

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Search</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Find posts by title, tags, or content. Try queries like "react hydration" or "async vs sync".
        </p>
      </div>

      {/* Hydrated client search with SSR initial state below */}
      <SearchClient docs={clientDocs} initialQuery={initialQuery} />

      {/* SSR results for crawlers / no-JS */}
      {initialQuery && (
        <div className="sr-only">
          <p>
            {serverResults.length} results for {initialQuery}
          </p>
          <ul>
            {serverResults.map((r) => (
              <li key={r.slug}>
                <a href={`/blog/${r.slug}`}>{r.title}</a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export async function generateMetadata({ searchParams }: PageProps<"/search">): Promise<Metadata> {
  const awaited = await searchParams;
  const q = (awaited?.q || "").toString().trim();
  const title = q ? `Search: ${q}` : "Search";
  const description = q
    ? `Search results for "${q}" on Bitlyst. Find posts matching your query.`
    : "Search Bitlyst posts by title, tags and content.";
  const url = q ? `https://bitlyst.vercel.app/search?q=${encodeURIComponent(q)}` : "https://bitlyst.vercel.app/search";
  return {
    title,
    description,
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
