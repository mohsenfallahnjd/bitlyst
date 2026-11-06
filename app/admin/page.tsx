import { cookies } from "next/headers";
import { connection } from "next/server";
import { Suspense } from "react";
import { ADMIN_COOKIE, isAdminSession } from "@/lib/adminAuth";
import { getAdminReport } from "@/lib/adminReport";
import { prisma } from "@/lib/prisma";
import AdminClient from "./AdminClient";

export default function AdminPage(props: { searchParams: Promise<{ error?: string }> }) {
  // reads cookies + searchParams, so it renders per request inside Suspense
  return (
    <Suspense>
      <AdminContent {...props} />
    </Suspense>
  );
}

async function AdminContent({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const sp = await searchParams;
  const cookieStore = await cookies();

  if (!isAdminSession(cookieStore.get(ADMIN_COOKIE)?.value)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <form action="/api/admin/session" method="POST" className="space-y-3 w-full max-w-xs">
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center">Admin access</p>
          {sp.error && <p className="text-xs text-red-500 text-center">Wrong secret.</p>}
          <input
            required
            name="secret"
            type="password"
            autoComplete="current-password"
            placeholder="Secret"
            className="w-full text-sm border border-gray-200 dark:border-gray-800 rounded-lg px-3 py-2 bg-transparent text-gray-900 dark:text-gray-100 focus:outline-none focus:border-brand-500"
          />
          <button
            type="submit"
            className="w-full text-sm px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg transition-colors"
          >
            Enter
          </button>
        </form>
      </div>
    );
  }

  // the report reads the clock, which must happen at request time
  await connection();

  const [pending, approved, report] = await Promise.all([
    prisma.comment.findMany({ where: { approved: false }, orderBy: { createdAt: "desc" } }),
    prisma.comment.findMany({ where: { approved: true }, orderBy: { createdAt: "desc" }, take: 50 }),
    getAdminReport(),
  ]);

  return <AdminClient pending={pending} approved={approved} report={report} />;
}
