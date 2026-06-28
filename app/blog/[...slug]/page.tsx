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
import DonatePrompt from "@/components/DonatePrompt";
import NewsletterForm from "@/components/NewsletterForm";
import PostMeta from "@/components/PostMeta";
import PostNav from "@/components/PostNav";
import PostReactions from "@/components/PostReactions";
import ReadingProgress from "@/components/ReadingProgress";
import RelatedPosts from "@/components/RelatedPosts";
import ShareButton from "@/components/ShareButton";
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
      <h1 className="text-2xl font-bold">{post.title}</h1>
      <PostMeta publishedTime={post.publishedTime} tags={post.tags} readingTime={post.readingTime} />

      {!!post.authors?.length && (
        <div className="mb-5 text-sm text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-800 pb-5 flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="size-4 text-gray-600 dark:text-brand-dark hover:text-gray-600 dark:hover:text-gray-600"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
            />
          </svg>{" "}
          {post.authors?.map((author) => (
            <Link
              href={author.url}
              key={author.name}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 underline"
            >
              {author.name}
            </Link>
          ))}
        </div>
      )}

      <div className="mt-2">
        <ShareButton title={post.title} url={`https://bitlyst.vercel.app/blog/${post.slug}`} />
      </div>

      {/* Content layout - single column; TOC handled in route layout for wide screens */}
      <div className="mt-8">
        {/* Mobile TOC (inline, non-sticky) */}
        <div className="xl:hidden mb-6">
          <TOC />
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
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">How did you like this post?</h3>
        <PostReactions postSlug={post.slug} />
      </div>

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
