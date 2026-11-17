import { createHash } from 'node:crypto';
import { isSameOrigin } from '@/lib/request-origin';
import { validateFair } from '@/lib/feira-validation';
import { fairRpc } from '@/lib/feira-server';
import { isAdmin, localDemo } from '@/lib/admin/session';

export const runtime = 'nodejs';
const attempts = new Map<string, {count: number; until: number}>();

export async function POST(request: Request) {
  if (!isSameOrigin(request)) return Response.json({error: 'Origem não permitida.'}, {status: 403});
  if (!request.headers.get('content-type')?.includes('application/json')) return Response.json({error: 'Formato inválido.'}, {status: 415});
  if (Number(request.headers.get('content-length')) > 16000) return Response.json({error: 'Resposta muito grande.'}, {status: 413});
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 'local';
  const key = createHash('sha256').update(ip).digest('hex');
  const previous = attempts.get(key);
  const bucket = previous && previous.until > Date.now() ? previous : {count: 0, until: Date.now() + 60000};
  if (bucket.count >= 60) return Response.json({error: 'Aguarde um minuto antes de enviar novamente.'}, {status: 429});
  bucket.count++; attempts.set(key, bucket);
  if (attempts.size > 2000) for (const [k, v] of attempts) if (v.until < Date.now()) attempts.delete(k);
  let b;
  try { const raw = await request.text(); if (raw.length > 16000) throw Error(); b = JSON.parse(raw); }
  catch { return Response.json({error: 'Resposta inválida.'}, {status: 400}); }
  if (b?.website) return Response.json({error: 'Não foi possível enviar.'}, {status: 400});
  const valid = validateFair(b);
  if (valid.error) return Response.json({error: valid.error}, {status: 400});
  const isTest = request.headers.get('x-uaibora-validation') === '1';
  if (isTest && (!localDemo(request) || !await isAdmin())) return Response.json({error: 'Modo de teste restrito à equipe.'}, {status: 401});
  try {
    await fairRpc('submit', {...valid.data!, is_test: isTest});
    return Response.json({saved: true}, {status: 201, headers: {'Cache-Control': 'no-store'}});
  } catch {
    return Response.json({error: 'Não conseguimos salvar agora. Suas respostas continuam no formulário. Tente novamente.'}, {status: 503});
  }
}
