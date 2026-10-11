const U=process.env.UPSTASH_REDIS_REST_URL!,T=process.env.UPSTASH_REDIS_REST_TOKEN!;
export async function r(...cmd:(string|number)[]){const x=await fetch(U,{method:"POST",headers:{Authorization:`Bearer ${T}`},body:JSON.stringify(cmd),cache:"no-store"});const j=await x.json();if(j.error)throw new Error(j.error);return j.result}
export type App={slug:string;name:string;publisher:string;category:string;version:string;short:string;description:string;changelog:string;minAndroid:string;sizeMB:string;iconUrl:string;screenshots:string[];apkUrl:string;featured:boolean;published:boolean;createdAt:number;downloads?:number};
export async function listApps(all=false):Promise<App[]>{
 try{const h:string[]=(await r("HGETALL","apps"))||[];const d:string[]=(await r("HGETALL","dl"))||[];
 const dm:Record<string,number>={};for(let i=0;i<d.length;i+=2)dm[d[i]]=+d[i+1];
 const a:App[]=[];for(let i=1;i<h.length;i+=2){const p=JSON.parse(h[i]);p.downloads=dm[p.slug]||0;if(all||p.published)a.push(p)}
 return a.sort((x,y)=>y.createdAt-x.createdAt)}catch{return []}}
export async function getApp(s:string){const v=await r("HGET","apps",s);if(!v)return null;const a=JSON.parse(v) as App;a.downloads=+(await r("HGET","dl",s))||0;return a}
