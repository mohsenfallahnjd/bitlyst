import Link from "next/link";
import { usefulLinks } from "@/lib/links";

function extractDomain(url: string): string {
  try {
    const u = new URL(url);
    return u.hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export const metadata = {
  title: "Useful Links",
  description: "Curated collection of helpful external resources and blogs.",
};

export default function UsefulLinksPage() {
  return (
    <section className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Useful Links</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Hand-picked resources, articles, and tools that I found genuinely helpful.
        </p>
      </div>

      <ul className="grid gap-4">
        {usefulLinks.map((item) => {
          const domain = extractDomain(item.url);
          return (
            <li key={item.url} className="rounded-lg border border-gray-200 dark:border-gray-800 p-4">
              <div className="flex flex-col gap-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <Link
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-2"
                  >
                    <span className="text-base font-medium group-hover:underline">{item.title}</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      className="size-4 text-gray-500 dark:text-gray-400"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13.5 6H18m0 0v4.5M18 6l-7.5 7.5M15 18H6a2 2 0 01-2-2V9"
                      />
                    </svg>
                  </Link>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{domain}</span>
                </div>

                {item.description && <p className="text-sm text-gray-600 dark:text-gray-300">{item.description}</p>}

                {!!item.tags?.length && (
                  <div className="mt-1 flex flex-wrap gap-1 text-xs text-gray-600 dark:text-gray-400">
                    {item.tags.map((t) => (
                      <span key={t} className="rounded bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5">
                        {t}
                      </span>
                    ))}
                  </div>
                )}

                {item.sharedBy && (
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Shared by{" "}
                    <Link
                      href={`mailto:${item.sharedBy.email}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline"
                    >
                      {item.sharedBy.name}
                    </Link>
                  </p>
                )}
              </div>
            </li>
          );
        })}
      </ul>

      <div className="text-sm text-gray-600 dark:text-gray-300">
        Know a great resource? Email me at{" "}
        <Link href="mailto:mohsenfallahnjd@gmail.com" target="_blank" rel="noopener noreferrer" className="underline">
          mohsenfallahnjd@gmail.com
        </Link>
        .
      </div>
    </section>
  );
}
