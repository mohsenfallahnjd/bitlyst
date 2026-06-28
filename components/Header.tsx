import Link from "next/link";
import SearchShortcut from "@/components/SearchShortcut";
import ThemeToggle from "@/components/ThemeToggle";
import { SniplyRoundedMark } from "./sniply-typography-icons/SniplyIcons";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/70 backdrop-blur dark:border-gray-800 dark:bg-black/10">
      <SearchShortcut />
      <div className="container flex flex-wrap items-center justify-between gap-2 py-4">
        <Link
          href="/"
          className="text-lg font-semibold tracking-tight hover:text-brand-light dark:hover:text-brand-dark flex items-center gap-2"
        >
          <SniplyRoundedMark /> Bitlyst
        </Link>
        <nav className="flex flex-wrap items-center gap-2 sm:gap-4">
          <Link
            href="/blog"
            className="hover:underline hover:text-gray-600 dark:hover:text-gray-600 text-xs sm:text-sm"
          >
            Posts
          </Link>
          <Link
            href="/search"
            className="group flex items-center gap-1.5 hover:text-gray-600 dark:hover:text-gray-600 text-xs sm:text-sm"
          >
            <svg viewBox="0 0 16 16" fill="currentColor" className="size-3.5 opacity-60">
              <path d="M10.68 11.74a6 6 0 0 1-7.922-8.982 6 6 0 0 1 8.982 7.922l3.04 3.04a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215ZM11.5 7a4.499 4.499 0 1 0-8.997 0A4.499 4.499 0 0 0 11.5 7Z" />
            </svg>
            <span className="hidden sm:inline">Search</span>
            <kbd className="hidden sm:inline-flex items-center gap-0.5 rounded border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 text-[10px] font-mono text-gray-400 group-hover:border-gray-300 transition-colors">
              ⌘K
            </kbd>
          </Link>
          <Link
            href="/links"
            className="hover:underline hover:text-gray-600 dark:hover:text-gray-600 text-xs sm:text-sm"
          >
            Links
          </Link>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
