import { isSameOrigin } from "@/lib/request-origin";
import { getServerSupabase } from "./server";
import { listPlaces, listEvents } from "./catalog";
import { validateCatalog, type CatalogKind } from "@/lib/catalog-validation";
const json = (body: unknown, status = 200) => Response.json(body, { status, headers: { "Cache-Control": "private, no-store" } });
export async function catalogGet(kind: CatalogKind, request?: Request) {
    try {
        const client = await getServerSupabase();
        if (!client)
            return json({ error: "Acesso indisponível." }, 503);
        if (request && new URL(request.url).searchParams.get("meus") === "1") {
            const { data: { user }, error: authError } = await client.auth.getUser();
            if (authError || !user)
                return json({ error: "Entre na sua conta." }, 401);
            const { data, error } = await client.from("uaibora_" + kind).select("id,title,category,published,moderation_status,created_at").eq("user_id", user.id).order("created_at", { ascending: false }).limit(100);
            return error ? json({ error: "Cadastros indisponíveis no momento." }, 503) : json({ data });
        }
        const result = await (kind === "places" ? listPlaces(client) : listEvents(client));
        return result.error ? json({ error: "O catálogo ainda está sendo preparado." }, 503) : json({ data: result.data });
    }
    catch {
        return json({ error: "Não conseguimos conectar agora." }, 503);
    }
}
export async function catalogPost(request: Request, kind: CatalogKind) {
    if (!isSameOrigin(request))
        return json({ error: "Origem não permitida." }, 403);
    if (!request.headers.get("content-type")?.includes("application/json"))
        return json({ error: "Envie JSON." }, 415);
    try {
        const client = await getServerSupabase();
        if (!client)
            return json({ error: "Acesso indisponível." }, 503);
        const { data: { user }, error: authError } = await client.auth.getUser();
        if (authError || !user)
            return json({ error: "Entre na sua conta." }, 401);
        let body: unknown;
        try {
            body = await request.json();
        }
        catch {
            return json({ error: "Dados inválidos." }, 400);
        }
        const result = validateCatalog(body, kind);
        if (result.error)
            return json({ error: result.error }, 400);
        const { data, error } = await client.from("uaibora_" + kind).insert({ ...result.data, user_id: user.id }).select("id,published").single();
        return error ? json({ error: "Cadastro indisponível. Confira Meus cadastros antes de reenviar." }, 503) : json({ data, message: "Cadastro salvo como rascunho." }, 201);
    }
    catch {
        return json({ error: "Não foi possível confirmar o envio. Consulte seus cadastros antes de tentar novamente." }, 503);
    }
}
