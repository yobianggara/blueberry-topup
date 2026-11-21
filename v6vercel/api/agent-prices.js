
import { loadStore, saveStore, storageMode } from './_store.js';
export default async function handler(req,res){
  let S = await loadStore('bb:agent-prices', {overrides:{}});
  if(req.method==='GET') return res.status(200).json({ok:true, storage:storageMode(), overrides:S.overrides||{}});
  if(req.method!=='POST') return res.status(405).json({ok:false});
  let b={}; try{b=typeof req.body==='string'?JSON.parse(req.body):(req.body||{});}catch(e){}
  if(b.action==='set'){ const items=Array.isArray(b.items)?b.items:(b.id?[{id:b.id,price:b.price}]:[]); let n=0; S.overrides=S.overrides||{}; for(const it of items){ const p=Number(it.price); if(it.id&&p>0){ S.overrides[String(it.id)]=Math.round(p); n++; } } await saveStore('bb:agent-prices', S); return res.status(200).json({ok:true, storage:storageMode(), saved:n, overrides:S.overrides}); }
  if(b.action==='clear'){ if(Array.isArray(b.ids)){ for(const id of b.ids) delete S.overrides[String(id)]; } else S.overrides={}; await saveStore('bb:agent-prices', S); return res.status(200).json({ok:true, storage:storageMode(), overrides:S.overrides}); }
  return res.status(400).json({ok:false});
}
