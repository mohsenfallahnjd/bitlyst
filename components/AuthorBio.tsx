import Image from "next/image";
import Link from "next/link";
import type { DocMeta } from "@/lib/mdSource";

export default function AuthorBio({ authors }: { authors: DocMeta["authors"] }) {
  if (!authors?.length) return null;

  return (
    <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
      <p className="text-xs uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-4 font-medium">Written by</p>
      <div className="flex flex-col gap-4">
        {authors.map((author) => (
          <div key={author.name} className="flex items-center gap-4">
            {author.avatar ? (
              <Image
                src={author.avatar}
                alt={author.name}
                width={48}
                height={48}
                className="rounded-full shrink-0"
              />
            ) : (
              <div className="size-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white font-bold text-lg shrink-0">
                {author.name.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="min-w-0">
              <Link
                href={author.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-semibold text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                {author.name}
              </Link>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Writing bite-sized JavaScript, React & Next.js tips at Bitlyst
              </p>
              <div className="flex gap-3 mt-1.5">
                <Link
                  href="https://x.com/mohsenfallahnjd"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  X / Twitter
                </Link>
                <Link
                  href="https://github.com/mohsenfallahnjd"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  GitHub
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
