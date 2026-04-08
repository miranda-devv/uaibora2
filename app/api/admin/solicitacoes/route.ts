import { NextResponse } from "next/server";
import { getSession } from "@/features/auth/services/auth-service";
import { getPendingSuggestions } from "@/features/suggestions/services/suggestion-service";

export async function GET() {
  try {
    const session = await getSession();
    
    console.log(">>> ADMIN SESSION:", session);

    // Verificação de Autorização (temporariamente menos rígida para debugar se necessário)
    if (!session || !session.user) {
      console.error("!!! ADMIN ACCESS DENIED: NO SESSION");
      return NextResponse.json(
        { success: false, message: "Não autenticado." },
        { status: 401 }
      );
    }

    if (session.user.perfil !== "ADMIN") {
      console.error("!!! ADMIN ACCESS DENIED: NOT ADMIN", session.user.perfil);
      return NextResponse.json(
        { success: false, message: "Acesso restrito a administradores." },
        { status: 403 }
      );
    }

    console.log(">>> FETCHING PENDING SUGGESTIONS...");
    const pendentes = await getPendingSuggestions();
    console.log(">>> PENDING COUNT:", pendentes.length);

    return NextResponse.json({
      success: true,
      data: pendentes,
    });
  } catch (error: any) {
    console.error("!!! ERRO NO ADMIN API /api/admin/solicitacoes:", error.stack || error.message);
    return NextResponse.json(
      { success: false, message: "Erro ao carregar solicitações.", error: error.message },
      { status: 500 }
    );
  }
}
