// Servidor do estande: público na rede local, administração desativada.
// Execute npm.cmd run build antes de iniciar.
const {spawn} = require('node:child_process');
const child = spawn(process.execPath, [require.resolve('next/dist/bin/next'), 'start', '--hostname', '0.0.0.0', '--port', '3001'], {
  stdio: 'inherit', env: {...process.env, UAIBORA_DEMO_ADMIN_ENABLED: 'false'},
});
child.on('exit', code => {process.exitCode = code ?? 1;});
process.on('SIGINT', () => child.kill('SIGINT'));
