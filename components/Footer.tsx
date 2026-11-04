import { cacheLife } from "next/cache";
import Link from "next/link";

const LINKS = [
  { label: "Posts", href: "/posts" },
  { label: "Series", href: "/series" },
  { label: "Topics", href: "/tags" },
  { label: "Links", href: "/links" },
  { label: "About", href: "/about" },
  // a feed file, not a page: a <Link> would prefetch it as an RSC payload
  { label: "RSS", href: "/rss.xml", plain: true },
  { label: "GitHub", href: "https://github.com/mohsenfallahnjd/bitlyst", external: true },
  { label: "X", href: "https://x.com/themohsenme", external: true },
];

/** Current year, recomputed daily — reading the clock directly would block prerendering. */
async function CopyrightYear() {
  "use cache";
  cacheLife("days");
  return <>{new Date().getFullYear()}</>;
}

export default function Footer() {
  return (
    <footer className="border-t border-gray-200/70 dark:border-gray-800/60 mt-24">
      <div className="container py-10 grid gap-8 sm:grid-cols-[1fr_auto] sm:items-end">
        <div className="space-y-2 max-w-sm">
          <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">Bitlyst</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
            Short, diagram-first posts on JavaScript, React & Next.js. Follow via{" "}
            <a href="/rss.xml" className="text-brand-600 dark:text-brand-400 hover:underline underline-offset-2">
              RSS
            </a>{" "}
            or the newsletter.
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500">
            © <CopyrightYear /> Mohsen Fallahnejad
          </p>
        </div>
        <nav aria-label="Footer" className="flex flex-wrap gap-x-5 gap-y-2">
          {LINKS.map((l) => {
            const className =
              "text-xs text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors";
            if ("external" in l && l.external) {
              return (
                <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer" className={className}>
                  {l.label}
                </a>
              );
            }
            if ("plain" in l && l.plain) {
              return (
                <a key={l.label} href={l.href} className={className}>
                  {l.label}
                </a>
              );
            }
            return (
              <Link key={l.label} href={l.href} className={className}>
                {l.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </footer>
  );
}
