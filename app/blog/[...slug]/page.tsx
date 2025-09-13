import { notFound } from "next/navigation";

import { loadMarkdownBySlug } from "@/lib/mdSource";
import { MDXRemote } from "next-mdx-remote/rsc";
import { useMDXComponents } from "@/mdx-components";
import type { Metadata } from "next";
import PostMeta from "@/components/PostMeta";
import Link from "next/link";

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
      <MDXRemote source={post.content} components={useMDXComponents()} />

      {!!post.authors?.length && (
        <div className="mt-10 text-sm text-gray-500 dark:text-gray-400 border-t border-dashed border-gray-200 dark:border-gray-800 pt-5">
          By{" "}
          {post.authors?.map((author) => (
            <Link
              href={author.url}
              key={author.name}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 underline"
            >
              {author.name}
            </Link>
          ))}
        </div>
      )}
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
