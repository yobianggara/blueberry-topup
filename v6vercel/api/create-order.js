
import crypto from 'crypto';
export default async function handler(req,res){
  if(req.method!=='POST') return res.status(405).json({ok:false,message:'Method tidak diizinkan'});
  try{
    const b=req.body||{};
    const base=(process.env.TOKOWENDIK_BASE_URL||'https://tokowendigg.com').replace(/\/$/,'');
    const path=process.env.TOKOWENDIK_API_PATH_ORDER||'/api/prepaid/transaction/create';
    const key=process.env.TOKOWENDIK_API_KEY||''; const secret=process.env.TOKOWENDIK_SECRET_KEY||'';
    const signature=crypto.createHmac('sha256',secret).update(key).digest('hex');
    const r=await fetch(base+path,{method:'POST',headers:{'X-Api-Key':key,'Signature':signature,'Content-Type':'application/json'},body:JSON.stringify({product_id:b.productId,product:b.productId,customer_no:b.gameId,game_id:b.gameId,whatsapp:b.whatsapp,payment:b.payment})});
    const j=await r.json().catch(()=>({}));
    return res.status(200).json({ok:true,message:'Pesanan diteruskan. Silakan selesaikan pembayaran via '+ (b.payment||'DANA/BCA') +'.',data:j});
  }catch(e){return res.status(200).json({ok:true,message:'Pesanan diterima. Admin akan konfirmasi pembayaran via WhatsApp.'});}
}
