import { createHash } from "node:crypto";
import { type NextRequest, NextResponse } from "next/server";
import { getRedis } from "@/lib/redis";
import { isPost, rateLimit, readJsonBody } from "@/lib/requestGuards";

/**
 * Cross-device reading sync. A device sends its whole reading state with a secret sync code;
 * the server merges it into the stored copy (highest progress / latest open per post, latest
 * bookmark per post by bt, latest streak day) and returns the merged state.
 *
 * The code is never stored: keys are derived from its salted hash.
 */

const CODE_RE = /^[a-f0-9]{32}$/;
const DAY_RE = /^(\d{4})-(\d{1,2})-(\d{1,2})$/;
const MAX_POSTS = 2000;
const TTL_SECONDS = 60 * 60 * 24 * 365;

// KEYS: progress, opened-at, streak, bookmark, bookmark-at
// ARGV: ttl, dayNum, day, count, best, then (slug, p, t, b, bt) per post
const MERGE = `
for i = 6, #ARGV, 5 do
  local s = ARGV[i]
  if tonumber(ARGV[i + 1]) > tonumber(redis.call('HGET', KEYS[1], s) or '-1') then
    redis.call('HSET', KEYS[1], s, ARGV[i + 1])
  end
  if tonumber(ARGV[i + 2]) > tonumber(redis.call('HGET', KEYS[2], s) or '-1') then
    redis.call('HSET', KEYS[2], s, ARGV[i + 2])
  end
  local bt_new = tonumber(ARGV[i + 4] or '0')
  if bt_new > 0 then
    local bt_old = tonumber(redis.call('HGET', KEYS[5], s) or '0')
    if bt_new > bt_old then
      redis.call('HSET', KEYS[5], s, ARGV[i + 4])
      local b = ARGV[i + 3]
      if b == nil or b == '' then
        redis.call('HDEL', KEYS[4], s)
      else
        redis.call('HSET', KEYS[4], s, b)
      end
    end
  end
end
local n = tonumber(ARGV[2])
if n > 0 then
  local cur = tonumber(redis.call('HGET', KEYS[3], 'n') or '0')
  local count = tonumber(ARGV[4])
  if n > cur then
    redis.call('HSET', KEYS[3], 'n', ARGV[2], 'day', ARGV[3], 'count', ARGV[4])
  elseif n == cur and count > tonumber(redis.call('HGET', KEYS[3], 'count') or '0') then
    redis.call('HSET', KEYS[3], 'count', ARGV[4])
  end
  if tonumber(ARGV[5]) > tonumber(redis.call('HGET', KEYS[3], 'best') or '0') then
    redis.call('HSET', KEYS[3], 'best', ARGV[5])
  end
end
for k = 1, 5 do
  redis.call('EXPIRE', KEYS[k], ARGV[1])
end
return {redis.call('HGETALL', KEYS[1]), redis.call('HGETALL', KEYS[2]), redis.call('HGETALL', KEYS[3]), redis.call('HGETALL', KEYS[4]), redis.call('HGETALL', KEYS[5])}
`;

function num(v: unknown, min: number, max: number) {
  return typeof v === "number" && Number.isFinite(v) ? Math.min(max, Math.max(min, v)) : null;
}

function pairs(flat: unknown): [string, string][] {
  const arr = Array.isArray(flat) ? flat.map(String) : [];
  const out: [string, string][] = [];
  for (let i = 0; i + 1 < arr.length; i += 2) {
    out.push([arr[i], arr[i + 1]]);
  }
  return out;
}

// POST /api/reader-sync — merge this device's reading state and return the combined state
export async function POST(req: NextRequest) {
  const limited = await rateLimit(req, "reader-sync", 60, 60);
  if (limited) {
    return limited;
  }

  const body = await readJsonBody(req);
  const code = typeof body.code === "string" ? body.code : "";
  if (!CODE_RE.test(code)) {
    return NextResponse.json({ error: "Invalid sync code" }, { status: 400 });
  }

  const now = Date.now();
  const quintuples: string[] = [];
  const history = body.history && typeof body.history === "object" ? (body.history as Record<string, unknown>) : {};
  for (const [slug, entry] of Object.entries(history).slice(0, MAX_POSTS)) {
    if (!isPost(slug) || !entry || typeof entry !== "object") {
      continue;
    }
    const { p, t, b, bt } = entry as { p?: unknown; t?: unknown; b?: unknown; bt?: unknown };
    const progress = num(p, 0, 1);
    const opened = num(t, 0, now + 60_000);
    if (progress === null || opened === null) {
      continue;
    }
    const bookmark = b === undefined ? "" : String(num(b, 0, 1) ?? "");
    const bookmarkAt = num(bt, 0, now + 60_000) ?? 0;
    quintuples.push(
      slug,
      String(progress),
      String(Math.round(opened)),
      bookmark,
      bookmarkAt > 0 ? String(Math.round(bookmarkAt)) : "0",
    );
  }

  const streak = body.streak && typeof body.streak === "object" ? (body.streak as Record<string, unknown>) : {};
  const day = typeof streak.day === "string" ? streak.day : "";
  const m = DAY_RE.exec(day);
  const dayNum = m ? Number(m[1]) * 10_000 + Number(m[2]) * 100 + Number(m[3]) : 0;
  const count = num(streak.count, 0, 100_000) ?? 0;
  const best = num(streak.best, 0, 100_000) ?? 0;

  try {
    const redis = await getRedis();
    if (!redis) {
      return NextResponse.json({ error: "Sync unavailable" }, { status: 503 });
    }
    const id = createHash("sha256")
      .update(`${code}|${process.env.VIEWS_SALT ?? "bitlyst"}`)
      .digest("hex")
      .slice(0, 32);
    const prefix = `readersync:${id}`;
    const result = (await redis.eval(MERGE, {
      keys: [
        `${prefix}:p`,
        `${prefix}:t`,
        `${prefix}:streak`,
        `${prefix}:bm`,
        `${prefix}:bt`,
      ],
      arguments: [
        String(TTL_SECONDS),
        String(dayNum),
        m ? day : "",
        String(Math.round(count)),
        String(Math.round(best)),
        ...quintuples,
      ],
    })) as unknown[];

    const opened = new Map(pairs(result[1]));
    const bookmarks = new Map(pairs(result[3]));
    const bookmarkAt = new Map(pairs(result[4]));
    const merged: Record<string, { p: number; t: number; b?: number; bt?: number }> = {};
    for (const [slug, p] of pairs(result[0])) {
      const entry: { p: number; t: number; b?: number; bt?: number } = {
        p: Number(p),
        t: Number(opened.get(slug) ?? 0),
      };
      const bt = Number(bookmarkAt.get(slug) ?? 0);
      if (bt > 0) {
        entry.bt = bt;
        const bm = bookmarks.get(slug);
        if (bm !== undefined) {
          entry.b = Number(bm);
        }
      }
      merged[slug] = entry;
    }
    const s = Object.fromEntries(pairs(result[2]));

    return NextResponse.json({
      history: merged,
      streak: { day: s.day ?? "", count: Number(s.count ?? 0), best: Number(s.best ?? 0) },
    });
  } catch (err) {
    console.error("reader-sync failed:", err);
    return NextResponse.json({ error: "Sync failed" }, { status: 500 });
  }
}