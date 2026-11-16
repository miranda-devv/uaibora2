import type { DiscoveryItem } from "@/data/demo";

export type SuggestionRow = {
  id: string; user_id: string; title: string; category: string;
  location: string; description: string; created_at: string;
};
export type SuggestionDraft = Pick<SuggestionRow, "title" | "category" | "location" | "description">;
export const categories = ["Ao ar livre", "Cultura", "Gastronomia", "Passeio"];
export const normalize = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
export function matchesSearch(item: DiscoveryItem, query: string) {
  const haystack = normalize([item.title, item.category, item.location, item.description].join(" "));
  return normalize(query).split(/\s+/).every(word => haystack.includes(word));
}
export function mapsUrl(location: string) {
  return "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(location);
}
export function validateSuggestion(draft: SuggestionDraft) {
  if (draft.title.trim().length < 3 || draft.title.trim().length > 80) return "Informe um nome de 3 a 80 caracteres.";
  if (!categories.includes(draft.category)) return "Escolha uma categoria válida.";
  if (draft.location.trim().length < 3 || draft.location.trim().length > 120) return "Informe a localização de 3 a 120 caracteres.";
  if (draft.description.trim().length < 15 || draft.description.trim().length > 1000) return "Conte um pouco mais: use de 15 a 1000 caracteres.";
  return null;
}
export function suggestionItem(row: SuggestionRow): DiscoveryItem {
  return { ...row, id: "community:" + row.id, image: "/images/uai-bora-oficial.png", alt: "Uai Bora — sugestão da comunidade" };
}
