
// V14 FIX - Provider loop PARALEL + dibatasi, biar tidak timeout 10 detik di Vercel
function cleanKey(v){return String(v||'').trim().replace(/^bearer\s+/i,'').trim().replace(/[\r\n\s]/g,'');}
async function fetchWithTimeout(url,opts,ms=3500){
  const c=new AbortController(); const t=setTimeout(()=>c.abort(),ms);
  try{ const r=await fetch(url,{...opts,signal:c.signal}); return r; } finally{ clearTimeout(t); }
}
export default async function handler(req,res){
  const base='https://tokowendigg.com';
  const key=cleanKey(process.env.TOKOWENDIK_API_KEY);
  const headers={'Authorization':'Bearer '+key,'Accept':'application/json'};
  const markup=parseFloat(process.env.MARKUP_PCT||'3')/100;
  try{
    // Step 1: provider list (timeout 4 detik)
    let providers=[];
    try{
      const r=await fetchWithTimeout(base+'/api/prepaid/provider',{headers},4000);
      const j=await r.json().catch(()=>null);
      providers=Array.isArray(j)?j:(j&&Array.isArray(j.data)?j.data:(j&&Array.isArray(j.providers)?j.providers:[]));
    }catch(e){}
    if(!providers.length) providers=[{code:'FFMAX-BJ-V3',name:'Free Fire MAX [PROMO TERMURAH] V3'}];
    // Step 2: PARALEL, max 15 provider dulu (bukan 40 sequential) - cukup untuk home, sisanya next load
    // Prioritas: provider game populer dulu kalau ada namanya, sisanya urutan awal
    const popular=['MOBILE','LEGEND','FREE','BLOOD','PUBG','HONOR','GENSHIN','ROBLOX','VALORANT','UNIPIN','PULSA','PLN','DANA','VOUCHER'];
    const scored=[...providers].sort((a,b)=>{
      const an=String(a.name||a.code||'').toUpperCase(), bn=String(b.name||b.code||'').toUpperCase();
      const sa=popular.findIndex(k=>an.includes(k)), sb=popular.findIndex(k=>bn.includes(k));
      return (sa===-1?99:sa)-(sb===-1?99:sb);
    });
    const slice=scored.slice(0,15);
    const results=await Promise.allSettled(slice.map(async(pv)=>{
      const code=pv.code||pv.provider_code||pv.id; const pname=pv.name||pv.provider_name||code;
      if(!code) return [];
      try{
        const r=await fetchWithTimeout(base+'/api/prepaid/product?provider='+encodeURIComponent(code)+'&active=1',{headers},3500);
        const j=await r.json().catch(()=>null);
        if(j&&(j.status===200||j.status==='200')&&Array.isArray(j.data)){
          return j.data.filter(p=>Number(p.price||0)>0).map(p=>({id:String(p.code||p.id),name:p.name||'Produk',category:pname,description:pname,price:Math.ceil(Number(p.price)*(1+markup))}));
        }
      }catch(e){}
      return [];
    }));
    let all=[]; for(const rr of results){ if(rr.status==='fulfilled') all.push(...rr.value); }
    // De-duplicate by id+name
    const seen=new Set(); all=all.filter(p=>{const k=p.id+'|'+p.name; if(seen.has(k)) return false; seen.add(k); return true;});
    if(all.length) return res.status(200).json({ok:true,products:all,source:'live',debug:{http_status:200,raw_count:all.length,provider_count:slice.length,used:'v14-parallel-15'}});
    return res.status(200).json({ok:true,products:[],source:'live',debug:{http_status:502,raw_count:0,supplier_message:'Tokowendik lambat / tidak merespon. Coba refresh.',provider_count:slice.length}});
  }catch(e){
    return res.status(200).json({ok:true,products:[],source:'live',debug:{http_status:500,raw_count:0,supplier_message:String(e)}});
  }
}
