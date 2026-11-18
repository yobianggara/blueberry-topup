
import crypto from 'crypto';
function sig(key,secret){return crypto.createHmac('sha256',secret).update(key).digest('hex');}
export default async function handler(req,res){
  try{
    const base=(process.env.TOKOWENDIK_BASE_URL||'https://tokowendik.com').replace(/\/$/,'');
    const path=process.env.TOKOWENDIK_API_PATH_PRODUCTS||'/api/prepaid/product';
    const key=process.env.TOKOWENDIK_API_KEY||''; const secret=process.env.TOKOWENDIK_SECRET_KEY||'';
    const r=await fetch(base+path,{headers:{'X-Api-Key':key,'Signature':sig(key,secret),'Content-Type':'application/json'}});
    const j=await r.json().catch(()=>({}));
    const raw=j.data||j.products||j.result||[];
    const markup=parseFloat(process.env.MARKUP_PCT||'3')/100;
    const products=(Array.isArray(raw)?raw:[]).map((p,i)=>{const basePrice=Number(p.price||p.harga||p.nominal||0);return{id:String(p.id||p.code||p.sku||i),name:p.name||p.product_name||p.title||'Produk',category:p.category||p.brand||p.type||'Game',description:p.description||p.desc||'',price:Math.ceil(basePrice*(1+markup))};}).filter(p=>p.price>0);
    res.setHeader('Cache-Control','s-maxage=60, stale-while-revalidate=120');
    return res.status(200).json({ok:true,products,source:'live'});
  }catch(e){return res.status(200).json({ok:false,products:[]});}
}
