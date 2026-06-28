import Link from "next/link";

const LINKS = [
  { label: "Posts", href: "/blog" },
  { label: "Links", href: "/links" },
  { label: "About", href: "/about" },
  { label: "RSS", href: "/rss.xml" },
  { label: "GitHub", href: "https://github.com/mohsenfallahnjd/bitlyst", external: true },
  { label: "X", href: "https://x.com/themohsenme", external: true },
];

export default function Footer() {
  return (
    <footer className="border-t border-gray-100 dark:border-gray-800/50 mt-20">
      <div className="container py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <span className="text-xs text-gray-400 dark:text-gray-500">
          © {new Date().getFullYear()} Bitlyst
        </span>
        <nav className="flex flex-wrap gap-5">
          {LINKS.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              {...("external" in l && l.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="text-xs text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
