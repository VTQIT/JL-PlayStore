import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { r } from "@/lib/db";

export const dynamic = "force-dynamic";

const allowedTypes = new Set([
  "App",
  "Game",
  "Partnership",
]);

function clean(value: unknown, max: number): string {
  return String(value ?? "").trim().slice(0, max);
}

function validOptionalUrl(value: string): boolean {
  if (!value) return true;

  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");

  if (origin) {
    try {
      if (!host || new URL(origin).host !== host) {
        return NextResponse.json(
          { error: "Invalid request origin." },
          { status: 403 }
        );
      }
    } catch {
      return NextResponse.json(
        { error: "Invalid request origin." },
        { status: 403 }
      );
    }
  }

  const body = await request.json().catch(() => null);

  if (!body || typeof body !== "object") {
    return NextResponse.json(
      { error: "Invalid request data." },
      { status: 400 }
    );
  }

  // Quietly accept bot submissions without saving them.
  if (clean(body.website, 300)) {
    return NextResponse.json({ ok: true }, { status: 201 });
  }

  const requesterName = clean(body.requesterName, 100);
  const contact = clean(body.contact, 200);
  const itemName = clean(body.itemName, 120);
  const requestType = clean(body.requestType, 30);
  const itemUrl = clean(body.itemUrl, 500);
  const message = clean(body.message, 2000);

  if (!requesterName || !contact || !itemName) {
    return NextResponse.json(
      { error: "Name, contact, and project name are required." },
      { status: 400 }
    );
  }

  if (!allowedTypes.has(requestType)) {
    return NextResponse.json(
      { error: "Please select a valid request type." },
      { status: 400 }
    );
  }

  if (!validOptionalUrl(itemUrl)) {
    return NextResponse.json(
      { error: "The link must be a valid HTTP or HTTPS URL." },
      { status: 400 }
    );
  }

  const id = randomUUID();

  const record = {
    id,
    requesterName,
    contact,
    itemName,
    requestType,
    itemUrl,
    message,
    status: "pending",
    createdAt: Date.now(),
  };

  try {
    await r(
      "HSET",
      "developer_requests",
      id,
      JSON.stringify(record)
    );

    await r("LPUSH", "developer_request_ids", id);

    // Keep the latest 500 request IDs.
    await r("LTRIM", "developer_request_ids", 0, 499);

    return NextResponse.json(
      { ok: true, id },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: "Unable to save your request. Please try again later." },
      { status: 503 }
    );
  }
}