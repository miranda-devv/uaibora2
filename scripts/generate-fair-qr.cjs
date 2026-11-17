const fs = require('node:fs/promises');
const path = require('node:path');
const QRCode = require('qrcode');
const sharp = require('sharp');
const jsQR = require('jsqr');

(async () => {
  const {formUrl: target} = require('../src/data/feira-tecnica.json');
  if (new URL(target).protocol !== 'https:') throw Error('A pesquisa pública precisa usar HTTPS.');
  const output = path.resolve(process.argv[2]);
  await fs.mkdir(path.dirname(output), {recursive: true});
  await QRCode.toFile(output, target, {width: 1000, margin: 4, errorCorrectionLevel: 'H', color: {dark: '#35110d', light: '#ffffff'}});
  const image = await sharp(output).ensureAlpha().raw().toBuffer({resolveWithObject: true});
  const read = jsQR(new Uint8ClampedArray(image.data), image.info.width, image.info.height);
  if (read?.data !== target) throw Error('O leitor independente não confirmou o QR.');
  console.log('QR gerado e decodificado com sucesso: ' + target);
  console.log('PNG: ' + output);
})().catch(error => {console.error(error.message); process.exitCode = 1;});
