import {NextRequest,NextResponse} from "next/server";import {isAdmin} from "@/lib/auth";import {r,listApps,getApp,App} from "@/lib/db";
const ok=(u:string)=>/^https:\/\/(github\.com\/[\w.-]+\/[\w.-]+\/releases\/download\/|[\w.-]+\.githubusercontent\.com\/)/.test(u);
const okImg=(u:string)=>!u||/^https:\/\//.test(u);
const no=()=>NextResponse.json({error:"Unauthorized"},{status:401});
export async function GET(){if(!(await isAdmin()))return no();return NextResponse.json(await listApps(true))}
export async function POST(q:NextRequest){if(!(await isAdmin()))return no();
 if(q.headers.get("origin")&&new URL(q.headers.get("origin")!).host!==q.headers.get("host"))return NextResponse.json({error:"Bad origin"},{status:403});
 const b=await q.json().catch(()=>null);if(!b)return NextResponse.json({error:"Invalid body"},{status:400});
 const slug=String(b.slug||"").toLowerCase();
 if(!/^[a-z0-9-]{2,60}$/.test(slug)||!b.name||!b.version)return NextResponse.json({error:"Name, version and a slug (a-z, 0-9, -) are required."},{status:400});
 if(!ok(String(b.apkUrl||"")))return NextResponse.json({error:"APK link must be a GitHub Releases download URL."},{status:400});
 const shots=(Array.isArray(b.screenshots)?b.screenshots:[]).map(String).filter(okImg).filter(okImg).slice(0,5);
 if(!okImg(String(b.iconUrl||"")))return NextResponse.json({error:"Icon must be an https URL."},{status:400});
 const old=await getApp(slug);const t=(k:string,n=2000)=>String(b[k]||"").slice(0,n);
 const a:App={slug,name:t("name",80),publisher:t("publisher",80),category:t("category",40)||"Other",version:t("version",30),short:t("short",140),description:t("description"),changelog:t("changelog"),minAndroid:t("minAndroid",10),sizeMB:t("sizeMB",10),iconUrl:t("iconUrl",500),screenshots:shots,apkUrl:t("apkUrl",500),featured:!!b.featured,published:!!b.published,createdAt:old?.createdAt||Date.now()};
 await r("HSET","apps",slug,JSON.stringify(a));
 await r("LPUSH","audit",JSON.stringify({t:Date.now(),a:old?"update":"create",slug,v:a.version}));return NextResponse.json({ok:true})}
export async function DELETE(q:NextRequest){if(!(await isAdmin()))return no();const s=q.nextUrl.searchParams.get("slug")||"";
 await r("HDEL","apps",s);await r("LPUSH","audit",JSON.stringify({t:Date.now(),a:"delete",slug:s}));return NextResponse.json({ok:true})}
