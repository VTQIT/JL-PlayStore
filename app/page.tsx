"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Search,
  Download,
  Gamepad2,
  Grid2X2,
  ShieldCheck,
  RefreshCw,
  MessageSquare,
} from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { isGameCategory } from "@/lib/catalog";

type A = {
  slug: string;
  name: string;
  publisher: string;
  category: string;
  short: string;
  iconUrl: string;
  downloads: number;
  featured: boolean;
  createdAt: number;
};

function AppRow({ app }: { app: A }) {
  return (
    <Link
      href={`/app/${app.slug}`}
      className="glass flex min-w-0 items-center gap-3 p-3 transition hover:bg-white/10"
    >
      {app.iconUrl ? (
        <img
          src={app.iconUrl}
          alt={`${app.name} icon`}
          className="h-14 w-14 shrink-0 rounded-2xl bg-white/10 object-cover"
          loading="lazy"
        />
      ) : (
        <div className="h-14 w-14 shrink-0 rounded-2xl bg-white/10" />
      )}

      <div className="min-w-0 flex-1">
        <h3 className="truncate font-semibold">{app.name}</h3>

        <p className="truncate text-sm text-slate-300">
          {app.publisher || "Unknown developer"}
          {app.category ? ` · ${app.category}` : ""}
        </p>

        <p className="text-xs text-slate-400">
          {app.downloads || 0} downloads
        </p>

        {app.short && (
          <p className="mt-1 line-clamp-2 text-xs text-slate-400">
            {app.short}
          </p>
        )}
      </div>

      <Download
        size={19}
        className="shrink-0 text-cyan-300"
      />
    </Link>
  );
}

function Section({
  title,
  items,
}: {
  title: string;
  items: A[];
}) {
  if (!items.length) return null;

  return (
    <section className="mt-7">
      <h2 className="mb-3 text-lg font-semibold">{title}</h2>

      <div className="grid gap-3 md:grid-cols-2">
        {items.map((app) => (
          <AppRow key={app.slug} app={app} />
        ))}
      </div>
    </section>
  );
}

