
export default async function handler(req,res){
 if(req.method!=='POST') return res.status(405).json({ok:false,message:'Metode tidak didukung'});
 let b={}; try{b=typeof req.body==='string'?JSON.parse(req.body):(req.body||{});}catch(e){}
 const email=String(b.email||'').trim().toLowerCase(); const sandi=String(b.sandi||b.password||'');
 const list=globalThis.__BB_AGENTS__||[];
 const a=list.find(x=>String(x.email||'').toLowerCase()===email);
 if(!a) return res.status(404).json({ok:false,message:'Email ini belum terdaftar sebagai agen. Daftar dulu jadi agen, lalu tunggu Admin menyetujui.'});
 if(a.status!=='Approved') return res.status(403).json({ok:false,message:'Pendaftaran agen kamu masih menunggu persetujuan Admin. Cek WA / email kamu.'});
 if(!a.sandi || a.sandi!==sandi) return res.status(401).json({ok:false,message:'Sandi agen salah. Minta sandi yang benar ke Admin via WA.'});
 return res.status(200).json({ok:true, agent:{id:a.id,nama:a.nama,email:a.email,wa:a.wa}});
}
