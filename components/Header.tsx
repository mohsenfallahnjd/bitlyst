import Link from "next/link";
import SearchShortcut from "@/components/SearchShortcut";
import ThemeToggle from "@/components/ThemeToggle";
import { SniplyRoundedMark } from "./sniply-typography-icons/SniplyIcons";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-200/70 dark:border-gray-800/70 bg-white/80 dark:bg-black/60 backdrop-blur-md">
      <SearchShortcut />
      <div className="container flex items-center justify-between gap-2 py-3">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 text-[15px] font-bold tracking-tight hover:opacity-80 transition-opacity shrink-0"
        >
          <SniplyRoundedMark size={26} />
          <span>Bitlyst</span>
        </Link>

        {/* Nav */}
        <nav className="flex items-center gap-0.5 sm:gap-1">
          {/* Text links — hidden on xs, visible sm+ */}
          <Link
            href="/blog"
            className="hidden sm:flex rounded-md px-3 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800/60 transition-colors"
          >
            Posts
          </Link>
          <Link
            href="/links"
            className="hidden sm:flex rounded-md px-3 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800/60 transition-colors"
          >
            Links
          </Link>
          <Link
            href="/about"
            className="hidden sm:flex rounded-md px-3 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800/60 transition-colors"
          >
            About
          </Link>

          {/* Mobile-only icon links */}
          <Link
            href="/blog"
            aria-label="Posts"
            className="sm:hidden flex items-center justify-center rounded-md p-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800/60 transition-colors"
          >
            <svg viewBox="0 0 16 16" fill="currentColor" className="size-4">
              <path d="M0 1.75A.75.75 0 0 1 .75 1h4.253c1.227 0 2.317.59 3 1.501A3.743 3.743 0 0 1 11.006 1h4.245a.75.75 0 0 1 .75.75v10.5a.75.75 0 0 1-.75.75h-4.507a2.25 2.25 0 0 0-1.591.659l-.622.621a.75.75 0 0 1-1.062 0l-.622-.621A2.25 2.25 0 0 0 5.258 13H.75a.75.75 0 0 1-.75-.75Z" />
            </svg>
          </Link>

          {/* Divider */}
          <span className="mx-0.5 sm:mx-1 h-4 w-px bg-gray-200 dark:bg-gray-700" aria-hidden />

          {/* Search */}
          <Link
            href="/search"
            aria-label="Search"
            className="flex items-center gap-1.5 rounded-md px-2 py-1.5 sm:px-2.5 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800/60 transition-colors"
          >
            <svg viewBox="0 0 16 16" fill="currentColor" className="size-4">
              <path d="M10.68 11.74a6 6 0 0 1-7.922-8.982 6 6 0 0 1 8.982 7.922l3.04 3.04a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215ZM11.5 7a4.499 4.499 0 1 0-8.997 0A4.499 4.499 0 0 0 11.5 7Z" />
            </svg>
            <kbd className="hidden sm:inline-flex items-center rounded border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 text-[10px] font-mono text-gray-400 leading-none">
              ⌘K
            </kbd>
          </Link>

          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
