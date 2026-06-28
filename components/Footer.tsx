import Link from "next/link";
import NewsletterForm from "@/components/NewsletterForm";
import { SniplyRoundedMark } from "./sniply-typography-icons/SniplyIcons";

const NAV = [
  {
    heading: "Content",
    links: [
      { label: "All posts", href: "/blog" },
      { label: "Links", href: "/links" },
      { label: "About", href: "/about" },
      { label: "RSS feed", href: "/rss.xml" },
    ],
  },
  {
    heading: "Connect",
    links: [
      { label: "GitHub", href: "https://github.com/mohsenfallahnjd/bitlyst", external: true },
      { label: "X / Twitter", href: "https://x.com/themohsenme", external: true },
      { label: "LinkedIn", href: "https://www.linkedin.com/in/mohsenfallahnjd/", external: true },
      { label: "Email", href: "mailto:mohsenfallahnjd@gmail.com", external: true },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 mt-20">
      <div className="container pt-10 pb-8 space-y-8">

        {/* Top: newsletter (full width on mobile) */}
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">
            Stay updated
          </p>
          <NewsletterForm />
        </div>

        {/* Middle: brand + nav side by side on sm+ */}
        <div className="flex flex-col sm:flex-row gap-6 sm:gap-10">
          {/* Brand */}
          <div className="shrink-0 space-y-1.5">
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <SniplyRoundedMark size={24} />
              <span className="text-sm font-bold tracking-tight">Bitlyst</span>
            </Link>
            <p className="text-xs text-gray-400 dark:text-gray-500 leading-relaxed max-w-[180px]">
              Bite-sized JS, React & Next.js tips. Free, always.
            </p>
          </div>

          {/* Nav columns */}
          <div className="flex gap-10 sm:gap-16">
            {NAV.map((col) => (
              <div key={col.heading}>
                <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2.5">
                  {col.heading}
                </p>
                <ul className="space-y-1.5">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <Link
                        href={l.href}
                        {...("external" in l && l.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                        className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-t border-gray-100 dark:border-gray-800/60 pt-5 text-xs text-gray-400 dark:text-gray-500">
          <span>© {new Date().getFullYear()} Bitlyst</span>
          <span>Built with Next.js & ❤️</span>
        </div>
      </div>
    </footer>
  );
}
