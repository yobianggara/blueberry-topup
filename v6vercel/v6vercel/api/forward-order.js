// Teruskan order ke supplier. Dipanggil server setelah pembayaran VA PAID / Admin verifikasi.
// Header benar dari dokumentasi: Authorization: Bearer API_KEY + Signature: SECRET_KEY
export default async function handler(req,res){
 if(req.method!=='POST')return res.status(405).json({ok:false});
 if(!req.headers.authorization) return res.status(401).json({ok:false});
 const {target_product_code,forms}=req.body||{};
 if(!target_product_code) return res.status(400).json({ok:false,error:'Kode produk wajib'});
 const base=(process.env.TOKOWENDIK_BASE_URL||'https://tokowendigg.com').replace(/\/$/,'');
 const path=process.env.TOKOWENDIK_API_PATH_ORDER||'/api/prepaid/transaction/create';
 const r=await fetch(base+path,{method:'POST',headers:{'Authorization':`Bearer ${process.env.TOKOWENDIK_API_KEY||''}`,'Signature':process.env.TOKOWENDIK_SECRET_KEY||'','Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify({target_product_code,...(forms||{})})});
 const j=await r.json().catch(()=>({}));
 return res.status(200).json({ok:true,supplier:j});
}
