import { PrismaClient } from "@prisma/client";

async function main() {
  const prisma = new PrismaClient();
  try {
    console.log("Tentando conectar ao banco...");
    const count = await prisma.usuario.count();
    console.log("Sucesso! Total de usuários:", count);
  } catch (error) {
    console.error("Falha na conexão:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
