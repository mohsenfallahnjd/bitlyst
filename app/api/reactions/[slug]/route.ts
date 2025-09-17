import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "redis";

type ReactionType = "like" | "love" | "fire" | "think" | "wow";

interface ReactionData {
  like: number;
  love: number;
  fire: number;
  think: number;
  wow: number;
}

const REACTION_TYPES: ReactionType[] = ["like", "love", "fire", "think", "wow"];

// Create Redis client
const redis = createClient({
  url: process.env.REDIS_URL,
});

// Connect to Redis (only once)
let isConnected = false;
async function connectRedis() {
  if (!isConnected) {
    await redis.connect();
    isConnected = true;
  }
  return redis;
}

// GET /api/reactions/[slug] - Get reaction counts for a post
export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const client = await connectRedis();

    // Get reaction counts from Redis
    const reactions = await client.hGetAll(`reactions:${slug}`);

    // Convert string values to numbers and initialize with zeros
    const reactionData: ReactionData = {
      like: parseInt(reactions.like || "0"),
      love: parseInt(reactions.love || "0"),
      fire: parseInt(reactions.fire || "0"),
      think: parseInt(reactions.think || "0"),
      wow: parseInt(reactions.wow || "0"),
    };

    return NextResponse.json(reactionData);
  } catch (error) {
    console.error("Error fetching reactions:", error);
    return NextResponse.json({ error: "Failed to fetch reactions" }, { status: 500 });
  }
}

// POST /api/reactions/[slug] - Add or remove a reaction
export async function POST(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const body = await request.json();
    const { reactionType, userId, action } = body;
    const client = await connectRedis();

    if (!REACTION_TYPES.includes(reactionType)) {
      return NextResponse.json({ error: "Invalid reaction type" }, { status: 400 });
    }

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    if (action !== "add" && action !== "remove") {
      return NextResponse.json({ error: 'Action must be "add" or "remove"' }, { status: 400 });
    }

    const userReactionKey = `user-reactions:${userId}:${slug}`;
    const reactionsKey = `reactions:${slug}`;

    // Check if user has already reacted with this type
    const userReactions = await client.sMembers(userReactionKey);
    const hasReacted = userReactions.includes(reactionType);

    if (action === "add" && hasReacted) {
      return NextResponse.json({ error: "User has already reacted with this type" }, { status: 400 });
    }

    if (action === "remove" && !hasReacted) {
      return NextResponse.json({ error: "User has not reacted with this type" }, { status: 400 });
    }

    // Update user reactions set
    if (action === "add") {
      await client.sAdd(userReactionKey, reactionType);
      // Set expiry for user reactions (optional, e.g., 1 year)
      await client.expire(userReactionKey, 365 * 24 * 60 * 60);
    } else {
      await client.sRem(userReactionKey, reactionType);
    }

    // Update reaction counts
    const increment = action === "add" ? 1 : -1;
    await client.hIncrBy(reactionsKey, reactionType, increment);

    // Get updated reaction counts
    const updatedReactions = await client.hGetAll(reactionsKey);

    const reactionData: ReactionData = {
      like: parseInt(updatedReactions.like || "0"),
      love: parseInt(updatedReactions.love || "0"),
      fire: parseInt(updatedReactions.fire || "0"),
      think: parseInt(updatedReactions.think || "0"),
      wow: parseInt(updatedReactions.wow || "0"),
    };

    // Get updated user reactions
    const updatedUserReactions = await client.sMembers(userReactionKey);

    return NextResponse.json({
      reactions: reactionData,
      userReactions: updatedUserReactions,
    });
  } catch (error) {
    console.error("Error updating reactions:", error);
    return NextResponse.json({ error: "Failed to update reactions" }, { status: 500 });
  }
}

// Helper function to get user's reactions for a post
export async function getUserReactions(slug: string, userId: string) {
  try {
    const client = await connectRedis();
    const userReactionKey = `user-reactions:${userId}:${slug}`;
    const userReactions = await client.sMembers(userReactionKey);
    return userReactions;
  } catch (error) {
    console.error("Error fetching user reactions:", error);
    return [];
  }
}
