import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import DonatePrompt from "@/components/DonatePrompt";
import NewsletterForm from "@/components/NewsletterForm";
import { loadMarkdownDocs } from "@/lib/mdSource";

export const metadata: Metadata = {
  title: "About · Bitlyst",
  description: "Mohsen Fallahnejad — the person behind Bitlyst. Bite-sized JavaScript, React & Next.js tips.",
  alternates: { canonical: "https://bitlyst.vercel.app/about" },
};

const LINKS = [
  {
    label: "X / Twitter",
    href: "https://x.com/themohsenme",
    icon: (
      <svg viewBox="0 0 16 16" fill="currentColor" className="size-3.5">
        <path d="M9.294 7.293 14.99 0h-1.35L8.67 6.36 4.38 0H0l5.977 8.7L0 16h1.35l5.228-6.082L11.62 16H16zM6.21 8.779l-.606-.867L1.83.99h2.075l3.89 5.568.606.867 5.054 7.232h-2.075z" />
      </svg>
    ),
  },
  {
    label: "GitHub",
    href: "https://github.com/mohsenfallahnjd",
    icon: (
      <svg viewBox="0 0 16 16" fill="currentColor" className="size-3.5">
        <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/mohsenfallahnjd/",
    icon: (
      <svg viewBox="0 0 16 16" fill="currentColor" className="size-3.5">
        <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854zm4.943 12.248V6.169H2.542v7.225zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248S2.4 3.226 2.4 3.934c0 .694.521 1.248 1.327 1.248zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016l.016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225z" />
      </svg>
    ),
  },
  {
    label: "Website",
    href: "https://themohsen.me",
    icon: (
      <svg viewBox="0 0 16 16" fill="currentColor" className="size-3.5">
        <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5Z" />
      </svg>
    ),
  },
];

const TOPICS = ["JavaScript", "React", "Next.js", "TypeScript", "CSS", "Performance", "Node.js", "Web APIs"];

export default function AboutPage() {
  const posts = loadMarkdownDocs();
  const totalPosts = posts.length;
  const avgRead = Math.round(posts.reduce((s, p) => s + (p.readingTime ?? 0), 0) / posts.length);
  const totalTopics = new Set(posts.flatMap((p) => p.tags ?? [])).size;

  return (
    <div className="space-y-12">
      {/* Hero */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start gap-5">
          <Image
            src="/mohsen.JPEG"
            alt="Mohsen Fallahnejad"
            width={80}
            height={80}
            className="rounded-full object-cover size-20 ring-2 ring-gray-100 dark:ring-gray-800 shrink-0"
            priority
          />
          <div className="space-y-1 sm:pt-1">
            <h1 className="text-2xl font-bold tracking-tight">Mohsen Fallahnejad</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Full-stack developer · Author of Bitlyst</p>
            <div className="flex flex-wrap gap-2 pt-2">
              {LINKS.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={l.label}
                  className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 dark:border-gray-700 px-3 py-1 text-xs text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
                >
                  {l.icon}
                  {l.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400 leading-relaxed max-w-prose">
          <p>
            Hey — I&apos;m Mohsen. I build web products and write about the things I learn along the way. Bitlyst is where I publish short, focused posts on JavaScript, React, and Next.js.
          </p>
          <p>
            Each post targets one concept. No long intros, no filler — just the thing you need to know, with code you can use today.
          </p>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap gap-x-8 gap-y-4 pt-1">
          {[
            { value: totalPosts, label: "posts published" },
            { value: totalTopics, label: "topics covered" },
            { value: `~${avgRead} min`, label: "avg read time" },
          ].map(({ value, label }) => (
            <div key={label}>
              <div className="text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100">{value}</div>
              <div className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{label}</div>
            </div>
          ))}
        </div>
      </div>

      <hr className="border-gray-100 dark:border-gray-800" />

      {/* Topics */}
      <div className="space-y-4">
        <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">What I write about</h2>
        <div className="flex flex-wrap gap-2">
          {TOPICS.map((t) => (
            <Link
              key={t}
              href={`/blog?tag=${encodeURIComponent(t.toLowerCase())}`}
              className="rounded-full border border-gray-200 dark:border-gray-800 px-3 py-1 text-xs text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900 hover:border-gray-300 dark:hover:border-gray-700 transition-colors"
            >
              {t}
            </Link>
          ))}
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          New posts weekly.{" "}
          <Link href="/blog" className="text-cyan-600 dark:text-cyan-400 hover:underline">
            Browse all {totalPosts} posts →
          </Link>
        </p>
      </div>

      <hr className="border-gray-100 dark:border-gray-800" />

      {/* Newsletter */}
      <div className="space-y-3">
        <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">Stay in the loop</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">New post drops? You&apos;ll be the first to know.</p>
        <NewsletterForm />
      </div>

      {/* Donate */}
      <DonatePrompt />
    </div>
  );
}
