import { type NextRequest, NextResponse } from "next/server";
import { clientIp, isPost } from "@/lib/requestGuards";
import { getViews, recordView } from "@/lib/stats";

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
    const views = await recordView(slug, clientIp(req), req.headers.get("user-agent") ?? "");
    return NextResponse.json({ views });
  } catch (error) {
    console.error("Error recording view:", error);
    return NextResponse.json({ error: "Failed to record view" }, { status: 500 });
  }
}
