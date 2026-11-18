
import crypto from 'crypto';
function pickPrice(p){for(const k of ['harga_jual','price','harga','sell_price','nominal','cost','amount','harga_modal']){if(p[k]!=null && Number(p[k])>0) return Number(p[k]);}return 0;}
function pickName(p){return p.name||p.product_name||p.title||p.produk||p.label||'Produk';}
function pickCat(p){return p.category||p.brand||p.type||p.operator||p.game||'Game';}
function flatten(j){
  if(Array.isArray(j)) return j;
  if(!j||typeof j!=='object') return [];
  for(const k of ['data','products','result','items','list']){ if(j[k]!=null){const r=flatten(j[k]); if(r.length) return r;} }
  let out=[];
  for(const k of Object.keys(j)){ const v=j[k]; if(Array.isArray(v)) out=out.concat(v.map(x=>({...x,category:x.category||k}))); else if(v&&typeof v==='object'&&Array.isArray(v.products)) out=out.concat(v.products.map(x=>({...x,category:x.category||k}))); }
  return out;
}
export default async function handler(req,res){
  // TRIM is the fix: Vercel Env often has leading \n / space from copy-paste
  const base=(process.env.TOKOWENDIK_BASE_URL||'https://tokowendigg.com').trim().replace(/\/$/,'');
  const path=(process.env.TOKOWENDIK_API_PATH_PRODUCTS||'/api/prepaid/product').trim();
  const key=String(process.env.TOKOWENDIK_API_KEY||'').trim().replace(/[\r\n\s]/g,'');
  const secret=String(process.env.TOKOWENDIK_SECRET_KEY||'').trim().replace(/[\r\n\s]/g,'');
  const url=base+path;
  const sig = crypto.createHmac('sha256',secret).update(key).digest('hex');
  // Supplier says: Authorization: Bearer <api_key> - this is PRIMARY now
  const attempts = [
    {name:'GET Bearer (supplier request)', opts:{headers:{'Authorization':'Bearer '+key,'Accept':'application/json'}}},
    {name:'GET Bearer + X-Api-Key', opts:{headers:{'Authorization':'Bearer '+key,'X-Api-Key':key,'Accept':'application/json'}}},
    {name:'GET Bearer + Signature', opts:{headers:{'Authorization':'Bearer '+key,'Signature':sig,'Accept':'application/json'}}},
    {name:'POST Bearer', opts:{method:'POST',headers:{'Authorization':'Bearer '+key,'Content-Type':'application/json'},body:JSON.stringify({})}},
    {name:'GET X-Api-Key+Signature', opts:{headers:{'X-Api-Key':key,'Signature':sig,'Accept':'application/json'}}},
  ];
  let lastMsg='', lastStatus=0, tried=[];
  for(const a of attempts){
    try{
      const r=await fetch(url, a.opts);
      const j=await r.json().catch(()=>null);
      tried.push(a.name+' -> HTTP '+r.status+' keys:'+(j?Object.keys(j).join(','):'no-json'));
      const raw=flatten(j||{});
      if(raw.length){
        const markup=parseFloat(process.env.MARKUP_PCT||'3')/100;
        const products=raw.map((p,i)=>{const bp=pickPrice(p);return{id:String(p.id||p.code||p.sku||p.product_code||i),name:pickName(p),category:pickCat(p),description:p.description||p.desc||p.detail||'',price:Math.ceil(bp*(1+markup))};}).filter(p=>p.price>0&&p.name!=='Produk');
        if(products.length){ res.setHeader('Cache-Control','s-maxage=60, stale-while-revalidate=120'); return res.status(200).json({ok:true,products,source:'live',debug:{http_status:r.status,raw_count:raw.length,used_attempt:a.name,base_used:base,path_used:path}}); }
      }
      if(j){ lastMsg = j.message||j.msg||j.status||JSON.stringify(j).slice(0,300); lastStatus=r.status; }
    }catch(e){ tried.push(a.name+' -> ERROR '+String(e).slice(0,120)); }
  }
  return res.status(200).json({ok:true,products:[],source:'live',debug:{http_status:lastStatus,raw_count:0,base_used:base,path_used:path,has_key:!!key,has_secret:!!secret,key_length:key.length,key_prefix:key?key.slice(0,4)+'...'+key.slice(-2):'',supplier_message:lastMsg,supplier_status:lastStatus,tried}});
}
