import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { supabaseConfig } from "./config";

export async function getServerSupabase() {
  const config = supabaseConfig();
  if (!config) return null;
  const store = await cookies();
  return createServerClient(config.url, config.key, {
    cookies: {
      getAll() { return store.getAll(); },
      setAll(values) { values.forEach(({name, value, options}) => store.set(name, value, options)); },
    },
  });
}
