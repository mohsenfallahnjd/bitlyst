import { createClient } from "redis";

type RedisClient = ReturnType<typeof createClient>;

const globalForRedis = globalThis as unknown as { redisPromise?: Promise<RedisClient> };

/**
 * Shared, lazily-connected Redis client. Returns null when REDIS_URL is not
 * configured so pages still render (with zero stats) in local/dev builds.
 */
export async function getRedis(): Promise<RedisClient | null> {
  if (!process.env.REDIS_URL) {
    return null;
  }

  if (!globalForRedis.redisPromise) {
    const client = createClient({
      url: process.env.REDIS_URL,
      socket: {
        connectTimeout: 5000,
        reconnectStrategy: (retries) => (retries > 3 ? new Error("Redis unreachable") : Math.min(retries * 200, 1000)),
      },
    });
    client.on("error", (err) => {
      console.error("Redis error:", err.message);
    });
    globalForRedis.redisPromise = client.connect().catch((err) => {
      globalForRedis.redisPromise = undefined;
      throw err;
    }) as Promise<RedisClient>;
  }

  const client = await globalForRedis.redisPromise;
  if (!client.isOpen) {
    globalForRedis.redisPromise = undefined;
    return getRedis();
  }
  return client;
}
