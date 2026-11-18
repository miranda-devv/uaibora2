import { isAdmin, localDemo } from '@/lib/admin/session';
import { fairRpc } from '@/lib/feira-server';

export async function GET(request: Request) {
  if (!localDemo(request) || !await isAdmin()) return Response.json({error: 'Entre na administração para consultar as respostas.'}, {status: 401});
  const value = Number(new URL(request.url).searchParams.get('offset') || 0);
  const offset = Number.isInteger(value) && value >= 0 ? value : 0;
  const include_tests = new URL(request.url).searchParams.get('tests') === '1';
  try { return Response.json(await fairRpc('list', {offset, include_tests}), {headers: {'Cache-Control': 'private, no-store'}}); }
  catch { return Response.json({error: 'Não foi possível carregar a pesquisa. Tente atualizar.'}, {status: 503}); }
}
