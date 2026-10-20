export function asRecord(value: unknown): Record<string, unknown> | null {
  return value !== null && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

export function readString(value: unknown): string | null {
  return typeof value === "string" && value.length > 0 ? value : null;
}

export function readNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
}

export function readBoolean(value: unknown): boolean | null {
  return typeof value === "boolean" ? value : null;
}

export function parseTimestamp(value: string | null) {
  if (!value) {
    return null;
  }

  // Postgres returns timestamptz text as "2026-10-20 05:58:32.573886+00".
  // JavaScript only accepts millisecond precision and a "+00:00" offset.
  let text = value.trim().replace(" ", "T");
  text = text.replace(/([+-]\d{2})$/, "$1:00");
  text = text.replace(/(\.\d{3})\d+/, "$1");

  if (!/([zZ]|[+-]\d{2}:\d{2})$/.test(text)) {
    text += "Z";
  }

  const time = Date.parse(text);

  return Number.isNaN(time) ? null : time;
}

export function isDeviceOnline(lastSeenAt: string | null) {
  const time = parseTimestamp(lastSeenAt);

  return time !== null && Date.now() - time < 5 * 60 * 1000;
}

export function formatLastSeen(lastSeenAt: string | null) {
  const time = parseTimestamp(lastSeenAt);

  if (time === null) {
    return "Never";
  }

  const seconds = Math.max(0, Math.round((Date.now() - time) / 1000));

  if (seconds < 60) {
    return "Just now";
  }

  if (seconds < 3600) {
    return `${Math.floor(seconds / 60)}m ago`;
  }

  if (seconds < 86_400) {
    return `${Math.floor(seconds / 3600)}h ago`;
  }

  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(time));
}

export function formatCoordinates(latitude: number, longitude: number) {
  return `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;
}

export function maskImei(imei: string) {
  return imei.length <= 4 ? imei : `•••• •••• ${imei.slice(-4)}`;
}
