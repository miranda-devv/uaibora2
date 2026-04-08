import Fastify, { FastifyRequest, FastifyReply } from 'fastify';
import { PrismaClient } from '@prisma/client';

const fastify = Fastify({
  logger: true
});

const prisma = new PrismaClient();

// Rota de Health Check
fastify.get('/health', async (_request: FastifyRequest, reply: FastifyReply) => {
  return { status: 'ok', service: 'UaiBora Backend (Fastify v5)' };
});

// Exemplo de rota que consome Prisma (Admin - Locais Pendentes)
fastify.get('/admin/locais/pendentes', async (_request: FastifyRequest, reply: FastifyReply) => {
  try {
    const locais = await prisma.local.findMany({
      where: { statusAprovacao: 'PENDENTE' },
      include: { sugeridoPor: true }
    });
    return locais;
  } catch (error) {
    fastify.log.error(error);
    return reply.status(500).send({ error: 'Erro ao buscar locais pendentes' });
  }
});

// Inicialização do Servidor
const start = async () => {
  try {
    const port = process.env.PORT ? parseInt(process.env.PORT) : 3333;
    await fastify.listen({ port, host: '0.0.0.0' });
    console.log(`🚀 Fastify Backend rodando em http://localhost:${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
