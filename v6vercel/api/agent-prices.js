
let S=globalThis.__BB_AGENT_PRICES__||(globalThis.__BB_AGENT_PRICES__={overrides:{}});
export default async function handler(req,res){
 if(req.method==='GET') return res.status(200).json({ok:true, overrides:S.overrides});
 if(req.method!=='POST') return res.status(405).json({ok:false});
 let b={}; try{b=typeof req.body==='string'?JSON.parse(req.body):(req.body||{});}catch(e){}
 if(b.action==='set'){ const items=Array.isArray(b.items)?b.items:(b.id?[{id:b.id,price:b.price}]:[]); let n=0; for(const it of items){const p=Number(it.price); if(it.id&&p>0){S.overrides[String(it.id)]=Math.round(p); n++;}} return res.status(200).json({ok:true,saved:n,overrides:S.overrides}); }
 if(b.action==='clear'){ if(Array.isArray(b.ids)){for(const id of b.ids) delete S.overrides[String(id)];} else S.overrides={}; return res.status(200).json({ok:true,overrides:S.overrides}); }
 return res.status(400).json({ok:false});
}
