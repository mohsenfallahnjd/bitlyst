import Image from "next/image";
import Link from "next/link";
import type { DocMeta } from "@/lib/mdSource";

const SOCIAL = [
  { label: "X", href: "https://x.com/themohsenme" },
  { label: "GitHub", href: "https://github.com/mohsenfallahnjd" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/mohsenfallahnjd/" },
];

export default function AuthorBio({ authors }: { authors: DocMeta["authors"] }) {
  if (!authors?.length) {
    return null;
  }

  return (
    <div className="mt-10 space-y-4">
      {authors.map((author) => (
        <div
          key={author.name}
          className="flex gap-4 rounded-2xl border border-gray-200/80 dark:border-gray-800 bg-surface-light dark:bg-surface-dark p-5"
        >
          {author.avatar ? (
            <Image
              src={author.avatar}
              alt={author.name}
              width={56}
              height={56}
              className="rounded-full shrink-0 object-cover size-14"
            />
          ) : (
            <div className="size-14 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-lg font-semibold text-gray-600 dark:text-gray-300 shrink-0">
              {author.name.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="min-w-0 space-y-1.5">
            <p className="text-[11px] uppercase tracking-wide text-gray-400 dark:text-gray-500">Written by</p>
            <Link
              href={author.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block font-semibold text-gray-900 dark:text-gray-50 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
            >
              {author.name}
            </Link>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
              Frontend engineer explaining JavaScript, React & Next.js internals in posts you can finish over coffee.{" "}
              <Link href="/about" className="text-brand-600 dark:text-brand-400 hover:underline underline-offset-2">
                More about me
              </Link>
            </p>
            <div className="flex gap-3 pt-1">
              {SOCIAL.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer me"
                  className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                >
                  {s.label} ↗
                </a>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
