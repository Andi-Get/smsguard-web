import { cache } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "./auth";
import { db } from "@/prisma/db";

/**
 * Deduped per request by React's cache. Server Components, layouts and pages
 * can call this without each one re-reading the session headers.
 */
export const getSession = cache(async () => {
  return auth.api.getSession({ headers: await headers() });
});

export const requireUser = cache(async () => {
  const session = await getSession();

  if (!session) {
    redirect("/");
  }

  const user = await db.orm.public.User.first({ id: session.user.id });

  if (!user) {
    redirect("/");
  }

  return user;
});
