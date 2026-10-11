"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Gamepad2,
  Grid2X2,
  Search,
  MessageSquare,
} from "lucide-react";

const items = [
  { label: "Games", href: "/games", Icon: Gamepad2 },
  { label: "Apps", href: "/apps", Icon: Grid2X2 },
  { label: "Search", href: "/search", Icon: Search },
  { label: "Developer", href: "/developer", Icon: MessageSquare },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Main navigation"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-[#070d24]/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl"
    >
      <div className="mx-auto grid h-[68px] w-full max-w-xl grid-cols-4 px-1">
        {items.map(({ label, href, Icon }) => {
          const active =
            pathname === href ||
            (href === "/apps" && pathname === "/");

          return (
            <Link
              key={href}
              href={href}
              aria-label={label}
              aria-current={active ? "page" : undefined}
              className={`flex min-w-0 flex-col items-center justify-center gap-1 rounded-xl px-1 transition-colors duration-200 ${
                active
                  ? "text-cyan-300"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <span
                className={`flex h-8 w-12 shrink-0 items-center justify-center rounded-full ${
                  active ? "bg-cyan-300/10" : ""
                }`}
              >
                <Icon
                  className="h-[22px] w-[22px] shrink-0"
                  strokeWidth={active ? 2.5 : 1.8}
                  aria-hidden="true"
                />
              </span>

              <span
                className={`max-w-full truncate text-[11px] leading-4 ${
                  active ? "font-semibold" : "font-medium"
                }`}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}