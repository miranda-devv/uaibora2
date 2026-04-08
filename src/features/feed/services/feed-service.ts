import prisma from "@/lib/prisma";

export async function getDiscoveryFeed() {
  try {
    // Usando queryRaw para acessar a View SQL personalizada 'vw_feed_descubra'
    // Esta view já filtra locais aprovados e eventos futuros
    const feed = await prisma.$queryRaw`SELECT * FROM vw_feed_descubra`;
    return feed;
  } catch (error) {
    console.error("Erro ao consultar view de feed:", error);
    throw new Error("Não foi possível carregar o feed de descobertas.");
  }
}
