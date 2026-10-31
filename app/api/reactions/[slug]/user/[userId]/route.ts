import { type NextRequest, NextResponse } from "next/server";
import { getRedis } from "@/lib/redis";

async function connectRedis() {
  const client = await getRedis();
  if (!client) {
    throw new Error("REDIS_URL is not configured");
  }
  return client;
}

// GET /api/reactions/[slug]/user/[userId] - Get user's reactions for a post
export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string; userId: string }> }) {
  try {
    const { slug, userId } = await params;
    const client = await connectRedis();

    const userReactionKey = `user-reactions:${userId}:${slug}`;
    const userReactions = await client.sMembers(userReactionKey);

    return NextResponse.json({ userReactions });
  } catch (error) {
    console.error("Error fetching user reactions:", error);
    return NextResponse.json({ error: "Failed to fetch user reactions" }, { status: 500 });
  }
}
