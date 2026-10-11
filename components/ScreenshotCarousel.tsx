
"use client";

import { useState } from "react";

type Props = {
  screenshots: string[];
  admin?: boolean;
};

export default function ScreenshotCarousel({
  screenshots,
  admin = false,
}: Props) {
  const images = screenshots
    .filter((url) => /^https:\/\//i.test(url))
    .slice(0, 5);

  const [index, setIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  if (!images.length) {
    return admin ? (
      <p className="mt-3 text-sm text-slate-400">
        Add an image URL to preview your screenshots here.
      </p>
    ) : null;
  }

  const move = (step: number) => {
    setIndex((current) => (current + step + images.length) % images.length);
  };

  return (
    <section className="mt-4 w-full" aria-label="App screenshots">
      {admin && (
        <p className="mb-2 text-sm text-slate-300">
          Landscape preview · {index + 1} of {images.length}
        </p>
      )}

      <div
        className="relative overflow-hidden rounded-2xl bg-slate-900"
        onTouchStart={(event) =>
          setTouchStart(event.touches[0].clientX)
        }
        onTouchEnd={(event) => {
          if (touchStart === null) return;

          const difference =
            event.changedTouches[0].clientX - touchStart;

          if (Math.abs(difference) > 40) {
            move(difference < 0 ? 1 : -1);
          }

          setTouchStart(null);
        }}
      >
        <img
          key={images[index]}
          src={images[index]}
          alt={`App screenshot ${index + 1}`}
          className="block aspect-video w-full object-contain"
          loading="lazy"
        />

        {images.length > 1 && (
          <>
            <button
              type="button"
              title="Previous screenshot"
              aria-label="Previous screenshot"
              onClick={() => move(-1)}
              className="absolute left-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/70 text-2xl text-white hover:bg-black"
            >
              ‹
            </button>

            <button
              type="button"
              title="Next screenshot"
              aria-label="Next screenshot"
              onClick={() => move(1)}
              className="absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/70 text-2xl text-white hover:bg-black"
            >
              ›
            </button>
          </>
        )}
      </div>

      <div className="mt-3 flex items-center justify-center gap-2">
        {images.map((url, i) => (
          <button
            key={`${url}-${i}`}
            type="button"
            aria-label={`Show screenshot ${i + 1}`}
            onClick={() => setIndex(i)}
            className={`h-2.5 rounded-full ${
              i === index ? "w-7 bg-cyan-400" : "w-2.5 bg-slate-500"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
