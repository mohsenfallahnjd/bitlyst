import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import DonatePrompt from "@/components/DonatePrompt";
import NewsletterForm from "@/components/NewsletterForm";
import PostCard from "@/components/PostCard";
import TopicRequest from "@/components/TopicRequest";
import { formatCount } from "@/lib/format";
import { loadMarkdownDocs, toSummary } from "@/lib/mdSource";
import { getPostStats } from "@/lib/stats";
import { getAllTopics } from "@/lib/tags";

export const metadata: Metadata = {
  title: "About",
  description:
    "Mohsen Fallahnejad — full-stack developer behind Bitlyst. Short, diagram-first posts on JavaScript, React & Next.js.",
  alternates: { canonical: "/about" },
  openGraph: { type: "profile", url: "/about", title: "About Mohsen Fallahnejad · Bitlyst" },
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

export default async function AboutPage() {
  const posts = loadMarkdownDocs();
  const stats = await getPostStats();
  const topics = getAllTopics(posts).slice(0, 10);
  const totalViews = Object.values(stats.views).reduce((n, v) => n + v, 0);
  const totalComments = Object.values(stats.comments).reduce((n, v) => n + v, 0);
  const avgRead = Math.round(posts.reduce((s, p) => s + (p.readingTime ?? 0), 0) / Math.max(posts.length, 1));

  // "Start here": most read beginner/intermediate posts, falling back to the newest
  const startHere = [...posts]
    .filter((p) => p.level !== "advanced")
    .sort((a, b) => (stats.views[b.slug] ?? 0) - (stats.views[a.slug] ?? 0))
    .slice(0, 3);

  const figures = [
    { value: posts.length, label: "posts" },
    { value: getAllTopics(posts).length, label: "topics" },
    { value: `~${avgRead} min`, label: "avg read" },
    ...(totalViews >= 100 ? [{ value: formatCount(totalViews), label: "reads" }] : []),
    ...(totalComments >= 10 ? [{ value: totalComments, label: "comments" }] : []),
  ];

  return (
    <div className="mx-auto max-w-[42rem] space-y-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ProfilePage",
            mainEntity: {
              "@type": "Person",
              name: "Mohsen Fallahnejad",
              url: "https://themohsen.me",
              image: "https://bitlyst.blog/mohsen.JPEG",
              jobTitle: "Full-stack developer",
              sameAs: LINKS.map((l) => l.href),
              knowsAbout: topics.map((t) => t.name),
            },
          }),
        }}
      />

      {/* Hero */}
      <section className="space-y-6">
        <div className="flex items-center gap-5">
          <Image
            src="/mohsen.JPEG"
            alt="Mohsen Fallahnejad"
            width={88}
            height={88}
            className="rounded-2xl object-cover size-[88px] shrink-0 ring-1 ring-black/5 dark:ring-white/10"
            priority
          />
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Hi, I&apos;m Mohsen 👋</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Full-stack developer · writing Bitlyst</p>
          </div>
        </div>

        <div className="space-y-4 text-[1.0625rem] leading-relaxed text-gray-700 dark:text-gray-300">
          <p>
            I build web products for a living and keep running into the same questions: <em>why</em> does the event loop
            do that, <em>when</em> does React re-render, <em>what</em> is Next.js actually caching?
          </p>
          <p>
            Bitlyst is where I write down the answers — one concept per post, with diagrams and code you can paste
            today. No 3,000-word intros. If you can&apos;t finish it over a coffee, it&apos;s too long.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {LINKS.map((l) => (
            <a
              key={l.label}
              href={l.href}
              target="_blank"
              rel="noopener noreferrer me"
              className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 dark:border-gray-800 px-3 py-1.5 text-xs text-gray-600 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-600 transition-colors"
            >
              {l.icon}
              {l.label}
            </a>
          ))}
        </div>

        <dl className="grid grid-cols-[repeat(auto-fit,minmax(6.5rem,1fr))] gap-px overflow-hidden rounded-xl border border-gray-200/80 dark:border-gray-800 bg-gray-200/80 dark:bg-gray-800">
          {figures.map(({ value, label }) => (
            <div key={label} className="bg-surface-light dark:bg-surface-dark px-4 py-3">
              <dt className="text-[11px] uppercase tracking-wide text-gray-400 dark:text-gray-500">{label}</dt>
              <dd className="text-lg font-bold tracking-tight text-gray-900 dark:text-gray-50">{value}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Start here */}
      <section>
        <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">
          New here? Start with these
        </h2>
        <div>
          {startHere.map((p) => (
            <PostCard key={p.slug} post={toSummary(p)} views={stats.views[p.slug]} comments={stats.comments[p.slug]} />
          ))}
        </div>
      </section>

      {/* Topics */}
      <section className="space-y-3">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">
          What I write about
        </h2>
        <div className="flex flex-wrap gap-1.5">
          {topics.map((t) => (
            <Link
              key={t.slug}
              href={`/tags/${t.slug}`}
              className="rounded-full border border-gray-200 dark:border-gray-800 px-3 py-1 text-xs text-gray-600 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-600 transition-colors"
            >
              #{t.name} <span className="text-gray-400 dark:text-gray-600">{t.count}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Talk to me */}
      <section className="grid gap-4">
        <TopicRequest />
        <NewsletterForm />
      </section>

      <DonatePrompt className="!mt-0" />
    </div>
  );
}
