
// V29 - Provider list DI-SORT stabil + cache + retry provider kosong. Fix katalog lompat-lompat (7 -> 27) & ML hilang.
function cleanKey(v){return String(v||'').trim().replace(/^bearer\s+/i,'').trim().replace(/[\r\n\s]/g,'');}
async function ft(url,opts,ms=10000){
  const c=new AbortController(); const t=setTimeout(()=>c.abort(),ms);
  try{ const r=await fetch(url,{...opts,signal:c.signal}); const txt=await r.text().catch(()=> ''); let j=null; try{ j=JSON.parse(txt); }catch(e){} return {status:r.status, json:j, raw:txt.slice(0,300)}; }catch(e){ return {status:0, json:null, raw:'FETCH ERROR: '+String(e).slice(0,120)}; } finally{ clearTimeout(t); }
}
let _provCache=null; let _provCacheAt=0;
async function getProviders(base,headers){
  // Cache 5 menit: urutan provider stabil antar batch, tidak berubah-ubah tiap request.
  if(_provCache && (Date.now()-_provCacheAt)<5*60*1000 && _provCache.length) return _provCache;
  const pr=await ft(base+'/api/prepaid/provider',{headers},10000);
  let providers=Array.isArray(pr.json)?pr.json:(pr.json&&Array.isArray(pr.json.data)?pr.json.data:(pr.json&&Array.isArray(pr.json.providers)?pr.json.providers:[]));
  // SORT STABIL by code: urutan tidak berubah tiap fetch, slice offset jadi konsisten, tidak ada provider kelewat / ke-double.
  providers=providers.slice().sort((a,b)=>String(a.code||a.provider_code||a.id||'').localeCompare(String(b.code||b.provider_code||b.id||'')));
  if(providers.length){ _provCache=providers; _provCacheAt=Date.now(); }
  return providers;
}
export default async function handler(req,res){
  const base=(cleanKey(process.env.TOKOWENDIK_BASE_URL)||'https://tokowendigg.com').replace(/\/$/,'');
  const keys=[cleanKey(process.env.TOKOWENDIK_API_KEY), cleanKey(process.env.TOKOWENDIK_SECRET_KEY)].filter(Boolean);
  const _mp=parseFloat(process.env.MARKUP_PCT||'3'); const markup=(!_mp||_mp<=0)?0.03:(_mp/100);
  const offset=parseInt(req.query?.offset||'0',10)||0;
  const limit=Math.min(parseInt(req.query?.limit||'12',10)||12, 20);
  const tried=[];
  for(const key of keys){
    const headers={'Authorization':'Bearer '+key,'Accept':'application/json'};
    const providers=await getProviders(base,headers);
    tried.push('provider -> '+providers.length+' providers (sorted+cache)');
    if(!providers.length) continue;
    const slice=providers.slice(offset, offset+limit);
    const fetchOne=async(pv)=>{
      const code=pv.code||pv.provider_code||pv.id; const pname=pv.name||pv.provider_name||code; if(!code) return [];
      for(let attempt=0; attempt<2; attempt++){
        const rr=await ft(base+'/api/prepaid/product?provider='+encodeURIComponent(code)+'&active=1',{headers},10000);
        if(rr.json&&(rr.json.status===200||rr.json.status==='200')&&Array.isArray(rr.json.data)) return rr.json.data.filter(p=>Number(p.price||0)>0).map(p=>({id:String(p.code||p.id),name:p.name||'Produk',category:pname,description:pname,price:Math.ceil(Number(p.price)*(1+markup)),note:String(p.note||p.description||p.instruction||p.how_to||p.detail||p.keterangan||''),ptype:String(p.type||p.product_type||p.category||''),raw_name:String(p.name||'')})); 
      }
      return [];
    };
    const results=await Promise.allSettled(slice.map(fetchOne));
    let all=[]; for(const rr of results) if(rr.status==='fulfilled') all.push(...rr.value);
    const seen=new Set(); all=all.filter(p=>{const k=p.id+'|'+p.name; if(seen.has(k)) return false; seen.add(k); return true;});
    res.setHeader('Cache-Control','no-store, max-age=0'); return res.status(200).json({ok:true,products:all,source:'live',debug:{http_status:200,raw_count:all.length,provider_total:providers.length,provider_offset:offset,provider_limit:limit,has_more:(offset+limit)<providers.length,used:'v29-sorted-cache-retry',tried}});
  }
  return res.status(200).json({ok:false,products:[],source:'error',debug:{http_status:502,raw_count:0,supplier_message:'Tokowendik menolak / tidak merespon.',has_api_key:!!process.env.TOKOWENDIK_API_KEY,has_secret:!!process.env.TOKOWENDIK_SECRET_KEY,base_used:base,tried}});
}
