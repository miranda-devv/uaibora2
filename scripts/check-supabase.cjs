// Run: node --env-file=.env.local scripts/check-supabase.cjs
// GET requests only. Never prints the key, auth settings, or database rows.
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
if (!url || !key) {
  console.log('Teste autenticado pendente: informe URL e chave publicavel completas em .env.local.');
  process.exit(2);
}
(async () => {
  const headers = {apikey: key};
  const auth = await fetch(new URL('/auth/v1/settings', url), {headers, signal: AbortSignal.timeout(15000)});
  console.log('Autenticacao: HTTP ' + auth.status);
  if (!auth.ok) { process.exitCode = 1; return; }
  for (const table of ['uaibora_places', 'uaibora_events', 'uaibora_suggestions']) {
    const endpoint = new URL('/rest/v1/' + table, url);
    endpoint.searchParams.set('select', 'id');
    endpoint.searchParams.set('limit', '1');
    const response = await fetch(endpoint, {headers, signal: AbortSignal.timeout(15000)});
    console.log(table + ': HTTP ' + response.status);
    if (!response.ok) process.exitCode = 1;
  }
})().catch(() => { console.error('Nao foi possivel concluir a verificacao de rede.'); process.exitCode = 1; });
