# Telas do Frontend - UaiBora

Mapeamento das telas do Next.js e sua respectiva conexão com a estrutura de dados.

## Fluxo do Usuário Comum

### 1. Tela: Login / Cadastro (`/Login`)
- **Estado:** Implementado (Layout)
- **Ação:** Login via Google ou E-mail.
- **Conexão:** API `/api/auth/login` e `/api/auth/register`.

### 2. Tela: Home / Feed Descubra (`/Dashboard/home`)
- **Estado:** Implementado (Mockup)
- **Ação:** Visualizar cards de locais e eventos próximos.
- **Conexão:** API `/api/feed/descubra` (consome a View `vw_feed_descubra`).

### 3. Tela: Detalhes do Local (`/Dashboard/local/[id]`)
- **Estado:** Pendente
- **Ação:** Ver fotos, descrição completa, eventos do local e botão "Interessado".
- **Conexão:** API `/api/locais/:id` e `/api/interacoes`.

### 4. Tela: Sugerir Local (`/Dashboard/sugerir`)
- **Estado:** Pendente
- **Ação:** Preencher formulário com nome, categoria e localização (mapa/lat-long).
- **Conexão:** API `/api/locais/sugerir`.

## Fluxo do Admin e Proprietário

### 5. Tela: Painel Proprietário (`/Dashboard/gestao`)
- **Estado:** Pendente
- **Ação:** Publicar e gerenciar eventos para seus locais aprovados.
- **Conexão:** API `/api/eventos` e `/api/gestao/locais`.

### 6. Tela: Painel Admin (`/Admin`)
- **Estado:** Pendente
- **Ação:** Aprovar ou Rejeitar sugestões pendentes da comunidade.
- **Conexão:** API `/api/admin/locais/pendentes`.

## Guia de Estilo (UI/UX)
- **Tema:** Escuro (Dark Mode) por padrão, com tons de laranja e vermelho (UaiBora).
- **Componentes:** Cards com efeito de glassmorphism, badges de categoria coloridas e micro-animações de hover.
- **Interatividade:** Uso intensivo de `framer-motion` (opcional) ou transições Tailwind para uma sensação premium.
