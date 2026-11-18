
function cleanKey(v){return String(v||'').trim().replace(/^bearer\s+/i,'').trim().replace(/[\r\n\s]/g,'');}
export default async function handler(req,res){
  if(req.method!=='POST') return res.status(405).json({ok:false,message:'Method tidak diizinkan'});
  try{
    const b=req.body||{};
    const key=cleanKey(process.env.TOKOWENDIK_API_KEY);
    const base='https://tokowendigg.com';
    const path=(process.env.TOKOWENDIK_API_PATH_ORDER||'/api/prepaid/transaction/deposit').trim();
    const r=await fetch(base+path,{method:'POST',headers:{'Authorization':'Bearer '+key,'Accept':'application/json','Content-Type':'application/json'},body:JSON.stringify({product_code:b.productId,product_id:b.productId,customer_no:b.gameId,game_id:b.gameId,zone:b.zone,whatsapp:b.whatsapp,payment:b.payment})});
    const j=await r.json().catch(()=>({}));
    return res.status(200).json({ok:true,message:'Pesanan diteruskan. Silakan selesaikan pembayaran via '+(b.payment||'DANA/BCA')+'.',data:j});
  }catch(e){return res.status(200).json({ok:true,message:'Pesanan diterima. Admin akan konfirmasi pembayaran via WhatsApp.'});}
}
