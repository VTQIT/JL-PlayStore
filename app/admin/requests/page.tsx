"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  RefreshCw,
  Trash2,
  ExternalLink,
} from "lucide-react";

type RequestItem = {
  id: string;
  requesterName: string;
  contact: string;
  itemName: string;
  requestType: string;
  itemUrl: string;
  message: string;
  status: "pending" | "reviewing" | "completed" | "rejected";
  createdAt: number;
};

const statuses = [
  "pending",
  "reviewing",
  "completed",
  "rejected",
] as const;

export default function AdminRequestsPage() {
  const router = useRouter();
  const [items, setItems] = useState<RequestItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/requests", {
        cache: "no-store",
      });

      if (response.status === 401) {
        router.replace("/admin");
        return;
      }

      if (!response.ok) {
        throw new Error("Unable to load requests.");
      }

      const data = await response.json();
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Request failed."
      );
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    void load();
  }, [load]);

  async function updateStatus(id: string, status: string) {
    setError("");

    try {
      const response = await fetch("/api/admin/requests", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });

      const data = await response.json().catch(() => ({}));

      if (response.status === 401) {
        router.replace("/admin");
        return;
      }

      if (!response.ok) {
        throw new Error(data.error || "Could not update status.");
      }

      setItems((current) =>
        current.map((item) =>
          item.id === id
            ? { ...item, status: status as RequestItem["status"] }
            : item
        )
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Update failed."
      );
    }
  }

  async function deleteRequest(id: string) {
    if (!window.confirm("Delete this request permanently?")) return;

    setError("");

    try {
      const response = await fetch(
        `/api/admin/requests?id=${encodeURIComponent(id)}`,
        { method: "DELETE" }
      );

      const data = await response.json().catch(() => ({}));

      if (response.status === 401) {
        router.replace("/admin");
        return;
      }

      if (!response.ok) {
        throw new Error(data.error || "Could not delete request.");
      }

      setItems((current) =>
        current.filter((item) => item.id !== id)
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Delete failed."
      );
    }
  }

  return (
    <main className="mx-auto min-h-screen max-w-4xl px-4 py-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 text-sm text-cyan-300"
          >
            <ArrowLeft size={16} />
            Back to Admin
          </Link>

          <h1 className="mt-3 text-3xl font-bold">
            Developer Requests
          </h1>

          <p className="mt-1 text-sm text-slate-400">
            Review app requests and developer inquiries.
          </p>
        </div>

        <button
          type="button"
          onClick={() => void load()}
          disabled={loading}
          className="btn inline-flex items-center gap-2 disabled:opacity-50"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {error && (
        <p role="alert" className="mt-5 text-sm text-red-300">
          {error}
        </p>
      )}

      {loading ? (
        <div className="glass mt-6 p-6">
          Loading requests...
        </div>
      ) : items.length === 0 ? (
        <div className="glass mt-6 p-8 text-center">
          <h2 className="font-semibold">No requests yet</h2>
          <p className="mt-2 text-sm text-slate-400">
            New submissions from the Developer page will appear here.
          </p>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {items.map((item) => (
            <article key={item.id} className="glass p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs uppercase tracking-wide text-cyan-300">
                    {item.requestType}
                  </p>

                  <h2 className="mt-1 break-words text-xl font-semibold">
                    {item.itemName}
                  </h2>

                  <p className="mt-1 text-sm text-slate-300">
                    From: {item.requesterName}
                  </p>

                  <p className="break-words text-sm text-slate-400">
                    Contact: {item.contact}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    {new Date(item.createdAt).toLocaleString()}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => void deleteRequest(item.id)}
                  className="inline-flex items-center gap-2 rounded-lg border border-red-400/30 px-3 py-2 text-sm text-red-300 hover:bg-red-400/10"
                >
                  <Trash2 size={15} />
                  Delete
                </button>
              </div>

              {item.itemUrl && (
                <a
                  href={item.itemUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-2 break-all text-sm text-cyan-300 underline"
                >
                  Open supplied link
                  <ExternalLink size={14} />
                </a>
              )}

              {item.message && (
                <div className="mt-4 whitespace-pre-wrap break-words rounded-xl bg-black/20 p-3 text-sm text-slate-200">
                  {item.message}
                </div>
              )}

              <div className="mt-4">
                <label className="mb-1 block text-sm text-slate-300">
                  Request status
                </label>

                <select
                  className="inp max-w-xs"
                  value={item.status}
                  onChange={(event) =>
                    void updateStatus(item.id, event.target.value)
                  }
                >
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}