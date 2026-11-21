
import { diagRedis } from './_store.js';
function clean(v){ return String(v||'').trim().replace(/^bearer\s+/i,'').trim(); }
export default async function handler(req,res){
  const r = await diagRedis();
  let toko = null;
  try{
    const base=(clean(process.env.TOKOWENDIK_BASE_URL)||'https://tokowendigg.com').replace(/\/$/,'');
    const key = clean(process.env.TOKOWENDIK_API_KEY) || clean(process.env.TOKOWENDIK_SECRET_KEY);
    const rr = await fetch(base+'/api/prepaid/product?provider='+encodeURIComponent('MLBB-ID-V3')+'&active=1', { headers:{ Authorization:'Bearer '+key, Accept:'application/json' } });
    const txt = await rr.text().catch(()=> '');
    toko = { http: rr.status, body_head: txt.slice(0,200), base_used: base, has_key: !!key };
  }catch(e){ toko = { error: String(e).slice(0,200) }; }
  return res.status(200).json({ ok:true, redis:r, supplier_test:toko,
    env_seen:{ has_upstash_url:!!process.env.UPSTASH_REDIS_REST_URL, has_upstash_token:!!process.env.UPSTASH_REDIS_REST_TOKEN, has_kv_url:!!process.env.KV_REST_API_URL, has_kv_token:!!process.env.KV_REST_API_TOKEN } });
}
