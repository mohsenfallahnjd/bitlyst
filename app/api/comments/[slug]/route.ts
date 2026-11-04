import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isPost, rateLimit, readJsonBody } from "@/lib/requestGuards";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!isPost(slug)) {
    return NextResponse.json({ error: "Unknown post" }, { status: 404 });
  }
  const comments = await prisma.comment.findMany({
    where: { slug, approved: true },
    orderBy: { createdAt: "asc" },
    select: { id: true, name: true, body: true, createdAt: true },
  });
  return NextResponse.json(comments);
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!isPost(slug)) {
    return NextResponse.json({ error: "Unknown post" }, { status: 404 });
  }

  const limited = await rateLimit(req, "comment", 5, 10 * 60);
  if (limited) {
    return limited;
  }

  const { name, email, body } = await readJsonBody(req);

  if (typeof name !== "string" || name.trim().length < 1) {
    return NextResponse.json({ error: "Name required" }, { status: 400 });
  }
  if (typeof body !== "string" || body.trim().length < 3) {
    return NextResponse.json({ error: "Comment too short" }, { status: 400 });
  }
  if (body.trim().length > 2000) {
    return NextResponse.json({ error: "Comment too long" }, { status: 400 });
  }

  await prisma.comment.create({
    data: {
      slug,
      name: name.trim().slice(0, 80),
      email: typeof email === "string" ? email.trim().slice(0, 200) || null : null,
      body: body.trim(),
    },
  });

  return NextResponse.json({ ok: true }, { status: 201 });
}
