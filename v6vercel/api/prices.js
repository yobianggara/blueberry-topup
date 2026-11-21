
// V18 - Harga: Auto-refresh 07:00 + Edit manual per produk (override menang atas auto)
// Store in-memory (sama kayak orders). Kalau mau permanen, pindah ke Vercel KV - struktur datanya sama.
let STORE = globalThis.__BB_PRICES__ || (globalThis.__BB_PRICES__ = { overrides:{}, lastRefresh:null, lastRefreshAt:null, lastAutoCount:0, history:[] });
function nowWIB(){ return new Date(new Date().toLocaleString('en-US',{timeZone:'Asia/Jakarta'})); }
export default async function handler(req,res){
  if(req.method==='GET'){
    return res.status(200).json({ok:true, overrides:STORE.overrides, lastRefresh:STORE.lastRefresh, lastRefreshAt:STORE.lastRefreshAt, lastAutoCount:STORE.lastAutoCount, history:STORE.history.slice(-10)});
  }
  if(req.method==='POST'){
    let b={}; try{ b=typeof req.body==='string'?JSON.parse(req.body):(req.body||{}); }catch(e){}
    if(b.action==='set'){
      // b.items = [{id, price}] atau b.id + b.price
      const items = Array.isArray(b.items)?b.items:(b.id?[{id:b.id, price:b.price}]:[]);
      let n=0;
      for(const it of items){ const p=Number(it.price); if(it.id && p>0){ STORE.overrides[String(it.id)]=Math.round(p); n++; } }
      STORE.history.push({at:new Date().toISOString(), type:'manual', count:n});
      return res.status(200).json({ok:true, saved:n, overrides:STORE.overrides});
    }
    if(b.action==='clear'){
      // b.ids = [...] atau clear all
      if(Array.isArray(b.ids)){ for(const id of b.ids) delete STORE.overrides[String(id)]; }
      else STORE.overrides={};
      STORE.history.push({at:new Date().toISOString(), type:'clear-manual', count:Array.isArray(b.ids)?b.ids.length:0});
      return res.status(200).json({ok:true, overrides:STORE.overrides});
    }
    if(b.action==='mark-refresh'){
      STORE.lastRefresh=b.date||nowWIB().toISOString().slice(0,10);
      STORE.lastRefreshAt=new Date().toISOString();
      STORE.lastAutoCount=Number(b.count||0);
      STORE.history.push({at:STORE.lastRefreshAt, type:'auto-07:00', count:STORE.lastAutoCount});
      return res.status(200).json({ok:true, lastRefresh:STORE.lastRefresh});
    }
    return res.status(400).json({ok:false, message:'action tidak dikenal'});
  }
  return res.status(405).json({ok:false});
}
