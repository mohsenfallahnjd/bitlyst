import { type NextRequest, NextResponse } from "next/server";
import { loadMarkdownDocs } from "@/lib/mdSource";
import { getViews, recordView, SLUG_RE } from "@/lib/stats";

let knownSlugs: Set<string> | undefined;
function isPost(slug: string) {
  if (!SLUG_RE.test(slug)) {
    return false;
  }
  knownSlugs ??= new Set(loadMarkdownDocs().map((p) => p.slug));
  return knownSlugs.has(slug);
}

// GET /api/views/[slug] - Current read count
export async function GET(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!isPost(slug)) {
    return NextResponse.json({ error: "Unknown post" }, { status: 404 });
  }
  return NextResponse.json({ views: await getViews(slug) });
}

// POST /api/views/[slug] - Count a read (deduped per visitor per day)
export async function POST(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!isPost(slug)) {
    return NextResponse.json({ error: "Unknown post" }, { status: 404 });
  }

  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? req.headers.get("x-real-ip") ?? "unknown";
    const views = await recordView(slug, ip, req.headers.get("user-agent") ?? "");
    return NextResponse.json({ views });
  } catch (error) {
    console.error("Error recording view:", error);
    return NextResponse.json({ error: "Failed to record view" }, { status: 500 });
  }
}
