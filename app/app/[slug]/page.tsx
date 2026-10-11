
import { getApp } from "@/lib/db";
import Link from "next/link";
import ScreenshotCarousel from "@/components/ScreenshotCarousel";

export const dynamic = "force-dynamic";

export default async function D(
  props: {
    params: Promise<{ slug: string }>;
  }
) {
  const params = await props.params;
  const a = await getApp(params.slug).catch(() => null);

  if (!a || !a.published) {
    return (
      <main className="p-8 text-center">
        App not found.{" "}
        <Link href="/" className="underline">
          Back to store
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-2xl p-4">
      <Link href="/" className="text-cyan-300">
        Back
      </Link>

      <div className="mt-4 flex gap-4">
        <img
          src={a.iconUrl}
          alt={`${a.name} icon`}
          className="h-24 w-24 rounded-3xl bg-white/10 object-cover"
        />

        <div>
          <h1 className="text-2xl font-bold">{a.name}</h1>
          <div className="text-cyan-300">{a.publisher}</div>
          <div className="text-sm text-slate-300">
            {a.category} · v{a.version}
          </div>
        </div>
      </div>

      <div className="glass mt-4 grid grid-cols-3 p-4 text-center">
        <div>
          <b>{a.sizeMB ? `${a.sizeMB} MB` : "-"}</b>
          <div className="text-xs">Size</div>
        </div>
        <div>
          <b>{a.downloads ?? 0}</b>
          <div className="text-xs">Downloads</div>
        </div>
        <div>
          <b>{a.minAndroid || "-"}</b>
          <div className="text-xs">Min Android</div>
        </div>
      </div>

      <a
        href={`/api/download/${a.slug}`}
        className="btn mt-4 block text-center"
      >
        Download APK
      </a>

      <p className="mt-2 text-xs text-slate-400">
        Android may ask you to allow installs from your browser. Allow it
        for this install only, then open the downloaded file.
      </p>

      <ScreenshotCarousel screenshots={a.screenshots || []} />

      <h2 className="mt-6 font-semibold">About this app</h2>
      <p className="whitespace-pre-wrap text-slate-200">
        {a.description || a.short}
      </p>

      {a.changelog && (
        <>
          <h2 className="mt-6 font-semibold">What's new</h2>
          <p className="whitespace-pre-wrap text-slate-200">
            {a.changelog}
          </p>
        </>
      )}
    </main>
  );
}
