"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { GitHubMark } from "./brand";

type Provider = "github" | "google";

function GoogleMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path
        fill="#4285F4"
        d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47a5.57 5.57 0 0 1-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09A11.99 11.99 0 0 0 12 24Z"
      />
      <path
        fill="#FBBC05"
        d="M5.27 14.29A7.2 7.2 0 0 1 4.89 12c0-.8.14-1.57.38-2.29V6.62H1.29A11.99 11.99 0 0 0 0 12c0 1.94.46 3.77 1.29 5.38l3.98-3.09Z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.69 1.29 6.62l3.98 3.09C6.22 6.86 8.87 4.75 12 4.75Z"
      />
    </svg>
  );
}

const buttonClass =
  "inline-flex w-full items-center justify-center gap-2.5 border-2 border-ink bg-white px-4 py-3 font-mono text-xs font-bold uppercase tracking-wider shadow-brutal-sm transition-shadow hover:bg-brand-50 hover:shadow-brutal disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-white disabled:hover:shadow-brutal-sm";

export function OAuthButtons() {
  const [pending, setPending] = useState<Provider | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function continueWith(provider: Provider) {
    setError(null);
    setPending(provider);

    try {
      const { error: authError } = await authClient.signIn.social({
        provider,
        callbackURL: "/",
      });

      if (authError) {
        throw new Error(authError.message);
      }
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Could not start the sign in. Try again.",
      );
      setPending(null);
    }
  }

  return (
    <div className="grid gap-3">
      <button
        type="button"
        onClick={() => continueWith("google")}
        disabled={pending !== null}
        className={buttonClass}
      >
        <GoogleMark className="size-4" />
        {pending === "google" ? "Redirecting…" : "Continue with Google"}
      </button>

      <button
        type="button"
        onClick={() => continueWith("github")}
        disabled={pending !== null}
        className={buttonClass}
      >
        <GitHubMark className="size-4" />
        {pending === "github" ? "Redirecting…" : "Continue with GitHub"}
      </button>

      {error ? (
        <p
          role="alert"
          className="border-2 border-ink bg-brand-50 px-3 py-2 font-mono text-[11px] leading-5 text-ink/70"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}
