
// Tokowendik Webhook - menerima update status transaksi dari Tokowendik
// Tokowendik kirim POST ke URL ini ketika status berubah:
// unpaid -> processing -> success / failed / expired / refund
export default async function handler(req,res){
  if(req.method!=='POST') return res.status(405).json({ok:false,message:'Method tidak diizinkan'});
  try{
    const b=req.body||{};
    // Tokowendik kirim: trx_id / order_id / status / message / data (bentuknya bisa beda per versi API)
    // Kita terima semua bentuk, log, dan balas OK agar Tokowendik tidak retry terus.
    // TODO produksi: di sini update status order di database berdasarkan b.trx_id / b.order_id
    // dan kalau status === 'success' + produk VOUCHER, kirim kode voucher ke WhatsApp customer.
    console.log('TOKOWENDIK WEBHOOK:', JSON.stringify(b).slice(0,2000));
    return res.status(200).json({ok:true,received:true,status:b.status||b.trx_status||'unknown'});
  }catch(e){
    return res.status(200).json({ok:false,message:String(e).slice(0,200)});
  }
}
