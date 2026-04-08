# Roadmap de Implementação - UaiBora

Etapas detalhadas para transformar o mockup atual em um MVP funcional.

## Fase 1: Fundação & Banco de Dados (Semana 1)
1. [x] Configurar o PostgreSQL no `docker-compose.yml`.
2. [x] Instalar o Prisma ORM (versão recomendada para Next.js).
3. [x] Criar o schema Prisma baseado no `docs/03-modelagem-banco.md`.
4. [x] Executar migrations e criar a View `vw_feed_descubra`.

## Fase 2: Autenticação & Cadastro (Semana 1)
1. [x] Implementar as rotas de API `/api/auth/*`.
2. [x] Atualizar a tela de Login para persistir o usuário no banco.
3. [x] Gerenciar sessão (Middleware ou NextAuth.js).

## Fase 3: Dinamização do Feed (Semana 2)
1. [x] Substituir o array `const lugares` na tela de Home por uma chamada à API `/api/feed/descubra`.
2. [x] Criar o formulário em `/Dashboard/sugerir` para a comunidade cadastrar novos pontos.
3. [x] Implementar a lógica de status 'pendente'.

## Fase 4: Gestão de Eventos (Semana 2)
1. [x] Criar a interface para proprietários publicarem eventos.
2. [x] Validar a visualização dos eventos vinculados aos locais aprovados.

## Fase 5: Admin & Curadoria (Semana 3)
1. [x] Criar a área administrativa para aprovação de locais (Nested Routing).
2. [ ] Testar o ciclo completo: sugestão -> aprovação -> aparição no feed.

---

### Próximo Passo Imediato
> **Implementar a Base de Dados no Docker e o Prisma ORM.**

Gostaria de prosseguir com a implementação da **Fase 1** (PostgreSQL + Prisma)?
