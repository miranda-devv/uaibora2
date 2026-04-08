import { NextResponse } from "next/server";
import { getSession } from "@/features/auth/services/auth-service";
import { getUserSuggestions } from "@/features/suggestions/services/suggestion-service";

export async function GET() {
  try {
    const session = await getSession();
    
    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, message: "Não autorizado." },
        { status: 401 }
      );
    }

    const locais = await getUserSuggestions(session.user.id);

    return NextResponse.json({
      success: true,
      data: locais
    });
  } catch (error: any) {
    console.error("Erro ao listar locais do usuário:", error);
    return NextResponse.json(
      { success: false, message: "Erro ao carregar seus locais." },
      { status: 500 }
    );
  }
}
