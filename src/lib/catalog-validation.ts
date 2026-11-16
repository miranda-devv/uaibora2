import { safeUrl, interests } from "./catalog-info";
export type CatalogKind = "places" | "events";
export function validateCatalog(body: unknown, kind: CatalogKind): {
    data?: Record<string, unknown>;
    error?: string;
} {
    if (!body || typeof body !== "object" || Array.isArray(body))
        return { error: "Envie os dados do cadastro." };
    const input = body as Record<string, unknown>;
    const limits: Record<string, [
        number,
        number
    ]> = { title: [3, 120], category: [2, 60], location: [3, 240], description: [15, 5000] };
    const labels: Record<string, unknown> = { title: "Nome", category: "Categoria", location: "Localização", description: "Descrição" };
    const data: Record<string, unknown> = {};
    for (const [field, [min, max]] of Object.entries(limits)) {
        const value = input[field];
        if (typeof value !== "string" || value.trim().length < min || value.trim().length > max)
            return { error: labels[field] + " deve ter de " + min + " a " + max + " caracteres." };
        data[field] = value.trim();
    }
    if (input.image_path != null && input.image_path !== "") {
        if (typeof input.image_path !== "string" || !( /^\/images\/[a-zA-Z0-9._-]+$/.test(input.image_path) || /^\/uploads\/[a-f0-9-]+\.webp$/.test(input.image_path) || safeUrl(input.image_path) ))
            return { error: "Use uma imagem enviada ou uma URL HTTPS." };
        data.image_path = input.image_path;
    }
    if (kind === "events") {
        if (input.place_id != null && input.place_id !== "") {
            if (typeof input.place_id !== "string" || !/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(input.place_id))
                return { error: "Escolha um local válido." };
            data.place_id = input.place_id;
        }
        const validDate = (value: unknown): value is string => typeof value === "string" && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2}(\.\d{1,3})?)?(Z|[+-]\d{2}:\d{2})$/.test(value) && Number.isFinite(Date.parse(value));
        if (!validDate(input.starts_at))
            return { error: "Informe data e horário de início com fuso horário." };
        data.starts_at = new Date(input.starts_at).toISOString();
        if (input.ends_at != null && input.ends_at !== "") {
            if (!validDate(input.ends_at) || Date.parse(input.ends_at) < Date.parse(input.starts_at))
                return { error: "O término deve ser igual ou posterior ao início." };
            data.ends_at = new Date(input.ends_at).toISOString();
        }
    }
    if(input.info != null){
      if(typeof input.info!=='object'||Array.isArray(input.info))return {error:'Informações inválidas.'};
      const i=input.info as Record<string,unknown>; const info:Record<string,unknown>={};
      if(!['free','paid','unknown'].includes(String(i.price)))return {error:'Informe se a entrada é gratuita.'};
      if(i.price==='paid'&&!['Festival','Feira','Feira de artesanato','Feira gastronômica'].includes(String(data.category)))return {error:'Nesta curadoria, entrada paga é permitida apenas em festivais e feiras.'};
      info.price=i.price;
      for(const [field,max] of [['hours',600],['priceNote',400],['photoCredit',300]] as const){if(i[field]!=null){if(typeof i[field]!=='string'||(i[field] as string).length>max)return {error:'Confira os detalhes do cadastro.'};info[field]=(i[field] as string).trim();}}
      for(const field of ['sourceUrl','bookingUrl'])if(i[field]){if(!safeUrl(i[field]))return {error:'Use um link HTTPS válido.'};info[field]=i[field];}
      if(i.tags!=null){if(!Array.isArray(i.tags)||i.tags.some(t=>!interests.includes(t)))return {error:'Selecione os públicos disponíveis.'};info.tags=[...new Set(i.tags)];}
      if(i.weekdays!=null){if(!Array.isArray(i.weekdays)||i.weekdays.some(d=>!Number.isInteger(d)||Number(d)<0||Number(d)>6))return {error:'Selecione dias válidos.'};info.weekdays=[...new Set(i.weekdays)];}
      data.info=info;
    }
    return { data };
}
