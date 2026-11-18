export type FairResponse = {
  id: string; name: string; free_place: string; free_reason: string;
  paid_place: string; paid_reason: string; consent: boolean; is_test?: boolean; created_at: string;
};

export function validateFair(input: unknown) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) return {error: 'Preencha o formulário.'};
  const b = input as Record<string, unknown>;
  const data: Record<string, string | boolean> = {};
  if (typeof b.id !== 'string' || !/^[a-f0-9]{8}(-[a-f0-9]{4}){3}-[a-f0-9]{12}$/i.test(b.id)) return {error: 'Recarregue a página para iniciar sua resposta.'};
  data.id = b.id;
  for (const [field, label, min, max] of [
    ['name', 'Seu nome', 2, 80], ['free_place', 'O lugar gratuito', 2, 160],
    ['free_reason', 'Por que você gostou do lugar gratuito', 10, 1200],
    ['paid_place', 'O lugar pago', 2, 160], ['paid_reason', 'Por que você gostou do lugar pago', 10, 1200],
  ] as const) {
    const value = b[field];
    if (typeof value !== 'string' || value.trim().length < min || value.trim().length > max) return {error: label + ' deve ter entre ' + min + ' e ' + max + ' caracteres.'};
    data[field] = value.trim();
  }
  if (b.consent !== true) return {error: 'Confirme que a equipe pode usar seu nome e suas respostas na pesquisa.'};
  data.consent = true;
  return {data};
}
