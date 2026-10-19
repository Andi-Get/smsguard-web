import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/prisma/db";
import { Logo, Wordmark } from "../_components/brand";
import { SignOutButton } from "../_components/sign-out-button";

const PROVIDERS: Record<string, string> = {
  github: "GitHub",
  google: "Google",
};

// The session check reads request headers, so this route blocks until it can
// resolve them instead of prerendering a static shell.
export const instant = false;

function formatTimestamp(value: string) {
  const date = new Date(value.replace(" ", "T"));

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function Field({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="border-t-2 border-ink p-4 first:border-t-0 sm:border-t-0 sm:border-l-2 sm:first:border-l-0">
      <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink/45">
        {label}
      </dt>
      <dd
        className={`mt-1.5 text-sm ${mono ? "font-mono break-all" : ""}`}
      >
        {value}
      </dd>
    </div>
  );
}

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/");
  }

  const user = await db.orm.public.User.first({ id: session.user.id });

  if (!user) {
    redirect("/");
  }

  const accounts = await db.orm.public.Account.where({ userId: user.id }).all();
  const provider =
    accounts.length > 0
      ? (PROVIDERS[accounts[0].providerId] ?? accounts[0].providerId)
      : "Unknown";
  const initials = user.name.trim().slice(0, 1).toUpperCase() || "?";

  return (
    <div className="flex flex-1 flex-col bg-gradient-to-b from-brand-50 via-white to-white">
      <header className="border-b-2 border-ink bg-white">
        <div className="mx-auto flex w-full max-w-3xl items-center justify-between gap-4 px-6 py-4">
          <div className="flex items-center gap-3">
            <Logo className="size-8" />
            <Wordmark />
          </div>
          <SignOutButton />
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-12">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-brand-700">
          Signed in
        </p>
        <h1 className="mt-2 text-2xl font-bold uppercase tracking-tight">
          Your account
        </h1>
        <p className="mt-2 max-w-lg text-sm leading-6 text-ink/60">
          This is the record Better Auth saved in Postgres when you signed in.
        </p>

        <section className="mt-8 border-2 border-ink bg-white shadow-brutal-lg">
          <div className="flex items-center gap-4 border-b-2 border-ink p-6">
            {user.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.image}
                alt=""
                className="size-14 border-2 border-ink object-cover"
              />
            ) : (
              <span className="grid size-14 place-items-center border-2 border-ink bg-brand-50 font-mono text-lg font-bold text-brand-700">
                {initials}
              </span>
            )}
            <div className="min-w-0">
              <p className="truncate text-lg font-bold">{user.name}</p>
              <p className="truncate text-sm text-ink/60">{user.email}</p>
            </div>
          </div>

          <dl className="grid sm:grid-cols-2">
            <Field label="User ID" value={user.id} mono />
            <Field label="Provider" value={provider} />
            <Field
              label="Email verified"
              value={user.emailVerified ? "Yes" : "No"}
            />
            <Field
              label="Member since"
              value={formatTimestamp(user.createdAt)}
            />
          </dl>
        </section>
      </main>

      <footer className="border-t-2 border-ink bg-white">
        <div className="mx-auto flex w-full max-w-3xl items-center justify-between gap-4 px-6 py-5 font-mono text-[11px] uppercase tracking-wider text-ink/45">
          <span>SMSGuard © 2026 · MIT</span>
          <span>Postgres · Better Auth</span>
        </div>
      </footer>
    </div>
  );
}
