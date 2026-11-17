const assert = require('node:assert/strict');
(async () => {
  const base = new URL(process.env.UAIBORA_FAIR_URL).origin;
  assert.equal((await fetch(base + '/feira-tecnica')).status, 200);
  assert.equal((await fetch(base + '/api/admin/feira-tecnica')).status, 401);
  assert.equal((await fetch(base + '/api/admin/moderation')).status, 401);
  const spoofed = await fetch(base + '/api/admin/session', {
    method: 'POST', headers: {'Content-Type': 'application/json', Host: '127.0.0.1:3001', Origin: 'http://127.0.0.1:3001'},
    body: JSON.stringify({password: process.env.UAIBORA_QA_PASSWORD}),
  });
  assert.equal(spoofed.status, 403);
  console.log('Pesquisa acessível pelo IP da Wi-Fi: HTTP 200.');
  console.log('Servidor dos visitantes bloqueia administração, respostas privadas e tentativa com Host forjado.');
})().catch(error => {console.error('Falha na rede:', error.message); process.exitCode = 1;});
