import {NextRequest,NextResponse} from "next/server";import {checkPin,makeSession,locked,fail,clear} from "@/lib/auth";
export async function POST(q:NextRequest){const ip=q.headers.get("x-forwarded-for")?.split(",")[0]||"x";
 if(await locked(ip))return NextResponse.json({error:"Too many attempts. Try again in 15 minutes."},{status:429});
 const {pin}=await q.json().catch(()=>({}));
 if(typeof pin!=="string"||!checkPin(pin)){await fail(ip);return NextResponse.json({error:"Wrong PIN."},{status:401})}
 await clear(ip);const res=NextResponse.json({ok:true});
 res.cookies.set("jl_s",makeSession(),{httpOnly:true,secure:process.env.NODE_ENV==="production",sameSite:"strict",path:"/",maxAge:28800});return res}
