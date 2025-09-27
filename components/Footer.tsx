import Link from "next/link";
import { SniplyRoundedMark } from "./sniply-typography-icons/SniplyIcons";

export default function Footer() {
  return (
    <footer className="border-t dark:border-gray-800 mt-16">
      <div className="container py-10 text-sm text-gray-500 flex items-center justify-between flex-col md:flex-row gap-4 md:gap-0">
        <p className="flex items-center gap-2">
          © {new Date().getFullYear()} • <SniplyRoundedMark size={16} /> Bitlyst
        </p>

        <div className="flex items-center gap-2">
          <Link
            href="https://github.com/mohsenfallahnjd/bitlyst"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            GitHub
          </Link>
          <span>•</span>
          <Link
            href="https://www.linkedin.com/in/mohsenfallahnjd/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            LinkedIn
          </Link>
          <span>•</span>
          {/* <Link href="https://x.com/mohsenfallahnjd" target="_blank" className="hover:underline">
            X
          </Link>
          <span>•</span>
          <Link href="https://www.instagram.com/mohsenfallahnjd/" target="_blank" className="hover:underline">
            Instagram
          </Link>
          <span>•</span> */}
          <Link
            href="mailto:mohsenfallahnjd@gmail.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            Contact
          </Link>
          <span>•</span>
          <Link href="/about" className="hover:underline hover:text-gray-600 dark:hover:text-gray-600 text-sm">
            About
          </Link>
        </div>
      </div>
    </footer>
  );
}
