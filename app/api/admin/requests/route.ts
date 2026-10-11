import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { r } from "@/lib/db";

export const dynamic = "force-dynamic";

const no = () =>
  NextResponse.json(
    { error: "Unauthorized" },
    { status: 401 }
  );

const validStatuses = new Set([
  "pending",
  "reviewing",
  "completed",
  "rejected",
]);

async function getRecord(id: string) {
  const value = await r("HGET", "developer_requests", id);

  if (!value) return null;

  try {
    return JSON.parse(value as string);
  } catch {
    return null;
  }
}

export async function GET() {
  if (!(await isAdmin())) return no();

  try {
    const ids = (await r(
      "LRANGE",
      "developer_request_ids",
      0,
      499
    )) as string[];

    const requests = [];

    for (const id of ids || []) {
      const record = await getRecord(id);
      if (record) requests.push(record);
    }

    return NextResponse.json(requests);
  } catch {
    return NextResponse.json(
      { error: "Could not load requests." },
      { status: 503 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  if (!(await isAdmin())) return no();

  const body = await request.json().catch(() => null);
  const id = String(body?.id || "");
  const status = String(body?.status || "");

  if (!id || !validStatuses.has(status)) {
    return NextResponse.json(
      { error: "A valid request ID and status are required." },
      { status: 400 }
    );
  }

  try {
    const record = await getRecord(id);

    if (!record) {
      return NextResponse.json(
        { error: "Request not found." },
        { status: 404 }
      );
    }

    const updated = { ...record, status };

    await r(
      "HSET",
      "developer_requests",
      id,
      JSON.stringify(updated)
    );

    return NextResponse.json({ ok: true, request: updated });
  } catch {
    return NextResponse.json(
      { error: "Could not update the request." },
      { status: 503 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  if (!(await isAdmin())) return no();

  const id = request.nextUrl.searchParams.get("id") || "";

  if (!id) {
    return NextResponse.json(
      { error: "Request ID is required." },
      { status: 400 }
    );
  }

  try {
    await r("HDEL", "developer_requests", id);
    await r("LREM", "developer_request_ids", 0, id);

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Could not delete the request." },
      { status: 503 }
    );
  }
}
