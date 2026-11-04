import type { Metadata } from "next";
import TopicRequest from "@/components/TopicRequest";
import { usefulLinks } from "@/lib/links";

function extractDomain(url: string): string {
  try {
    const u = new URL(url);
    return u.hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export const metadata: Metadata = {
  title: "Useful Links",
  description: "Hand-picked articles, deep dives and tools for frontend and full-stack developers.",
  alternates: { canonical: "/links" },
};

export default function UsefulLinksPage() {
  return (
    <div className="mx-auto max-w-[42rem] space-y-10">
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Useful links</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Articles, deep dives and tools I found genuinely worth your time — {usefulLinks.length} so far.
        </p>
      </div>

      <ul>
        {usefulLinks.map((item) => (
          <li key={item.url} className="border-b border-gray-200/70 dark:border-gray-800/60 last:border-b-0">
            <a href={item.url} target="_blank" rel="noopener noreferrer" className="group block py-5">
              <div className="flex items-baseline justify-between gap-3">
                <span className="font-semibold leading-snug text-gray-900 dark:text-gray-100 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                  {item.title}{" "}
                  <span className="text-gray-400 dark:text-gray-600" aria-hidden>
                    ↗
                  </span>
                </span>
                <span className="shrink-0 text-xs text-gray-400 dark:text-gray-500">{extractDomain(item.url)}</span>
              </div>
              {item.description && (
                <p className="mt-1.5 text-sm leading-relaxed text-gray-500 dark:text-gray-400">{item.description}</p>
              )}
              <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-gray-400 dark:text-gray-500">
                {item.tags?.map((t) => (
                  <span key={t}>#{t}</span>
                ))}
                {item.sharedBy && <span>· shared by {item.sharedBy.name}</span>}
              </div>
            </a>
          </li>
        ))}
      </ul>

      <TopicRequest
        title="Know a great resource?"
        description="Send it over — if it teaches something well, it goes on the list (with credit)."
        placeholder="Link + one line on why it's good"
        kind="link-suggestion"
        submitLabel="Send"
      />
    </div>
  );
}
