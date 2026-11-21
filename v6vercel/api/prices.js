
import { loadStore, saveStore, storageMode } from './_store.js';
export default async function handler(req,res){
  let S = await loadStore('bb:prices', {overrides:{}, lastRefresh:null, lastRefreshAt:null, lastAutoCount:0, history:[]});
  if(req.method==='GET') return res.status(200).json({ok:true, storage:storageMode(), overrides:S.overrides||{}, lastRefresh:S.lastRefresh, lastRefreshAt:S.lastRefreshAt, lastAutoCount:S.lastAutoCount, history:(S.history||[]).slice(-10)});
  if(req.method!=='POST') return res.status(405).json({ok:false});
  let b={}; try{b=typeof req.body==='string'?JSON.parse(req.body):(req.body||{});}catch(e){}
  if(b.action==='set'){
    const items=Array.isArray(b.items)?b.items:(b.id?[{id:b.id,price:b.price}]:[]);
    let n=0; S.overrides=S.overrides||{};
    for(const it of items){ const p=Number(it.price); if(it.id && p>0){ S.overrides[String(it.id)]=Math.round(p); n++; } }
    S.history=(S.history||[]); S.history.push({at:new Date().toISOString(), type:'manual', count:n});
    await saveStore('bb:prices', S);
    return res.status(200).json({ok:true, storage:storageMode(), saved:n, overrides:S.overrides});
  }
  if(b.action==='clear'){
    if(Array.isArray(b.ids)){ for(const id of b.ids) delete S.overrides[String(id)]; } else S.overrides={};
    S.history=(S.history||[]); S.history.push({at:new Date().toISOString(), type:'clear-manual', count:Array.isArray(b.ids)?b.ids.length:0});
    await saveStore('bb:prices', S);
    return res.status(200).json({ok:true, storage:storageMode(), overrides:S.overrides});
  }
  if(b.action==='mark-refresh'){
    S.lastRefresh=b.date||new Date().toISOString().slice(0,10); S.lastRefreshAt=new Date().toISOString(); S.lastAutoCount=Number(b.count||0);
    S.history=(S.history||[]); S.history.push({at:S.lastRefreshAt, type:'auto-07:00', count:S.lastAutoCount});
    await saveStore('bb:prices', S);
    return res.status(200).json({ok:true, storage:storageMode(), lastRefresh:S.lastRefresh});
  }
  return res.status(400).json({ok:false, message:'action tidak dikenal'});
}
