import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";
import AuthorBio from "@/components/AuthorBio";
import Comments from "@/components/Comments";
import DifficultyBadge from "@/components/DifficultyBadge";
import NewsletterForm from "@/components/NewsletterForm";
import { PostActionBar, PostRailActions } from "@/components/PostActions";
import { shortDate } from "@/components/PostCard";
import PostEngagement from "@/components/PostEngagement";
import PostNav from "@/components/PostNav";
import ReadingProgress from "@/components/ReadingProgress";
import ReadTracker from "@/components/ReadTracker";
import RelatedPosts from "@/components/RelatedPosts";
import SeriesNav from "@/components/SeriesNav";
import ShareButton from "@/components/ShareButton";
import { CommentIcon } from "@/components/StatIcons";
import TOC from "@/components/TOC";
import ViewCounter from "@/components/ViewCounter";
import { tagSlug } from "@/lib/format";
import { loadMarkdownBySlug, loadMarkdownDocs } from "@/lib/mdSource";
import { getPostStats } from "@/lib/stats";
import { useMDXComponents } from "@/mdx-components";

export default async function Page(props: PageProps<"/p/[...slug]">) {
  const params = await props.params;
  const slugParam = params.slug as string | string[] | undefined;
  const slugPath = Array.isArray(slugParam) ? slugParam.join("/") : (slugParam ?? "");
  const post = loadMarkdownBySlug(slugPath);

  if (!post) {
    notFound();
  }

  const postUrl = `https://bitlyst.blog/p/${post.slug}`;
  const stats = await getPostStats();
  const views = stats.views[post.slug] ?? 0;
  const commentCount = stats.comments[post.slug] ?? 0;
  const wordCount = post.content.split(/\s+/).filter(Boolean).length;
  const readingTime = post.readingTime ?? 1;
  const author = post.authors[0];
  const topics = [...new Map((post.tags ?? []).map((t) => [tagSlug(t), t])).entries()];
  const [primaryTopic] = topics;
  const updated = post.modifiedTime && post.modifiedTime !== post.publishedTime ? post.modifiedTime : undefined;
  const actionProps = { title: post.title, url: postUrl, readingTime, comments: commentCount };

  return (
    <div data-post className="xl:grid xl:grid-cols-[minmax(0,1fr)_12rem] xl:gap-12">
      <ReadingProgress />
      <ReadTracker slug={post.slug} />

      {/* JSON-LD in the initial HTML (next/script would inject it after hydration) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: "https://bitlyst.blog" },
                { "@type": "ListItem", position: 2, name: "Posts", item: "https://bitlyst.blog/posts" },
                { "@type": "ListItem", position: 3, name: post.title, item: postUrl },
              ],
            },
            {
              "@context": "https://schema.org",
              "@type": "BlogPosting",
              headline: post.title,
              description: post.summary,
              datePublished: post.publishedTime,
              dateModified: post.modifiedTime || post.publishedTime,
              author: (post.authors || []).map((a) => ({ "@type": "Person", name: a.name, url: a.url })),
              mainEntityOfPage: { "@type": "WebPage", "@id": postUrl },
              publisher: {
                "@type": "Organization",
                name: "Bitlyst",
                logo: { "@type": "ImageObject", url: "https://bitlyst.blog/logo.svg" },
              },
              image: [`https://bitlyst.blog/og?slug=${post.slug}`],
              keywords: (post.tags ?? []).join(", "),
              articleSection: post.tags?.[0],
              wordCount,
              timeRequired: `PT${post.readingTime ?? 1}M`,
              inLanguage: "en",
              commentCount,
              interactionStatistic: [
                {
                  "@type": "InteractionCounter",
                  interactionType: "https://schema.org/ReadAction",
                  userInteractionCount: views,
                },
                {
                  "@type": "InteractionCounter",
                  interactionType: "https://schema.org/CommentAction",
                  userInteractionCount: commentCount,
                },
              ],
            },
          ]),
        }}
      />

      <div className="mx-auto w-full min-w-0 max-w-[42rem] xl:mx-0">
        {/* Header */}
        <header className="pb-8 mb-10 border-b border-gray-200/70 dark:border-gray-800/60">
          <nav
            aria-label="Breadcrumb"
            className="mb-6 flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500"
          >
            <Link href="/posts" className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
              Posts
            </Link>
            {primaryTopic && (
              <>
                <span aria-hidden>/</span>
                <Link
                  href={`/tags/${primaryTopic[0]}`}
                  className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                >
                  {primaryTopic[1]}
                </Link>
              </>
            )}
          </nav>

          <div className="mb-4 flex flex-wrap items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <DifficultyBadge level={post.level} />
            <span className="inline-flex items-center rounded-full bg-gray-100 dark:bg-gray-800/80 px-2.5 py-0.5 font-medium">
              {readingTime} min read
            </span>
          </div>

          {post.series && (
            <div className="mb-3">
              <SeriesNav post={post} variant="compact" />
            </div>
          )}

          <h1 className="text-[2rem] sm:text-[2.6rem] font-extrabold tracking-[-0.025em] leading-[1.12] text-balance text-gray-900 dark:text-gray-50">
            {post.title}
          </h1>

          {post.summary && (
            <p className="mt-4 text-lg sm:text-xl leading-relaxed text-pretty text-gray-500 dark:text-gray-400">
              {post.summary}
            </p>
          )}

          <div className="mt-7 flex items-center justify-between gap-4">
            <div className="flex min-w-0 items-center gap-3">
              {author?.avatar && (
                <Image
                  src={author.avatar}
                  alt={author.name}
                  width={36}
                  height={36}
                  className="size-9 shrink-0 rounded-full object-cover"
                />
              )}
              <div className="min-w-0 text-xs leading-relaxed">
                <p className="truncate text-sm font-medium text-gray-900 dark:text-gray-100">{author?.name}</p>
                <div className="flex flex-wrap items-center gap-x-2.5 text-gray-500 dark:text-gray-400">
                  {post.publishedTime && <time dateTime={post.publishedTime}>{shortDate(post.publishedTime)}</time>}
                  {updated && (
                    <span>
                      · Updated <time dateTime={updated}>{shortDate(updated)}</time>
                    </span>
                  )}
                  <ViewCounter slug={post.slug} initial={views} />
                  <a
                    href="#comments"
                    className="inline-flex items-center gap-1 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                  >
                    <CommentIcon className="size-3" />
                    {commentCount > 0 ? commentCount : "Discuss"}
                  </a>
                </div>
              </div>
            </div>
            <ShareButton title={post.title} url={postUrl} variant="icon" className="shrink-0" />
          </div>
        </header>

        <div className="xl:hidden mb-8">
          <TOC collapsible />
        </div>

        <article id="post-body" className="post-prose">
          <MDXRemote
            source={post.content}
            components={useMDXComponents()}
            options={{
              mdxOptions: {
                remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter, remarkGfm],
                rehypePlugins: [rehypeSlug, rehypeHighlight],
              },
            }}
          />
        </article>

        {topics.length > 0 && (
          <div className="mt-12 flex flex-wrap items-center gap-1.5">
            <span className="mr-1 text-xs text-gray-400 dark:text-gray-500">Filed under</span>
            {topics.map(([slug, name]) => (
              <Link
                key={slug}
                href={`/tags/${slug}`}
                className="rounded-full bg-gray-100 dark:bg-gray-800/70 px-2.5 py-1 text-xs text-gray-600 dark:text-gray-300 hover:bg-brand-50 hover:text-brand-700 dark:hover:bg-brand-950/60 dark:hover:text-brand-300 transition-colors"
              >
                #{name}
              </Link>
            ))}
          </div>
        )}

        <SeriesNav post={post} />

        <PostEngagement postSlug={post.slug} />

        <AuthorBio authors={post.authors} />

        <PostNav current={post.slug} />

        <Comments slug={post.slug} />

        <RelatedPosts current={post} views={stats.views} comments={stats.comments} />

        <NewsletterForm className="mt-14" />
      </div>

      <aside className="hidden xl:block">
        <div className="sticky top-24">
          <TOC />
          <PostRailActions {...actionProps} />
        </div>
      </aside>

      <PostActionBar {...actionProps} />
    </div>
  );
}

