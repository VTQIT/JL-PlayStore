"use client";import {useEffect,useState} from "react";import Link from "next/link";import {Menu,Search,Download,X,Home,Grid2x2,Flame,Clock,Star,Info} from "lucide-react";
type A={slug:string;name:string;publisher:string;category:string;short:string;iconUrl:string;downloads:number;featured:boolean;createdAt:number};
const Row=({a}:{a:A})=><Link href={`/app/${a.slug}`} className="glass flex items-center gap-3 p-3"><img src={a.iconUrl} alt="" className="w-14 h-14 rounded-2xl bg-white/10 object-cover"/><div className="flex-1 min-w-0"><div className="font-semibold truncate">{a.name}</div><div className="text-sm text-slate-300 truncate">{a.publisher} · {a.category}</div><div className="text-xs text-slate-400">{a.downloads} downloads</div></div><Download className="text-cyan-300"/></Link>;
const Sec=({t,l}:{t:string;l:A[]})=>l.length?<section className="mt-6"><h2 className="font-semibold mb-2">{t}</h2><div className="grid gap-3 md:grid-cols-2">{l.map(a=><Row key={a.slug} a={a}/>)}</div></section>:null;
const nav=[[Home,"Home","/"],[Grid2x2,"Apps","/"],[Clock,"Recently added","/"],[Flame,"Most downloaded","/"],[Star,"Featured","/"],[Info,"Admin","/admin"]] as const;
export default function P(){const [apps,setApps]=useState<A[]|null>(null);const [err,setErr]=useState(false);const [q,setQ]=useState("");const [cat,setCat]=useState("All");const [open,setOpen]=useState(false);
 useEffect(()=>{fetch("/api/apps").then(r=>r.json()).then(setApps).catch(()=>setErr(true))},[]);
 useEffect(()=>{const k=(e:KeyboardEvent)=>{if(e.key==="Escape")setOpen(false)};addEventListener("keydown",k);return()=>removeEventListener("keydown",k)},[]);
 const cats=["All",...Array.from(new Set((apps||[]).map(a=>a.category)))];
 const f=(apps||[]).filter(a=>(cat==="All"||a.category===cat)&&(a.name+a.publisher+a.short).toLowerCase().includes(q.toLowerCase()));
 return <main className="max-w-4xl mx-auto p-4">
 {open&&<div className="fixed inset-0 z-20 bg-black/50" onClick={()=>setOpen(false)}><nav className="glass h-full w-64 p-4 rounded-none" onClick={e=>e.stopPropagation()}><button aria-label="Close menu" onClick={()=>setOpen(false)}><X/></button><div className="mt-4 space-y-1">{nav.map(([I,n,h])=><Link key={n} href={h} className="flex gap-3 p-3 rounded-xl hover:bg-white/10"><I size={18}/>{n}</Link>)}</div></nav></div>}
 <header className="flex items-center gap-3"><button aria-label="Open menu" onClick={()=>setOpen(true)}><Menu/></button><b className="text-lg">JL PlayStore</b><div className="relative flex-1"><Search size={16} className="absolute left-3 top-3 text-slate-400"/><input aria-label="Search apps" value={q} onChange={e=>setQ(e.target.value)} placeholder="Search apps" className="inp pl-9"/></div></header>
 <div className="glass mt-5 p-6 bg-gradient-to-r from-blue-500/30 to-violet-500/30"><h1 className="text-3xl font-bold">Discover great apps</h1><p className="text-slate-200">Your favorite apps, all in one place.</p></div>
 <div className="flex gap-2 mt-4 overflow-x-auto">{cats.map(c=><button key={c} onClick={()=>setCat(c)} className={`px-4 py-1.5 rounded-full border border-white/15 whitespace-nowrap ${cat===c?"bg-indigo-400/40":"bg-white/5"}`}>{c}</button>)}</div>
 {err&&<p className="mt-6 text-red-300">Could not load apps. Refresh to try again.</p>}
 {!apps&&!err&&<div className="mt-6 grid gap-3">{[0,1,2].map(i=><div key={i} className="glass h-20 animate-pulse"/>)}</div>}
 {apps&&!apps.length&&<div className="glass mt-6 p-8 text-center">No apps yet. Sign in at /admin to publish your first one.</div>}
 {apps&&apps.length>0&&!q&&cat==="All"&&<><Sec t="Featured" l={apps.filter(a=>a.featured)}/><Sec t="Most downloaded" l={[...apps].sort((a,b)=>b.downloads-a.downloads).filter(a=>a.downloads>0).slice(0,6)}/></>}
 {apps&&apps.length>0&&<Sec t={q||cat!=="All"?"Results":"Recently added"} l={f}/>}
 {apps&&apps.length>0&&!f.length&&<p className="mt-6 text-slate-300">Nothing matches that search.</p>}
 </main>}
