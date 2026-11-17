// Executado localmente, sem imprimir credenciais ou hashes.
const fs = require('node:fs');
const crypto = require('node:crypto');
let env = fs.readFileSync('.env.local', 'utf8');
const salt = crypto.randomBytes(16).toString('hex');
const values = {
  UAIBORA_DEMO_ADMIN_ENABLED: 'true',
  UAIBORA_DEMO_ADMIN_USER: '@teste',
  UAIBORA_DEMO_ADMIN_PASSWORD_HASH: salt + ':' + crypto.scryptSync('123', salt, 64).toString('hex'),
};
for (const [key, value] of Object.entries(values)) {
  const pattern = new RegExp('^' + key + '=.*$', 'm');
  env = pattern.test(env) ? env.replace(pattern, key + '=' + value) : env + '\n' + key + '=' + value;
}
fs.writeFileSync('.env.local', env);
console.log('Acesso administrativo local configurado. Nenhum segredo exibido.');
