"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  Gamepad2,
  Grid2X2,
  Search,
  MessageSquare,
  Home,
  ShieldCheck,
  ChevronRight,
  Sparkles,
} from "lucide-react";

const links = [
  { label: "Home", href: "/", Icon: Home },
  { label: "Games", href: "/games", Icon: Gamepad2 },
  { label: "Apps", href: "/apps", Icon: Grid2X2 },
  { label: "Search", href: "/search", Icon: Search },
  {
    label: "Developer requests",
    href: "/developer",
    Icon: MessageSquare,
  },
];

export default function StoreHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Keep the public drawer away from the separate admin and
  // app-detail interfaces.
  if (
    pathname.startsWith("/admin") ||
    pathname.startsWith("/api") ||
    pathname === "/app" ||
    pathname.startsWith("/app/")
  ) {
    return null;
  }

  return (
    <>
      <header className="store-header sticky top-0 z-50">
        <div className="mx-auto flex h-[72px] max-w-6xl items-center gap-3 px-4">
          <button
            type="button"
            aria-label="Open navigation menu"
            aria-expanded={open}
            onClick={() => setOpen(true)}
            className="store-icon-button"
          >
            <Menu size={22} />
          </button>

          <Link
            href="/"
            className="flex min-w-0 flex-1 items-center gap-3"
          >
            <span className="store-logo">
              <Gamepad2 size={25} />
            </span>

            <span className="min-w-0">
              <span className="block truncate text-lg font-extrabold tracking-tight text-white">
                JL <span className="text-cyan-300">PlayStore</span>
              </span>
              <span className="block text-[9px] font-semibold tracking-[0.22em] text-blue-200/70">
                DISCOVER. DOWNLOAD. ENJOY.
              </span>
            </span>
          </Link>

          <Link
            href="/search"
            aria-label="Search apps and games"
            className="store-icon-button"
          >
            <Search size={20} />
          </Link>
        </div>
      </header>

      {open && (
        <div className="fixed inset-0 z-[80]">
          <button
            type="button"
            aria-label="Close navigation menu"
            className="absolute inset-0 h-full w-full bg-[#020617]/75 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />

          <aside
            aria-label="Store navigation drawer"
            className="store-drawer absolute inset-y-0 left-0 flex w-[min(86vw,340px)] flex-col border-r border-blue-300/15"
          >
            <div className="flex items-center justify-between border-b border-white/10 p-5">
              <div className="flex items-center gap-3">
                <span className="store-logo">
                  <Gamepad2 size={25} />
                </span>
                <div>
                  <p className="font-bold text-white">
                    JL PlayStore
                  </p>
                  <p className="text-xs text-blue-200/70">
                    Your app discovery hub
                  </p>
                </div>
              </div>

              <button
                type="button"
                aria-label="Close navigation menu"
                onClick={() => setOpen(false)}
                className="store-icon-button"
              >
                <X size={21} />
              </button>
            </div>

            <div className="p-4">
              <div className="rounded-2xl border border-cyan-300/15 bg-gradient-to-br from-blue-500/20 to-violet-500/15 p-4">
                <Sparkles
                  size={22}
                  className="text-cyan-300"
                />
                <p className="mt-3 font-semibold text-white">
                  Discover something new
                </p>
                <p className="mt-1 text-xs leading-5 text-blue-100/70">
                  Explore apps and games in your personal store.
                </p>
              </div>
            </div>

            <nav className="flex-1 space-y-1 overflow-y-auto px-3 pb-4">
              <p className="px-3 pb-2 pt-1 text-[10px] font-bold uppercase tracking-[0.2em] text-blue-200/50">
                Explore
              </p>

              {links.map(({ label, href, Icon }) => {
                const active =
                  href === "/"
                    ? pathname === "/"
                    : pathname === href ||
                      pathname.startsWith(`${href}/`);

                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setOpen(false)}
                    aria-current={active ? "page" : undefined}
                    className={`flex items-center gap-3 rounded-xl px-3 py-3 transition ${
                      active
                        ? "border border-cyan-300/15 bg-cyan-300/10 text-cyan-200"
                        : "text-blue-100/75 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <Icon size={20} />
                    <span className="flex-1 text-sm font-medium">
                      {label}
                    </span>
                    <ChevronRight
                      size={16}
                      className="opacity-50"
                    />
                  </Link>
                );
              })}

              <div className="my-4 border-t border-white/10" />

              <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-blue-200/50">
                Management
              </p>

              <Link
                href="/admin"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 rounded-xl px-3 py-3 text-blue-100/75 transition hover:bg-white/5 hover:text-white"
              >
                <ShieldCheck size={20} />
                <span className="flex-1 text-sm font-medium">
                  Admin dashboard
                </span>
                <ChevronRight size={16} className="opacity-50" />
              </Link>
            </nav>

            <div className="border-t border-white/10 p-5">
              <p className="text-xs text-blue-200/50">
                JL PlayStore
              </p>
              <p className="mt-1 text-[11px] text-blue-200/35">
                Discover · Explore · Enjoy
              </p>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}