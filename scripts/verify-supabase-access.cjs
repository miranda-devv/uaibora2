// Read-only GETs and rejected POSTs with an empty body (cannot create a valid row).
// node --env-file=.env.local scripts/verify-supabase-access.cjs
const base=process.env.NEXT_PUBLIC_SUPABASE_URL;
const key=process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
if(!base||!key){console.error('Conexão não configurada.');process.exit(2);}
(async()=>{
 let failed=false;
 const headers={apikey:key,'Content-Type':'application/json'};
 for(const table of ['uaibora_places','uaibora_events','uaibora_suggestions','uaibora_favorites']){
  const endpoint=new URL('/rest/v1/'+table,base);
  endpoint.searchParams.set('select',table==='uaibora_favorites'?'item_id':'id');endpoint.searchParams.set('limit','1');
  const response=await fetch(endpoint,{headers,signal:AbortSignal.timeout(15000)});
  const expected=table==='uaibora_favorites'?[401,403]:[200];
  console.log(table+' leitura visitante: HTTP '+response.status);
  if(!expected.includes(response.status))failed=true;
  const write=await fetch(new URL('/rest/v1/'+table,base),{method:'POST',headers,body:'{}',signal:AbortSignal.timeout(15000)});
  console.log(table+' escrita visitante: HTTP '+write.status);
  if(![401,403].includes(write.status))failed=true;
 }
 process.exitCode=failed?1:0;
})().catch(()=>{console.error('Verificação de rede indisponível.');process.exitCode=1;});
