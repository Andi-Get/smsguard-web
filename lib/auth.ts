import { betterAuth } from "better-auth";
import { Pool } from "pg";

/**
 * Better Auth instance for SMSGuard.
 *
 * Sessions, users and OAuth accounts are persisted in Postgres. The schema
 * lives in prisma/contract.prisma, so run the Prisma migration before the
 * first sign in. Only GitHub and Google are enabled as providers.
 */
const globalForAuth = globalThis as unknown as { authPool?: Pool };

const pool =
  globalForAuth.authPool ??
  new Pool({ connectionString: process.env.DATABASE_URL });

if (process.env.NODE_ENV !== "production") {
  globalForAuth.authPool = pool;
}

export const auth = betterAuth({
  appName: "SMSGuard",
  database: pool,
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID ?? "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET ?? "",
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    },
  },
});
