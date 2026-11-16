# Uai Bora — apresentação local

Abra http://127.0.0.1:3000 . Inicie com npm.cmd run dev -- --hostname 127.0.0.1 se necessário.

## O que está funcionando

- Catálogo público lido do Supabase. Fotos reais da Pampulha e Praça da Liberdade e imagens ilustrativas dos eventos.
- Busca, categorias, detalhes, favoritos por conta e mapa interativo com rotas externas.
- Locais abrem os eventos futuros associados; eventos abrem seu local.
- Cadastro de lugares/eventos por usuário autenticado, encaminhado para análise. O evento pode ser ligado a um local aprovado.
- Sugestões aguardam aprovação antes de aparecer na comunidade.
- Área Admin: login de apresentação fornecido pela criadora; senha verificada no servidor, sessão assinada em cookie HttpOnly, proteção de origem e limite de tentativas.
- Admin pode cadastrar, aprovar, retirar publicação ou rejeitar lugares, eventos e sugestões. Envios não são apagados.

## Dados e limites

Dois lugares reais foram cadastrados editorialmente. Três eventos fictícios estão publicados e claramente marcados como demonstração. Um evento adicional criado no teste foi rejeitado e permanece só no histórico administrativo. Não há ingressos, pagamentos ou programação real confirmada.

O admin de apresentação aceita somente conexões localhost/127.0.0.1 e fica desativado fora desses hosts. Os segredos de sessão, hash de senha e token da ponte de moderação ficam em .env.local, ignorado pelo Git. Nunca use esse acesso de demonstração para publicar um sistema na internet. A ponte no banco exige um token aleatório do servidor; chamar a função com a chave publicável e um token inválido deve falhar.

As migrações 202611160003_moderation.sql e 202611160004_catalog_demo.sql foram aplicadas no projeto novo com autorização. Não reaplique os scripts de criação.

Supabase Auth: endereço principal 127.0.0.1:3000 e retornos /auth/confirm com recuperação configurados para 127.0.0.1 e localhost. A confirmação de e-mail foi preservada. O recebimento de e-mail e o login de usuários reais dependem da caixa de e-mail do usuário e das condições de envio do Supabase; não foram inventadas contas ou desligada a confirmação.

## Verificações realizadas

- TypeScript sem emissão, testes de validação, origem, sessão, autoria e consultas anônimas.
- Teste ao vivo do login administrativo; rejeição retirou um evento de demonstração do público e aprovação o restaurou.
- Pelo navegador: cadastro real de evento demonstrativo via formulário, confirmação de publicação e retirada pelo admin.
- Navegação local → evento → local, imagens e layout no celular sem rolagem horizontal.

Antes de produção: substituir o acesso demo por administradores individuais com MFA, domínio HTTPS e SMTP próprio; testar cadastro/confirmação/recuperação com e-mail real; definir moderação operacional e conteúdo verificado. Nenhum commit, push ou alteração em bancos antigos/backups foi realizado.

## Validação final

Build de produção concluído com sucesso (npm.cmd run build), TypeScript e geração das páginas aprovados. O next.config.ts limita a geração a um worker e desativa somente o cache persistente de build do Turbopack para reduzir uso de disco. O servidor de desenvolvimento usa seu cache normal.

O teste scripts/verify-presentation.cjs exige UAIBORA_QA_PASSWORD fornecida somente no ambiente do processo. A variável temporária foi removida de .env.local após os testes; a senha do administrador permanece armazenada apenas como hash scrypt.
