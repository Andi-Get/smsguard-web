import { db } from "@/prisma/db";
import { isDeviceOnline } from "@/lib/device-status";
import { requireUser } from "@/lib/session";
import { AddDeviceDialog } from "./_components/add-device-dialog";
import { DeviceCard } from "./_components/device-card";

export const instant = false;

function Summary({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="border-2 border-ink bg-white px-4 py-3 shadow-brutal-sm">
      <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-ink/40">
        {label}
      </p>
      <p className="mt-1 text-xl font-bold">{value}</p>
    </div>
  );
}

export default async function DashboardPage() {
  const user = await requireUser();
  const devices = await db.orm.public.Device.where({ userId: user.id })
    .orderBy((device) => device.createdAt.desc())
    .all();

  const online = devices.filter(
    (device) => device.isActive && isDeviceOnline(device.lastSeenAt),
  ).length;

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-brand-700">
            Your fleet
          </p>
          <h1 className="mt-1 text-2xl font-bold uppercase tracking-tight">
            Devices
          </h1>
          <p className="mt-1 text-sm text-ink/55">
            Pair a phone, then manage its location and status from the web.
          </p>
        </div>
        <AddDeviceDialog />
      </div>

      <div className="mt-6 grid grid-cols-3 gap-2 sm:gap-3">
        <Summary label="Devices" value={devices.length} />
        <Summary label="Online" value={online} />
        <Summary label="Offline" value={devices.length - online} />
      </div>

      {devices.length === 0 ? (
        <section className="mt-6 border-2 border-dashed border-ink/30 bg-white/70 px-6 py-12 text-center">
          <span className="mx-auto grid size-14 place-items-center border-2 border-ink bg-brand-50">
            <svg viewBox="0 0 24 24" fill="none" className="size-6 text-brand-700">
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
          <h2 className="mt-4 text-base font-bold">No devices yet</h2>
          <p className="mx-auto mt-1 max-w-sm text-sm leading-6 text-ink/55">
            Generate a secure pairing code, scan it with the SMSGuard mobile
            app, and the phone will appear here.
          </p>
          <div className="mt-5 flex justify-center">
            <AddDeviceDialog />
          </div>
        </section>
      ) : (
        <section className="mt-6 grid gap-4 sm:grid-cols-2">
          {devices.map((device) => (
            <DeviceCard key={device.id} device={device} />
          ))}
        </section>
      )}
    </>
  );
}
