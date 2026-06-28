import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import AdminClient from "./AdminClient";
import { createClient } from "redis";

async function getReactionTotals() {
  try {
    const redis = createClient({ url: process.env.REDIS_URL });
    await redis.connect();
    const keys = await redis.keys("reactions:*");
    const totals: { slug: string; total: number }[] = [];
    for (const key of keys) {
      const data = await redis.hGetAll(key);
      const total = Object.values(data).reduce((sum, v) => sum + parseInt(v || "0"), 0);
      totals.push({ slug: key.replace("reactions:", ""), total });
    }
    await redis.disconnect();
    return totals.sort((a, b) => b.total - a.total).slice(0, 20);
  } catch {
    return [];
  }
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ secret?: string }>;
}) {
  const sp = await searchParams;
  const cookieStore = await cookies();
  const sessionSecret = cookieStore.get("admin_secret")?.value;
  const querySecret = sp.secret;

  const validSecret = process.env.ADMIN_SECRET;
  const authed = sessionSecret === validSecret || querySecret === validSecret;

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <form action="/admin" method="GET" className="space-y-3 w-full max-w-xs">
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center">Admin access</p>
          <input
            name="secret"
            type="password"
            placeholder="Secret"
            className="w-full text-sm border border-gray-200 dark:border-gray-800 rounded-lg px-3 py-2 bg-transparent text-gray-900 dark:text-gray-100 focus:outline-none focus:border-teal-500"
          />
          <button
            type="submit"
            className="w-full text-sm px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-colors"
          >
            Enter
          </button>
        </form>
      </div>
    );
  }

  const [pending, approved, reactions] = await Promise.all([
    prisma.comment.findMany({ where: { approved: false }, orderBy: { createdAt: "desc" } }),
    prisma.comment.findMany({ where: { approved: true }, orderBy: { createdAt: "desc" }, take: 50 }),
    getReactionTotals(),
  ]);

  return (
    <AdminClient
      pending={pending}
      approved={approved}
      reactions={reactions}
      secret={querySecret ?? sessionSecret ?? ""}
    />
  );
}
