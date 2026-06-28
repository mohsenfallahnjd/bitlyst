import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Script from "next/script";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";
import AuthorBio from "@/components/AuthorBio";
import DifficultyBadge from "@/components/DifficultyBadge";
import DonatePrompt from "@/components/DonatePrompt";
import NewsletterForm from "@/components/NewsletterForm";
import PostEngagement from "@/components/PostEngagement";
import PostNav from "@/components/PostNav";
import PublishTime from "@/components/PublishTime";
import QuickFeedback from "@/components/QuickFeedback";
import ReadingProgress from "@/components/ReadingProgress";
import RelatedPosts from "@/components/RelatedPosts";
import ShareButton from "@/components/ShareButton";
import ShareFAB from "@/components/ShareFAB";
import StickyReactionBar from "@/components/StickyReactionBar";
import TOC from "@/components/TOC";
import { loadMarkdownBySlug, loadMarkdownDocs } from "@/lib/mdSource";
import { useMDXComponents } from "@/mdx-components";

export default async function Page(props: PageProps<"/blog/[...slug]">) {
  const params = await props.params;
  const slugParam = params.slug as string | string[] | undefined;
  const slugPath = Array.isArray(slugParam) ? slugParam.join("/") : (slugParam ?? "");
  const post = loadMarkdownBySlug(slugPath);

  if (!post) {
    notFound();
  }

  const postUrl = `https://bitlyst.vercel.app/blog/${post.slug}`;

  return (
    <div>
      <ReadingProgress />
      <StickyReactionBar postSlug={post.slug} />

      <Script
        type="application/ld+json"
        id="post-breadcrumb-ld-json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://bitlyst.vercel.app" },
              { "@type": "ListItem", position: 2, name: "Blog", item: "https://bitlyst.vercel.app/blog" },
              { "@type": "ListItem", position: 3, name: post.title, item: postUrl },
            ],
          }),
        }}
      />
      <Script
        type="application/ld+json"
        id="post-ld-json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: post.title,
            datePublished: post.publishedTime,
            dateModified: post.modifiedTime ?? post.publishedTime,
            author: (post.authors || []).map((a) => ({ "@type": "Person", name: a.name, url: a.url })),
            mainEntityOfPage: { "@type": "WebPage", "@id": postUrl },
            publisher: {
              "@type": "Organization",
              name: "Bitlyst",
              logo: { "@type": "ImageObject", url: "https://bitlyst.vercel.app/opengraph-image" },
            },
            image: [`https://bitlyst.vercel.app/og?slug=${post.slug}`],
            description: post.summary,
          }),
        }}
      />

      {/* Breadcrumb */}
      <div className="mb-6 flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500 flex-wrap">
        <Link href="/blog" className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors flex items-center gap-1">
          <svg viewBox="0 0 16 16" fill="currentColor" className="size-3.5">
            <path d="M9.78 12.78a.75.75 0 0 1-1.06 0L4.47 8.53a.75.75 0 0 1 0-1.06l4.25-4.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042L6.06 8l3.72 3.72a.75.75 0 0 1 0 1.06Z" />
          </svg>
          All posts
        </Link>
        {post.tags && post.tags.slice(0, 2).map((t) => (
          <span key={t} className="flex items-center gap-1">
            <span>/</span>
            <Link href={`/blog?tag=${encodeURIComponent(t)}`} className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
              #{t}
            </Link>
          </span>
        ))}
      </div>

      {/* Post header */}
      <div className="mb-8 space-y-3">
        {/* Badges row */}
        <div className="flex flex-wrap items-center gap-2">
          <DifficultyBadge level={post.level} />
          {post.readingTime && (
            <span className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1">
              <svg viewBox="0 0 16 16" fill="currentColor" className="size-3 opacity-60">
                <path d="M1 5.25A2.25 2.25 0 0 1 3.25 3h9.5A2.25 2.25 0 0 1 15 5.25v5.5A2.25 2.25 0 0 1 12.75 13h-9.5A2.25 2.25 0 0 1 1 10.75ZM3.25 4.5a.75.75 0 0 0-.75.75v5.5c0 .414.336.75.75.75h9.5a.75.75 0 0 0 .75-.75v-5.5a.75.75 0 0 0-.75-.75Zm-.5 4.25a.75.75 0 0 1 .75-.75h5a.75.75 0 0 1 0 1.5h-5a.75.75 0 0 1-.75-.75Zm0-2.5a.75.75 0 0 1 .75-.75h9a.75.75 0 0 1 0 1.5h-9a.75.75 0 0 1-.75-.75Z" />
              </svg>
              {post.readingTime} min read
            </span>
          )}
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-50 leading-tight">
          {post.title}
        </h1>

        {/* Summary */}
        {post.summary && (
          <p className="text-base text-gray-500 dark:text-gray-400 leading-relaxed">{post.summary}</p>
        )}

        {/* Meta + share row */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-b border-gray-100 dark:border-gray-800 pb-5">
          <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500">
            {post.publishedTime && <PublishTime publishedTime={post.publishedTime} />}
            {post.tags && post.tags.length > 0 && (
              <>
                <span>·</span>
                <div className="flex gap-1.5 flex-wrap">
                  {post.tags.map((t) => (
                    <Link key={t} href={`/blog?tag=${encodeURIComponent(t)}`} className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                      #{t}
                    </Link>
                  ))}
                </div>
              </>
            )}
          </div>
          <ShareButton title={post.title} url={postUrl} />
        </div>
      </div>

      {/* Mobile FAB share */}
      <ShareFAB title={post.title} url={postUrl} />

      {/* Content */}
      <div className="mt-2">
        <div className="xl:hidden mb-6">
          <TOC collapsible />
        </div>
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
      </div>

      {/* End-of-article engagement */}
      <PostEngagement postSlug={post.slug} />

      {/* Feedback */}
      <QuickFeedback postSlug={post.slug} />

      <AuthorBio authors={post.authors} />

      <RelatedPosts current={post} />

      <NewsletterForm className="mt-10" />

      <DonatePrompt className="mt-10" />

      <PostNav current={post.slug} />
    </div>
  );
}

export async function generateMetadata(props: PageProps<"/blog/[...slug]">): Promise<Metadata> {
  const params = await props.params;
  const slugParam = params.slug as string | string[] | undefined;
  const slugPath = Array.isArray(slugParam) ? slugParam.join("/") : (slugParam ?? "");
  const page = loadMarkdownBySlug(slugPath);
  if (!page) { notFound(); }

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
      url: `https://bitlyst.vercel.app/blog/${slugPath}`,
      type: "article",
      authors: page.authors.map((a) => a.name),
      siteName: "Bitlyst",
      images: [{ url: `https://bitlyst.vercel.app/og?slug=${slugPath}`, width: 1200, height: 630, alt: page.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: page.title,
      description: page.summary,
      images: [{ url: `https://bitlyst.vercel.app/og?slug=${slugPath}`, alt: page.title }],
    },
    alternates: { canonical: `https://bitlyst.vercel.app/blog/${slugPath}` },
  };
}

export async function generateStaticParams() {
  const all = loadMarkdownDocs();
  return all.map((p) => ({ slug: p.slug.split("/") }));
}
