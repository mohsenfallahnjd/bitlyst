import Link from "next/link";
import SearchShortcut from "@/components/SearchShortcut";
import ThemeToggle from "@/components/ThemeToggle";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-200/40 dark:border-gray-800/40 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-sm">
      <SearchShortcut />
      <div className="container flex items-center justify-between py-4">
        <Link
          href="/"
          className="text-sm font-semibold tracking-tight text-gray-900 dark:text-gray-100 hover:opacity-70 transition-opacity"
        >
          Bitlyst
        </Link>

        <nav className="flex items-center gap-5 sm:gap-6">
          <Link href="/blog" className="hidden sm:block text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
            Posts
          </Link>
          <Link href="/links" className="hidden sm:block text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
            Links
          </Link>
          <Link href="/about" className="hidden sm:block text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
            About
          </Link>
          <Link
            href="/search"
            aria-label="Search"
            className="text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
          >
            <svg viewBox="0 0 16 16" fill="currentColor" className="size-4">
              <path d="M10.68 11.74a6 6 0 0 1-7.922-8.982 6 6 0 0 1 8.982 7.922l3.04 3.04a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215ZM11.5 7a4.499 4.499 0 1 0-8.997 0A4.499 4.499 0 0 0 11.5 7Z" />
            </svg>
          </Link>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
