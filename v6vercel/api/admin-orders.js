
// V17 ADMIN API - laporan penjualan harian & bulanan, manual + VA
// GET /api/admin-orders -> list order (filter ?day=YYYY-MM-DD &month=YYYY-MM &mode=MANUAL/VA &status=...)
// GET /api/admin-orders?report=1 -> ringkasan harian + bulanan
// POST /api/admin-orders {action:'update-status', code, status} -> ubah status (DIPROSES / SELESAI / DIBATALKAN)
// Catatan: data di globalThis.__BB_ORDERS (memori instance). Untuk permanen, sambungkan Vercel KV / Upstash (lihat README).
if(!globalThis.__BB_ORDERS) globalThis.__BB_ORDERS=[];
export default async function handler(req,res){
  const orders=globalThis.__BB_ORDERS||[];
  if(req.method==='POST'){
    try{
      const b=typeof req.body==='string'?JSON.parse(req.body):(req.body||{});
      if(b.action==='update-status' && b.code){
        const o=orders.find(x=>x.code===b.code);
        if(o){ o.status=b.status||o.status; o.updatedAt=new Date().toISOString(); return res.status(200).json({ok:true, order:o}); }
        return res.status(404).json({ok:false, message:'Order tidak ditemukan (mungkin server restart / belum ada KV).'});
      }
      if(b.action==='add' && b.order){ orders.unshift(b.order); return res.status(200).json({ok:true}); }
      return res.status(400).json({ok:false, message:'Action tidak dikenal'});
    }catch(e){ return res.status(500).json({ok:false, message:String(e)}); }
  }
  // REPORT
  const {day, month, mode, status} = req.query||{};
  let filtered=[...orders];
  if(day) filtered=filtered.filter(o=>o.day===day);
  if(month) filtered=filtered.filter(o=>o.month===month);
  if(mode) filtered=filtered.filter(o=>o.mode===mode);
  if(status) filtered=filtered.filter(o=>o.status===status);
  const sum=(arr)=>arr.reduce((a,o)=>a+Number(o.amount||o.price||0),0);
  const byDay={}; const byMonth={};
  for(const o of orders){
    if(!byDay[o.day]) byDay[o.day]={day:o.day, total:0, count:0, manual:0, va:0, selesai:0};
    byDay[o.day].total+=Number(o.amount||0); byDay[o.day].count++; if(o.mode==='VA') byDay[o.day].va++; else byDay[o.day].manual++; if(String(o.status).includes('SELESAI')) byDay[o.day].selesai++;
    if(!byMonth[o.month]) byMonth[o.month]={month:o.month, total:0, count:0, manual:0, va:0, selesai:0};
    byMonth[o.month].total+=Number(o.amount||0); byMonth[o.month].count++; if(o.mode==='VA') byMonth[o.month].va++; else byMonth[o.month].manual++; if(String(o.status).includes('SELESAI')) byMonth[o.month].selesai++;
  }
  const daily=Object.values(byDay).sort((a,b)=>b.day.localeCompare(a.day));
  const monthly=Object.values(byMonth).sort((a,b)=>b.month.localeCompare(a.month));
  const today=new Date().toISOString().slice(0,10);
  const thisMonth=new Date().toISOString().slice(0,7);
  const todayOrders=orders.filter(o=>o.day===today);
  const monthOrders=orders.filter(o=>o.month===thisMonth);
  return res.status(200).json({ok:true, total:orders.length, orders:filtered, report:{today:{day:today, count:todayOrders.length, total:sum(todayOrders), manual:todayOrders.filter(o=>o.mode!=='VA').length, va:todayOrders.filter(o=>o.mode==='VA').length}, thisMonth:{month:thisMonth, count:monthOrders.length, total:sum(monthOrders), manual:monthOrders.filter(o=>o.mode!=='VA').length, va:monthOrders.filter(o=>o.mode==='VA').length}, daily, monthly}, note:'Data di memori Vercel (reset saat redeploy / cold start). Aktifkan Vercel KV / Upstash untuk permanen. Export CSV di halaman admin untuk arsip.'});
}
