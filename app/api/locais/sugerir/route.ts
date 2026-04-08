import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/features/auth/services/auth-service";
import { createSuggestion } from "@/features/suggestions/services/suggestion-service";

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    
    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, message: "Você precisa estar logado para sugerir um local." },
        { status: 401 }
      );
    }

    const body = await request.json();

    const localSugerido = await createSuggestion({
      ...body,
      sugeridoPorId: session.user.id,
    });

    return NextResponse.json({
      success: true,
      message: "Sugestão enviada com sucesso! Aguarde a aprovação do administrador.",
      data: localSugerido,
    });
  } catch (error: any) {
    console.error("Erro ao sugerir local:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Erro ao processar sua sugestão." },
      { status: 500 }
    );
  }
}
