
// V15 DIAGNOSTIC + MULTI-FALLBACK - jangan pernah stuck diam lagi
function cleanKey(v){return String(v||'').trim().replace(/^bearer\s+/i,'').trim().replace(/[\r\n\s]/g,'');}
async function ft(url,opts,ms=4000){
  const c=new AbortController(); const t=setTimeout(()=>c.abort(),ms);
  try{ const r=await fetch(url,{...opts,signal:c.signal}); const txt=await r.text().catch(()=> ''); let j=null; try{ j=JSON.parse(txt); }catch(e){} return {status:r.status, json:j, raw:txt.slice(0,300)}; }catch(e){ return {status:0, json:null, raw:'FETCH ERROR: '+String(e).slice(0,120)}; } finally{ clearTimeout(t); }
}
export default async function handler(req,res){
  const bases=[cleanKey(process.env.TOKOWENDIK_BASE_URL)||'https://tokowendigg.com','https://tokowendigg.com','https://tokowendik.com'];
  const base=[...new Set(bases.filter(Boolean))][0];
  const keys=[cleanKey(process.env.TOKOWENDIK_API_KEY), cleanKey(process.env.TOKOWENDIK_SECRET_KEY)].filter(Boolean);
  const markup=parseFloat(process.env.MARKUP_PCT||'3')/100;
  const tried=[];
  for(const key of keys){
    const headers={'Authorization':'Bearer '+key,'Accept':'application/json'};
    // Cara A: provider loop paralel (cara FIX7 yang dulu pernah jalan, raw_count 302)
    try{
      const pr=await ft(base+'/api/prepaid/provider',{headers},4500);
      tried.push('provider -> HTTP '+pr.status+' '+(pr.json?JSON.stringify(pr.json).slice(0,120):pr.raw.slice(0,120)));
      let providers=Array.isArray(pr.json)?pr.json:(pr.json&&Array.isArray(pr.json.data)?pr.json.data:(pr.json&&Array.isArray(pr.json.providers)?pr.json.providers:[]));
      if(providers.length){
        const slice=providers.slice(0,12);
        const results=await Promise.allSettled(slice.map(async(pv)=>{
          const code=pv.code||pv.provider_code||pv.id; const pname=pv.name||pv.provider_name||code; if(!code) return [];
          const rr=await ft(base+'/api/prepaid/product?provider='+encodeURIComponent(code)+'&active=1',{headers},4000);
          if(rr.json&&(rr.json.status===200||rr.json.status==='200')&&Array.isArray(rr.json.data)) return rr.json.data.filter(p=>Number(p.price||0)>0).map(p=>({id:String(p.code||p.id),name:p.name||'Produk',category:pname,description:pname,price:Math.ceil(Number(p.price)*(1+markup))}));
          return [];
        }));
        let all=[]; for(const rr of results) if(rr.status==='fulfilled') all.push(...rr.value);
        if(all.length) return res.status(200).json({ok:true,products:all,source:'live',debug:{http_status:200,raw_count:all.length,provider_count:slice.length,used:'v15-provider-loop',tried}});
      }
    }catch(e){ tried.push('provider loop error '+String(e).slice(0,100)); }
    // Cara B: langsung list product tanpa provider (fallback kalau endpoint provider berubah)
    for(const path of ['/api/prepaid/product?active=1','/api/prepaid/product','/api/prepaid/products?active=1']){
      const rr=await ft(base+path,{headers},4500);
      tried.push('direct '+path+' -> HTTP '+rr.status+' '+(rr.json?JSON.stringify(rr.json).slice(0,120):rr.raw.slice(0,120)));
      const arr=Array.isArray(rr.json)?rr.json:(rr.json&&Array.isArray(rr.json.data)?rr.json.data:[]);
      if(arr.length){
        const all=arr.filter(p=>Number(p.price||0)>0).map(p=>({id:String(p.code||p.id),name:p.name||'Produk',category:p.category||p.provider||'Lainnya',description:p.category||'',price:Math.ceil(Number(p.price)*(1+markup))}));
        if(all.length) return res.status(200).json({ok:true,products:all,source:'live',debug:{http_status:200,raw_count:all.length,provider_count:0,used:'v15-direct:'+path,tried}});
      }
    }
  }
  // Semua cara gagal -> kasih error JUJUR + debug, biar frontend bisa nampilin tombol cek
  return res.status(200).json({ok:false,products:[],source:'error',debug:{http_status:502,raw_count:0,supplier_message:'Tokowendik menolak / tidak merespon. Cek API Key di Vercel Env (TOKOWENDIK_API_KEY) atau cek status Tokowendik.',has_api_key:!!process.env.TOKOWENDIK_API_KEY,has_secret:!!process.env.TOKOWENDIK_SECRET_KEY,base_used:base,tried}});
}
