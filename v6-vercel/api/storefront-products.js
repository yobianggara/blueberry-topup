// Harga jual = harga internal * (1 + markup). Markup hanya dari Env server. Browser tidak pernah menerima harga modal / kunci.
const MARKUP=Number(process.env.MARKUP_PCT||3);
export default async function handler(req,res){
 try{const base=(process.env.TOKOWENDIK_BASE_URL||'').replace(/\/$/,'');const path=process.env.TOKOWENDIK_API_PATH_PRODUCTS||'/products';
 const r=await fetch(base+path,{headers:{Authorization:`Bearer ${process.env.TOKOWENDIK_API_KEY||''}`,'X-Secret':process.env.TOKOWENDIK_SECRET_KEY||'','Content-Type':'application/json'}});
 const d=await r.json().catch(()=>({}));const raw=d.data||d.products||d.items||[];
 const products=raw.map((p,i)=>{const modal=Number(p.price||p.modal||p.cost||0);return{name:p.name||p.product_name||'Produk',game:p.game||p.category||p.provider||'Lainnya',category:p.category||'',code:p.code||p.id||String(i),price:Math.round(modal*(1+MARKUP/100))}}).filter(p=>p.price>0);
 return res.status(200).json({ok:true,products,count:products.length});
 }catch(e){return res.status(200).json({ok:false,products:[]})}
}
