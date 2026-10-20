"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

type Status = "idle" | "saving" | "saved" | "error";

export function SettingsForm({ defaultName }: { defaultName: string }) {
  const router = useRouter();
  const [name, setName] = useState(defaultName);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmed = name.trim();

    if (!trimmed) {
      setError("Display name cannot be empty.");
      setStatus("error");
      return;
    }

    setStatus("saving");
    setError(null);

    const { error: updateError } = await authClient.updateUser({
      name: trimmed,
    });

    if (updateError) {
      setError(updateError.message ?? "Could not save your profile.");
      setStatus("error");
      return;
    }

    setStatus("saved");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="p-5">
      <label
        htmlFor="display-name"
        className="block font-mono text-[10px] uppercase tracking-[0.16em] text-ink/45"
      >
        Display name
      </label>
      <div className="mt-2 flex flex-col gap-2 sm:flex-row">
        <input
          id="display-name"
          name="name"
          value={name}
          onChange={(event) => {
            setName(event.target.value);
            setStatus("idle");
          }}
          autoComplete="name"
          maxLength={80}
          className="min-w-0 flex-1 border-2 border-ink bg-white px-3 py-2 text-sm outline-none focus-visible:bg-brand-50"
        />
        <button
          type="submit"
          disabled={status === "saving" || name.trim() === defaultName}
          className="border-2 border-ink bg-brand-700 px-4 py-2 font-mono text-[11px] font-bold uppercase tracking-wider text-white shadow-brutal-sm transition-shadow hover:bg-brand-600 hover:shadow-brutal disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
        >
          {status === "saving" ? "Saving…" : "Save"}
        </button>
      </div>

      {status === "saved" ? (
        <p className="mt-3 font-mono text-[10px] uppercase tracking-wider text-brand-700">
          Profile updated
        </p>
      ) : null}

      {status === "error" && error ? (
        <p className="mt-3 border-2 border-ink bg-red-50 p-2.5 text-xs">
          {error}
        </p>
      ) : null}

      <p className="mt-3 text-xs leading-5 text-ink/50">
        This is the name shown across SMSGuard. Your email is managed by your
        sign-in provider.
      </p>
    </form>
  );
}
