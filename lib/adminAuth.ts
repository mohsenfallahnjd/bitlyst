import "server-only";

import { createHash, createHmac, timingSafeEqual } from "node:crypto";

export const ADMIN_COOKIE = "admin_session";
export const ADMIN_SESSION_MAX_AGE = 7 * 86_400;

function configuredSecret() {
  return process.env.ADMIN_SECRET || null;
}

/** Hashing first gives both sides the same length, which timingSafeEqual requires. */
function safeEqual(a: string, b: string) {
  return timingSafeEqual(createHash("sha256").update(a).digest(), createHash("sha256").update(b).digest());
}

/** Derived from the secret, so the cookie never holds it and rotating the secret ends every session. */
function sessionToken(secret: string) {
  return createHmac("sha256", secret).update("admin-session").digest("hex");
}

/** Always false when ADMIN_SECRET is unset or empty: no configured secret means no admin access. */
export function isValidAdminSecret(candidate: unknown) {
  const secret = configuredSecret();
  return Boolean(secret) && typeof candidate === "string" && safeEqual(candidate, secret as string);
}

export function isAdminSession(cookieValue: string | undefined) {
  const secret = configuredSecret();
  return Boolean(secret) && typeof cookieValue === "string" && safeEqual(cookieValue, sessionToken(secret as string));
}

/** Call only after isValidAdminSecret passed. */
export function createAdminSessionToken() {
  return sessionToken(configuredSecret() as string);
}
