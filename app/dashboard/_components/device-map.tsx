import { formatCoordinates } from "@/lib/device-status";

/**
 * Small keyless map (OpenStreetMap embed) for the device's last reported
 * position. The whole card links out to a full map for further detail.
 */
export function DeviceMap({
  latitude,
  longitude,
}: {
  latitude: number;
  longitude: number;
}) {
  return (
    <a
      href={`https://maps.google.com/?q=${latitude},${longitude}`}
      target="_blank"
      rel="noreferrer"
      className="group mt-4 block border-2 border-ink bg-white shadow-brutal-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-700"
    >
      <iframe
        title="Approximate device location"
        src={`https://www.openstreetmap.org/export/embed.html?bbox=${longitude - 0.002},${latitude - 0.002},${longitude + 0.002},${latitude + 0.002}&layer=mapnik&marker=${latitude},${longitude}`}
        className="h-56 w-full border-0"
        loading="lazy"
      />
      <span className="flex items-center justify-between gap-3 border-t-2 border-ink px-4 py-2 font-mono text-[10px] uppercase tracking-wider text-ink/40">
        <span>{formatCoordinates(latitude, longitude)} · approximate</span>
        <span className="font-bold text-brand-700 group-hover:underline">
          Open in maps ↗
        </span>
      </span>
    </a>
  );
}