export async function generateMetadata(props: PageProps<"/p/[...slug]">): Promise<Metadata> {
  const params = await props.params;
  const slugParam = params.slug as string | string[] | undefined;
  const slugPath = Array.isArray(slugParam) ? slugParam.join("/") : (slugParam ?? "");
  const page = loadMarkdownBySlug(slugPath);
  if (!page) {
    notFound();
  }

  return {
    title: page.title,
    description: page.summary,
    keywords: ["bitlyst", ...(page.tags || [])],
    authors: page.authors,
    openGraph: {
      title: page.title,
      description: page.summary,
      publishedTime: page.publishedTime as string,
      modifiedTime: (page.modifiedTime || page.publishedTime) as string,
      tags: ["bitlyst", ...(page.tags || [])],
      url: `https://bitlyst.blog/p/${slugPath}`,
      type: "article",
      authors: page.authors.map((a) => a.name),
      siteName: "Bitlyst",
      images: [{ url: `https://bitlyst.blog/og?slug=${slugPath}`, width: 1200, height: 630, alt: page.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: page.title,
      description: page.summary,
      images: [{ url: `https://bitlyst.blog/og?slug=${slugPath}`, alt: page.title }],
    },
    alternates: { canonical: `https://bitlyst.blog/p/${slugPath}` },
  };
}

export async function generateStaticParams() {
  const all = loadMarkdownDocs();
  return all.map((p) => ({ slug: p.slug.split("/") }));
}
