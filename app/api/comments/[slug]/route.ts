import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const comments = await prisma.comment.findMany({
    where: { slug, approved: true },
    orderBy: { createdAt: "asc" },
    select: { id: true, name: true, body: true, createdAt: true },
  });
  return NextResponse.json(comments);
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { name, email, body } = await req.json();

  if (!name || typeof name !== "string" || name.trim().length < 1) {
    return NextResponse.json({ error: "Name required" }, { status: 400 });
  }
  if (!body || typeof body !== "string" || body.trim().length < 3) {
    return NextResponse.json({ error: "Comment too short" }, { status: 400 });
  }
  if (body.trim().length > 2000) {
    return NextResponse.json({ error: "Comment too long" }, { status: 400 });
  }

  await prisma.comment.create({
    data: {
      slug,
      name: name.trim().slice(0, 80),
      email: email?.trim().slice(0, 200) || null,
      body: body.trim(),
    },
  });

  return NextResponse.json({ ok: true }, { status: 201 });
}
