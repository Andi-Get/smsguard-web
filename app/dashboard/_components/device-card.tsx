import {
  asRecord,
  formatCoordinates,
  formatLastSeen,
  isDeviceOnline,
  maskImei,
  readBoolean,
  readNumber,
  readString,
} from "@/lib/device-status";

export type DeviceCardDevice = {
  id: string;
  name: string | null;
  brand: string;
  model: string;
  manufacturer: string | null;
  platform: string | null;
  osVersion: string | null;
  imei: string;
  status: unknown;
  lastSeenAt: string | null;
  isActive: boolean;
};

function Stat({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="border-t-2 border-ink/10 pt-2 first:border-t-0 first:pt-0 sm:border-t-0 sm:border-l-2 sm:border-ink/10 sm:pt-0 sm:pl-3 sm:first:border-l-0 sm:first:pl-0">
      <dt className="font-mono text-[9px] uppercase tracking-[0.16em] text-ink/40">
        {label}
      </dt>
      <dd className="mt-0.5 truncate text-xs font-medium">{value}</dd>
    </div>
  );
}

export function DeviceCard({ device }: { device: DeviceCardDevice }) {
  const status = asRecord(device.status);
  const battery = asRecord(status?.["battery"]);
  const location = asRecord(status?.["location"]);
  const network = asRecord(status?.["network"]);
  const connectedDevice = asRecord(status?.["connectedDevice"]);

  const batteryLevel = readNumber(battery?.["level"]);
  const charging = readBoolean(battery?.["charging"]);
  const latitude = readNumber(location?.["latitude"]);
  const longitude = readNumber(location?.["longitude"]);
  const carrier = readString(network?.["carrier"]);
  const networkType = readString(network?.["type"]);
  const connectedName = readString(connectedDevice?.["name"]);
  const online = device.isActive && isDeviceOnline(device.lastSeenAt);
  const displayName = device.name ?? `${device.brand} ${device.model}`;

  return (
    <article className="border-2 border-ink bg-white shadow-brutal transition-transform hover:-translate-y-0.5 hover:shadow-brutal-lg">
      <div className="flex items-start gap-3 border-b-2 border-ink p-4">
        <span className="grid size-10 shrink-0 place-items-center border-2 border-ink bg-brand-50">
          <svg viewBox="0 0 24 24" fill="none" className="size-5 text-brand-700">
            <rect
              x="6.5"
              y="2.5"
              width="11"
              height="19"
              rx="1.5"
              stroke="currentColor"
              strokeWidth="1.8"
            />
            <path
              d="M10 5.5h4M11 18.5h2"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h2 className="truncate text-sm font-bold">{displayName}</h2>
            <span
              className={`shrink-0 border border-ink px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider ${
                online ? "bg-brand-50 text-brand-900" : "bg-ink/5 text-ink/50"
              }`}
            >
              {online ? "Online" : "Offline"}
            </span>
          </div>
          <p className="mt-0.5 truncate text-[11px] text-ink/50">
            {[device.manufacturer, device.platform, device.osVersion]
              .filter(Boolean)
              .join(" · ") || `${device.brand} ${device.model}`}
          </p>
        </div>
      </div>

      <dl className="grid grid-cols-2 gap-2 px-4 py-3 sm:grid-cols-4">
        <Stat
          label="Battery"
          value={
            batteryLevel === null
              ? "—"
              : `${Math.round(batteryLevel)}%${charging ? " ⚡" : ""}`
          }
        />
        <Stat
          label="Network"
          value={carrier ?? networkType ?? "—"}
        />
        <Stat
          label="Location"
          value={
            latitude !== null && longitude !== null
              ? formatCoordinates(latitude, longitude)
              : "—"
          }
        />
        <Stat label="Connected" value={connectedName ?? "—"} />
      </dl>

      <div className="flex items-center justify-between gap-3 border-t-2 border-ink/10 px-4 py-2.5 font-mono text-[10px] uppercase tracking-wider text-ink/40">
        <span>IMEI {maskImei(device.imei)}</span>
        <span>{formatLastSeen(device.lastSeenAt)}</span>
      </div>
    </article>
  );
}
