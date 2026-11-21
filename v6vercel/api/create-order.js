
import crypto from 'crypto';
function clean(v){return String(v||'').trim().replace(/^bearer\s+/i,'').trim();}
const PAYMAP={
  'BCA Virtual Account':'BC','BCA Transfer':'BC','BCA':'BC',
  'BNI Virtual Account':'I1','BNI':'I1',
  'BRI Virtual Account':'A1','BRI':'A1',
  'Mandiri Virtual Account':'M1','Mandiri':'M1',
  'CIMB Virtual Account':'B1','CIMB':'B1',
  'Permata Virtual Account':'BT','Permata':'BT',
  'Maybank Virtual Account':'VA','Maybank':'VA',
  'DANA':'DA','OVO':'OV','Gopay':'GP','ShopeePay':'SP','QRIS':'QR','LinkAja':'LA',
};

// V17 ADMIN STORE - order disimpan di memori instance + dikirim ke log
// Untuk laporan permanen di Vercel, aktifkan Upstash Redis / Vercel KV (lihat README ADMIN).
// Sampai KV aktif, order juga tersimpan di browser customer (localStorage) + WA admin, dan admin bisa export CSV.
if(!globalThis.__BB_ORDERS) globalThis.__BB_ORDERS=[];
function saveOrder(o){ globalThis.__BB_ORDERS.unshift(o); if(globalThis.__BB_ORDERS.length>500) globalThis.__BB_ORDERS.pop(); return o; }
function orderMode(pay){ const s=String(pay||'').toLowerCase(); if(s.includes('virtual')||s.includes('va')||s.includes('duitku')) return 'VA'; return 'MANUAL'; }

export default async function handler(req,res){
  if(req.method!=='POST') return res.status(405).json({ok:false,message:'Method tidak diizinkan'});
  try{
    const b=req.body||{};
    const orderCode='BB'+new Date().toISOString().slice(0,10).replace(/-/g,'')+'-'+Math.floor(1000+Math.random()*9000);
    const amount=Math.ceil(Number(b.price||0));
    const merchantCode=clean(process.env.DUITKU_MERCHANT_CODE||process.env.DUITKU_API_KEY||'');
    const merchantKey=clean(process.env.DUITKU_MERCHANT_KEY||process.env.DUITKU_API_KEY_SECRET||process.env.DUITKU_PRIVATE_KEY||'');
    const siteUrl=(process.env.SITE_URL||'https://blueberrytopup.com').replace(/\/$/,'');
    // If Duitku not configured yet -> manual fallback, NO fake VA
    if(!merchantCode || !merchantKey){
      return res.status(200).json({ok:true,orderCode,va_number:null,duitku:false,amount,message:'Pesanan dibuat (Virtual Account sedang perbaikan, lanjutkan proses transaksi via Admin). Transfer ke rekening yang tertera + konfirmasi via WhatsApp dengan kode '+orderCode+'. Admin akan proses manual.'});
    }
    const paymentMethod=PAYMAP[b.payment]||PAYMAP[b.paymentMethod]||'BC';
    const signature=crypto.createHash('md5').update(merchantCode+orderCode+amount+merchantKey).digest('hex');
    const payload={
      merchantCode, paymentAmount:amount, paymentMethod,
      merchantOrderId:orderCode,
      productDetails:((b.gameId==='VOUCHER'||b.gameId==='-'?'[VOUCHER] ':'[DIRECT] ')+(b.productName||'Top Up')+' - '+(b.gameId||'')),
      additionalParam:'', merchantUserInfo:b.whatsapp||'',
      customerVaName:'BLUEBERRY '+(b.gameId||'CUSTOMER').toString().slice(0,20),
      email:'customer@blueberrytopup.com', phoneNumber:String(b.whatsapp||''),
      itemDetails:[{name:String(b.productName||'Top Up').slice(0,50),price:amount,quantity:1}],
      customerDetail:{firstName:'Customer',lastName:'Blueberry',email:'customer@blueberrytopup.com',phoneNumber:String(b.whatsapp||'')},
      callbackUrl:siteUrl+'/api/duitku-webhook', returnUrl:siteUrl, expiryPeriod:1440, signature
    };
    const r=await fetch('https://passport.duitku.com/webapi/api/merchant/v2/inquiry',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
    const j=await r.json().catch(()=>null);
    // Duitku v2 returns reference + paymentUrl + vaNumber (for VA methods)
    if(j && (j.reference || j.vaNumber || j.paymentUrl)){
      return res.status(200).json({ok:true,orderCode,va_number:j.vaNumber||null,va_name:j.customerVaName||'BLUEBERRY',method:paymentMethod,reference:j.reference||'',paymentUrl:j.paymentUrl||'',amount:j.amount||amount,duitku:true,message:j.vaNumber?'Virtual Account Duitku berhasil dibuat. Bayar dari bank apapun ke VA ini.':'Link pembayaran Duitku berhasil dibuat. Klik link untuk bayar.'});
    }
    return res.status(200).json({ok:true,orderCode,va_number:null,duitku:false,amount,message:'Duitku menolak transaksi: '+(j?JSON.stringify(j).slice(0,200):'no response')+'. Coba lagi / transfer manual.'});
  }catch(e){ return res.status(200).json({ok:false,message:'Gagal buat pesanan: '+String(e).slice(0,150)}); }
}
