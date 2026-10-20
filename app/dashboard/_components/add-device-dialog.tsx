"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";
import { parseTimestamp } from "@/lib/device-status";

type Pairing = {
  token: string;
  url: string;
  expiresAt: string;
  expiresIn: number;
};

type Phase = "creating" | "waiting" | "claimed" | "expired" | "error";

function formatCountdown(seconds: number) {
  const safe = Math.max(0, seconds);
  const minutes = Math.floor(safe / 60);
  const rest = safe % 60;

  return `${String(minutes).padStart(2, "0")}:${String(rest).padStart(2, "0")}`;
}

function isLoopback(url: string) {
  try {
    const { hostname } = new URL(url);
    return ["localhost", "127.0.0.1", "::1", "0.0.0.0"].includes(hostname);
  } catch {
    return false;
  }
}

export function AddDeviceDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pairing, setPairing] = useState<Pairing | null>(null);
  const [phase, setPhase] = useState<Phase>("creating");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [now, setNow] = useState(() => Date.now());

  const createPairing = useCallback(async () => {
    setPhase("creating");
    setError(null);
    setCopied(false);

    try {
      const response = await fetch("/api/devices/pairings", {
        method: "POST",
        headers: { Accept: "application/json" },
      });
      const data = (await response.json()) as Pairing & { error?: string };

      if (!response.ok) {
        throw new Error(data.error ?? "Could not create a pairing code.");
      }

      setPairing(data);
      setNow(Date.now());
      setPhase("waiting");
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Could not create a pairing code.",
      );
      setPhase("error");
    }
  }, []);

  function openDialog() {
    setOpen(true);
    setPairing(null);
    void createPairing();
  }

  useEffect(() => {
    if (!open) {
      return;
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, [open]);

  useEffect(() => {
    if (!open || !pairing || phase !== "waiting") {
      return;
    }

    let cancelled = false;

    async function check() {
      try {
        const response = await fetch(
          `/api/devices/pairings/${encodeURIComponent(pairing!.token)}`,
          { cache: "no-store" },
        );

        if (!response.ok || cancelled) {
          return;
        }

        const data = (await response.json()) as { status?: string };

        if (data.status === "claimed") {
          setPhase("claimed");
          router.refresh();
        } else if (data.status === "expired") {
          setPhase("expired");
        }
      } catch {
        // The next poll retries; a transient network error is not fatal.
      }
    }

    const id = window.setInterval(check, 2500);
    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, [open, pairing, phase, router]);

  const expiresAt = pairing ? parseTimestamp(pairing.expiresAt) : null;
  const remaining = expiresAt === null ? 0 : Math.ceil((expiresAt - now) / 1000);
  const expired =
    phase === "expired" ||
    (phase === "waiting" && (expiresAt === null || remaining <= 0));

  async function copyLink() {
    if (!pairing) {
      return;
    }

    try {
      await navigator.clipboard.writeText(pairing.url);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={openDialog}
        className="inline-flex items-center gap-2 border-2 border-ink bg-brand-700 px-4 py-2 font-mono text-[11px] font-bold uppercase tracking-wider text-white shadow-brutal-sm transition-shadow hover:bg-brand-600 hover:shadow-brutal"
      >
        <svg viewBox="0 0 24 24" fill="none" className="size-4">
          <path
            d="M12 5v14M5 12h14"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
        Add device
      </button>

      {open ? (
        <div
          className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-ink/40 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setOpen(false);
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-device-title"
            className="w-full max-w-md border-2 border-ink bg-white shadow-brutal-lg"
          >
            <div className="flex items-start justify-between gap-4 border-b-2 border-ink p-5">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-brand-700">
                  Secure pairing
                </p>
                <h2 id="add-device-title" className="mt-1 text-lg font-bold">
                  Add a device
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="grid size-8 place-items-center border-2 border-ink bg-white font-mono text-sm font-bold hover:bg-brand-50"
              >
                ×
              </button>
            </div>

            <div className="p-5">
              {phase === "claimed" ? (
                <div className="py-6 text-center">
                  <span className="mx-auto grid size-14 place-items-center border-2 border-ink bg-brand-50">
                    <svg viewBox="0 0 24 24" fill="none" className="size-7 text-brand-700">
                      <path
                        d="m5 12.5 4.2 4.2L19 7"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  <h3 className="mt-4 text-base font-bold">Device connected</h3>
                  <p className="mx-auto mt-1 max-w-xs text-sm leading-6 text-ink/60">
                    The phone submitted its details and now appears in your
                    device list.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setOpen(false);
                      router.refresh();
                    }}
                    className="mt-5 border-2 border-ink bg-brand-700 px-4 py-2 font-mono text-[11px] font-bold uppercase tracking-wider text-white shadow-brutal-sm hover:bg-brand-600"
                  >
                    Done
                  </button>
                </div>
              ) : phase === "error" ? (
                <div className="py-4">
                  <p className="border-2 border-ink bg-red-50 p-3 text-sm">
                    {error ?? "Could not create a pairing code."}
                  </p>
                  <button
                    type="button"
                    onClick={() => void createPairing()}
                    className="mt-4 border-2 border-ink bg-white px-4 py-2 font-mono text-[11px] font-bold uppercase tracking-wider shadow-brutal-sm hover:bg-brand-50"
                  >
                    Try again
                  </button>
                </div>
              ) : (
                <>
                  <ol className="grid grid-cols-2 gap-2">
                    <li className="border-2 border-ink bg-brand-50 p-2.5">
                      <span className="font-mono text-[9px] font-bold text-brand-700">
                        01
                      </span>
                      <p className="mt-0.5 text-xs leading-5">
                        Scan this code with the SMSGuard mobile app.
                      </p>
                    </li>
                    <li className="border-2 border-ink bg-white p-2.5">
                      <span className="font-mono text-[9px] font-bold text-brand-700">
                        02
                      </span>
                      <p className="mt-0.5 text-xs leading-5">
                        Approve the device on your phone.
                      </p>
                    </li>
                  </ol>

                  <div className="mt-4 grid place-items-center border-2 border-ink bg-white p-3">
                    {phase === "creating" || !pairing ? (
                      <div className="grid h-[212px] w-[212px] place-items-center">
                        <div className="text-center">
                          <span className="mx-auto block size-8 animate-spin rounded-full border-2 border-ink border-t-transparent" />
                          <p className="mt-3 font-mono text-[10px] uppercase tracking-wider text-ink/45">
                            Generating code
                          </p>
                        </div>
                      </div>
                    ) : expired ? (
                      <div className="grid h-[212px] w-[212px] place-items-center bg-ink/5 text-center">
                        <div>
                          <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-ink/50">
                            Code expired
                          </p>
                          <button
                            type="button"
                            onClick={() => void createPairing()}
                            className="mt-3 border-2 border-ink bg-white px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-wider shadow-brutal-sm hover:bg-brand-50"
                          >
                            New code
                          </button>
                        </div>
                      </div>
                    ) : (
                      <QRCodeSVG
                        value={pairing.url}
                        size={212}
                        level="M"
                        marginSize={1}
                        bgColor="#ffffff"
                        fgColor="#16200f"
                        title="SMSGuard device pairing code"
                      />
                    )}
                  </div>

                  {pairing && !expired && phase !== "creating" ? (
                    <>
                      <div className="mt-3 flex items-center justify-between gap-3">
                        <p className="font-mono text-[10px] uppercase tracking-wider text-ink/45">
                          Expires in{" "}
                          <span className="font-bold text-ink">
                            {formatCountdown(remaining)}
                          </span>
                        </p>
                        <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-brand-700">
                          <span className="size-1.5 animate-pulse rounded-full bg-brand-600" />
                          Waiting
                        </span>
                      </div>

                      <div className="mt-3 flex items-stretch gap-2">
                        <code className="min-w-0 flex-1 truncate border-2 border-ink/20 bg-ink/[0.03] px-2.5 py-2 font-mono text-[10px] text-ink/60">
                          {pairing.url}
                        </code>
                        <button
                          type="button"
                          onClick={() => void copyLink()}
                          className="shrink-0 border-2 border-ink bg-white px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-wider hover:bg-brand-50"
                        >
                          {copied ? "Copied" : "Copy"}
                        </button>
                      </div>

                      {isLoopback(pairing.url) ? (
                        <p className="mt-3 border-2 border-ink/15 bg-brand-50 p-2.5 text-[11px] leading-5 text-ink/65">
                          This link points to localhost, which your phone
                          cannot reach. Set{" "}
                          <code className="font-mono text-[10px]">
                            NEXT_PUBLIC_APP_URL
                          </code>{" "}
                          to your computer&apos;s LAN address for testing.
                        </p>
                      ) : null}
                    </>
                  ) : null}
                </>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
