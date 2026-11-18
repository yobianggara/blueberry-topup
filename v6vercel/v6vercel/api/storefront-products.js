// Harga jual = harga internal * (1 + markup). Markup hanya dari Env server.
const MARKUP=Number(process.env.MARKUP_PCT||3);
export default async function handler(req,res){
 try{
  const base=(process.env.TOKOWENDIK_BASE_URL||'https://tokowendigg.com').replace(/\/$/,'');
  const path=process.env.TOKOWENDIK_API_PATH_PRODUCTS||'/api/prepaid/product';
  const r=await fetch(base+path,{headers:{'Authorization':`Bearer ${process.env.TOKOWENDIK_API_KEY||''}`,'Accept':'application/json'}});
  const d=await r.json().catch(()=>({}));
  const raw=d.data||d.products||[];
  // Format Tokowendik: data[] berisi provider / produk. Ambil yang punya harga.
  const products=[];
  const walk=(arr,game='')=>{ (arr||[]).forEach(p=>{ if(p.products||p.items) walk(p.products||p.items,p.name||p.provider||game); else { const modal=Number(p.price||p.cost||p.base_price||0); if(modal>0) products.push({name:p.name||p.product_name||'Produk',game:game||p.game||p.category||p.provider||'Lainnya',category:p.category||'',code:p.code||p.target_product_code||String(p.id||''),price:Math.round(modal*(1+MARKUP/100))}); } }) };
  walk(raw);
  return res.status(200).json({ok:true,products,count:products.length});
 }catch(e){return res.status(200).json({ok:false,products:[]})}
}
