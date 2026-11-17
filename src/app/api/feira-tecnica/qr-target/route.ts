import fair from '@/data/feira-tecnica.json';

export async function GET() {
  return Response.json({url: fair.formUrl}, {headers: {'Cache-Control': 'no-store'}});
}
