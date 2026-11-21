
import { loadStore, saveStore, storageMode } from './_store.js';
export default async function handler(req,res){
  const today = new Date(new Date().toLocaleString('en-US',{timeZone:'Asia/Jakarta'})).toISOString().slice(0,10);
  let s = await loadStore('bb:prices', {overrides:{}, lastRefresh:null, lastRefreshAt:null, lastAutoCount:0, history:[]});
  s.lastRefresh=today; s.lastRefreshAt=new Date().toISOString(); s.history=(s.history||[]); s.history.push({at:s.lastRefreshAt, type:'auto-07:00', count:0});
  await saveStore('bb:prices', s);
  return res.status(200).json({ok:true, storage:storageMode(), message:'Refresh harga 07:00 WIB selesai. Harga manual tetap dipertahankan.', date:today, overridesCount:Object.keys(s.overrides||{}).length});
}
