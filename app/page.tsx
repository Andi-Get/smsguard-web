const REPO = "https://github.com/smsguard-org/smsguard";
const navLinks = [
  { label: "Features", href: "#features" },
  { label: "Commands", href: "#commands" },
  { label: "Manifesto", href: "#why" },
];

function GitHubMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}

function Star({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 2l2.9 6.26 6.1.7-4.5 4.2 1.2 6-5.7-3.1-5.7 3.1 1.2-6L3 8.96l6.1-.7L12 2Z" />
    </svg>
  );
}

function Logo({ className = "size-9" }: { className?: string }) {
  return (
    <span
      className={`grid place-items-center border-2 border-ink bg-gradient-to-br from-brand-400 to-brand-700 text-white ${className}`}
    >
      <svg viewBox="0 0 24 24" fill="none" className="size-5">
        <path
          d="M12 3.2 5.8 5.6v5.1c0 3.8 2.5 7.2 6.2 8.4 3.7-1.2 6.2-4.6 6.2-8.4V5.6L12 3.2Z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        <path
          d="M9.4 11.6l1.8 1.8 3.4-3.6"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

const commands = ["locate", "ring", "lock", "wipe", "siren", "battery"];

const features = [
  {
    id: "01",
    title: "Remote commands",
    body: "Locate, ring, lock, or wipe any linked device by sending one short SMS — no data plan needed.",
    icon: (
      <path
        d="M8 3.5h8a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-4l-4 3v-3H8a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    ),
  },
  {
    id: "02",
    title: "Device vault",
    body: "Keep every phone in one clean registry with its nickname, SIM number, and IMEI on file.",
    icon: (
      <>
        <rect
          x="4.5"
          y="3.5"
          width="15"
          height="17"
          stroke="currentColor"
          strokeWidth="1.8"
        />
        <path
          d="M9 3.5h6M10 17h4"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </>
    ),
  },
  {
    id: "03",
    title: "Act from the web",
    body: "Trigger anything from the dashboard and watch the reply land in your inbox seconds later.",
    icon: (
      <>
        <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.8" />
        <path
          d="M12 8v4l2.5 1.5"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </>
    ),
  },
];

export default function Home() {
  return (
    <div className="relative flex-1 bg-gradient-to-b from-brand-50 via-white to-white">
      {/* Top open-source strip */}
      <div className="border-b-2 border-ink bg-ink text-brand-50">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-2 px-6 py-2 font-mono text-[11px] uppercase tracking-wider">
          <p className="text-brand-200">
            Open source · MIT licensed · self-host in minutes
          </p>
          <a
            href={REPO}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 border-2 border-brand px-2 py-0.5 text-white transition-colors hover:bg-brand hover:text-ink"
          >
            <Star className="size-3 text-brand" />
            <span>Star on GitHub</span>
          </a>
        </div>
      </div>

      <header className="border-b-2 border-ink bg-white">
        <nav className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-6 py-4">
          <a href="#" className="flex items-center gap-3">
            <Logo />
            <span className="font-mono text-base font-bold uppercase tracking-[0.14em]">
              SMS<span className="text-brand-700">Guard</span>
            </span>
          </a>

          <div className="hidden items-center gap-7 font-mono text-[11px] uppercase tracking-wider text-ink/60 lg:flex">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="transition-colors hover:text-brand-700"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <a
              href={REPO}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border-2 border-ink bg-white px-3 py-2 font-mono text-[11px] font-bold uppercase tracking-wider shadow-brutal-sm transition-shadow hover:bg-brand-50 hover:shadow-brutal"
            >
              <GitHubMark className="size-3.5" />
              <span className="hidden sm:inline">Star</span>
            </a>
            <a
              href="#start"
              className="inline-flex items-center border-2 border-ink bg-gradient-to-b from-brand-400 to-brand-600 px-4 py-2 font-mono text-[11px] font-bold uppercase tracking-wider text-white shadow-brutal-sm transition-shadow hover:from-brand-600 hover:to-brand-700 hover:shadow-brutal"
            >
              Dashboard
            </a>
          </div>
        </nav>
      </header>

      <main className="mx-auto w-full max-w-6xl px-6">
        {/* Hero */}
        <section
          id="start"
          className="grid items-center gap-14 border-b-2 border-ink py-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12"
        >
          <div>
            <span className="inline-flex items-center gap-2 border-2 border-ink bg-white px-3 py-1 font-mono text-[11px] uppercase tracking-wider">
              <span className="size-2 bg-brand" />
              Works over plain SMS
            </span>

            <h1 className="mt-6 text-4xl font-bold leading-[1.04] tracking-tight sm:text-5xl lg:text-[3.6rem]">
              Track and protect your phone
              <span className="block bg-gradient-to-r from-brand-700 via-brand to-brand-400 bg-clip-text text-transparent">
                with a text message.
              </span>
            </h1>

            <p className="mt-6 max-w-md text-[17px] leading-7 text-ink/65">
              Link your devices, keep their IMEI safe, and run remote actions
              straight from the web — even when the phone is offline.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href={REPO}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 border-2 border-ink bg-gradient-to-b from-brand-400 to-brand-600 px-6 py-3 font-mono text-xs font-bold uppercase tracking-wider text-white shadow-brutal transition-shadow hover:from-brand-600 hover:to-brand-700 hover:shadow-brutal-lg"
              >
                <GitHubMark className="size-4" />
                Get started
              </a>
              <a
                href="#commands"
                className="inline-flex items-center border-2 border-ink bg-white px-6 py-3 font-mono text-xs font-bold uppercase tracking-wider shadow-brutal-sm transition-shadow hover:bg-brand-50 hover:shadow-brutal"
              >
                View commands
              </a>
            </div>

            <p className="mt-6 font-mono text-[11px] uppercase tracking-wider text-ink/45">
              No app on the receiving end · Android + feature phones
            </p>
          </div>

          {/* Device card */}
          <div className="w-full border-2 border-ink bg-white shadow-brutal-lg">
            <div className="flex items-center justify-between border-b-2 border-ink bg-brand-50 p-4">
              <div className="flex items-center gap-3">
                <span className="grid size-10 place-items-center border-2 border-ink bg-white text-brand-700">
                  <svg viewBox="0 0 24 24" fill="none" className="size-5">
                    <rect
                      x="7"
                      y="2.5"
                      width="10"
                      height="19"
                      rx="2.5"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    />
                    <path
                      d="M10.5 19h3"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
                <div>
                  <p className="text-sm font-bold uppercase tracking-wide">
                    Pixel 8
                  </p>
                  <p className="font-mono text-[11px] text-ink/55">
                    3549 21 08 447120 6
                  </p>
                </div>
              </div>
              <span className="border-2 border-ink bg-gradient-to-b from-brand-400 to-brand-600 px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-white">
                Linked
              </span>
            </div>

            <div className="p-4">
              <div className="hatch h-24 border-2 border-ink bg-brand-50" />
              <div className="mt-3 flex items-center justify-between">
                <p className="font-mono text-[11px] text-ink/60">
                  6.5244, 3.3792
                </p>
                <span className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase text-brand-700">
                  <span className="size-2 bg-brand" />
                  Updated now
                </span>
              </div>

              <div className="mt-4 flex flex-wrap gap-2 border-t-2 border-dashed border-ink/20 pt-4">
                {commands.map((command) => (
                  <span
                    key={command}
                    className="border-2 border-ink bg-white px-2.5 py-1 font-mono text-[11px] text-brand-700 shadow-brutal-sm transition-shadow hover:bg-brand-50 hover:shadow-brutal"
                  >
                    /{command}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="border-b-2 border-ink py-14">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-ink/55">
              What it does
            </h2>
            <p className="max-w-sm text-sm leading-6 text-ink/60">
              Everything a lost-phone toolkit needs, stripped to the essentials.
            </p>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.id}
                className="border-2 border-ink bg-white p-6 shadow-brutal transition-shadow hover:shadow-brutal-lg"
              >
                <div className="flex items-start justify-between">
                  <span className="grid size-11 place-items-center border-2 border-ink bg-gradient-to-br from-brand-50 to-brand-200 text-brand-700">
                    <svg viewBox="0 0 24 24" fill="none" className="size-5">
                      {feature.icon}
                    </svg>
                  </span>
                  <span className="font-mono text-xs font-bold text-brand-700">
                    /{feature.id}
                  </span>
                </div>
                <h3 className="mt-5 text-base font-bold uppercase tracking-wide">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-ink/60">
                  {feature.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Commands */}
        <section id="commands" className="border-b-2 border-ink py-14">
          <div className="border-2 border-ink bg-gradient-to-br from-brand-50 via-white to-brand-100 p-8 shadow-brutal sm:p-10">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold uppercase tracking-tight">
                  One shortcode, every action
                </h2>
                <p className="mt-2 max-w-md text-sm leading-6 text-ink/60">
                  Send a keyword, get an instant reply with the result.
                </p>
              </div>
              <a
                href={REPO}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 border-2 border-ink bg-white px-4 py-2 font-mono text-[11px] font-bold uppercase tracking-wider shadow-brutal-sm transition-shadow hover:bg-brand-50 hover:shadow-brutal"
              >
                Read the docs
              </a>
            </div>

            <div className="mt-7 flex flex-wrap gap-3">
              {[
                "GUARD LOCATE",
                "GUARD RING",
                "GUARD LOCK",
                "GUARD WIPE",
                "GUARD BATTERY",
                "GUARD WHOAMI",
              ].map((command) => (
                <code
                  key={command}
                  className="border-2 border-ink bg-white px-3 py-2 font-mono text-xs text-brand-700 shadow-brutal-sm transition-shadow hover:bg-brand-50 hover:shadow-brutal"
                >
                  {command}
                </code>
              ))}
            </div>
          </div>
        </section>

        {/* Open-source */}
        <section id="why" className="py-14">
          <div className="grid items-stretch gap-6 lg:grid-cols-[1.4fr_0.6fr]">
            <div className="border-2 border-ink bg-white p-8 shadow-brutal">
              <h2 className="text-2xl font-bold uppercase tracking-tight">
                Built in the open
              </h2>
              <p className="mt-3 max-w-lg text-sm leading-7 text-ink/65">
                SMSGuard is MIT licensed. Read the source, audit what leaves your
                device, self-host the relay, or send a patch — the whole stack is
                yours.
              </p>
              <div className="mt-6 flex flex-wrap gap-3 font-mono text-[11px] uppercase tracking-wider">
                {["MIT license", "Self-hostable", "No trackers", "PRs welcome"].map(
                  (tag) => (
                    <span
                      key={tag}
                      className="border-2 border-ink bg-brand-50 px-3 py-1"
                    >
                      {tag}
                    </span>
                  ),
                )}
              </div>
            </div>

            <a
              href={REPO}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col justify-between border-2 border-ink bg-ink p-8 text-brand-50 shadow-brutal transition-shadow hover:shadow-brutal-lg"
            >
              <GitHubMark className="size-7 text-brand" />
              <div className="mt-8">
                <p className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-brand-200">
                  <Star className="size-3.5 text-brand" />
                  Star smsguard-org/smsguard
                </p>
              </div>
            </a>
          </div>
        </section>
      </main>

      <footer className="border-t-2 border-ink bg-white">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-4 px-6 py-7 font-mono text-[11px] uppercase tracking-wider text-ink/55 sm:flex-row">
          <div className="flex items-center gap-3">
            <Logo className="size-7" />
            <span>SMSGuard © 2026 · MIT</span>
          </div>
          <div className="flex items-center gap-6">
            <a
              href={REPO}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 transition-colors hover:text-brand-700"
            >
              <GitHubMark className="size-3.5" />
              GitHub
            </a>
            <a className="transition-colors hover:text-brand-700" href="#features">
              Features
            </a>
            <a className="transition-colors hover:text-brand-700" href="#start">
              Dashboard
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
