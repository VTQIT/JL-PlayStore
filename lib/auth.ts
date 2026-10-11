import crypto from "crypto";
import { cookies } from "next/headers";
import { r } from "./db";

const S = () => process.env.SESSION_SECRET!;

const sign = (v: string) =>
  crypto.createHmac("sha256", S()).update(v).digest("hex");

export function checkPin(pin: string) {
  const h = process.env.ADMIN_PIN_HASH || "";
  const [salt, hash] = h.split(":");
  if (!salt || !hash) return false;

  const a = crypto.scryptSync(pin, salt, 32);
  const b = Buffer.from(hash, "hex");

  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export function makeSession() {
  const e = String(Date.now() + 8 * 3600e3);
  return e + "." + sign(e);
}

export async function isAdmin(): Promise<boolean> {
  const cookieStore = await cookies();
  const v = cookieStore.get("jl_s")?.value;

  if (!v) return false;

  const [e, s] = v.split(".");
  if (!e || !s || +e < Date.now()) return false;

  const x = sign(e);

  return (
    x.length === s.length &&
    crypto.timingSafeEqual(Buffer.from(x), Buffer.from(s))
  );
}

export async function locked(ip: string) {
  return +((await r("GET", "fail:" + ip)) || 0) >= 5;
}

export async function fail(ip: string) {
  await r("INCR", "fail:" + ip);
  await r("EXPIRE", "fail:" + ip, 900);
}

export async function clear(ip: string) {
  await r("DEL", "fail:" + ip);
}
