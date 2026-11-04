import { type NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE, ADMIN_SESSION_MAX_AGE, createAdminSessionToken, isValidAdminSecret } from "@/lib/adminAuth";
import { rateLimit } from "@/lib/requestGuards";

// POST /api/admin/session - Log in from the /admin form
export async function POST(req: NextRequest) {
  const limited = await rateLimit(req, "admin-login", 5, 15 * 60);
  if (limited) {
    return limited;
  }

  const form = await req.formData().catch(() => null);
  if (!isValidAdminSecret(form?.get("secret"))) {
    return NextResponse.redirect(new URL("/admin?error=1", req.url), 303);
  }

  const res = NextResponse.redirect(new URL("/admin", req.url), 303);
  res.cookies.set(ADMIN_COOKIE, createAdminSessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    // strict also protects the comment moderation routes from cross-site requests
    sameSite: "strict",
    path: "/",
    maxAge: ADMIN_SESSION_MAX_AGE,
  });
  return res;
}

// DELETE /api/admin/session - Log out
export function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.delete(ADMIN_COOKIE);
  return res;
}
