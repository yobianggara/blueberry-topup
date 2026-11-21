
// V19 - Registrasi: simpan + auto kirim notif ke raffmong@gmail.com
// Cara kirim email: pakai RESEND_API_KEY kalau ada di Vercel Env (gratis, 100 email/hari).
// Kalau belum ada key, data tetap tersimpan di Admin + tombol "Kirim ke Email" di Admin.
// Jadi tidak ada data yang hilang.
let REG = globalThis.__BB_REG__ || (globalThis.__BB_REG__ = []);
export default async function handler(req,res){
  if(req.method==='GET'){
    return res.status(200).json({ok:true, count:REG.length, registrations:REG.slice().reverse()});
  }
  if(req.method!=='POST') return res.status(405).json({ok:false});
  let b={}; try{ b=typeof req.body==='string'?JSON.parse(req.body):(req.body||{}); }catch(e){}
  const nama=String(b.nama||'').trim(); const wa=String(b.wa||b.whatsapp||'').trim(); const email=String(b.email||'').trim(); const username=String(b.username||'').trim();
  if(!nama || !wa || !email) return res.status(400).json({ok:false, message:'Nama, WhatsApp, dan Email wajib diisi.'});
  if(!/^\S+@\S+\.\S+$/.test(email)) return res.status(400).json({ok:false, message:'Format email tidak valid.'});
  const digits=wa.replace(/\D/g,''); if(digits.length<9) return res.status(400).json({ok:false, message:'Nomor WhatsApp tidak valid.'});
  if(REG.some(r=>r.email.toLowerCase()===email.toLowerCase())) return res.status(400).json({ok:false, message:'Email ini sudah terdaftar. Silakan login / pakai email lain.'});
  const rec={id:'REG-'+Date.now().toString().slice(-8), nama, wa:digits, email, username:username||email.split('@')[0], createdAt:new Date().toISOString(), emailSent:false, emailError:null};
  REG.push(rec);
  // Kirim email via Resend kalau ada key
  const key=(process.env.RESEND_API_KEY||'').trim();
  if(key){
    try{
      const r=await fetch('https://api.resend.com/emails',{method:'POST',headers:{'Authorization':'Bearer '+key,'Content-Type':'application/json'},body:JSON.stringify({from:'Blueberry Topup <onboarding@resend.dev>', to:['raffmong@gmail.com'], subject:'[Blueberry] Pendaftar Baru: '+nama, html:`<h2>Pendaftar Baru - Blueberry Topup</h2><p><b>Nama:</b> ${nama}</p><p><b>WhatsApp:</b> ${digits}</p><p><b>Email:</b> ${email}</p><p><b>Username:</b> ${rec.username}</p><p><b>ID Registrasi:</b> ${rec.id}</p><p><b>Waktu:</b> ${new Date(rec.createdAt).toLocaleString('id-ID',{timeZone:'Asia/Jakarta'})} WIB</p><p>Lihat di Admin: blueberrytopup.com/admin</p>`})});
      if(r.ok){ rec.emailSent=true; } else { rec.emailError='Resend HTTP '+r.status; }
    }catch(e){ rec.emailError=String(e).slice(0,120); }
  } else {
    rec.emailError='RESEND_API_KEY belum diisi di Vercel - data tersimpan di Admin, kirim manual via tombol di Admin.';
  }
  return res.status(200).json({ok:true, registration:rec, emailSent:rec.emailSent, emailNote: rec.emailSent ? 'Notifikasi sudah terkirim ke raffmong@gmail.com' : 'Tersimpan di Admin. Aktifkan RESEND_API_KEY di Vercel agar auto-kirim email (lihat README-REGISTRASI).'});
}
