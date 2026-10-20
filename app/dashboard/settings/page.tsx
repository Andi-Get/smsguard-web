import { db } from "@/prisma/db";
import { parseTimestamp } from "@/lib/device-status";
import { requireUser } from "@/lib/session";
import { SignOutButton } from "../../_components/sign-out-button";
import { SettingsForm } from "../_components/settings-form";

export const instant = false;

const PROVIDERS: Record<string, string> = {
  github: "GitHub",
  google: "Google",
};

function formatTimestamp(value: string) {
  const time = parseTimestamp(value);

  if (time === null) {
    return value;
  }

  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(time));
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
    <div className="border-t-2 border-ink/10 px-5 py-3 first:border-t-0">
      <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink/45">
        {label}
      </dt>
      <dd className={`mt-1 text-sm ${mono ? "font-mono break-all" : ""}`}>
        {value}
      </dd>
    </div>
  );
}

export default async function SettingsPage() {
  const user = await requireUser();
  const accounts = await db.orm.public.Account.where({ userId: user.id }).all();
  const provider =
    accounts.length > 0
      ? (PROVIDERS[accounts[0].providerId] ?? accounts[0].providerId)
      : "Unknown";

  return (
    <>
      <div>
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-brand-700">
          Preferences
        </p>
        <h1 className="mt-1 text-2xl font-bold uppercase tracking-tight">
          Settings
        </h1>
        <p className="mt-1 text-sm text-ink/55">
          Your profile and the account Better Auth saved in Postgres.
        </p>
      </div>

      <section className="mt-6 border-2 border-ink bg-white shadow-brutal-lg">
        <div className="border-b-2 border-ink px-5 py-3">
          <h2 className="font-mono text-[11px] font-bold uppercase tracking-[0.16em]">
            Profile
          </h2>
        </div>
        <SettingsForm defaultName={user.name} />
      </section>

      <section className="mt-5 border-2 border-ink bg-white shadow-brutal-lg">
        <div className="border-b-2 border-ink px-5 py-3">
          <h2 className="font-mono text-[11px] font-bold uppercase tracking-[0.16em]">
            Account
          </h2>
        </div>
        <dl className="grid sm:grid-cols-2">
          <Field label="Email" value={user.email} />
          <Field label="Sign-in method" value={provider} />
          <Field label="Email verified" value={user.emailVerified ? "Yes" : "No"} />
          <Field label="Member since" value={formatTimestamp(user.createdAt)} />
          <Field label="User ID" value={user.id} mono />
        </dl>
      </section>

      <section className="mt-5 border-2 border-ink bg-white shadow-brutal-lg">
        <div className="border-b-2 border-ink px-5 py-3">
          <h2 className="font-mono text-[11px] font-bold uppercase tracking-[0.16em]">
            Session
          </h2>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 p-5">
          <div>
            <p className="text-sm">
              Signed in as{" "}
              <span className="font-medium">{user.email}</span>
            </p>
            <p className="mt-0.5 text-xs text-ink/50">
              Signing out also clears the session cookie on this device.
            </p>
          </div>
          <SignOutButton />
        </div>
      </section>
    </>
  );
}
