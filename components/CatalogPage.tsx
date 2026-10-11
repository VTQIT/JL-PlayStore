"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Search, Download } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { isGameCategory } from "@/lib/catalog";

type AppItem = {
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

type Mode = "apps" | "games" | "search";

export default function CatalogPage({
  mode,
}: {
  mode: Mode;
}) {
  const [apps, setApps] = useState<AppItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");

  useEffect(() => {
    let cancelled = false;

    async function loadApps() {
      try {
        const response = await fetch("/api/apps");

        if (!response.ok) {
          throw new Error("Unable to load apps");
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
          throw new Error("Invalid catalog response");
        }

        if (!cancelled) {
          setApps(data);
          setError(false);
        }
      } catch {
        if (!cancelled) {
          setError(true);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadApps();

    return () => {
      cancelled = true;
    };
  }, []);

  const catalog = useMemo(() => {
    if (mode === "games") {
      return apps.filter((app) => isGameCategory(app.category));
    }

    if (mode === "apps") {
      return apps.filter((app) => !isGameCategory(app.category));
    }

    return apps;
  }, [apps, mode]);

  const categories = useMemo(
    () => [
      "All",
      ...Array.from(
        new Set(catalog.map((app) => app.category).filter(Boolean))
      ).sort((a, b) => a.localeCompare(b)),
    ],
    [catalog]
  );

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();

    return catalog.filter((app) => {
      const matchesCategory =
        category === "All" || app.category === category;

      const searchable = [
        app.name,
        app.publisher,
        app.category,
        app.short,
      ]
        .join(" ")
        .toLowerCase();

      return matchesCategory && (!q || searchable.includes(q));
    });
  }, [catalog, category, query]);

  const title =
    mode === "games"
      ? "Games"
      : mode === "apps"
        ? "Apps"
        : "Search";

  return (
    <main className="mx-auto min-h-screen max-w-4xl px-4 pb-28 pt-5">
      <header className="mb-5">
        <Link href="/" className="text-sm text-cyan-300">
          JL PlayStore
        </Link>

        <h1 className="mt-2 text-3xl font-bold">{title}</h1>

        <p className="mt-1 text-sm text-slate-300">
          {mode === "games"
            ? "Discover games to play."
            : mode === "apps"
              ? "Explore apps for your device."
              : "Find apps and games by name, developer, or category."}
        </p>
      </header>

      <div className="relative mb-4">
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <input
          type="search"
          aria-label="Search the catalog"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search apps, games, developers..."
          className="inp pl-10"
        />
      </div>

      <div className="mb-5 flex gap-2 overflow-x-auto pb-2">
        {categories.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setCategory(item)}
            className={`whitespace-nowrap rounded-full border border-white/15 px-4 py-2 text-sm ${
              category === item
                ? "bg-cyan-400/20 text-cyan-200"
                : "bg-white/5 text-slate-300"
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      {loading && (
        <div className="grid gap-3 md:grid-cols-2">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="glass h-24 animate-pulse"
            />
          ))}
        </div>
      )}

      {error && !loading && (
        <div className="glass p-5 text-red-300">
          Unable to load the catalog. Please refresh and try again.
        </div>
      )}

      {!loading && !error && results.length === 0 && (
        <div className="glass p-8 text-center">
          <h2 className="font-semibold">No results found</h2>
          <p className="mt-2 text-sm text-slate-400">
            Try another search term or category.
          </p>
        </div>
      )}

      {!loading && !error && results.length > 0 && (
        <>
          <p className="mb-3 text-sm text-slate-400">
            {results.length} {results.length === 1 ? "result" : "results"}
          </p>

          <div className="grid gap-3 md:grid-cols-2">
            {results.map((app) => (
              <Link
                key={app.slug}
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
                  <h2 className="truncate font-semibold">
                    {app.name}
                  </h2>

                  <p className="truncate text-sm text-slate-300">
                    {app.publisher || "Unknown developer"}
                  </p>

                  <p className="truncate text-xs text-slate-400">
                    {app.category || "Other"} · {app.downloads || 0} downloads
                  </p>

                  {app.short && (
                    <p className="mt-1 line-clamp-2 text-xs text-slate-400">
                      {app.short}
                    </p>
                  )}
                </div>

                <Download
                  size={18}
                  className="shrink-0 text-cyan-300"
                />
              </Link>
            ))}
          </div>
        </>
      )}

      <BottomNav />
    </main>
  );
}