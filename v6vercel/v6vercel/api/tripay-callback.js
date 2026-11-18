// Callback dari gateway: verifikasi signature, tandai lunas, teruskan order ke sistem internal. Endpoint ini HANYA dipanggil gateway, bukan browser.
import crypto from 'crypto';
export default async function handler(req,res){
 if(req.method!=='POST')return res.status(405).json({ok:false});
 const {merchant_ref,status}=req.body||{};
 const sig=req.headers['x-callback-signature']||''; const expected=crypto.createHmac('sha256',process.env.TRIPAY_PRIVATE_KEY||'').update(JSON.stringify(req.body)).digest('hex');
 if(!process.env.TRIPAY_PRIVATE_KEY||sig!==expected) return res.status(401).json({ok:false,error:'Signature tidak valid'});
 if(status==='PAID'){ /* Di sini: simpan status PAID + forward order ke sistem internal via server-to-server */ }
 return res.status(200).json({ok:true,merchant_ref,status});
}
