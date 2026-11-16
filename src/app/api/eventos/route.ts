import { catalogGet, catalogPost } from "@/lib/supabase/catalog-api";
export async function GET(request: Request) { return catalogGet("events", request); }
export async function POST(request: Request) { return catalogPost(request, "events"); }
