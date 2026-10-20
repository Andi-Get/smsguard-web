import { asRecord } from "./device-status";

export type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

export type DeviceSubmission = {
  name: string | null;
  brand: string;
  model: string;
  manufacturer: string | null;
  deviceType: string | null;
  serialNumber: string | null;
  imei: string;
  imei2: string | null;
  meid: string | null;
  imsi: string | null;
  iccid: string | null;
  phoneNumber: string | null;
  platform: string | null;
  osVersion: string | null;
  appVersion: string | null;
  status: JsonValue;
};

type ParseResult =
  | { ok: true; value: DeviceSubmission }
  | { ok: false; error: string };

const IMEI_PATTERN = /^\d{14,17}$/;

function optionalText(value: unknown, maxLength = 255) {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  return trimmed ? trimmed.slice(0, maxLength) : null;
}

function isJsonValue(value: unknown): value is JsonValue {
  if (
    value === null ||
    typeof value === "string" ||
    typeof value === "boolean"
  ) {
    return true;
  }

  if (typeof value === "number") {
    return Number.isFinite(value);
  }

  if (Array.isArray(value)) {
    return value.every(isJsonValue);
  }

  const record = asRecord(value);
  return record !== null && Object.values(record).every(isJsonValue);
}

export function parseDeviceSubmission(body: unknown): ParseResult {
  const record = asRecord(body);

  if (!record) {
    return { ok: false, error: "Expected a JSON object." };
  }

  const brand = optionalText(record["brand"], 120);
  const model = optionalText(record["model"], 120);
  const imei = optionalText(record["imei"], 32);

  if (!brand) {
    return { ok: false, error: "brand is required." };
  }

  if (!model) {
    return { ok: false, error: "model is required." };
  }

  if (!imei || !IMEI_PATTERN.test(imei)) {
    return {
      ok: false,
      error: "imei must be a 14–17 digit IMEI/IMEISV number.",
    };
  }

  const imei2 = optionalText(record["imei2"], 32);
  const meid = optionalText(record["meid"], 32);

  if (imei2 && !IMEI_PATTERN.test(imei2)) {
    return { ok: false, error: "imei2 must be a 14–17 digit number." };
  }

  if (meid && !/^[0-9A-Fa-f]{14}$/.test(meid)) {
    return { ok: false, error: "meid must be a 14 character hex value." };
  }

  const rawStatus = record["status"];

  if (rawStatus !== undefined && asRecord(rawStatus) === null) {
    return { ok: false, error: "status must be a JSON object." };
  }

  if (rawStatus !== undefined && !isJsonValue(rawStatus)) {
    return { ok: false, error: "status must contain only JSON values." };
  }

  if (rawStatus !== undefined && JSON.stringify(rawStatus).length > 64_000) {
    return { ok: false, error: "status is too large." };
  }

  return {
    ok: true,
    value: {
      name: optionalText(record["name"], 120),
      brand,
      model,
      manufacturer: optionalText(record["manufacturer"], 120),
      deviceType: optionalText(record["deviceType"], 40),
      serialNumber: optionalText(record["serialNumber"], 120),
      imei,
      imei2,
      meid,
      imsi: optionalText(record["imsi"], 32),
      iccid: optionalText(record["iccid"], 32),
      phoneNumber: optionalText(record["phoneNumber"], 32),
      platform: optionalText(record["platform"], 40),
      osVersion: optionalText(record["osVersion"], 80),
      appVersion: optionalText(record["appVersion"], 40),
      status: (rawStatus ?? {}) as JsonValue,
    },
  };
}
