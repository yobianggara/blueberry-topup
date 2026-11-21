
// V24 - Gudang Redis yang tahan gagal.
// Baca dari UPSTASH_* dulu, fallback ke KV_* (yang dibuat otomatis Vercel).
// Kalau Redis down / token salah, JANGAN bikin toko crash — balik ke memori sementara.
const URL = (process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL || '').replace(/\/$/,'');
const TOKEN = (process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN || '').trim();
export function storageMode(){ return (URL && TOKEN) ? 'redis' : 'sementara'; }
export function redisConfigured(){ return !!(URL && TOKEN); }
async function upstash(path, opts={}){
  const r = await fetch(URL + path, { ...opts, headers:{ Authorization:'Bearer '+TOKEN, ...(opts.headers||{}) } });
  const txt = await r.text().catch(()=> '');
  let j=null; try{ j=JSON.parse(txt); }catch(e){}
  return { status:r.status, json:j, raw:txt.slice(0,300) };
}
export async function loadStore(key, fallback){
  if(URL && TOKEN){
    try{
      const { status, json } = await upstash('/get/'+encodeURIComponent(key));
      if(status===200 && json && typeof json.result === 'string' && json.result){
        try{ return JSON.parse(json.result); }catch(e){ return fallback; }
      }
      return fallback;
    }catch(e){ return fallback; }
  }
  const g = globalThis.__BB_STORE__ || (globalThis.__BB_STORE__ = {});
  if(!(key in g)) g[key]=fallback;
  return g[key];
}
export async function saveStore(key, value){
  const g = globalThis.__BB_STORE__ || (globalThis.__BB_STORE__ = {});
  g[key]=value;
  if(URL && TOKEN){
    try{
      const v = encodeURIComponent(JSON.stringify(value));
      const { status, json } = await upstash('/set/'+encodeURIComponent(key)+'/'+v, { method:'POST' });
      // Upstash balas {result:"OK"} kalau berhasil. Kalau token READ_ONLY, status 401 / result null.
      if(status===200 && json && json.result==='OK') return true;
      return false;
    }catch(e){ return false; }
  }
  return true;
}
export async function diagRedis(){
  if(!URL || !TOKEN) return { configured:false, reason:'ENV UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN belum kebaca (redeploy belum jalan / nama env salah)' };
  try{
    const ping = await upstash('/ping');
    const w = await saveStore('bb:diag-ping', { at:new Date().toISOString(), ok:1 });
    const back = await loadStore('bb:diag-ping', null);
    return { configured:true, ping_status:ping.status, ping:ping.json, write_ok:!!w, read_back_ok:!!(back && back.ok===1),
      hint: (!w ? 'TOKEN-nya kemungkinan READ_ONLY (cuma bisa baca). Ganti dengan KV_REST_API_TOKEN yang tanpa embel-embel READ_ONLY, lalu Redeploy.' : 'Redis OK — baca + tulis jalan.') };
  }catch(e){ return { configured:true, error:String(e).slice(0,200) }; }
}
