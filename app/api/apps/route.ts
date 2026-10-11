import {NextResponse} from "next/server";import {listApps} from "@/lib/db";
export const dynamic="force-dynamic";
export async function GET(){const a=await listApps();return NextResponse.json(a.map(({apkUrl,...x})=>x))}
