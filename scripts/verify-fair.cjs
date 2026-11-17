// Dados de teste ficam separados das participações reais.
// Uso: UAIBORA_QA_PASSWORD no ambiente + node --env-file=.env.local scripts/verify-fair.cjs
const assert = require('node:assert/strict');
const {randomUUID} = require('node:crypto');
const {createClient} = require('@supabase/supabase-js');
const base = 'http://127.0.0.1:3000';
const json = {'Content-Type': 'application/json', Origin: base};
async function post(body, headers = json) {return fetch(base + '/api/feira-tecnica', {method: 'POST', headers, body: JSON.stringify(body)});}

(async () => {
  assert.equal((await fetch(base + '/api/admin/feira-tecnica')).status, 401);
  const row = {id: randomUUID(), name: 'Teste automatizado da equipe', free_place: 'Lugar gratuito de teste', free_reason: 'Motivo fictício para verificar a gravação protegida.', paid_place: 'Lugar pago de teste', paid_reason: 'Outro motivo fictício para validar a pesquisa.', consent: true};
  assert.equal((await post({...row, free_reason: ''})).status, 400);
  assert.equal((await post({...row, paid_place: ''})).status, 400);
  assert.equal((await post({...row, consent: false})).status, 400);
  assert.equal((await post(row, {...json, Origin: 'https://example.org'})).status, 403);
  assert.equal((await post(row, {...json, 'x-uaibora-validation': '1'})).status, 401);
  console.log('Campos obrigatórios, consentimento, origem e leitura privada verificados.');
  const login = await fetch(base + '/api/admin/session', {method: 'POST', headers: json, body: JSON.stringify({password: process.env.UAIBORA_QA_PASSWORD})});
  assert.equal(login.status, 200, 'Admin deve entrar só com a senha configurada.');
  const cookie = login.headers.get('set-cookie').split(';')[0];
  const headers = {...json, Cookie: cookie};
  const current = await (await fetch(base + '/api/admin/feira-tecnica', {headers})).json();
  assert.ok(Number.isInteger(current.total));
  const sent = await post(row, {...headers, 'x-uaibora-validation': '1'});
  assert.equal(sent.status, 201); assert.equal((await sent.json()).saved, true);
  // A mesma tentativa repetida não duplica a participação.
  assert.equal((await post(row, {...headers, 'x-uaibora-validation': '1'})).status, 201);
  const testing = await (await fetch(base + '/api/admin/feira-tecnica?tests=1', {headers})).json();
  assert.equal(testing.data.filter(r => r.id === row.id).length, 1);
  const saved = testing.data.find(r => r.id === row.id);
  for (const field of ['name', 'free_place', 'free_reason', 'paid_place', 'paid_reason']) assert.equal(saved[field], row[field]);
  assert.equal(saved.is_test, true);
  const real = await (await fetch(base + '/api/admin/feira-tecnica', {headers})).json();
  assert.equal(real.total, current.total); assert.ok(!real.data.some(r => r.id === row.id));
  console.log('Senha única, gravação no Supabase, consulta no admin e reenvio sem duplicação aprovados. Testes não entram no total real.');
  const client = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY, {auth: {persistSession: false}});
  const blocked = await client.rpc('uaibora_feira', {p_token: 'invalid-test-token', p_action: 'list'});
  assert.ok(blocked.error);
  console.log('Acesso direto ao banco bloqueado sem token privado.');
  for (const path of ['/feira-tecnica', '/feira-tecnica/qr']) assert.equal((await fetch(base + path)).status, 200);
  await fetch(base + '/api/admin/session', {method: 'DELETE', headers});
  console.log('Páginas da pesquisa e do QR code: HTTP 200.');
})().catch(error => {console.error('Falha na validação:', error.message); process.exitCode = 1;});
