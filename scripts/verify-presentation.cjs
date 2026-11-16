// Local presentation integration checks; no keys/cookies are printed.
const assert=require('node:assert/strict');
const BASE='http://127.0.0.1:3000';
async function json(path,options={}){const r=await fetch(BASE+path,{...options,headers:{origin:BASE,'Content-Type':'application/json',...options.headers}});return {r,p:await r.json()};}
(async()=>{
 let result=await json('/api/admin/moderation');assert.equal(result.r.status,401);
 result=await json('/api/admin/session',{method:'POST',body:JSON.stringify({login:'@teste',password:'senha-incorreta'})});assert.equal(result.r.status,401);
 result=await json('/api/admin/session',{method:'POST',body:JSON.stringify({login:'@teste',password:process.env.UAIBORA_QA_PASSWORD})});assert.equal(result.r.status,200);
 const cookie=result.r.headers.get('set-cookie').split(';')[0];
 result=await json('/api/admin/moderation',{headers:{cookie}});assert.equal(result.r.status,200);assert.ok(Array.isArray(result.p.places));assert.ok(result.p.events.length>=3);
 const id='e0000000-0000-4000-8000-000000000001';
 try {
  result=await json('/api/admin/moderation',{method:'POST',headers:{cookie},body:JSON.stringify({kind:'events',id,action:'reject'})});assert.equal(result.r.status,200);
  result=await json('/api/eventos');assert.equal(result.r.status,200);assert.equal(result.p.data.some(row=>row.id===id),false);
 } finally {
  const restore=await json('/api/admin/moderation',{method:'POST',headers:{cookie},body:JSON.stringify({kind:'events',id,action:'approve'})});assert.equal(restore.r.status,200,'Restore demonstration event');
 }
 result=await json('/api/eventos');const event=result.p.data.find(row=>row.id===id);assert.ok(event);assert.equal(event.is_demo,true);assert.equal(event.place_id,'b0000000-0000-4000-8000-000000000001');
 result=await json('/api/admin/moderation',{method:'POST',headers:{cookie},body:JSON.stringify({kind:'events',id,action:'delete'})});assert.equal(result.r.status,400);
 result=await json('/api/admin/session',{method:'DELETE',headers:{cookie}});assert.equal(result.r.status,200);
 console.log('Admin: acesso negado sem sessão, login, listagem, rejeição/aprovação e vínculo evento-local passaram. Evento demonstrativo restaurado.');
})().catch(e=>{console.error(e.message);process.exitCode=1;});
