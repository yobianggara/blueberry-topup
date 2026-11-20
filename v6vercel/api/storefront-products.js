
// V18 - Ambil SEMUA provider, bertahap (pagination). Jangan potong jadi 12-15 lagi.
function cleanKey(v){return String(v||'').trim().replace(/^bearer\s+/i,'').trim().replace(/[\r\n\s]/g,'');}
async function ft(url,opts,ms=4000){
  const c=new AbortController(); const t=setTimeout(()=>c.abort(),ms);
  try{ const r=await fetch(url,{...opts,signal:c.signal}); const txt=await r.text().catch(()=> ''); let j=null; try{ j=JSON.parse(txt); }catch(e){} return {status:r.status, json:j, raw:txt.slice(0,300)}; }catch(e){ return {status:0, json:null, raw:'FETCH ERROR: '+String(e).slice(0,120)}; } finally{ clearTimeout(t); }
}
export default async function handler(req,res){
  const base=(cleanKey(process.env.TOKOWENDIK_BASE_URL)||'https://tokowendigg.com').replace(/\/$/,'');
  const keys=[cleanKey(process.env.TOKOWENDIK_API_KEY), cleanKey(process.env.TOKOWENDIK_SECRET_KEY)].filter(Boolean);
  const markup=parseFloat(process.env.MARKUP_PCT||'3')/100;
  const offset=parseInt(req.query?.offset||'0',10)||0;
  const limit=Math.min(parseInt(req.query?.limit||'12',10)||12, 20);
  const tried=[];
  for(const key of keys){
    const headers={'Authorization':'Bearer '+key,'Accept':'application/json'};
    // Provider list (cache per request, tapi kita fetch tiap page agar simpel + fresh)
    const pr=await ft(base+'/api/prepaid/provider',{headers},4500);
    tried.push('provider -> HTTP '+pr.status);
    let providers=Array.isArray(pr.json)?pr.json:(pr.json&&Array.isArray(pr.json.data)?pr.json.data:(pr.json&&Array.isArray(pr.json.providers)?pr.json.providers:[]));
    if(!providers.length) continue;
    // JANGAN di-sort populer. Ambil urutan asli supplier, potong per offset/limit.
    const slice=providers.slice(offset, offset+limit);
    const results=await Promise.allSettled(slice.map(async(pv)=>{
      const code=pv.code||pv.provider_code||pv.id; const pname=pv.name||pv.provider_name||code; if(!code) return [];
      const rr=await ft(base+'/api/prepaid/product?provider='+encodeURIComponent(code)+'&active=1',{headers},4000);
      if(rr.json&&(rr.json.status===200||rr.json.status==='200')&&Array.isArray(rr.json.data)) return rr.json.data.filter(p=>Number(p.price||0)>0).map(p=>({id:String(p.code||p.id),name:p.name||'Produk',category:pname,description:pname,price:Math.ceil(Number(p.price)*(1+markup)),note:String(p.note||p.description||p.instruction||p.how_to||p.detail||p.keterangan||''),ptype:String(p.type||p.product_type||p.category||''),raw_name:String(p.name||'')}));
      return [];
    }));
    let all=[]; for(const rr of results) if(rr.status==='fulfilled') all.push(...rr.value);
    const seen=new Set(); all=all.filter(p=>{const k=p.id+'|'+p.name; if(seen.has(k)) return false; seen.add(k); return true;});
    return res.status(200).json({ok:true,products:all,source:'live',debug:{http_status:200,raw_count:all.length,provider_total:providers.length,provider_offset:offset,provider_limit:limit,has_more:(offset+limit)<providers.length,used:'v18-paginated-all',tried}});
  }
  return res.status(200).json({ok:false,products:[],source:'error',debug:{http_status:502,raw_count:0,supplier_message:'Tokowendik menolak / tidak merespon.',has_api_key:!!process.env.TOKOWENDIK_API_KEY,has_secret:!!process.env.TOKOWENDIK_SECRET_KEY,base_used:base,tried}});
}
