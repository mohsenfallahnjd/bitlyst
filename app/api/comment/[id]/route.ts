import { revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE, isAdminSession } from "@/lib/adminAuth";
import { prisma } from "@/lib/prisma";

function checkAdmin(req: NextRequest) {
  return isAdminSession(req.cookies.get(ADMIN_COOKIE)?.value);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!checkAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const comment = await prisma.comment.update({ where: { id }, data: { approved: true } });
  revalidateTag("comments", "max");
  return NextResponse.json(comment);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!checkAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  await prisma.comment.delete({ where: { id } });
  revalidateTag("comments", "max");
  return NextResponse.json({ ok: true });
}
