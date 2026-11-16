const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const ts = require('typescript');
function load(file, imports={}) {
  const context={exports:{},Response,URL,require:name=>{if(!(name in imports))throw Error(name);return imports[name];}};
  const code=ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText;
  vm.runInNewContext(code,context);return context.exports;
}
const validation=load('src/lib/catalog-validation.ts');
const draft={title:'Lugar de teste',category:'Cultura',location:'Belo Horizonte',description:'Descrição suficiente para validar o cadastro.'};
assert.equal(validation.validateCatalog(draft,'places').error,undefined);
for(const bad of [null,[],{...draft,title:' '},{...draft,description:'curta'}])assert.ok(validation.validateCatalog(bad,'places').error);
assert.ok(validation.validateCatalog({...draft,starts_at:'2026-12-01T10:00'},'events').error);
assert.ok(validation.validateCatalog({...draft,starts_at:'2026-12-01T10:00:00-03:00',ends_at:'2026-12-01T09:00:00-03:00'},'events').error);
assert.equal(validation.validateCatalog({...draft,starts_at:'2026-12-01T10:00:00-03:00'},'events').data.starts_at,'2026-12-01T13:00:00.000Z');
assert.equal(validation.validateCatalog({...draft,user_id:'outro',published:true},'places').data.published,undefined);
let currentUser={id:'usuario-A'}, inserted, filters=[];
const client={auth:{getUser:async()=>({data:{user:currentUser},error:null})},from:()=>({
 insert:payload=>{inserted=payload;return{select:()=>({single:async()=>({data:{id:'novo',published:false},error:null})})};},
 select:()=>({eq:(field,value)=>{filters.push([field,value]);return{order:()=>({limit:async()=>({data:[],error:null})})};}})
})};
const api=load('src/lib/supabase/catalog-api.ts',{'@/lib/request-origin':load('src/lib/request-origin.ts'),'./server':{getServerSupabase:async()=>client},'./catalog':{listPlaces:async()=>({data:[],error:null}),listEvents:async()=>({data:[],error:null})},'@/lib/catalog-validation':validation});
const request=(body,origin='http://localhost:3000')=>new Request('http://localhost:3000/api/lugares',{method:'POST',headers:{origin,'content-type':'application/json'},body:JSON.stringify(body)});
(async()=>{
 assert.equal((await api.catalogPost(request(draft,'https://outro.example'),'places')).status,403);
 assert.equal(inserted,undefined);
 currentUser=null;
 assert.equal((await api.catalogPost(request(draft),'places')).status,401);
 assert.equal((await api.catalogGet('places',new Request('http://localhost:3000/api/lugares?meus=1'))).status,401);
 currentUser={id:'usuario-A'};
 assert.equal((await api.catalogPost(request({...draft,user_id:'usuario-B',published:true}),'places')).status,201);
 assert.equal(inserted.user_id,'usuario-A');assert.equal(inserted.published,undefined);
 await api.catalogGet('places',new Request('http://localhost:3000/api/lugares?meus=1&user_id=usuario-B'));
 assert.deepEqual(filters,[['user_id','usuario-A']]);
 console.log('Validações de campos/datas, origem, sessão e autoria passaram (sem chamadas ao Supabase).');
})().catch(error=>{console.error(error.message);process.exitCode=1;});
