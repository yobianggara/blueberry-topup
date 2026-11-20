
// V31 - CEPAT + ANTI-TIMEOUT. V30 timeout karena nanya 5 endpoint satu-satu (5x10 detik > batas Vercel 10 detik).
// V31: 1 endpoint prepaid saja, cache provider, timeout pendek, produk paralel. ML diselamatkan di frontend (kartu WA), bukan dengan bikin backend lambat.
function cleanKey(v){return String(v||'').trim().replace(/^bearer\s+/i,'').trim().replace(/[\r\n\s]/g,'');}
async function ft(url,opts,ms=6000){
  const c=new AbortController(); const t=setTimeout(()=>c.abort(),ms);
  try{ const r=await fetch(url,{...opts,signal:c.signal}); const txt=await r.text().catch(()=> ''); let j=null; try{ j=JSON.parse(txt); }catch(e){} return {status:r.status, json:j, raw:txt.slice(0,300)}; }catch(e){ return {status:0, json:null, raw:'FETCH ERROR: '+String(e).slice(0,120)}; } finally{ clearTimeout(t); }
}
let _provCache=null; let _provCacheAt=0;
export default async function handler(req,res){
  const base=(cleanKey(process.env.TOKOWENDIK_BASE_URL)||'https://tokowendigg.com').replace(/\/$/,'');
  const keys=[cleanKey(process.env.TOKOWENDIK_API_KEY), cleanKey(process.env.TOKOWENDIK_SECRET_KEY)].filter(Boolean);
  const _mp=parseFloat(process.env.MARKUP_PCT||'3'); const markup=(!_mp||_mp<=0)?0.03:(_mp/100);
  const offset=parseInt(req.query?.offset||'0',10)||0;
  const limit=Math.min(parseInt(req.query?.limit||'12',10)||12, 20);
  const tried=[];
  for(const key of keys){
    const headers={'Authorization':'Bearer '+key,'Accept':'application/json'};
    // Provider: cache 5 menit, 1 endpoint saja, timeout 6 detik. Jangan loop 5 endpoint.
    let providers=null;
    if(_provCache && (Date.now()-_provCacheAt)<5*60*1000 && _provCache.length) providers=_provCache;
    else {
      const pr=await ft(base+'/api/prepaid/provider',{headers},6000);
      let arr=Array.isArray(pr.json)?pr.json:(pr.json&&Array.isArray(pr.json.data)?pr.json.data:(pr.json&&Array.isArray(pr.json.providers)?pr.json.providers:[]));
      providers=arr.slice().sort((a,b)=>String(a.code||a.provider_code||a.id||'').localeCompare(String(b.code||b.provider_code||b.id||'')));
      if(providers.length){ _provCache=providers; _provCacheAt=Date.now(); }
    }
    tried.push('provider -> '+ (providers?providers.length:0) +' (1 endpoint + cache)');
    if(!providers || !providers.length) continue;
    const slice=providers.slice(offset, offset+limit);
    let mlExtra=[];
    if(offset===0){ try{ const mlR=await ft(base+'/api/prepaid/product?provider='+encodeURIComponent('MLBB-ID-V3')+'&active=1',{headers},6000); if(mlR.json&&(mlR.json.status===200||mlR.json.status==='200')&&Array.isArray(mlR.json.data)){ mlExtra=mlR.json.data.filter(p=>Number(p.price||0)>0).map(p=>({id:String(p.code||p.id),name:p.name||'Produk',category:'Mobile Legends',description:'Mobile Legends',price:Math.ceil(Number(p.price)*(1+markup)),price_before:Math.ceil(Number(p.price)*(1+markup)),note:String(p.note||p.description||''),ptype:String(p.type||''),raw_name:String(p.name||'')})); } }catch(e){} }
    // Produk: paralel, timeout 6 detik, retry 1x saja (bukan 2x + fallback endpoint yang bikin lambat)
    const fetchOne=async(pv)=>{
      const code=pv.code||pv.provider_code||pv.id; const pname=pv.name||pv.provider_name||code; if(!code) return [];
      for(let attempt=0; attempt<2; attempt++){
        const rr=await ft(base+'/api/prepaid/product?provider='+encodeURIComponent(code)+'&active=1',{headers},6000);
        if(rr.json&&(rr.json.status===200||rr.json.status==='200')&&Array.isArray(rr.json.data)) return rr.json.data.filter(p=>Number(p.price||0)>0).map(p=>({id:String(p.code||p.id),name:p.name||'Produk',category:pname,description:pname,price:Math.ceil(Number(p.price)*(1+markup)),note:String(p.note||p.description||p.instruction||p.how_to||p.detail||p.keterangan||''),ptype:String(p.type||p.product_type||p.category||''),raw_name:String(p.name||'')})); 
      }
      return [];
    };
    const results=await Promise.allSettled(slice.map(fetchOne));
    let all=[...mlExtra]; for(const rr of results) if(rr.status==='fulfilled') all.push(...rr.value);
    const seen=new Set(); all=all.filter(p=>{const k=p.id+'|'+p.name; if(seen.has(k)) return false; seen.add(k); return true;});
    res.setHeader('Cache-Control','no-store, max-age=0'); return res.status(200).json({ok:true,products:all,source:'live',debug:{http_status:200,raw_count:all.length,provider_total:providers.length,provider_offset:offset,provider_limit:limit,has_more:(offset+limit)<providers.length,used:'v31-fast-single-endpoint',tried}});
  }
  return res.status(200).json({ok:false,products:[],source:'error',debug:{http_status:502,raw_count:0,supplier_message:'Tokowendik menolak / tidak merespon.',has_api_key:!!process.env.TOKOWENDIK_API_KEY,has_secret:!!process.env.TOKOWENDIK_SECRET_KEY,base_used:base,tried}});
}
