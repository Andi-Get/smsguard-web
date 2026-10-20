import { createHash, randomBytes } from "node:crypto";
import { parseTimestamp } from "./device-status";

/** How long a scanned code stays valid. */
export const PAIRING_TTL_MS = 10 * 60 * 1000;
export const PAIRING_TTL_SECONDS = Math.floor(PAIRING_TTL_MS / 1000);

/**
 * Creates the value that goes into the QR code and stores only its hash. The
 * raw token is never persisted, so a database leak cannot be replayed.
 */
export function createPairingToken() {
  const token = randomBytes(32).toString("base64url");

  return { token, tokenHash: hashPairingToken(token) };
}

export function hashPairingToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export function isPairingExpired(expiresAt: string) {
  const time = parseTimestamp(expiresAt);

  return time === null || time <= Date.now();
}

/**
 * Absolute origin used in the QR code. NEXT_PUBLIC_APP_URL is required when
 * the phone cannot reach the host the browser used (for example localhost).
 */
export function resolveAppOrigin(request: Request) {
  const configured =
    process.env["NEXT_PUBLIC_APP_URL"]?.trim() ||
    process.env["BETTER_AUTH_URL"]?.trim();

  if (configured) {
    return configured.replace(/\/+$/, "");
  }

  const proto =
    request.headers.get("x-forwarded-proto") ??
    (request.url.startsWith("https:") ? "https" : "http");
  const host =
    request.headers.get("x-forwarded-host") ?? request.headers.get("host");

  return host ? `${proto}://${host}` : new URL(request.url).origin;
}
