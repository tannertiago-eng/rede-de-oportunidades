# Guia de transição: do protótipo para o sistema real

Este repositório tem um **protótipo navegável, sem backend**, usado para testes internos. Ele já tem as telas, os textos, os fluxos e as regras de produto, em Next.js. Falta o que este guia lista: banco de dados, login e segurança.

Leia antes o [CLAUDE.md](../CLAUDE.md). Ele é a especificação do produto: papéis, regras de RLS, LGPD, modelo de dados e decisões (seção 12).

> **O protótipo não é seguro, por projeto.** Todas as regras rodam no navegador e os dados ficam no `localStorage`. Nada dele pode receber dados reais. A proteção precisa ser construída no banco.

## O que já existe e pode ser aproveitado

| Pasta | O que é | O que fazer |
| --- | --- | --- |
| `src/app/` | Todas as telas do MVP | Manter. Trocar só a origem dos dados |
| `src/componentes/`, `src/estilos/` | Componentes e tokens de design | Manter |
| `src/dominio/tipos.ts` | Tipos com os mesmos nomes das tabelas e colunas | Manter ou gerar com `supabase gen types` |
| `src/dominio/visibilidade.ts` | Regras de visibilidade por campo | Levar para o banco (função `ver_perfis`). Os testes servem de especificação |
| `src/dominio/indicadores.ts` | Cálculo do painel | Levar para o banco (função `indicadores`) |
| `src/dados/` | **Camada falsa:** `loja.ts`, `ganchos.ts`, `acoes.ts` | **Substituir pelo Supabase** |
| `src/dados/exemplo.ts`, `conteudo.ts` | Dados fictícios, trilhas e simulados | Virar `supabase/seed.sql`. Os links das trilhas foram conferidos em 06/11/2026 |
| `src/lib/supabase/` | Clientes de navegador, servidor e proxy (`@supabase/ssr`) | Prontos, ainda sem uso |
| `para-o-desenvolvedor/proxy.ts` | Proxy que renova a sessão | Mover para `src/proxy.ts` e adicionar o bloqueio de quem não está logado |
| `supabase/migrations/`, `supabase/tests/` | Base: `anon` sem acesso a nada, com teste pgTAP | Manter e continuar |

As telas falam com os dados por um único caminho: leem com `useEstado()` e `useUsuario()` e escrevem com as funções de `src/dados/acoes.ts`. Por isso, cada função dessas é um item da sua lista de trabalho. Mudanças de status viram funções do banco que conferem o papel e gravam em `auditoria` na mesma transação.

## Sair do modo estático

1. Em `next.config.ts`, retirar `output`, `trailingSlash` e `basePath`.
2. Religar `cacheComponents: true` e `partialPrefetching: true` (estavam no template; foram desligados só para a exportação). Atenção: com `cacheComponents`, ler `cookies()` fora de `<Suspense>` quebra o build.
3. Restaurar os cabeçalhos de segurança: `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy: camera=(), microphone=(), geolocation=()`.
4. Em `src/app/manifest.ts`, retirar `export const dynamic = "force-static"`.
5. Remover `FaixaPrototipo`, a tela `/prototipo`, os botões "Simular" e os perfis de teste em `/entrar`.
6. No botão de contato da vitrine, abrir `https://wa.me/`. No protótipo ele só copia, porque os números são fictícios.
7. Manter `robots: noindex` e conferir que nenhuma página aberta cita a igreja (CLAUDE.md, seção 10).

Esta versão do Next tem mudanças incompatíveis: leia `node_modules/next/dist/docs/` antes de usar qualquer API.

## O que é simulado e precisa ser construído

| No protótipo | Na versão real |
| --- | --- |
| Login com e-mail fixo e código preenchido | Código de 6 dígitos por e-mail (`signInWithOtp` / `verifyOtp`). Link mágico não: no iPhone, o PWA instalado não compartilha sessão com o Safari |
| Papel escolhido num seletor | Tabela `papeis`, editável só pela coordenação. Se ficar em `perfis`, o membro pode se promover |
| `Guarda` no navegador | Sessão validada com `getClaims()` no servidor; autorização pelo RLS |
| Permissões que escondem telas | RLS em todas as tabelas, com testes pgTAP por papel (CLAUDE.md, seção 3) |
| `verPerfil()` no navegador | RLS filtra linhas, não colunas. A tabela `perfis` só é legível pelo dono e pela coordenação; os demais leem por função que mascara os campos |
| Gabarito e cronômetro no navegador | Gabarito oculto até finalizar; correção e tempo limite no banco |
| Certificados, comprovantes e fotos simulados | Buckets privados, com política por dono e URL assinada |
| Baixar e excluir no navegador | Exportação e exclusão no servidor, incluindo o usuário em `auth.users` e os arquivos no Storage. O comportamento esperado está em `apagarDadosDe()` e nos testes |
| Monitor de limite de e-mail: não existe | Registrar falhas de envio por limite (só contagem e horário) e avisar quando passar de um limiar (CLAUDE.md, decisão 12.4) |

## Decisões em aberto: pedir confirmação antes de implementar

O responsável exige confirmação para tudo que afeta privacidade, permissões ou dados pessoais. O protótipo **demonstra** os itens abaixo para que a igreja opine, mas eles **não foram aprovados** (CLAUDE.md, seção 12.8):

- `papel` em tabela própria e `email` fora de `perfis`
- Negócio editado sai do ar até nova revisão
- Nota STAR visível ao membro só na exportação de dados
- `compartilhar_com_ministerio` também nos simulados
- Excluir conta: `cascade` nos dados pessoais e `set null` nos registros de impacto
- No protótipo, a mentoria é criada só pela coordenação e encerrada também pelo mentor
- Também falta decidir se o nível "executivo" precisa de confirmação da coordenação

Bloqueios antes do primeiro membro real:

- **SMTP próprio é obrigatório.** O e-mail embutido do Supabase só entrega à equipe do projeto e envia 2 por hora. O provedor recebe e-mails de membros, então a escolha exige aprovação.
- **Textos jurídicos:** política, termos e consentimento estão marcados com `[REVISAR COM ADVOGADO]`.
- **Hospedagem de produção:** o Vercel Hobby é restrito a uso pessoal não comercial. Comparar opções, e usar o plano Pro do Supabase, que não pausa por inatividade.
- **Repositório público:** este repositório é público por causa do GitHub Pages gratuito. Considere um repositório privado para a versão real.
- **Checklist de segurança** para revisão externa (CLAUDE.md, seção 9, Fase 6).

## Como rodar

```bash
npm install
npm run dev         # protótipo em http://localhost:3000
npm run verificar   # lint, tipos e testes das regras
npm run publicar    # publica o protótipo no GitHub Pages

# Banco local: precisa de Docker ou OrbStack
supabase start
npm run testes:db   # testes pgTAP
```
