"use client";

import Link from "next/link";
import { Download, Grid2X2, Star } from "lucide-react";

export type StoreApp = {
  slug: string;
  name: string;
  publisher: string;
  category: string;
  short: string;
  iconUrl: string;
  downloads: number;
  featured: boolean;
  createdAt: number;
  rating?: number | string;
};

export default function AppCard({ app }: { app: StoreApp }) {
  const rating = app.rating;
  const hasRating =
    rating !== undefined &&
    rating !== null &&
    String(rating).trim() !== "";

  return (
    <Link href={`/app/${app.slug}`} className="store-app-card group">
      <div className="flex items-start gap-3">
        {app.iconUrl ? (
          <img
            src={app.iconUrl}
            alt={`${app.name} icon`}
            className="store-app-icon"
            loading="lazy"
          />
        ) : (
          <div className="store-app-icon flex items-center justify-center bg-gradient-to-br from-blue-500 to-violet-600">
            <Grid2X2 size={27} className="text-white" />
          </div>
        )}

        <div className="min-w-0 flex-1 pt-1">
          <h3 className="truncate text-sm font-bold text-white transition group-hover:text-cyan-200">
            {app.name}
          </h3>

          <p className="mt-1 truncate text-xs text-blue-100/60">
            {app.publisher || "Independent developer"}
          </p>

          <p className="mt-2 inline-flex max-w-full rounded-full border border-blue-300/10 bg-blue-300/5 px-2 py-1 text-[10px] text-blue-100/70">
            <span className="truncate">{app.category || "Other"}</span>
          </p>
        </div>

        <span className="store-download-circle">
          <Download size={17} />
        </span>
      </div>

      {app.short && (
        <p className="mt-4 line-clamp-2 min-h-9 text-xs leading-5 text-blue-100/60">
          {app.short}
        </p>
      )}

      <div className="mt-4 flex items-center justify-between gap-2 border-t border-white/[0.07] pt-3">
        <span className="inline-flex min-w-0 items-center gap-1.5 text-[11px] text-blue-100/55">
          {hasRating ? (
            <>
              <Star
                size={13}
                className="shrink-0 fill-amber-300 text-amber-300"
              />
              <span>{String(rating)}</span>
            </>
          ) : (
            <>
              <Download size={13} className="shrink-0" />
              <span>{Number(app.downloads || 0).toLocaleString()} downloads</span>
            </>
          )}
        </span>

        <span className="shrink-0 text-[11px] font-semibold text-cyan-300">
          View details →
        </span>
      </div>
    </Link>
  );
}