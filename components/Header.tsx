import ThemeToggle from "@/components/ThemeToggle";
import { SniplyRoundedMark } from "./sniply-typography-icons/SniplyIcons";
import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/70 backdrop-blur dark:border-gray-800 dark:bg-black/10">
      <div className="container flex items-center justify-between py-4">
        <Link
          href="/"
          className="text-lg font-semibold tracking-tight hover:text-brand-light dark:hover:text-brand-dark flex items-center gap-2"
        >
          <SniplyRoundedMark /> Sniply Blog
        </Link>
        <nav className="flex items-center gap-4">
          <Link href="/blog" className="hover:underline">
            Blog
          </Link>
          <Link href="/about" className="hover:underline">
            About
          </Link>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
