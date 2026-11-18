
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
  const base=(process.env.TOKOWENDIK_BASE_URL||'https://tokowendigg.com').replace(/\/$/,'');
  const path=process.env.TOKOWENDIK_API_PATH_PRODUCTS||'/api/prepaid/product';
  const key=process.env.TOKOWENDIK_API_KEY||''; const secret=process.env.TOKOWENDIK_SECRET_KEY||'';
  const url=base+path;
  // All common signature variants - try in order, stop at first that returns products
  const sigHmacSecretKey = crypto.createHmac('sha256',secret).update(key).digest('hex');
  const sigHmacKeySecret = crypto.createHmac('sha256',key).update(secret).digest('hex');
  const sigShaKeySecret = crypto.createHash('sha256').update(key+secret).digest('hex');
  const sigShaSecretKey = crypto.createHash('sha256').update(secret+key).digest('hex');
  const sigMd5KeySecret = crypto.createHash('md5').update(key+secret).digest('hex');
  const attempts = [
    {name:'GET hmac(secret,key) X-Api-Key+Signature', opts:{headers:{'X-Api-Key':key,'Signature':sigHmacSecretKey,'Accept':'application/json'}}},
    {name:'GET hmac(key,secret)', opts:{headers:{'X-Api-Key':key,'Signature':sigHmacKeySecret,'Accept':'application/json'}}},
    {name:'POST body api_key+signature hmac', opts:{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({api_key:key,signature:sigHmacSecretKey})}},
    {name:'POST body api_key+signature sha256(key+secret)', opts:{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({api_key:key,signature:sigShaKeySecret})}},
    {name:'POST body api_key+secret_key', opts:{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({api_key:key,secret_key:secret})}},
    {name:'GET Bearer', opts:{headers:{'Authorization':'Bearer '+key,'Accept':'application/json'}}},
    {name:'GET query api_key', opts:{headers:{'Accept':'application/json'}}, urlOverride:url+(url.includes('?')?'&':'?')+'api_key='+encodeURIComponent(key)},
  ];
  let lastMsg='', lastStatus=0, tried=[];
  for(const a of attempts){
    try{
      const r=await fetch(a.urlOverride||url, a.opts);
      const j=await r.json().catch(()=>null);
      tried.push(a.name+' -> HTTP '+r.status+' keys:'+(j?Object.keys(j).join(','):'no-json'));
      const raw=flatten(j||{});
      if(raw.length){
        const markup=parseFloat(process.env.MARKUP_PCT||'3')/100;
        const products=raw.map((p,i)=>{const bp=pickPrice(p);return{id:String(p.id||p.code||p.sku||p.product_code||i),name:pickName(p),category:pickCat(p),description:p.description||p.desc||p.detail||'',price:Math.ceil(bp*(1+markup))};}).filter(p=>p.price>0&&p.name!=='Produk');
        if(products.length){ res.setHeader('Cache-Control','s-maxage=60, stale-while-revalidate=120'); return res.status(200).json({ok:true,products,source:'live',debug:{http_status:r.status,raw_count:raw.length,used_attempt:a.name,base_used:base,path_used:path}}); }
      }
      // save supplier message for debugging
      if(j){ lastMsg = j.message||j.msg||j.status||JSON.stringify(j).slice(0,300); lastStatus=r.status; }
    }catch(e){ tried.push(a.name+' -> ERROR '+String(e).slice(0,100)); }
  }
  return res.status(200).json({ok:true,products:[],source:'live',debug:{http_status:lastStatus,raw_count:0,base_used:base,path_used:path,has_key:!!key,has_secret:!!secret,supplier_message:lastMsg,supplier_status:lastStatus,tried}});
}
