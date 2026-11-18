
// FIX7 - Per Tokowendigg docs: List Product WAJIB ?provider=CODE&active=1
// Step 1: GET /api/prepaid/provider -> daftar provider
// Step 2: Per provider GET /api/prepaid/product?provider=CODE&active=1
function cleanKey(v){return String(v||'').trim().replace(/^bearer\s+/i,'').trim().replace(/[\r\n\s]/g,'');}
export default async function handler(req,res){
  const base='https://tokowendigg.com';
  const key=cleanKey(process.env.TOKOWENDIK_API_KEY);
  const headers={'Authorization':'Bearer '+key,'Accept':'application/json'};
  const markup=parseFloat(process.env.MARKUP_PCT||'3')/100;
  let lastMsg='', lastStatus=0, tried=[];
  try{
    // --- Step 1: List Provider ---
    const providerPaths=['/api/prepaid/provider','/api/prepaid/providers','/api/prepaid/product/provider'];
    let providers=[];
    for(const pp of providerPaths){
      try{
        const r=await fetch(base+pp,{headers});
        const j=await r.json().catch(()=>null);
        tried.push('provider '+pp+' -> HTTP '+r.status);
        const arr=Array.isArray(j)?j:(j&&Array.isArray(j.data)?j.data:(j&&Array.isArray(j.providers)?j.providers:[]));
        if(arr.length){ providers=arr; break; }
        if(j) { lastMsg=j.message||j.msg||''; lastStatus=r.status; }
      }catch(e){}
    }
    // Fallback: kalau endpoint provider gagal, pakai provider yang sudah diketahui dari docs
    if(!providers.length){
      providers=[{code:'FFMAX-BJ-V3',name:'Free Fire MAX [PROMO TERMURAH] V3'}];
      tried.push('provider fallback -> FFMAX-BJ-V3 (dari docs)');
    }
    // --- Step 2: List Product per provider ---
    let all=[];
    // Batasi 40 provider pertama biar tidak timeout di Vercel (10 detik)
    const slice=providers.slice(0,40);
    for(const pv of slice){
      const code=pv.code||pv.provider_code||pv.id;
      const pname=pv.name||pv.provider_name||code;
      if(!code) continue;
      try{
        const url=base+'/api/prepaid/product?provider='+encodeURIComponent(code)+'&active=1';
        const r=await fetch(url,{headers});
        const j=await r.json().catch(()=>null);
        if(j&&(j.status===200||j.status==='200')&&Array.isArray(j.data)){
          for(const p of j.data){
            if(!p.active && p.active!==1) continue;
            const bp=Number(p.price||0);
            if(bp<=0) continue;
            all.push({id:String(p.code||p.id),name:p.name||'Produk',category:pname,description:pname,price:Math.ceil(bp*(1+markup))});
          }
          tried.push('product provider='+code+' -> OK '+j.data.length+' items');
        } else {
          tried.push('product provider='+code+' -> HTTP '+r.status+' '+(j?JSON.stringify(j).slice(0,120):''));
          if(j) { lastMsg=j.message||''; lastStatus=r.status; }
        }
      }catch(e){ tried.push('product provider='+code+' -> ERROR'); }
    }
    if(all.length){
      return res.status(200).json({ok:true,products:all,source:'live',debug:{http_status:200,raw_count:all.length,provider_count:slice.length,used:'provider-loop'}});
    }
    return res.status(200).json({ok:true,products:[],source:'live',debug:{http_status:lastStatus,raw_count:0,base_used:base,has_key:!!key,key_length:key.length,key_prefix:key?key.slice(0,4)+'...'+key.slice(-2):'',supplier_message:lastMsg,provider_count:slice.length,tried}});
  }catch(e){
    return res.status(200).json({ok:true,products:[],source:'live',debug:{http_status:500,raw_count:0,supplier_message:String(e),tried}});
  }
}
