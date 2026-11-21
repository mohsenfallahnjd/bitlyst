import { NextResponse } from "next/server";
import { buildLlmsTxt } from "@/lib/llmsTxt";

export async function GET() {
  const body = buildLlmsTxt();
  return new NextResponse(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
    },
  });
}