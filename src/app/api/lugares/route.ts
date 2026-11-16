import { catalogGet, catalogPost } from "@/lib/supabase/catalog-api";
export async function GET(request: Request) { return catalogGet("places", request); }
export async function POST(request: Request) { return catalogPost(request, "places"); }
