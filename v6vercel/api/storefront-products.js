
// V16 - FOKUS 4 GAME SAJA. Tidak lagi loop semua provider (itu yang bikin stuck/timeout).
// Provider: AOEML-BJ, MLBB-ID-V3, FF-V3, PUBGIM-BJ
function cleanKey(v){return String(v||'').trim().replace(/^bearer\s+/i,'').trim().replace(/[\r\n\s]/g,'');}
async function ft(url,opts,ms=4500){
  const c=new AbortController(); const t=setTimeout(()=>c.abort(),ms);
  try{ const r=await fetch(url,{...opts,signal:c.signal}); const txt=await r.text().catch(()=> ''); let j=null; try{ j=JSON.parse(txt); }catch(e){} return {status:r.status, json:j, raw:txt.slice(0,300)}; }catch(e){ return {status:0, json:null, raw:'FETCH ERROR: '+String(e).slice(0,120)}; } finally{ clearTimeout(t); }
}
const FOCUS=[
  {code:'AOEML-BJ', name:'Age of Empires Mobile', img:'assets/aoe.jpg'},
  {code:'MLBB-ID-V3', name:'Mobile Legends', img:'assets/mlbb.jpg'},
  {code:'FF-V3', name:'Free Fire', img:'assets/ff.jpg'},
  {code:'PUBGIM-BJ', name:'PUBG Mobile', img:'assets/pubg.jpg'},
];
export default async function handler(req,res){
  const base=(cleanKey(process.env.TOKOWENDIK_BASE_URL)||'https://tokowendigg.com').replace(/\/$/,'');
  const keys=[cleanKey(process.env.TOKOWENDIK_API_KEY), cleanKey(process.env.TOKOWENDIK_SECRET_KEY)].filter(Boolean);
  const markup=parseFloat(process.env.MARKUP_PCT||'3')/100;
  const tried=[];
  for(const key of keys){
    const headers={'Authorization':'Bearer '+key,'Accept':'application/json'};
    const results=await Promise.allSettled(FOCUS.map(async(f)=>{
      const rr=await ft(base+'/api/prepaid/product?provider='+encodeURIComponent(f.code)+'&active=1',{headers},4500);
      tried.push(f.code+' -> HTTP '+rr.status);
      if(rr.json&&(rr.json.status===200||rr.json.status==='200')&&Array.isArray(rr.json.data)){
        return rr.json.data.filter(p=>Number(p.price||0)>0).map(p=>({id:String(p.code||p.id),name:p.name||'Produk',category:f.name,provider:f.code,img:f.img,price:Math.ceil(Number(p.price)*(1+markup))}));
      }
      return [];
    }));
    let all=[]; for(const rr of results) if(rr.status==='fulfilled') all.push(...rr.value);
    if(all.length){
      const _ps = await loadStore('bb:prices', {overrides:{}}); const ov = _ps.overrides||{};
      const withOverride = all.map(p=>{ const o=ov[String(p.id)]; if(o && Number(o)>0) return {...p, price:Math.round(Number(o)), priceSource:'manual', supplierPrice:p.price}; return {...p, priceSource:'auto'}; });
      const _ap = await loadStore('bb:agent-prices', {overrides:{}}); const _ao=_ap.overrides||{}; const withAgent = withOverride.map(p=>({ ...p, agentPrice: _ao[String(p.id)] ? Math.round(Number(_ao[String(p.id)])) : null }));
      return res.status(200).json({ok:true,products:withAgent,source:'live',focus:FOCUS.map(f=>f.code),overridesCount:Object.keys(ov).length,debug:{http_status:200,raw_count:all.length,provider_count:4,used:'v18-auto07-manual-override',tried}});
    }
  }
  return res.status(200).json({ok:false,products:[],source:'error',debug:{http_status:502,raw_count:0,supplier_message:'Server sedang sibuk untuk 4 game fokus. Coba lagi beberapa saat.',has_api_key:!!process.env.TOKOWENDIK_API_KEY,has_secret:!!process.env.TOKOWENDIK_SECRET_KEY,base_used:base,tried}});
}
