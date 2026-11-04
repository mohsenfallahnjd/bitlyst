import type { NextRequest } from "next/server";
import { loadMarkdownBySlug } from "@/lib/mdSource";
import { renderOgImage } from "@/lib/og";

export function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");

  const post = slug ? loadMarkdownBySlug(slug) : null;

  return renderOgImage({
    title: post?.title ?? "Bite-sized JavaScript, React, and Next.js tips",
    tags: post?.tags,
    readingTime: post?.readingTime,
  });
}
