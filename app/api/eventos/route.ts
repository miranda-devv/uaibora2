import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/features/auth/services/auth-service";
import { createEvent } from "@/src/features/events/services/event-service";

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    
    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, message: "Você precisa estar logado para criar eventos." },
        { status: 401 }
      );
    }

    const body = await request.json();

    const evento = await createEvent(body);

    return NextResponse.json({
      success: true,
      message: "Evento criado com sucesso!",
      data: evento,
    });
  } catch (error: any) {
    console.error("Erro ao criar evento:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Erro ao processar o cadastro do evento." },
      { status: 500 }
    );
  }
}
