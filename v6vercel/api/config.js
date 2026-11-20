
export default async function handler(req,res){
  const duitkuActive=!!(process.env.DUITKU_MERCHANT_CODE && (process.env.DUITKU_MERCHANT_KEY||process.env.DUITKU_PRIVATE_KEY));
  return res.status(200).json({ok:true,whatsapp:process.env.WHATSAPP_NUMBER||'',has_bca:!!process.env.BCA_ACCOUNT,bca_last4:process.env.BCA_ACCOUNT?String(process.env.BCA_ACCOUNT).slice(-4):'',duitku_active:duitkuActive,tripay_active:false,gateway:'duitku'});
}
