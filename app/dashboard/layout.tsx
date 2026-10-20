import Link from "next/link";
import { Logo, Wordmark } from "../_components/brand";
import { SignOutButton } from "../_components/sign-out-button";
import { requireUser } from "@/lib/session";
import { DashboardNav } from "./_components/dashboard-nav";

// Session and device reads are request-specific, so this segment blocks
// instead of being validated for instant navigation.
export const instant = false;

export default async function DashboardLayout({
  children,
}: LayoutProps<"/dashboard">) {
  const user = await requireUser();
  const initials = user.name.trim().slice(0, 1).toUpperCase() || "?";

  return (
    <div className="flex flex-1 flex-col bg-gradient-to-b from-brand-50 via-white to-white">
      <header className="border-b-2 border-ink bg-white">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-6 py-4">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-700"
          >
            <Logo className="size-8" />
            <Wordmark />
          </Link>

          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 sm:flex">
              <span className="grid size-8 place-items-center border-2 border-ink bg-brand-50 font-mono text-xs font-bold text-brand-700">
                {initials}
              </span>
              <div className="max-w-40 leading-tight">
                <p className="truncate text-xs font-bold">{user.name}</p>
                <p className="truncate text-[11px] text-ink/50">{user.email}</p>
              </div>
            </div>
            <SignOutButton />
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-5xl flex-1 items-start gap-8 px-6 py-8">
        <aside className="hidden w-48 shrink-0 md:block">
          <DashboardNav />
          <div className="mt-4 border-2 border-ink bg-white p-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink/45">
              Tip
            </p>
            <p className="mt-1.5 text-xs leading-5 text-ink/60">
              Pair a device once, then update its status from the SMSGuard app.
            </p>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <div className="mb-5 md:hidden">
            <DashboardNav />
          </div>
          {children}
        </div>
      </main>

      <footer className="border-t-2 border-ink bg-white">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-6 py-5 font-mono text-[11px] uppercase tracking-wider text-ink/45">
          <span>SMSGuard © 2026 · MIT</span>
          <span>Postgres · Better Auth</span>
        </div>
      </footer>
    </div>
  );
}
