import 'server-only';
import { createClient } from '@supabase/supabase-js';
import { supabaseConfig } from '@/lib/supabase/config';

export async function fairRpc(action: 'submit' | 'list', input: Record<string, unknown>) {
  const c = supabaseConfig();
  const token = process.env.UAIBORA_ADMIN_BRIDGE_TOKEN;
  if (!c || !token) throw Error('unavailable');
  const client = createClient(c.url, c.key, {auth: {persistSession: false, autoRefreshToken: false}});
  const {data, error} = await client.rpc('uaibora_feira', {p_token: token, p_action: action, p_data: input});
  if (error) throw Error('unavailable');
  return data;
}
