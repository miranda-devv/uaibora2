import prisma from "@/lib/prisma";

export interface EventData {
  localId: string;
  titulo: string;
  descricao?: string;
  dataInicio: string | Date;
  dataFim: string | Date;
}

export async function createEvent(data: EventData) {
  if (!data.localId || !data.titulo || !data.dataInicio || !data.dataFim) {
    throw new Error("Campos obrigatórios: Local, título, data início e data fim.");
  }

  // Verificar se o local existe e está aprovado
  const local = await prisma.local.findUnique({
    where: { id: data.localId },
  });

  if (!local) {
    throw new Error("Local não encontrado.");
  }

  if (local.statusAprovacao !== "APROVADO") {
    throw new Error("Este local ainda não foi aprovado para receber eventos.");
  }

  // Criar o evento
  return await prisma.evento.create({
    data: {
      localId: data.localId,
      titulo: data.titulo,
      descricao: data.descricao,
      dataInicio: new Date(data.dataInicio),
      dataFim: new Date(data.dataFim),
    },
  });
}
