import {getApp} from "@/lib/db";import Link from "next/link";
export const dynamic="force-dynamic";
export default async function D({params}:{params:{slug:string}}){const a=await getApp(params.slug).catch(()=>null);
 if(!a||!a.published)return <main className="p-8 text-center">App not found. <Link href="/" className="underline">Back to store</Link></main>;
 return <main className="max-w-2xl mx-auto p-4"><Link href="/" className="text-cyan-300">Back</Link>
 <div className="flex gap-4 mt-4"><img src={a.iconUrl} alt="" className="w-24 h-24 rounded-3xl bg-white/10 object-cover"/><div><h1 className="text-2xl font-bold">{a.name}</h1><div className="text-cyan-300">{a.publisher}</div><div className="text-sm text-slate-300">{a.category} · v{a.version}</div></div></div>
 <div className="glass grid grid-cols-3 text-center p-4 mt-4"><div><b>{a.sizeMB?a.sizeMB+" MB":"-"}</b><div className="text-xs">Size</div></div><div><b>{a.downloads}</b><div className="text-xs">Downloads</div></div><div><b>{a.minAndroid||"-"}</b><div className="text-xs">Min Android</div></div></div>
 <a href={`/api/download/${a.slug}`} className="btn block text-center mt-4">Download APK</a>
 <p className="text-xs text-slate-400 mt-2">Android may ask you to allow installs from your browser. Allow it for this install only, then open the downloaded file.</p>
 {a.screenshots.length>0&&<div className="flex gap-3 overflow-x-auto mt-4">{a.screenshots.map(s=><img key={s} src={s} alt="Screenshot" className="h-64 rounded-2xl"/>)}</div>}
 <h2 className="font-semibold mt-6">About this app</h2><p className="whitespace-pre-wrap text-slate-200">{a.description||a.short}</p>
 {a.changelog&&<><h2 className="font-semibold mt-6">What's new</h2><p className="whitespace-pre-wrap text-slate-200">{a.changelog}</p></>}</main>}
