import Link from "next/link";
import { usefulLinks } from "@/lib/links";

export const metadata = {
  title: "Useful Links",
  description: "Curated collection of helpful external resources and blogs.",
};

export default function UsefulLinksPage() {
  return (
    <section className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Useful Links</h1>
        <p className="text-gray-600 dark:text-gray-300">Curated external resources worth reading.</p>
      </div>

      <ul className="grid gap-4">
        {usefulLinks.map((item) => (
          <li key={item.url} className="rounded-lg border border-gray-200 dark:border-gray-800 p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
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
                {item.source && <p className="text-xs text-gray-500 dark:text-gray-400">{item.source}</p>}
              </div>

              {item.tags && item.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {item.tags.map((t) => (
                    <span
                      key={t}
                      className="text-xs rounded-full border border-gray-200 dark:border-gray-800 px-2 py-0.5"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>

      <div className="text-sm text-gray-600 dark:text-gray-300">
        Want to suggest a link? Send me an email at{" "}
        <Link href="mailto:mohsenfallahnjd@gmail.com" target="_blank" rel="noopener noreferrer" className="underline">
          Email
        </Link>
        .
      </div>
    </section>
  );
}
