import Image from "next/image";
import Link from "next/link";
import type { DocMeta } from "@/lib/mdSource";

export default function AuthorBio({ authors }: { authors: DocMeta["authors"] }) {
  if (!authors?.length) return null;

  return (
    <div className="mt-12 pt-8 border-t border-gray-100 dark:border-gray-800/60">
      {authors.map((author) => (
        <div key={author.name} className="flex items-center gap-3">
          {author.avatar ? (
            <Image
              src={author.avatar}
              alt={author.name}
              width={40}
              height={40}
              className="rounded-full shrink-0 object-cover size-10"
            />
          ) : (
            <div className="size-10 rounded-full bg-stone-200 dark:bg-stone-700 flex items-center justify-center text-sm font-semibold text-stone-600 dark:text-stone-300 shrink-0">
              {author.name.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="min-w-0">
            <Link
              href={author.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-gray-900 dark:text-gray-100 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
            >
              {author.name}
            </Link>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
              Writing bite-sized JS, React & Next.js tips
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
