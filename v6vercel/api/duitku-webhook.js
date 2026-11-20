
import crypto from 'crypto';
function clean(v){return String(v||'').trim();}
export default async function handler(req,res){
  if(req.method!=='POST') return res.status(405).send('Method tidak diizinkan');
  try{
    const b=req.body||{};
    const merchantCode=clean(process.env.DUITKU_MERCHANT_CODE||'');
    const merchantKey=clean(process.env.DUITKU_MERCHANT_KEY||'');
    // Duitku callback signature: MD5(merchantCode + amount + merchantOrderId + merchantKey)
    const expected=crypto.createHash('md5').update(merchantCode+String(b.amount||'')+String(b.merchantOrderId||'')+merchantKey).digest('hex');
    if(b.signature && b.signature!==expected){
      return res.status(400).send('Signature tidak valid');
    }
    // resultCode 00 = Success. For now we just acknowledge - order status is confirmed via WhatsApp / Duitku dashboard.
    // A production version would update order status in a DB here.
    if(String(b.resultCode)==='00'){
      return res.status(200).send('SUCCESS');
    }
    return res.status(200).send('OK');
  }catch(e){ return res.status(500).send('Error'); }
}
