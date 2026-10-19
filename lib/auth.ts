import { betterAuth } from "better-auth";

/**
 * Better Auth instance for SMSGuard.
 *
 * No database is configured, so Better Auth runs in stateless mode: the
 * session is kept in a signed, encrypted cookie instead of a database row.
 * Only GitHub and Google are enabled as providers.
 */
export const auth = betterAuth({
  appName: "SMSGuard",
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
