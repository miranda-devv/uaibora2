import prisma from "@/lib/prisma";

export type StatusLocal = "PENDENTE" | "APROVADO" | "REJEITADO";

export interface SuggestionData {
  nome: string;
  categoria: string;
  descricao?: string;
  latitude?: number;
  longitude?: number;
  sugeridoPorId: string;
}

export async function createSuggestion(data: SuggestionData) {
  if (!data.nome || !data.categoria) {
    throw new Error("Nome e categoria são obrigatórios.");
  }

  return await prisma.local.create({
    data: {
      nome: data.nome,
      categoria: data.categoria,
      descricao: data.descricao,
      latitude: data.latitude,
      longitude: data.longitude,
      statusAprovacao: "PENDENTE",
      sugeridoPorId: data.sugeridoPorId,
    },
  });
}

/**
 * Busca todos os locais com status PENDENTE para revisão administrativa.
 */
export async function getPendingSuggestions() {
  return await prisma.local.findMany({
    where: {
      statusAprovacao: "PENDENTE",
    },
    include: {
      sugeridoPor: {
        select: {
          nome: true,
          email: true,
        },
      },
    },
    orderBy: {
      criadoEm: "desc",
    },
  });
}

/**
 * Atualiza o status de uma sugestão (APROVADO ou REJEITADO).
 */
export async function updateSuggestionStatus(id: string, status: StatusLocal) {
  if (!["APROVADO", "REJEITADO"].includes(status)) {
    throw new Error("Status inválido para atualização.");
  }

  return await prisma.local.update({
    where: { id },
    data: {
      statusAprovacao: status,
    },
  });
}

/**
 * Busca os locais sugeridos ou gerenciados por um usuário específico.
 */
export async function getUserSuggestions(userId: string) {
  return await prisma.local.findMany({
    where: {
      OR: [
        { sugeridoPorId: userId },
        { proprietarioId: userId }
      ]
    },
    orderBy: {
      criadoEm: "desc"
    }
  });
}
