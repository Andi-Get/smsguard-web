import { GitHubMark, Logo, StarIcon } from "./_components/brand";
import { OAuthButtons } from "./_components/oauth-buttons";

const REPO = "https://github.com/smsguard-org/smsguard";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col bg-gradient-to-b from-brand-50 via-white to-white">
      <main className="flex flex-1 items-center justify-center px-6 py-14">
        <div className="w-full max-w-md border-2 border-ink bg-white p-8 text-center shadow-brutal-lg sm:p-10">
          <div className="flex justify-center">
            <Logo className="size-12" />
          </div>

          <p className="mt-5 font-mono text-[11px] uppercase tracking-[0.2em] text-brand-700">
            Open source · MIT
          </p>
          <h1 className="mt-2 text-3xl font-bold uppercase tracking-tight">
            SMSGuard
          </h1>
          <p className="mx-auto mt-3 max-w-xs text-sm leading-6 text-ink/60">
            This is the SMSGuard web panel. It lets you access your device and
            do things with it directly from the web.
          </p>

          <div className="mt-7 text-left">
            <OAuthButtons />
          </div>

          <a
            href={REPO}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 border-2 border-ink bg-brand-50 px-3 py-1.5 font-mono text-[11px] font-bold uppercase tracking-wider shadow-brutal-sm transition-shadow hover:bg-white hover:shadow-brutal"
          >
            <GitHubMark className="size-3.5" />
            <StarIcon className="size-3 text-brand-700" />
            Star the repo
          </a>
        </div>
      </main>

      <footer className="border-t-2 border-ink bg-white">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-6 py-5 font-mono text-[11px] uppercase tracking-wider text-ink/45">
          <span>SMSGuard © 2026 · MIT</span>
          <a
            href={REPO}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-brand-700"
          >
            GitHub
          </a>
        </div>
      </footer>
    </div>
  );
}
