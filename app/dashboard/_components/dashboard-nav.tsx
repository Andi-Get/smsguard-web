"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ITEMS = [
  { href: "/dashboard", label: "Devices", hint: "Phones & tablets" },
  { href: "/dashboard/settings", label: "Settings", hint: "Account & profile" },
] as const;

export function DashboardNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Dashboard" className="flex gap-2 md:flex-col">
      {ITEMS.map((item) => {
        const active =
          item.href === "/dashboard"
            ? pathname === "/dashboard" ||
              pathname.startsWith("/dashboard/devices")
            : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={`flex-1 border-2 border-ink px-4 py-3 transition-shadow ${
              active
                ? "bg-brand-700 text-white shadow-brutal-sm"
                : "bg-white hover:bg-brand-50 hover:shadow-brutal-sm"
            }`}
          >
            <span className="block font-mono text-[11px] font-bold uppercase tracking-[0.16em]">
              {item.label}
            </span>
            <span
              className={`mt-0.5 hidden text-[11px] sm:block ${
                active ? "text-white/65" : "text-ink/45"
              }`}
            >
              {item.hint}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
