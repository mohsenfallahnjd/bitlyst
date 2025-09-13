import Link from "next/link";
import { SniplyRoundedMark } from "./sniply-typography-icons/SniplyIcons";

export default function Footer() {
  return (
    <footer className="border-t dark:border-gray-800 mt-16">
      <div className="container py-10 text-sm text-gray-500 flex items-center justify-between">
        <p className="flex items-center gap-2">
          © {new Date().getFullYear()} • <SniplyRoundedMark size={16} /> Sniply
        </p>

        <div className="flex items-center gap-2">
          <Link href="https://github.com/mohsenfallahnjd/sniply" target="_blank" className="hover:underline">
            GitHub
          </Link>
          <span>•</span>
          <Link href="https://www.linkedin.com/in/mohsenfallahnjd/" target="_blank" className="hover:underline">
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
          <Link href="mailto:mohsenfallahnjd@gmail.com" target="_blank" className="hover:underline">
            Contact
          </Link>
        </div>
      </div>
    </footer>
  );
}
