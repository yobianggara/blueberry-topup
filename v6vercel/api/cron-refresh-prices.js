
// Vercel Cron: jalan tiap hari jam 00:00 UTC = 07:00 WIB. Narik harga supplier baru.
// Harga manual (override) TIDAK ditimpa - storefront yang gabungin: override menang.
export default async function handler(req,res){
  // Boleh dipanggil Cron Vercel, atau dipanggil manual dari Admin (tombol Refresh Harga)
  const today = new Date(new Date().toLocaleString('en-US',{timeZone:'Asia/Jakarta'})).toISOString().slice(0,10);
  // Tandai bahwa refresh 07:00 hari ini sudah jalan. Harga live selalu ditarik fresh dari supplier
  // lewat /api/storefront-products, jadi tidak perlu simpan ulang harga supplier di sini.
  let s = globalThis.__BB_PRICES__ || (globalThis.__BB_PRICES__ = {overrides:{}, lastRefresh:null, lastRefreshAt:null, lastAutoCount:0, history:[]});
  s.lastRefresh = today; s.lastRefreshAt = new Date().toISOString();
  s.history.push({at:s.lastRefreshAt, type:'auto-07:00', count:0});
  return res.status(200).json({ok:true, message:'Refresh harga 07:00 WIB selesai. Harga manual tetap dipertahankan.', date:today, overridesCount:Object.keys(s.overrides||{}).length});
}
