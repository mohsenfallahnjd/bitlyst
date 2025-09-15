import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypeSlug from "rehype-slug";
import rehypeStarryNight from "rehype-starry-night";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";
import PostMeta from "@/components/PostMeta";
import { loadMarkdownBySlug } from "@/lib/mdSource";
import { useMDXComponents } from "@/mdx-components";

export default async function Page(props: PageProps<"/blog/[...slug]">) {
  const params = await props.params;
  const post = loadMarkdownBySlug(params.slug?.toString()!);

  if (!post) {
    notFound();
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">{post.title}</h1>
      <PostMeta publishedTime={post.publishedTime} tags={post.tags} />

      {!!post.authors?.length && (
        <div className="mb-10 text-sm text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-800 pb-5 flex items-center gap-2">
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

      <MDXRemote
        source={post.content}
        components={useMDXComponents()}
        options={{
          mdxOptions: {
            remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter, remarkGfm],
            rehypePlugins: [rehypeSlug, rehypeStarryNight],
          },
        }}
      />
    </div>
  );
}

export async function generateMetadata(props: PageProps<"/blog/[...slug]">): Promise<Metadata> {
  const params = await props.params;
  const page = loadMarkdownBySlug(params.slug?.toString()!);
  if (!page) {
    notFound();
  }

  return {
    title: page.title,
    description: page.summary,
    keywords: page.tags?.join(", "),
    openGraph: {
      title: page.title,
      description: page.summary,
      publishedTime: page.publishedTime as string,
    },
    twitter: {
      card: "summary",
      title: page.title,
      description: page.summary,
    },
  };
}
