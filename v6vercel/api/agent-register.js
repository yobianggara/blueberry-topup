
// V20 - Registrasi AGEN: data masuk ke WA owner (6288802561769) + tersimpan di Admin untuk approval.
// TIDAK ada lagi kirim ke email raffmong@gmail.com, TIDAK ada notif lonceng.
// Flow: customer isi form -> data disimpan (status: Menunggu Approval) -> WA owner kebuka otomatis dengan pesan lengkap
// -> owner balas via WA / email pendaftar untuk konfirmasi -> owner klik Approve di Admin -> agen dapat harga agen.
let AGENTS = globalThis.__BB_AGENTS__ || (globalThis.__BB_AGENTS__ = []);
export default async function handler(req,res){
  if(req.method==='GET'){
    return res.status(200).json({ok:true, count:AGENTS.length, agents:AGENTS.slice().reverse().map(a=>({id:a.id,nama:a.nama,wa:a.wa,email:a.email,kota:a.kota,alasan:a.alasan,status:a.status,createdAt:a.createdAt,hasSandi:!!a.sandi}))});
  }
  if(req.method!=='POST') return res.status(405).json({ok:false});
  let b={}; try{ b=typeof req.body==='string'?JSON.parse(req.body):(req.body||{}); }catch(e){}
  if(b.action==='setStatus'){ const it=AGENTS.find(a=>a.id===b.id); if(it){ it.status=b.status; if(b.sandi) it.sandi=String(b.sandi); if(b.password) it.sandi=String(b.password); } return res.status(200).json({ok:true, agent:it}); }
  const nama=String(b.nama||'').trim(); const wa=String(b.wa||b.whatsapp||'').trim(); const email=String(b.email||'').trim(); const kota=String(b.kota||'').trim(); const alasan=String(b.alasan||'').trim();
  if(!nama || !wa || !email) return res.status(400).json({ok:false, message:'Nama, WhatsApp, dan Email wajib diisi.'});
  if(!/^\S+@\S+\.\S+$/.test(email)) return res.status(400).json({ok:false, message:'Format email tidak valid.'});
  const digits=wa.replace(/\D/g,''); if(digits.length<9) return res.status(400).json({ok:false, message:'Nomor WhatsApp tidak valid.'});
  if(AGENTS.some(a=>a.email.toLowerCase()===email.toLowerCase())) return res.status(400).json({ok:false, message:'Email ini sudah daftar jadi agen. Tunggu konfirmasi dari Admin via WA / email ya.'});
  const rec={id:'AGEN-'+Date.now().toString().slice(-8), nama, wa:digits, email, kota, alasan, status:'Menunggu Approval', createdAt:new Date().toISOString()};
  AGENTS.push(rec);
  return res.status(200).json({ok:true, agent:rec});
}
