import { checkCredentials, clearAdminSession, createAdminSession, isAdmin, localDemo, sameOrigin } from "@/lib/admin/session";
const attempts = new Map<string, {
    count: number;
    until: number;
}>();
export async function GET(request: Request) { return Response.json({ authenticated: localDemo(request) && await isAdmin() }, { headers: { 'Cache-Control': 'no-store' } }); }
export async function POST(request: Request) { if (!localDemo(request) || !sameOrigin(request))
    return Response.json({ error: 'Acesso disponível somente na apresentação local.' }, { status: 403 }); const slot = 'local'; let entry = attempts.get(slot); if (!entry || entry.until < Date.now()) {
    entry = { count: 0, until: Date.now() + 10 * 60 * 1000 };
    attempts.set(slot, entry);
} if (entry.count >= 8)
    return Response.json({ error: 'Muitas tentativas. Aguarde 10 minutos.' }, { status: 429 }); entry.count++; let body; try {
    body = await request.json();
}
catch {
    return Response.json({ error: 'Dados inválidos.' }, { status: 400 });
} if (!body || typeof body !== 'object' || typeof body.password !== 'string' || !checkCredentials(process.env.UAIBORA_DEMO_ADMIN_USER || "@teste", body.password))
    return Response.json({ error: 'Senha incorreta.' }, { status: 401 }); await createAdminSession(); attempts.delete(slot); return Response.json({ ok: true }); }
export async function DELETE(request: Request) { if (!sameOrigin(request))
    return Response.json({ error: 'Origem inválida.' }, { status: 403 }); await clearAdminSession(); return Response.json({ ok: true }); }
