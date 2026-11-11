import { type NextRequest, NextResponse } from "next/server";
import { getRedis } from "@/lib/redis";
import { isPost, rateLimit, readJsonBody } from "@/lib/requestGuards";

type ReactionType = "like" | "love" | "fire" | "think" | "wow";

interface ReactionData {
  like: number;
  love: number;
  fire: number;
  think: number;
  wow: number;
}

const REACTION_TYPES: ReactionType[] = ["like", "love", "fire", "think", "wow"];
const USER_ID_RE = /^[a-zA-Z0-9_-]{1,64}$/;

async function connectRedis() {
  const client = await getRedis();
  if (!client) {
    throw new Error("REDIS_URL is not configured");
  }
  return client;
}

// GET /api/reactions/[slug]?user=<id> - reaction counts for a post, plus that reader's own reactions
// when `user` is given. One request and one Redis round trip instead of two.
export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    if (!isPost(slug)) {
      return NextResponse.json({ error: "Unknown post" }, { status: 404 });
    }
    const userId = request.nextUrl.searchParams.get("user");
    if (userId !== null && !USER_ID_RE.test(userId)) {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }
    const client = await connectRedis();

    const [reactions, mine] = await Promise.all([
      client.hGetAll(`reactions:${slug}`),
      userId ? client.sMembers(`user-reactions:${userId}:${slug}`) : Promise.resolve([] as string[]),
    ]);

    const counts: ReactionData = {
      like: parseInt(reactions.like || "0"),
      love: parseInt(reactions.love || "0"),
      fire: parseInt(reactions.fire || "0"),
      think: parseInt(reactions.think || "0"),
      wow: parseInt(reactions.wow || "0"),
    };

    return NextResponse.json({ counts, userReactions: mine });
  } catch (error) {
    console.error("Error fetching reactions:", error);
    return NextResponse.json({ error: "Failed to fetch reactions" }, { status: 500 });
  }
}

// POST /api/reactions/[slug] - Add or remove a reaction
export async function POST(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    if (!isPost(slug)) {
      return NextResponse.json({ error: "Unknown post" }, { status: 404 });
    }

    const limited = await rateLimit(request, "reaction", 30, 60);
    if (limited) {
      return limited;
    }

    const { reactionType: rawReactionType, userId, action } = await readJsonBody(request);

    if (!REACTION_TYPES.includes(rawReactionType as ReactionType)) {
      return NextResponse.json({ error: "Invalid reaction type" }, { status: 400 });
    }
    const reactionType = rawReactionType as ReactionType;

    if (typeof userId !== "string" || !USER_ID_RE.test(userId)) {
      return NextResponse.json({ error: "Valid user ID is required" }, { status: 400 });
    }

    if (action !== "add" && action !== "remove") {
      return NextResponse.json({ error: 'Action must be "add" or "remove"' }, { status: 400 });
    }

    const client = await connectRedis();
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
