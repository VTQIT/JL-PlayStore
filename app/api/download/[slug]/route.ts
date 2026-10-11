import {NextRequest,NextResponse} from "next/server";import {getApp,r} from "@/lib/db";
export async function GET(q:NextRequest, props:{params: Promise<{slug:string}>}) {
 const params = await props.params;
 const a=await getApp(params.slug);if(!a||!a.published)return new NextResponse("Not available",{status:404});
 const ip=q.headers.get("x-forwarded-for")?.split(",")[0]||"x";
 if(await r("SET",`dlseen:${a.slug}:${ip}`,"1","NX","EX",3600))await r("HINCRBY","dl",a.slug,1);
 return NextResponse.redirect(a.apkUrl,302)
}
