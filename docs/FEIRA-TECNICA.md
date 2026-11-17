# Feira Técnica — Uai Bora

## Pesquisa pública atual

- Pesquisa: https://forms.gle/PVvdRyDqCSYPTrpXA
- `/feira-tecnica` apresenta a capivara, o QR público e o botão para responder no Google Forms.
- `/feira-tecnica/qr` permite baixar o QR e o cartaz completo ou imprimir/salvar PDF.
- O QR funciona com dados móveis e qualquer Wi-Fi, sem depender do computador ou do servidor local.
- Nome e duas perguntas obrigatórias: lugar gratuito + motivo; lugar/evento pago + motivo.
- Não exige login e não coleta e-mail. Respostas e planilha ficam privadas na conta Google da equipe.
- O agradecimento personalizado é exibido pelo Google Forms após o envio.
- Uma resposta identificada como TESTE DA EQUIPE foi usada para verificar o envio.
- O admin contém o link para consultar as novas respostas no Google Forms e a planilha vinculada.
- Não existe sincronização automática das respostas do Google Forms para o Supabase.

## Configuração e imagens

Os links e caminhos das imagens ficam em `src/data/feira-tecnica.json`. O QR e o cartaz em `public/images/feira-tecnica-*-publico.png` apontam para a pesquisa pública, sem redirecionamento pelo endereço local do site.

Para gerar novamente o PNG: `node scripts/generate-fair-qr.cjs caminho-do-arquivo.png`. O script usa o mesmo destino público e valida a leitura com um decodificador independente. O antigo `UAIBORA_FAIR_URL` do ambiente local não altera esse destino.

Use o QR público atual; imagens antigas de QR da rede local continuam dependendo da mesma Wi-Fi.

## Histórico preservado no Supabase

A API e a tabela anteriores foram preservadas. A migração `202611170006_feira_tecnica.sql` cria `uaibora_private.feira_responses`, com RLS habilitado, sem privilégios públicos. A função `uaibora_feira` exige o token privado do servidor. A leitura exige sessão administrativa local. Não utiliza `service_role` e não registra respostas ou IP nos logs.

No painel, “Respostas anteriores do site” abre busca, CSV e paginação desses registros. Testes da equipe ficam ocultos por padrão. Essa contagem não inclui os envios do Google Forms.

## Administração e servidor local

- Admin: http://127.0.0.1:3000/admin, somente senha 123, restrita à apresentação local.
- `.env.local` não deve ser versionado. Os segredos permanecem somente no ambiente do servidor.
- `npm.cmd run dev -- --hostname 127.0.0.1` inicia o site local da equipe.
- `npm.cmd run build` e `npm.cmd run feira` disponibilizam uma segunda instância na porta 3001 com a administração desativada. Ela não é necessária para o QR público.
- O site completo ainda não está publicado na Vercel; apenas a pesquisa do Google Forms é pública.
