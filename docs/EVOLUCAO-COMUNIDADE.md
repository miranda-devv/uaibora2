# Uai Bora — descoberta e comunidade

Implementação local em 16/11/2026, branch uaibora-2-novo.

## Páginas
- /entrar: Google, visitante e link seguro para e-mail já cadastrado. Não autentica só pelo e-mail digitado.
- /: destaques e carrosséis, ordenados por contagens reais de favoritos; interesses do perfil desempatatam.
- /eventos e /lugares: pesquisa de nome/endereço, gratuidade e público; eventos também por data.
- /mapa: mapa carregado a pedido; localização somente após clique e permissão do navegador, sem persistência.
- /perfil: nome/foto/bio, interesses, favoritos, cadastros e avaliações.
- /admin: sessão administrativa local existente; catálogo editável, fila, avaliações e indicadores reais.

## Banco
Migração 005 aplicada: info nas tabelas existentes; profiles/reviews/review_likes com RLS. Avaliações pendentes antes da publicação. Contagens agregadas não expõem usuários. Admin RPC protegido pelo token privado do servidor, sem service_role. Excluir da publicação é retirada reversível; não apaga o histórico. Retirar um lugar retira também seus eventos. Aprovar o lugar novamente não republica os eventos sem análise individual.

## Conteúdo
6 lugares acrescentados e 7 sessões/eventos reais pesquisados. Fontes oficiais estão em cada cadastro. Exemplos fictícios retirados da publicação. Pampulha indica apenas passeio externo gratuito, sem confundir com ingresso do santuário. Endereço Orisamba tem divergência na fonte: cadastro pede confirmação com organização. Horários não são atualizados automaticamente; conferir periodicamente.

## Google — pendência externa
O provedor Google está DESABILITADO no projeto Supabase (verificado pela API pública). É preciso criar/configurar um cliente OAuth Web no Google Cloud e inserir Client ID e Client Secret diretamente no painel Supabase > Authentication > Sign In / Providers > Google.
Callback Google: https://yiuntwgfoxauhrinsaxd.supabase.co/auth/v1/callback
URLs de retorno da aplicação já permitidas: http://127.0.0.1:3000/auth/confirm e http://localhost:3000/auth/confirm.
Não envie Client Secret pelo chat e não coloque em NEXT_PUBLIC. Depois de ativar, testar com a conta Google autorizada na tela de consentimento. A implementação solicita apenas dados básicos de perfil, sem Drive/Gmail.
Link por e-mail usa shouldCreateUser:false. Novas contas pelo Google; link apenas para contas existentes. Entrega de e-mail depende do serviço/limites e não foi verificada com caixa postal real. Sessão é mantida pelo Supabase enquanto válida; não há bypass por e-mail.

## Fotos e limites
Upload por arquivo ou Ctrl+V e URL HTTPS no formulário. /api/images exige usuário validado ou admin local, origem igual, 5 MB de entrada, 20 MP, conversão WebP até 1400 px, metadados removidos, 25 imagens/h por conta no processo. Arquivos em public/uploads, ignorados pelo Git. Para publicação em nuvem, migrar para Storage persistente; uploads locais não garantem persistência em hosts efêmeros. URL remota depende do servidor da imagem e deve ter direito de uso.

## Limites desta etapa
IA é futura e indicada como tal. Conta admin de demonstração restrita ao loopback; não serve para produção pública. Perfis e avaliações têm código e políticas instalados, mas teste completo com dois usuários Google depende da ativação do provedor. Nenhum segredo é exposto nos relatórios. Sem commit/push.

## Validação concluída
- npm.cmd run build: aprovado (17 páginas/rotas).
- TypeScript aprovado.
- scripts/verify-community.cjs: permissões, RPC protegido, sete rotas HTTP 200, admin, edição real preservando valores, proteção de origem, regra de gratuidade e upload WebP aprovados.
- Navegador: visitante é convidado ao login ao favoritar; filtros Gratuito + Família + Afonso Pena retornam Parque Municipal; editor administrativo carregou todos os campos do banco.
- A ferramenta de navegador permaneceu em 319 px apesar das tentativas de alteração de viewport; a inspeção visual efetiva desta rodada foi nessa largura estreita. Layout desktop implementado em CSS, sem alegação de inspeção visual ampla bem-sucedida.

Verificação adicional: exposição em cartaz aparece no detalhe do CCBB mesmo com data de início no passado; 319 px sem rolagem horizontal e sem imagens quebradas carregadas. Capturas atuais: uaibora-admin-comunidade.jpg e uaibora-descoberta-mobile.jpg na pasta de visualizações desta conversa.
