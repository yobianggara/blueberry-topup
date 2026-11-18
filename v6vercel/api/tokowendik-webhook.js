// Webhook status dari supplier: unpaid / processing / success / failed / expired / refund
// Pasang URL ini di: Member > Settings > Webhook di dashboard supplier:
// https://blueberrytopup.com/api/tokowendik-webhook
export default async function handler(req,res){
 if(req.method!=='POST')return res.status(405).json({ok:false});
 const {webhook_type,reference,status}=req.body||{};
 // Di sini: update status pesanan di database berdasarkan reference + status
 return res.status(200).json({status:200,message:'Webhook berhasil diproses',reference,status});
}
