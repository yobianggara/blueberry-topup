
// V23 - SATU GUDANG BARENG untuk semua API.
// Masalah V22: tiap API Vercel punya ingatan sendiri-sendiri, jadi harga yang disimpan
// di /api/prices tidak kelihatan di /api/storefront-products, dan agen yang di-approve
// di /api/agent-register tidak kelihatan di /api/agent-login.
// Solusi: simpan semua di Upstash Redis (Vercel Storage). Semua API baca dari sini.
const URL = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL || '';
const TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN || '';
export function storageMode(){ return (URL && TOKEN) ? 'redis' : 'sementara'; }
export async function loadStore(key, fallback){
  if(URL && TOKEN){
    try{
      const r = await fetch(URL + '/get/' + encodeURIComponent(key), { headers:{ Authorization:'Bearer '+TOKEN } });
      const j = await r.json().catch(()=>null);
      if(j && typeof j.result === 'string' && j.result){
        try{ return JSON.parse(j.result); }catch(e){ return fallback; }
      }
      return fallback;
    }catch(e){ return fallback; }
  }
  const g = globalThis.__BB_STORE__ || (globalThis.__BB_STORE__ = {});
  if(!(key in g)) g[key]=fallback;
  return g[key];
}
export async function saveStore(key, value){
  if(URL && TOKEN){
    try{
      const v = encodeURIComponent(JSON.stringify(value));
      await fetch(URL + '/set/' + encodeURIComponent(key) + '/' + v, { method:'POST', headers:{ Authorization:'Bearer '+TOKEN } });
    }catch(e){}
  }
  const g = globalThis.__BB_STORE__ || (globalThis.__BB_STORE__ = {});
  g[key]=value;
  return true;
}
