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
import PostMeta from "@/components/PostMeta";
import PostNav from "@/components/PostNav";
import PostReactions from "@/components/PostReactions";
import ReadingProgress from "@/components/ReadingProgress";
import RelatedPosts from "@/components/RelatedPosts";
import ShareButton from "@/components/ShareButton";
import ShareFAB from "@/components/ShareFAB";
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

  return (
    <div>
      <ReadingProgress />
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
              { "@type": "ListItem", position: 3, name: post.title, item: `https://bitlyst.vercel.app/blog/${post.slug}` },
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
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": `https://bitlyst.vercel.app/blog/${post.slug}`,
            },
            publisher: {
              "@type": "Organization",
              name: "Bitlyst",
              logo: {
                "@type": "ImageObject",
                url: "https://bitlyst.vercel.app/opengraph-image",
              },
            },
            image: [`https://bitlyst.vercel.app/og?slug=${post.slug}`],
            description: post.summary,
          }),
        }}
      />
      {/* Back breadcrumb */}
      <div className="mb-6">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        >
          <svg viewBox="0 0 16 16" fill="currentColor" className="size-3.5">
            <path d="M9.78 12.78a.75.75 0 0 1-1.06 0L4.47 8.53a.75.75 0 0 1 0-1.06l4.25-4.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042L6.06 8l3.72 3.72a.75.75 0 0 1 0 1.06Z" />
          </svg>
          All posts
        </Link>
      </div>

      {/* Post header */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <DifficultyBadge level={post.level} />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-50 leading-tight">{post.title}</h1>
        {post.summary && (
          <p className="text-base text-gray-500 dark:text-gray-400 leading-relaxed">{post.summary}</p>
        )}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <PostMeta publishedTime={post.publishedTime} tags={post.tags} readingTime={post.readingTime} />
          <ShareButton title={post.title} url={`https://bitlyst.vercel.app/blog/${post.slug}`} />
        </div>
      </div>

      {/* Mobile FAB share */}
      <ShareFAB title={post.title} url={`https://bitlyst.vercel.app/blog/${post.slug}`} />

      {/* Content layout */}
      <div className="mt-2">
        {/* Mobile TOC — collapsible accordion */}
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

      <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
        <h3 className="text-sm font-semibold mb-4 text-gray-900 dark:text-gray-100 uppercase tracking-widest">How did you like this post?</h3>
        <PostReactions postSlug={post.slug} />
      </div>

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
      url: `https://bitlyst.vercel.app/blog/${slugPath}`,
      type: "article",
      authors: page.authors.map((author) => author.name),
      siteName: "Bitlyst",
      images: [
        {
          url: `https://bitlyst.vercel.app/og?slug=${slugPath}`,
          width: 1200,
          height: 630,
          alt: page.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: page.title,
      description: page.summary,
      images: [
        {
          url: `https://bitlyst.vercel.app/og?slug=${slugPath}`,
          alt: page.title,
        },
      ],
    },
    alternates: { canonical: `https://bitlyst.vercel.app/blog/${slugPath}` },
  };
}

export async function generateStaticParams() {
  const all = loadMarkdownDocs();
  return all.map((p) => ({ slug: p.slug.split("/") }));
}
