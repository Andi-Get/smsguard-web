import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/prisma/db";
import {
  asRecord,
  formatCoordinates,
  formatLastSeen,
  isDeviceOnline,
  readBoolean,
  readNumber,
  readString,
} from "@/lib/device-status";
import { requireUser } from "@/lib/session";
import { DeviceMap } from "../../_components/device-map";

export const instant = false;

type PageProps = { params: Promise<{ id: string }> };

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-t-2 border-ink/10 px-4 py-2 first:border-t-0">
      <dt className="shrink-0 font-mono text-[10px] uppercase tracking-[0.16em] text-ink/45">
        {label}
      </dt>
      <dd className="min-w-0 truncate text-right text-sm">{value}</dd>
    </div>
  );
}

export default async function DeviceDetailPage({ params }: PageProps) {
  const { id } = await params;
  const user = await requireUser();

  // Scoped to the owner, so another user's device id answers 404.
  const device = await db.orm.public.Device.where({
    id,
    userId: user.id,
  }).first();

  if (!device) {
    notFound();
  }

  const status = asRecord(device.status);
  const battery = asRecord(status?.["battery"]);
  const location = asRecord(status?.["location"]);
  const network = asRecord(status?.["network"]);

  const batteryLevel = readNumber(battery?.["level"]);
  const charging = readBoolean(battery?.["charging"]);
  const latitude = readNumber(location?.["latitude"]);
  const longitude = readNumber(location?.["longitude"]);
  const carrier = readString(network?.["carrier"]);
  const networkType = readString(network?.["type"]);

  const online = device.isActive && isDeviceOnline(device.lastSeenAt);
  const displayName = device.name ?? `${device.brand} ${device.model}`;
  const hasStatus = status !== null && Object.keys(status).length > 0;

  return (
    <>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <Link
            href="/dashboard"
            className="font-mono text-[11px] uppercase tracking-[0.16em] text-brand-700 hover:underline"
          >
            ← Devices
          </Link>
          <h1 className="mt-1.5 text-xl font-bold uppercase tracking-tight">
            {displayName}
          </h1>
          <p className="mt-0.5 text-sm text-ink/55">
            {[
              device.manufacturer,
              `${device.brand} ${device.model}`,
              device.platform,
              device.osVersion,
            ]
              .filter(Boolean)
              .join(" · ")}
          </p>
        </div>
        <span
          className={`shrink-0 border-2 border-ink px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-wider ${
            online ? "bg-brand-50 text-brand-900" : "bg-ink/5 text-ink/50"
          }`}
        >
          {online ? "Online" : "Offline"}
        </span>
      </div>

      {latitude !== null && longitude !== null ? (
        <DeviceMap latitude={latitude} longitude={longitude} />
      ) : null}

      <section className="mt-4 border-2 border-ink bg-white shadow-brutal-lg">
        <div className="border-b-2 border-ink px-4 py-2.5">
          <h2 className="font-mono text-[11px] font-bold uppercase tracking-[0.16em]">
            Device
          </h2>
        </div>
        <dl>
          <Row label="IMEI" value={device.imei} />
          <Row label="Platform" value={device.osVersion ? `${device.platform ?? "—"} ${device.osVersion}` : (device.platform ?? "—")} />
          <Row label="App version" value={device.appVersion ?? "—"} />
          <Row label="Serial" value={device.serialNumber ?? "—"} />
          <Row label="Last seen" value={formatLastSeen(device.lastSeenAt)} />
        </dl>
      </section>

      <section className="mt-4 border-2 border-ink bg-white shadow-brutal-lg">
        <div className="border-b-2 border-ink px-4 py-2.5">
          <h2 className="font-mono text-[11px] font-bold uppercase tracking-[0.16em]">
            Status
          </h2>
        </div>
        {hasStatus ? (
          <dl>
            <Row
              label="Battery"
              value={
                batteryLevel === null
                  ? "—"
                  : `${Math.round(batteryLevel)}%${charging ? " · charging" : ""}`
              }
            />
            <Row
              label="Location"
              value={
                latitude !== null && longitude !== null
                  ? formatCoordinates(latitude, longitude)
                  : "—"
              }
            />
            <Row label="Network" value={carrier ?? networkType ?? "—"} />
          </dl>
        ) : (
          <p className="px-4 py-4 text-sm text-ink/50">
            No status reported yet — open the SMSGuard app on the phone to
            send an update.
          </p>
        )}
      </section>
    </>
  );
}