export default function HomePage() {
  const [apps, setApps] = useState<A[] | null>(null);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [filter, setFilter] = useState("All apps");
  const [loading, setLoading] = useState(false);

  async function loadApps() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/apps", {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Could not load the app catalog.");
      }

      const data: unknown = await response.json();

      if (!Array.isArray(data)) {
        throw new Error("The server returned an invalid catalog.");
      }

      setApps(data as A[]);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not load apps. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadApps();
  }, []);

  const categories = useMemo(
    () => [
      "All",
      ...Array.from(
        new Set((apps || []).map((app) => app.category).filter(Boolean))
      ).sort((a, b) => a.localeCompare(b)),
    ],
    [apps]
  );

  const filteredApps = useMemo(() => {
    const search = query.trim().toLowerCase();

    return (apps || []).filter((app) => {
      const isGame = isGameCategory(app.category);

      const matchesType =
        filter === "All apps" ||
        (filter === "Games" && isGame) ||
        (filter === "Apps" && !isGame);

      const matchesCategory =
        category === "All" || app.category === category;

      const searchableText = [
        app.name,
        app.publisher,
        app.category,
        app.short,
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        !search || searchableText.includes(search);

      return matchesType && matchesCategory && matchesSearch;
    });
  }, [apps, filter, category, query]);

  const featured = (apps || []).filter((app) => app.featured);

  const popular = [...(apps || [])]
    .sort(
      (a, b) => (b.downloads || 0) - (a.downloads || 0)
    )
    .filter((app) => (app.downloads || 0) > 0)
    .slice(0, 6);

  const recent = [...(apps || [])]
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, 6);

  const isSearching =
    query.trim().length > 0 ||
    category !== "All" ||
    filter !== "All apps";

  return (
    <main className="mx-auto min-h-screen max-w-4xl px-4 pb-28 pt-5">
      {/* Header */}
      <header className="flex items-center justify-between gap-3">
        <Link href="/" className="text-xl font-bold tracking-tight">
          JL <span className="text-cyan-300">PlayStore</span>
        </Link>

        <Link
          href="/admin"
          aria-label="Admin dashboard"
          title="Admin dashboard"
          className="rounded-xl border border-white/10 p-2 text-slate-400 transition hover:text-cyan-300"
        >
          <ShieldCheck size={21} />
        </Link>
      </header>

      {/* Hero */}
      <section className="glass mt-6 overflow-hidden bg-linear-to-br from-blue-500/30 to-violet-500/30 p-6 md:p-8">
        <p className="text-xs font-semibold tracking-widest text-cyan-200">
          YOUR APP DISCOVERY STORE
        </p>

        <h1 className="mt-3 text-3xl font-bold leading-tight md:text-4xl">
          Discover great apps and games.
        </h1>

        <p className="mt-3 max-w-xl text-sm text-slate-200 md:text-base">
          Find something new, explore popular downloads, and
          request the apps you want to see on JL PlayStore.
        </p>

        <Link
          href="/search"
          className="btn mt-5 inline-flex items-center gap-2"
        >
          <Search size={17} />
          Search catalog
        </Link>
      </section>

      {/* Main shortcuts */}
      <section className="mt-5 grid grid-cols-2 gap-3">
        <Link
          href="/games"
          className="glass flex items-center gap-3 p-4 transition hover:bg-white/10"
        >
          <Gamepad2 size={27} className="shrink-0 text-cyan-300" />
          <div className="min-w-0">
            <h2 className="font-semibold">Games</h2>
            <p className="text-xs text-slate-400">
              Discover games
            </p>
          </div>
        </Link>

        <Link
          href="/apps"
          className="glass flex items-center gap-3 p-4 transition hover:bg-white/10"
        >
          <Grid2X2 size={25} className="shrink-0 text-violet-300" />
          <div className="min-w-0">
            <h2 className="font-semibold">Apps</h2>
            <p className="text-xs text-slate-400">
              Browse applications
            </p>
          </div>
        </Link>
      </section>

      {/* Developer request shortcut */}
      <Link
        href="/developer"
        className="glass mt-3 flex items-center gap-3 p-4 transition hover:bg-white/10"
      >
        <MessageSquare
          size={23}
          className="shrink-0 text-cyan-300"
        />
        <div className="min-w-0 flex-1">
          <h2 className="font-semibold">Request an app or game</h2>
          <p className="text-sm text-slate-400">
            Suggest an addition or contact us about publishing.
          </p>
        </div>
      </Link>

      {/* Search */}
      <section className="mt-6">
        <label
          htmlFor="homepage-search"
          className="mb-2 block text-sm font-medium text-slate-300"
        >
          Find your next favorite
        </label>

        <div className="relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            id="homepage-search"
            type="search"
            aria-label="Search apps and games"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by name, developer, or category..."
            className="inp pl-10"
          />
        </div>
      </section>

      {/* Type filters */}
      <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
        {["All apps", "Apps", "Games"].map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => {
              setFilter(item);
              setCategory("All");
            }}
            className={`whitespace-nowrap rounded-full border border-white/15 px-4 py-2 text-sm transition ${
              filter === item
                ? "bg-cyan-400/20 text-cyan-200"
                : "bg-white/5 text-slate-300 hover:bg-white/10"
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      {/* Category filters */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setCategory(item)}
            className={`whitespace-nowrap rounded-full border border-white/10 px-3 py-1.5 text-xs transition ${
              category === item
                ? "bg-violet-400/25 text-violet-200"
                : "bg-white/5 text-slate-400 hover:bg-white/10"
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      {/* Loading */}
      {loading && !apps && (
        <div className="mt-6 grid gap-3 md:grid-cols-2">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="glass h-24 animate-pulse"
            />
          ))}
        </div>
      )}

      {/* Error and retry */}
      {error && (
        <div className="glass mt-6 p-5">
          <p className="text-sm text-red-300">{error}</p>

          <button
            type="button"
            onClick={() => void loadApps()}
            disabled={loading}
            className="btn mt-4 inline-flex items-center gap-2 disabled:opacity-50"
          >
            <RefreshCw size={16} />
            {loading ? "Retrying..." : "Try again"}
          </button>
        </div>
      )}

      {/* Empty catalog */}
      {apps && apps.length === 0 && !error && (
        <div className="glass mt-7 p-7 text-center">
          <Grid2X2
            size={35}
            className="mx-auto text-slate-400"
          />

          <h2 className="mt-3 font-semibold">
            No published apps yet
          </h2>

          <p className="mt-2 text-sm text-slate-400">
            Add and publish your first app through the admin
            dashboard to see it here.
          </p>

          <Link href="/admin" className="btn mt-4 inline-flex">
            Open Admin
          </Link>
        </div>
      )}

      {/* Search/filter results */}
      {apps && apps.length > 0 && isSearching && (
        <section className="mt-6">
          <h2 className="mb-3 font-semibold">
            Search results ({filteredApps.length})
          </h2>

          {filteredApps.length > 0 ? (
            <div className="grid gap-3 md:grid-cols-2">
              {filteredApps.map((app) => (
                <AppRow key={app.slug} app={app} />
              ))}
            </div>
          ) : (
            <div className="glass p-6 text-center">
              <p className="font-semibold">Nothing found</p>
              <p className="mt-2 text-sm text-slate-400">
                Try another search term or category.
              </p>
            </div>
          )}
        </section>
      )}

      {/* Homepage sections */}
      {apps && apps.length > 0 && !isSearching && (
        <>
          <Section title="Featured" items={featured} />
          <Section title="Most downloaded" items={popular} />
          <Section title="Recently added" items={recent} />

          {!featured.length &&
            !popular.length &&
            !recent.length && (
              <div className="glass mt-6 p-6 text-center text-slate-400">
                No published apps are available to display.
              </div>
            )}
        </>
      )}

      {/* Public bottom navigation */}
      <BottomNav />
    </main>
  );
}