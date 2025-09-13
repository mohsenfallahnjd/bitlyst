import { notFound } from "next/navigation";

import { loadMarkdownBySlug } from "@/lib/mdSource";
import { MDXRemote } from "next-mdx-remote/rsc";
import { useMDXComponents } from "@/mdx-components";
import type { Metadata } from "next";

export default async function Page(props: PageProps<"/blog/[...slug]">) {
  const params = await props.params;
  const post = loadMarkdownBySlug(params.slug?.toString()!);
  if (!post) {
    notFound();
  }

  return <MDXRemote source={post.content} components={useMDXComponents()} />;
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
