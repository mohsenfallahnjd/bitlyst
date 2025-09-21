import Link from "next/link";
import { SniplyRoundedMark } from "@/components/sniply-typography-icons/SniplyIcons";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center gap-4 py-24 text-center">
      <div className="flex items-center justify-center rounded-full border border-gray-200 bg-white p-3 text-gray-500 shadow-sm dark:border-gray-800 dark:bg-transparent">
        <SniplyRoundedMark />
      </div>
      <p className="text-sm uppercase tracking-widest text-gray-400">404</p>
      <h1 className="text-2xl font-semibold">Page not found</h1>
      <p className="text-gray-600 dark:text-gray-400">The page you’re looking for doesn’t exist or was moved.</p>
      <div className="mt-2 flex items-center gap-3">
        <Link href="/" className="rounded-md border px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-900">
          Go home
        </Link>
        <Link href="/search" className="rounded-md border px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-900">
          Search posts
        </Link>
      </div>
    </div>
  );
}
