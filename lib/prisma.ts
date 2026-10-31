import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

// pg already treats prefer/require/verify-ca as verify-full; say so explicitly to keep
// that behavior when pg v9 switches to libpq semantics (and silence its warning)
function withExplicitSslMode(url?: string) {
  return url?.replace(/sslmode=(prefer|require|verify-ca)\b/, "sslmode=verify-full");
}

function createPrismaClient() {
  const pool = new Pool({ connectionString: withExplicitSslMode(process.env.DATABASE_URL) });
  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
