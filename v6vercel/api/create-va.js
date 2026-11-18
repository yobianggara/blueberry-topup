// Membuat Virtual Account via gateway. Kunci gateway HANYA di Env server, tidak pernah ke browser.
// Gateway yang dipakai: Tripay (BRIVA = BCA VA, DANA = DANA VA). Jika Env gateway belum diisi, kembalikan error yang rapi — jangan tampilkan nomor VA palsu.
import crypto from 'crypto';
export default async function handler(req,res){
 if(req.method!=='POST')return res.status(405).json({ok:false,error:'Method tidak diizinkan'});
 const {product,player_id,server,method,email}=req.body||{};
 if(!product||!player_id||!email)return res.status(400).json({ok:false,error:'Lengkapi data pesanan.'});
 const invoice='BB-'+Date.now().toString().slice(-8);
 const amount=Number(product.price||0);
 const apiKey=process.env.TRIPAY_API_KEY, merchant=process.env.TRIPAY_MERCHANT_CODE, privateKey=process.env.TRIPAY_PRIVATE_KEY;
 if(!apiKey||!merchant||!privateKey) return res.status(200).json({ok:false,error:'GATEWAY_NOT_CONFIGURED',message:'Pembayaran Virtual Account belum diaktifkan. Admin: isi kunci gateway di Env Vercel lalu Redeploy.'});
 try{
  const signature=crypto.createHmac('sha256',privateKey).update(merchant+invoice+amount).digest('hex');
  const payload={method:method||'BRIVA',merchant_ref:invoice,amount,customer_name:(email||'Customer').split('@')[0],customer_email:email,customer_phone:'081200000000',order_items:[{sku:product.code||'TOPUP',name:product.name,price:amount,quantity:1}],return_url:process.env.SITE_URL||'https://blueberrytopup.com',expired_time:24,signature};
  const r=await fetch('https://tripay.co.id/api/transaction/create',{method:'POST',headers:{Authorization:'Bearer '+apiKey,'Content-Type':'application/json'},body:JSON.stringify(payload)});
  const j=await r.json();
  if(!j.success) return res.status(200).json({ok:false,error:'GATEWAY_ERROR',message:'Gagal membuat Virtual Account. Coba lagi.'});
  const d=j.data||{};
  return res.status(200).json({ok:true,invoice,amount,method_label:method==='DANA'?'DANA Virtual Account':'BCA Virtual Account',va_number:d.pay_code||d.pay_url||'',va_name:d.customer_name||'BLUEBERRY TOPUP',expired:d.expired_time||''});
 }catch(e){return res.status(200).json({ok:false,error:'GATEWAY_ERROR'})}
}
