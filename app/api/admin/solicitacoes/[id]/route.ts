import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/features/auth/services/auth-service";
import { updateSuggestionStatus } from "@/features/suggestions/services/suggestion-service";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    
    // Verificação de Autorização
    if (!session || !session.user || session.user.perfil !== "ADMIN") {
      return NextResponse.json(
        { success: false, message: "Acesso restrito a administradores." },
        { status: 403 }
      );
    }

    const { status } = await request.json();
    const id = params.id;

    if (!id || !["APROVADO", "REJEITADO"].includes(status)) {
      return NextResponse.json(
        { success: false, message: "ID ou Status inválidos." },
        { status: 400 }
      );
    }

    const localAtualizado = await updateSuggestionStatus(id, status as any);

    return NextResponse.json({
      success: true,
      message: `Local ${status.toLowerCase()} com sucesso!`,
      data: localAtualizado,
    });
  } catch (error: any) {
    console.error("Erro ao atualizar solicitação:", error);
    return NextResponse.json(
      { success: false, message: "Erro ao processar a decisão." },
      { status: 500 }
    );
  }
}
