import Link from "next/link";
import NavLinks from "@/components/NavLinks";
import SearchShortcut from "@/components/SearchShortcut";
import { SniplyRoundedMark } from "@/components/sniply-typography-icons/SniplyIcons";
import ThemeToggle from "@/components/ThemeToggle";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-200/50 dark:border-gray-800/50 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-md">
      <SearchShortcut />
      <div className="container flex items-center justify-between gap-3 py-3">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <SniplyRoundedMark size={28} />
          <span className="hidden min-[360px]:inline text-sm font-semibold tracking-tight text-foreground-light dark:text-foreground-dark">Bitlyst</span>
        </Link>

        <nav className="flex items-center gap-3.5 sm:gap-6" aria-label="Main">
          <NavLinks />
          <Link
            href="/search"
            aria-label="Search"
            className="text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
          >
            <svg viewBox="0 0 16 16" fill="currentColor" className="size-4" aria-hidden>
              <path d="M10.68 11.74a6 6 0 0 1-7.922-8.982 6 6 0 0 1 8.982 7.922l3.04 3.04a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215ZM11.5 7a4.499 4.499 0 1 0-8.997 0A4.499 4.499 0 0 0 11.5 7Z" />
            </svg>
          </Link>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
