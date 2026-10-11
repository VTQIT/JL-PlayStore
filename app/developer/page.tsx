"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Send } from "lucide-react";
import BottomNav from "@/components/BottomNav";

export default function DeveloperPage() {
  const [form, setForm] = useState({
    requesterName: "",
    contact: "",
    itemName: "",
    requestType: "App",
    itemUrl: "",
    message: "",
    website: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function update(
    field: keyof typeof form,
    value: string
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/developer-requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.error || "Your request could not be submitted."
        );
      }

      setSubmitted(true);
      setForm({
        requesterName: "",
        contact: "",
        itemName: "",
        requestType: "App",
        itemUrl: "",
        message: "",
        website: "",
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto min-h-screen max-w-2xl px-4 pb-28 pt-5">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm text-cyan-300"
      >
        <ArrowLeft size={16} />
        JL PlayStore
      </Link>

      <h1 className="mt-5 text-3xl font-bold">
        Developer & App Requests
      </h1>

      <p className="mt-2 text-slate-300">
        Request an app or game, suggest an addition, or contact
        us about publishing your project on JL PlayStore.
      </p>

      {submitted ? (
        <section className="glass mt-6 p-6">
          <CheckCircle2
            size={38}
            className="text-cyan-300"
          />

          <h2 className="mt-3 text-xl font-semibold">
            Request submitted
          </h2>

          <p className="mt-2 text-sm text-slate-300">
            Thank you! Your request has been recorded for review.
            Submission does not guarantee that the app or game
            will be published.
          </p>

          <button
            type="button"
            onClick={() => setSubmitted(false)}
            className="btn mt-5"
          >
            Submit another request
          </button>
        </section>
      ) : (
        <form
          onSubmit={submit}
          className="glass mt-6 space-y-4 p-5"
        >
          <div>
            <label className="mb-1 block text-sm">
              Your name
            </label>
            <input
              className="inp"
              value={form.requesterName}
              onChange={(e) =>
                update("requesterName", e.target.value)
              }
              maxLength={100}
              placeholder="Your name"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm">
              Contact information
            </label>
            <input
              className="inp"
              value={form.contact}
              onChange={(e) =>
                update("contact", e.target.value)
              }
              maxLength={200}
              placeholder="Email or other contact"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm">
              Request type
            </label>
            <select
              className="inp"
              value={form.requestType}
              onChange={(e) =>
                update("requestType", e.target.value)
              }
            >
              <option value="App">Request an app</option>
              <option value="Game">Request a game</option>
              <option value="Partnership">
                Developer partnership
              </option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm">
              App, game, or project name
            </label>
            <input
              className="inp"
              value={form.itemName}
              onChange={(e) =>
                update("itemName", e.target.value)
              }
              maxLength={120}
              placeholder="Name of the app or game"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm">
              Website or download link (optional)
            </label>
            <input
              className="inp"
              type="url"
              value={form.itemUrl}
              onChange={(e) =>
                update("itemUrl", e.target.value)
              }
              maxLength={500}
              placeholder="https://example.com"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm">
              Message (optional)
            </label>
            <textarea
              className="inp min-h-28"
              value={form.message}
              onChange={(e) =>
                update("message", e.target.value)
              }
              maxLength={2000}
              placeholder="Tell us more about your request..."
            />
          </div>

          {/* Honeypot field for basic bot filtering */}
          <div
            aria-hidden="true"
            className="absolute left-[-10000px] h-px w-px overflow-hidden"
          >
            <label>
              Leave this field empty
              <input
                tabIndex={-1}
                autoComplete="off"
                value={form.website}
                onChange={(e) =>
                  update("website", e.target.value)
                }
              />
            </label>
          </div>

          {error && (
            <p role="alert" className="text-sm text-red-300">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn inline-flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Send size={16} />
            {loading ? "Submitting..." : "Submit request"}
          </button>

          <p className="text-xs text-slate-400">
            Please do not include passwords or other sensitive
            information in your request.
          </p>
        </form>
      )}

      <BottomNav />
    </main>
  );
}