
import crypto from 'crypto';
function pickPrice(p){for(const k of ['harga_jual','price','harga','sell_price','nominal','cost','amount']){if(p[k]!=null && Number(p[k])>0) return Number(p[k]);}return 0;}
function pickName(p){return p.name||p.product_name||p.title||p.produk||p.label||'Produk';}
function pickCat(p){return p.category||p.brand||p.type||p.operator||p.game||'Game';}
function flatten(j){
  if(Array.isArray(j)) return j;
  if(!j||typeof j!=='object') return [];
  // common wrappers
  for(const k of ['data','products','result','items','list']){ if(j[k]!=null) { const r=flatten(j[k]); if(r.length) return r; } }
  // data is object grouped by category: { "Mobile Legends": [...] , "Free Fire": [...] }
  let out=[];
  for(const k of Object.keys(j)){
    const v=j[k];
    if(Array.isArray(v)) out=out.concat(v.map(x=>({...x, category:x.category||k})));
    else if(v&&typeof v==='object'&&Array.isArray(v.products)) out=out.concat(v.products.map(x=>({...x, category:x.category||k})));
  }
  return out;
}
export default async function handler(req,res){
  try{
    const base=(process.env.TOKOWENDIK_BASE_URL||'https://tokowendigg.com').replace(/\/$/,'');
    const path=process.env.TOKOWENDIK_API_PATH_PRODUCTS||'/api/prepaid/product';
    const key=process.env.TOKOWENDIK_API_KEY||''; const secret=process.env.TOKOWENDIK_SECRET_KEY||'';
    const signature=crypto.createHmac('sha256',secret).update(key).digest('hex');
    // Try GET first, then POST fallback - some supplier endpoints only accept POST
    let j=null, status=0;
    try{
      const r=await fetch(base+path,{headers:{'X-Api-Key':key,'Signature':signature,'Content-Type':'application/json','Accept':'application/json'}});
      status=r.status; j=await r.json().catch(()=>null);
    }catch(e){}
    if(!j || (!j.data && !j.products && !j.result)){
      try{
        const r2=await fetch(base+path,{method:'POST',headers:{'X-Api-Key':key,'Signature':signature,'Content-Type':'application/json'},body:JSON.stringify({})});
        const j2=await r2.json().catch(()=>null);
        if(j2) { j=j2; status=r2.status; }
      }catch(e){}
    }
    const raw=flatten(j||{});
    const markup=parseFloat(process.env.MARKUP_PCT||'3')/100;
    const products=raw.map((p,i)=>{const bp=pickPrice(p);return{id:String(p.id||p.code||p.sku||p.product_code||i),name:pickName(p),category:pickCat(p),description:p.description||p.desc||p.detail||'',price:Math.ceil(bp*(1+markup))};}).filter(p=>p.price>0 && p.name!=='Produk');
    res.setHeader('Cache-Control','s-maxage=60, stale-while-revalidate=120');
    // debug info helps without exposing secrets
    return res.status(200).json({ok:true,products,source:'live',debug:{http_status:status,raw_count:raw.length,base_used:base,path_used:path,has_key:!!key,has_secret:!!secret,top_keys:j?Object.keys(j).slice(0,8):[]}});
  }catch(e){return res.status(200).json({ok:false,products:[],error:String(e)});}
}
