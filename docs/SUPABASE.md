# Supabase — Uai Bora 2.0

## Estado em 16/11/2026

Conexão configurada em .env.local, ignorado pelo Git. A chave não é reproduzida nesta documentação.
Projeto: yiuntwgfoxauhrinsaxd (uai-bora-2).

O conteúdo de supabase/PROPOSTA_COMPLETA.sql foi aplicado com autorização da criadora no SQL Editor, em uma transação. A consulta prévia não encontrou tabelas uaibora_*. Não reaplique o script: ele usa CREATE TABLE e não foi projetado para repetição.

Criadas uaibora_places, uaibora_events, uaibora_suggestions e uaibora_favorites, com RLS ativa em todas. A verificação no banco confirmou 2 políticas por tabela de catálogo e 3 por tabela de sugestões/favoritos. As consultas públicas pela aplicação retornaram HTTP 200 para lugares, eventos e sugestões.

## Regras

- Lugares/eventos: visitantes leem apenas publicados. Usuários autenticados também leem seus próprios rascunhos e podem cadastrar rascunhos próprios. Publicação e edição não são concedidas pelo cadastro público.
- Sugestões: leitura pública; cadastro por usuário autenticado e exclusão apenas pelo autor.
- Favoritos: leitura, cadastro e exclusão somente pelo próprio usuário.
- Nenhum registro de demonstração foi inserido no banco. Os cards demonstrativos da página inicial continuam identificados.
- Não há service_role ou senha do banco no frontend. Os bancos antigos e backups não foram usados.

## Como usar

Após entrar na conta do Uai Bora, abra Meu Perfil → Cadastrar lugar / Cadastrar evento / Meus cadastros. Cadastros novos ficam como rascunhos. O catálogo público não mostra rascunhos. Datas usam o fuso do dispositivo e são enviadas em UTC. Não existe sucesso simulado nem armazenamento local substituindo o banco.

GET /api/lugares e /api/eventos consultam publicados. Com ?meus=1 consultam apenas registros do usuário autenticado. POST exige sessão válida, origem da aplicação e JSON com title, category, location e description; eventos também exigem starts_at com fuso e aceitam ends_at. O proprietário é obtido da autenticação.

## Validação e pendências

node --env-file=.env.local scripts/check-supabase.cjs
node --env-file=.env.local scripts/verify-supabase-access.cjs
node scripts/verify-catalog.cjs

A autenticação entre contas distintas, o cadastro autenticado e os fluxos de e-mail ainda precisam de teste com contas da aplicação. O login no painel Supabase não equivale a login no Uai Bora. Não foram criadas contas de teste nem enviados e-mails automaticamente.

Configure no painel Auth a Site URL e redirecionamentos para o host usado: http://127.0.0.1:3000/auth/confirm e http://127.0.0.1:3000/auth/confirm?flow=recovery (adicione localhost se utilizar esse host). Para produção, use o domínio HTTPS correspondente. Confirmação por e-mail e SMTP devem ser verificados antes do uso público.

Área Admin/moderação e ligação do catálogo real aos cards públicos continuam pendentes; esta etapa preservou o visual aprovado.

## Atualização — versão de apresentação concluída

Consulte docs/APRESENTACAO.md para o estado atual. As migrações 003 (moderação/ponte administrativa protegida) e 004 (catálogo editorial e vínculo evento-local) foram aplicadas. Os cards agora consultam o catálogo real; 2 lugares editoriais reais e 3 eventos fictícios identificados foram publicados. Sugestões exigem aprovação. A Área Admin local foi implementada e testada, com sessão HttpOnly assinada, hash scrypt de senha, conferência de origem e limitação de tentativas. Sem o token aleatório do servidor, as funções administrativas no banco recusam chamadas. A tabela privada da ponte também possui RLS.

Site URL: http://127.0.0.1:3000 . Foram salvos 4 retornos locais de confirmação/recuperação para 127.0.0.1 e localhost. A confirmação por e-mail não foi desativada. Não há domínio público ou implantação nesta etapa.
