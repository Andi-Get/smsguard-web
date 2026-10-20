import Link from "next/link";
import type { Metadata } from "next";
import { db } from "@/prisma/db";
import { parseTimestamp } from "@/lib/device-status";
import { hashPairingToken, isPairingExpired } from "@/lib/pairing";
import { Logo, Wordmark } from "../../_components/brand";

export const instant = false;

export const metadata: Metadata = {
  title: "Pair a device — SMSGuard",
  robots: { index: false, follow: false },
};

type PageProps = { params: Promise<{ token: string }> };

function formatExpiry(value: string) {
  const time = parseTimestamp(value);

  if (time === null) {
    return value;
  }

  return new Intl.DateTimeFormat("en", {
    timeStyle: "short",
  }).format(new Date(time));
}

export default async function PairingLinkPage({ params }: PageProps) {
  const { token } = await params;
  const validToken = token.length >= 20;
  const pairing = validToken
    ? await db.orm.public.DevicePairing.where({
        tokenHash: hashPairingToken(token),
      }).first()
    : null;

  const owner = pairing
    ? await db.orm.public.User.first({ id: pairing.userId })
    : null;

  const claimed = pairing?.status === "claimed";
  const expired = pairing
    ? pairing.status !== "pending" || isPairingExpired(pairing.expiresAt)
    : true;
  const usable = Boolean(pairing && owner && !claimed && !expired);
  const deepLink = `smsguard://pair?token=${encodeURIComponent(token)}`;

  return (
    <div className="flex flex-1 flex-col bg-gradient-to-b from-brand-50 via-white to-white">
      <header className="border-b-2 border-ink bg-white">
        <div className="mx-auto flex w-full max-w-xl items-center gap-3 px-6 py-4">
          <Logo className="size-8" />
          <Wordmark />
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center px-6 py-10">
        <div className="w-full max-w-md border-2 border-ink bg-white shadow-brutal-lg">
          <div className="border-b-2 border-ink p-6">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-brand-700">
              Secure pairing
            </p>
            <h1 className="mt-1.5 text-2xl font-bold uppercase tracking-tight">
              {claimed
                ? "Already paired"
                : expired
                  ? "Link expired"
                  : "Connect this phone"}
            </h1>
          </div>

          <div className="p-6">
            {!pairing ? (
              <>
                <p className="text-sm leading-6 text-ink/60">
                  This pairing link is not valid. Ask the account owner to
                  generate a new code from their dashboard.
                </p>
                <Link
                  href="/"
                  className="mt-5 inline-block border-2 border-ink bg-brand-50 px-4 py-2 font-mono text-[11px] font-bold uppercase tracking-wider shadow-brutal-sm hover:bg-white"
                >
                  Go to SMSGuard
                </Link>
              </>
            ) : claimed ? (
              <>
                <p className="text-sm leading-6 text-ink/60">
                  This pairing code has already been used. If you need to add
                  another device, generate a fresh code from the dashboard.
                </p>
                <Link
                  href="/dashboard"
                  className="mt-5 inline-block border-2 border-ink bg-brand-50 px-4 py-2 font-mono text-[11px] font-bold uppercase tracking-wider shadow-brutal-sm hover:bg-white"
                >
                  Open dashboard
                </Link>
              </>
            ) : expired ? (
              <>
                <p className="text-sm leading-6 text-ink/60">
                  Pairing codes are valid for a short time. Generate a new one
                  from the SMSGuard dashboard and scan it again.
                </p>
                <Link
                  href="/dashboard"
                  className="mt-5 inline-block border-2 border-ink bg-brand-50 px-4 py-2 font-mono text-[11px] font-bold uppercase tracking-wider shadow-brutal-sm hover:bg-white"
                >
                  Generate a new code
                </Link>
              </>
            ) : (
              <>
                <p className="text-sm leading-6 text-ink/60">
                  <span className="font-medium text-ink">
                    {owner?.name ?? "A SMSGuard account"}
                  </span>{" "}
                  wants to link this phone to their account.
                </p>

                <dl className="mt-4 grid grid-cols-2 border-2 border-ink">
                  <div className="border-r-2 border-ink p-3">
                    <dt className="font-mono text-[9px] uppercase tracking-[0.16em] text-ink/40">
                      Code expires
                    </dt>
                    <dd className="mt-0.5 text-sm font-medium">
                      {formatExpiry(pairing.expiresAt)}
                    </dd>
                  </div>
                  <div className="p-3">
                    <dt className="font-mono text-[9px] uppercase tracking-[0.16em] text-ink/40">
                      Account
                    </dt>
                    <dd className="mt-0.5 truncate text-sm font-medium">
                      {owner?.name ?? "SMSGuard user"}
                    </dd>
                  </div>
                </dl>

                {usable ? (
                  <a
                    href={deepLink}
                    className="mt-5 flex w-full items-center justify-center gap-2 border-2 border-ink bg-brand-700 px-4 py-2.5 font-mono text-[11px] font-bold uppercase tracking-wider text-white shadow-brutal-sm transition-shadow hover:bg-brand-600 hover:shadow-brutal"
                  >
                    Open SMSGuard app
                  </a>
                ) : null}

                <p className="mt-4 text-xs leading-5 text-ink/50">
                  Only continue if you requested this pairing. The code is
                  single-use and ties this device to the account above.
                </p>
              </>
            )}
          </div>
        </div>
      </main>

      <footer className="border-t-2 border-ink bg-white">
        <div className="mx-auto flex w-full max-w-xl items-center justify-between gap-4 px-6 py-5 font-mono text-[11px] uppercase tracking-wider text-ink/45">
          <span>SMSGuard © 2026 · MIT</span>
          <Link href="/" className="hover:text-brand-700">
            Home
          </Link>
        </div>
      </footer>
    </div>
  );
}
