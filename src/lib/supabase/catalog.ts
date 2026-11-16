import type { CatalogInfo } from "@/lib/catalog-info";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { SuggestionRow } from "@/lib/discovery";

export type PlaceRow = {
  id: string; title: string; category: string; location: string;
  description: string; image_path: string | null;
  latitude: number | null; longitude: number | null;
  info: CatalogInfo; published: boolean; created_at: string;
};
export type EventRow = {
  id: string; place_id: string | null; title: string; category: string;
  location: string; description: string; image_path: string | null;
  starts_at: string; ends_at: string | null; is_demo: boolean; info: CatalogInfo; published: boolean; created_at: string;
};
type Result<T> = {data: T[]; error: string | null};

// Read-only repository. No demo fallback: database errors remain explicit.
export async function listPlaces(client: SupabaseClient): Promise<Result<PlaceRow>> {
  const {data, error} = await client.from("uaibora_places")
    .select("id,title,category,location,description,image_path,latitude,longitude,published,created_at,info")
    .eq("published", true).order("title").limit(100);
  return {data: error ? [] : data as PlaceRow[], error: error?.message ?? null};
}
export async function listEvents(client: SupabaseClient): Promise<Result<EventRow>> {
  const {data, error} = await client.from("uaibora_events")
    .select("id,place_id,title,category,location,description,image_path,starts_at,ends_at,is_demo,published,created_at,info")
    .eq("published", true).order("starts_at").limit(100);
  return {data: error ? [] : data as EventRow[], error: error?.message ?? null};
}
export async function listSuggestions(client: SupabaseClient): Promise<Result<SuggestionRow>> {
  const {data, error} = await client.from("uaibora_suggestions")
    .select("id,user_id,title,category,location,description,created_at")
    .order("created_at", {ascending: false}).limit(100);
  return {data: error ? [] : data as SuggestionRow[], error: error?.message ?? null};
}
