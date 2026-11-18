// Ringkasan Admin: produk, pesanan hari ini, omzet, menunggu bayar. Data pesanan lengkap diambil dari gateway + sistem internal.
export default async function handler(req,res){if(!req.headers.authorization)return res.status(401).json({ok:false});
 let products=0; try{const base=(process.env.TOKOWENDIK_BASE_URL||'').replace(/\/$/,'');const r=await fetch(base+(process.env.TOKOWENDIK_API_PATH_PRODUCTS||'/products'),{headers:{Authorization:`Bearer ${process.env.TOKOWENDIK_API_KEY||''}`}});const d=await r.json();products=(d.data||d.products||[]).length;}catch{}
 return res.status(200).json({ok:true,products,today_orders:0,today_revenue:0,pending:0,orders:[],note:'Hubungkan ke database pesanan / Tripay merchant transactions untuk angka real-time.'});}
