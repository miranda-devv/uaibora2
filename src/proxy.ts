import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { supabaseConfig } from "@/lib/supabase/config";

export async function proxy(request: NextRequest) {
  const config = supabaseConfig();
  if (!config) return NextResponse.next();
  let response = NextResponse.next({ request });
  const client = createServerClient(config.url, config.key, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll(values) {
        values.forEach(({name, value}) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        values.forEach(({name, value, options}) => response.cookies.set(name, value, options));
        response.headers.set("Cache-Control", "private, no-store");
      },
    },
  });
  // Server validation, not an unverified cookie/session read.
  await client.auth.getUser();
  return response;
}
export const config = { matcher: ["/", "/entrar", "/perfil", "/eventos", "/lugares", "/mapa", "/auth/:path*"] };
