import { NextResponse } from "next/server";
import { getDiscoveryFeed } from "@/features/feed/services/feed-service";

export async function GET() {
  console.log(">>> Chamando GET /api/feed/descubra");
  try {
    const feed = await getDiscoveryFeed();
    
    console.log(">>> Feed carregado com sucesso, total de itens:", Array.isArray(feed) ? feed.length : 0);
    
    return NextResponse.json({
      success: true,
      data: feed
    });
  } catch (error: any) {
    console.error("!!! ERRO NO FEED API:", error.message);
    return NextResponse.json(
      { success: false, message: error.message || "Erro ao carregar o feed." },
      { status: 500 }
    );
  }
}
