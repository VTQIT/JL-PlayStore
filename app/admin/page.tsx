
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ScreenshotCarousel from "@/components/ScreenshotCarousel";

const empty = {
  slug: "",
  name: "",
  publisher: "",
  category: "",
  version: "",
  short: "",
  description: "",
  changelog: "",
  minAndroid: "",
  sizeMB: "",
  iconUrl: "",
  apkUrl: "",
  screenshots: "",
  featured: false,
  published: true,
};

type AppItem = {
  slug: string;
  name: string;
  publisher: string;
  category: string;
  version: string;
  short: string;
  description: string;
  changelog: string;
  minAndroid: string;
  sizeMB: string;
  iconUrl: string;
  apkUrl: string;
  screenshots: string[];
  featured: boolean;
  published: boolean;
  downloads?: number;
};

export default function Admin() {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [pin, setPin] = useState("");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);
  const [apps, setApps] = useState<AppItem[]>([]);
  const [f, setF] = useState<any>(empty);

  const load = async () => {
    try {
      const response = await fetch("/api/admin/apps", {
        cache: "no-store",
      });

      if (response.ok) {
        setApps(await response.json());
        setAuthed(true);
      } else {
        setAuthed(false);
      }
    } catch {
      setMsg("Unable to connect. Check your internet connection.");
      setAuthed(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const login = async () => {
    setBusy(true);
    setMsg("");

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin }),
      });

      const result = await response.json();

      if (response.ok) {
        await load();
      } else {
        setMsg(result.error || "Login failed.");
      }
    } catch {
      setMsg("Unable to connect to the server.");
    } finally {
      setBusy(false);
    }
  };

  const save = async () => {
    setBusy(true);
    setMsg("");

    const screenshots = String(f.screenshots || "")
      .split("\n")
      .map((s: string) => s.trim())
      .filter(Boolean)
      .slice(0, 5);

    try {
      const response = await fetch("/api/admin/apps", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...f, screenshots }),
      });

      const result = await response.json();

      if (!response.ok) {
        setMsg(result.error || "Unable to save app.");
        return;
      }

      setMsg("App saved successfully.");
      setF({ ...empty });
      await load();
    } catch {
      setMsg("Unable to connect to the server.");
    } finally {
      setBusy(false);
    }
  };

  const del = async (slug: string) => {
    if (
      !confirm(
        `Remove ${slug} from the store? The GitHub release will not be deleted.`
      )
    ) {
      return;
    }

    try {
      const response = await fetch(
        `/api/admin/apps?slug=${encodeURIComponent(slug)}`,
        { method: "DELETE" }
      );

      if (!response.ok) {
        setMsg("Unable to delete app.");
        return;
      }

      setMsg(`${slug} removed from the store.`);
      await load();
    } catch {
      setMsg("Unable to connect to the server.");
    }
  };

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    setApps([]);
    setAuthed(false);
    setPin("");
    setMsg("");
  };

  const I = (key: string, label: string, textarea = false) => (
    <label className="mt-3 block text-sm" key={key}>
      <span className="mb-1 block">{label}</span>

      {textarea ? (
        <textarea
          className="inp"
          rows={3}
          value={f[key] ?? ""}
          onChange={(e) =>
            setF({ ...f, [key]: e.target.value })
          }
        />
      ) : (
        <input
          className="inp"
          value={f[key] ?? ""}
          onChange={(e) =>
            setF({ ...f, [key]: e.target.value })
          }
        />
      )}
    </label>
  );

  const IconButton = ({
    icon,
    label,
    onClick,
    danger = false,
  }: {
    icon: string;
    label: string;
    onClick: () => void;
    danger?: boolean;
  }) => (
    <button
      type="button"
      onClick={onClick}
      title={label}
      aria-label={label}
      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 transition hover:bg-white/10 ${
        danger ? "text-red-300" : "text-cyan-300"
      }`}
    >
      <span aria-hidden="true" className="text-xl">
        {icon}
      </span>
    </button>
  );

  if (authed === null) {
    return (
      <main className="p-8 text-center">
        <p>Loading admin dashboard…</p>
      </main>
    );
  }

  if (!authed) {
    return (
      <main className="flex min-h-screen flex-col px-4 pb-24">
        <section
          id="login"
          className="glass mx-auto mt-24 w-full max-w-sm p-6 text-center"
        >
          <div className="mb-3 text-5xl" aria-hidden="true">
            ◈
          </div>

          <h1 className="text-2xl font-bold">JL PlayStore</h1>
          <p className="mb-5 mt-1 text-sm text-slate-300">
            Administrator sign in
          </p>

          <label className="block text-left text-sm" htmlFor="admin-pin">
            Admin PIN
          </label>

          <input
            id="admin-pin"
            aria-label="Admin PIN"
            type="password"
            inputMode="numeric"
            autoComplete="current-password"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !busy) void login();
            }}
            className="inp mt-2 text-center tracking-widest"
            placeholder="Enter your PIN"
          />

          <button
            type="button"
            disabled={busy || !pin}
            onClick={() => void login()}
            className="btn mt-4 w-full disabled:opacity-50"
          >
            {busy ? "Signing in…" : "Sign in"}
          </button>

          {msg && (
            <p role="alert" className="mt-3 text-sm text-red-300">
              {msg}
            </p>
          )}

          <Link href="/" className="mt-5 inline-block text-sm text-cyan-300">
            ← Back to store
          </Link>
        </section>

        <nav
          aria-label="Login navigation"
          className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-2 border-t border-white/10 bg-slate-950/95 p-2 backdrop-blur-xl"
        >
          <Link
            href="/"
            className="flex flex-col items-center gap-1 rounded-xl py-2 text-slate-300 hover:bg-white/5 hover:text-cyan-300"
          >
            <span className="text-2xl" aria-hidden="true">⌂</span>
            <span className="text-xs">Store</span>
          </Link>

          <a
            href="#login"
            className="flex flex-col items-center gap-1 rounded-xl py-2 text-cyan-300"
          >
            <span className="text-2xl" aria-hidden="true">♙</span>
            <span className="text-xs">Admin</span>
          </a>
        </nav>
      </main>
    );
  }

  const screenshotText = Array.isArray(f.screenshots)
    ? f.screenshots.join("\n")
    : String(f.screenshots || "");

  const totalDownloads = apps.reduce(
    (sum, app) => sum + (app.downloads || 0),
    0
  );

  return (
    <main
      id="dashboard"
      className="mx-auto max-w-3xl px-4 pb-28 pt-5"
    >
      {/* Header and account actions */}
      <header
        id="settings"
        className="flex items-center justify-between gap-3"
      >
        <div>
          <p className="text-xs uppercase tracking-widest text-cyan-300">
            JL PlayStore
          </p>
          <h1 className="text-2xl font-bold">Dashboard</h1>
        </div>

        <IconButton
          icon="⇥"
          label="Logout"
          onClick={() => void logout()}
        />
      </header>

      {/* Statistics */}
      <section
        aria-label="Store statistics"
        className="mt-5 grid grid-cols-2 gap-3"
      >
        <div className="glass p-4">
          <span className="text-sm text-slate-300">Total apps</span>
          <p className="mt-1 text-3xl font-bold">{apps.length}</p>
          <span className="text-xs text-slate-400">
            Published and drafts
          </span>
        </div>

        <div className="glass p-4">
          <span className="text-sm text-slate-300">Total downloads</span>
          <p className="mt-1 text-3xl font-bold">{totalDownloads}</p>
          <span className="text-xs text-slate-400">
            Recorded downloads
          </span>
        </div>
      </section>

      {/* Add or edit app */}
      <section id="editor" className="glass mt-5 scroll-mt-4 p-4">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-lg font-semibold">
            {f.slug ? "Edit app" : "Add or update app"}
          </h2>

          <IconButton
            icon="＋"
            label="Clear form and add new app"
            onClick={() => {
              setF({ ...empty });
              setMsg("");
            }}
          />
        </div>

        <p className="mt-2 text-xs text-slate-300">
          Upload the APK to a GitHub Release first. Paste its direct
          release download URL below. Using an existing slug updates
          that app.
        </p>

        {I("name", "App name")}
        {I("slug", "Slug (a-z, 0-9, -)")}
        {I("publisher", "Publisher")}
        {I("category", "Category")}
        {I("version", "Version")}
        {I("short", "Short description")}
        {I("description", "Full description", true)}
        {I("changelog", "Changelog", true)}
        {I("minAndroid", "Minimum Android version")}
        {I("sizeMB", "APK size (MB)")}
        {I("apkUrl", "APK link (GitHub Releases download URL)")}
        {I("iconUrl", "Icon image HTTPS URL")}
        {I(
          "screenshots",
          "Landscape screenshot HTTPS URLs (maximum 5, one per line)",
          true
        )}

        <ScreenshotCarousel
          admin
          screenshots={screenshotText
            .split("\n")
            .map((s: string) => s.trim())
            .filter(Boolean)
            .slice(0, 5)}
        />

        <label className="mt-4 flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={!!f.featured}
            onChange={(e) =>
              setF({ ...f, featured: e.target.checked })
            }
          />
          Featured app
        </label>

        <label className="mt-2 flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={!!f.published}
            onChange={(e) =>
              setF({ ...f, published: e.target.checked })
            }
          />
          Published (uncheck to save as draft)
        </label>

        <button
          type="button"
          disabled={busy}
          onClick={() => void save()}
          className="btn mt-4 w-full disabled:opacity-50"
        >
          {busy ? "Please wait…" : "✓ Save app"}
        </button>

        {f.slug && (
          <button
            type="button"
            onClick={() => {
              setF({ ...empty });
              setMsg("");
            }}
            className="mt-3 w-full rounded-full border border-white/15 p-2 text-sm hover:bg-white/5"
          >
            Cancel editing
          </button>
        )}

        {msg && (
          <p role="status" className="mt-3 text-sm text-cyan-200">
            {msg}
          </p>
        )}
      </section>

      {/* Manage existing apps */}
      <section id="apps" className="mt-6 scroll-mt-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Manage apps</h2>
          <span className="text-xs text-slate-400">
            {apps.length} total
          </span>
        </div>

        {!apps.length && (
          <div className="glass p-5 text-center text-sm text-slate-300">
            No apps yet. Use Add App to publish your first app.
          </div>
        )}

        {apps.map((app) => (
          <article
            key={app.slug}
            className="glass mb-3 flex items-center gap-3 p-3"
          >
            {app.iconUrl ? (
              <img
                src={app.iconUrl}
                alt=""
                className="h-14 w-14 shrink-0 rounded-xl bg-white/10 object-cover"
              />
            ) : (
              <div
                aria-hidden="true"
                className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-white/10 text-2xl"
              >
                ◈
              </div>
            )}

            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold">{app.name}</p>
              <p className="text-xs text-slate-300">
                v{app.version} · {app.published ? "Published" : "Draft"}
              </p>
              <p className="text-xs text-slate-400">
                {app.downloads || 0} downloads
              </p>
            </div>

            <div className="flex gap-1">
              <IconButton
                icon="✎"
                label={`Edit ${app.name}`}
                onClick={() => {
                  setF({
                    ...app,
                    screenshots: (app.screenshots || [])
                      .slice(0, 5)
                      .join("\n"),
                  });
                  setMsg("");
                  document.getElementById("editor")?.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  });
                }}
              />

              <IconButton
                icon="⌫"
                label={`Delete ${app.name}`}
                danger
                onClick={() => void del(app.slug)}
              />
            </div>
          </article>
        ))}
      </section>

      {/* Google Play-style bottom navigation */}
      <nav
        aria-label="Admin navigation"
        className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-4 border-t border-white/10 bg-slate-950/95 p-2 backdrop-blur-xl"
      >
        {[
          { href: "#dashboard", icon: "⌂", label: "Home" },
          { href: "#apps", icon: "▦", label: "Apps" },
          { href: "#editor", icon: "＋", label: "Add App" },
          { href: "#settings", icon: "⚙", label: "Settings" },
        ].map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="flex flex-col items-center justify-center gap-1 rounded-xl py-2 text-slate-300 transition hover:bg-white/5 hover:text-cyan-300"
          >
            <span className="text-2xl leading-none" aria-hidden="true">
              {item.icon}
            </span>
            <span className="text-xs">{item.label}</span>
          </a>
        ))}
      </nav>
    </main>
  );
}
