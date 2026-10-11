import {NextResponse} from "next/server";
export async function POST(){const x=NextResponse.json({ok:true});x.cookies.delete("jl_s");return x}
