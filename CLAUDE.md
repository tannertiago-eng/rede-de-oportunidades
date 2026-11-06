# Rede de Oportunidades — instruções do projeto

@AGENTS.md

> Documento-base do projeto. As seções 0 a 11 são o pedido original. As seções 12 e 13 registram decisões já tomadas e notas técnicas conferidas. Leia tudo antes de trabalhar. **Estado atual: protótipo sem backend (decisão 12.10).**

---

## 0. Como quero que você trabalhe

1. **Antes de escrever qualquer código**, entre em modo de planejamento: leia este documento inteiro, liste dúvidas e proponha (a) a estrutura de pastas, (b) o esquema do banco, (c) a ordem das entregas. Espere minha aprovação.
2. Trabalhe **uma fase por vez** (seção 9). Ao fim de cada fase: rode o app, rode os testes, me mostre o que mudou e o que falta.
3. **Não invente APIs.** Confira na documentação atual do Next.js e do Supabase os nomes de pacotes, funções e configurações antes de usar. Se não tiver certeza de que algo existe, diga.
4. Commits pequenos, com mensagens em português.
5. Toda decisão que afete **privacidade, permissões ou dados pessoais** precisa de minha confirmação antes de ser implementada.
6. Tudo em **português do Brasil**: interface, mensagens de erro, comentários de domínio e nomes de tabelas/colunas.

---

## 1. Contexto

A **Rede de Oportunidades** é uma iniciativa de uma igreja para conectar membros a trabalho, negócios e crescimento profissional. Ela tem três camadas:

- **Plataforma** (este sistema): web app mobile-first.
- **Ministério**: voluntários que fazem curadoria de vagas e negócios, mentoria e indicação. A coordenação é de uma profissional de RH.
- **Ações presenciais**: encontros mensais, mutirões de currículo, rodadas de negócios.

O diferencial não é a tecnologia, é **confiança da comunidade + acompanhamento humano**. O sistema existe para apoiar o ministério, não para substituí-lo. Por isso, quase todo conteúdo passa por **revisão humana antes de publicar**.

| Princípio | O que significa no código |
| --- | --- |
| Integrar, não competir | Vagas e cursos externos entram como **link** (Indeed, Catho, Fundação Bradesco, Sebrae etc.). Não construir ATS nem LMS. |
| Humano no centro | Negócios e vagas têm fluxo `rascunho → em_revisao → publicado`. Indicação é feita por voluntário, com nota estruturada. |
| Privacidade por padrão | Nada é público. Login obrigatório para tudo. Cada campo do perfil tem visibilidade própria. |
| Medir o que importa | Registrar contratações e negócios fechados (autodeclarados), trilhas concluídas e mentorias ativas. |

---

## 2. Stack

- **Next.js** (App Router) + **TypeScript** + **Tailwind CSS**.
- **Supabase**: Postgres, Auth, Storage e **Row Level Security (RLS) em todas as tabelas**.
- **PWA** instalável no celular (manifest + ícones). Sem app nativo.
- Hospedagem: proponha a opção mais simples e me diga os limites do plano gratuito (confira os termos atuais — o uso é de um ministério sem fins lucrativos).
- Sem dependências pesadas sem justificar. Sem bibliotecas de UI completas; componentes próprios com os tokens da seção 7.

Observação de custo: o plano gratuito do Supabase pausa projetos após alguns dias sem uso. Avise-me disso no README e sugira como lidar (ex.: plano Pro quando entrar em produção).

---

## 3. Papéis e permissões

| Papel | Quem | Pode |
| --- | --- | --- |
| `membro` | Qualquer membro cadastrado com consentimento | Editar o próprio perfil; ver vitrine e vagas publicadas; cadastrar o próprio negócio (vai para revisão); demonstrar interesse em vagas; fazer trilhas e simulados; denunciar conteúdo |
| `voluntario` | Curadores de vagas e da vitrine, mentores | Tudo do membro + revisar negócios e vagas; publicar vagas; registrar indicações; ver perfis apenas nos campos liberados para "ministério" |
| `coordenacao` | Coordenação do ministério | Tudo do voluntário + gerenciar papéis; ver painel de indicadores; ver quem marcou "buscando" em modo discreto; tratar denúncias |
| `admin` | Responsável técnico | Configuração técnica. **Não** usar para operação do dia a dia |

Regras de RLS obrigatórias:

1. Nenhuma tabela legível por usuário anônimo.
2. Um membro **nunca** vê campo de outro membro que não esteja liberado na visibilidade dele.
3. **Modo discreto**: se ligado, o status "buscando oportunidade" só aparece para `coordenacao`.
4. Perfis de nível **executivo** nunca aparecem em listagens; só a coordenação os vê.
5. Perfis de **menores de 18** só são visíveis para a coordenação e exigem registro de autorização do responsável. *(Ver decisão 12.5: menores ficam fora do MVP.)*
6. Resultados de avaliações são privados do membro; ele escolhe compartilhar com o ministério.
7. Toda alteração de status (publicar, rejeitar, indicar) gera registro em `auditoria`.

Escreva **testes automatizados das políticas RLS**: para cada papel, um usuário de teste tenta ler e escrever o que pode e o que não pode. Esses testes precisam passar antes de cada fase ser dada como concluída.

---

## 4. LGPD — requisitos não negociáveis

Fazer parte da lista de membros de uma igreja revela convicção religiosa, que é **dado pessoal sensível** na LGPD. Por isso:

- **Consentimento específico e destacado** no primeiro acesso, em tela própria, com texto separado do resto. Guardar versão do termo, data e hora (`consentimentos`). Sem consentimento, o usuário não entra.
- **Minimização**: não coletar CPF, endereço completo, data de nascimento completa, estado civil ou dados de família. Para idade, só "sou maior de 18: sim/não".
- **Direitos do titular** na tela de privacidade: baixar meus dados (JSON), corrigir, revogar consentimento e **excluir minha conta** (com exclusão real dos dados pessoais e anonimização dos registros de impacto).
- **Visibilidade por campo** com três níveis: `so_eu`, `ministerio`, `membros`.
- Página de **política de privacidade** e **termos de uso** com texto provisório marcado como `[REVISAR COM ADVOGADO]`.
- Termos de uso devem dizer que cadastro revisado **não é recomendação** da igreja, e proibir: marketing multinível, "oportunidades de investimento", empréstimos entre membros, política partidária e vagas que exijam religião.
- Logs sem dados pessoais em texto aberto.

---

## 5. Modelo de dados (proposta inicial)

```text
perfis               id (= auth.users.id), nome, telefone_whatsapp, email, maior_de_18 (bool),
                     autorizacao_responsavel_em (timestamp, nulo se maior), nivel (operacional|tecnico|gestao|executivo),
                     area, resumo, experiencias (jsonb), buscando (bool), modo_discreto (bool),
                     disponibilidade (turno, cnh, bairro — só para nível operacional), linkedin_url,
                     visibilidade (jsonb: campo -> so_eu|ministerio|membros), papel, criado_em, atualizado_em
consentimentos       id, usuario_id, tipo, versao, aceito_em, revogado_em
negocios             id, dono_id, nome, categoria, descricao, bairro, whatsapp, instagram, fotos (storage),
                     status (rascunho|em_revisao|publicado|rejeitado|arquivado), motivo_rejeicao,
                     revisado_por, revisado_em, atualizado_em
vagas                id, titulo, empresa, negocio_id (nulo), nivel, tipo_contrato, modalidade, bairro_cidade,
                     descricao, link_externo, origem (interna|externa), status, curador_id, publicada_em, expira_em
interesses_vaga      id, vaga_id, usuario_id, status (interessado|indicado|entrevista|contratado|nao_seguiu), criado_em
indicacoes           id, interesse_id, voluntario_id, situacao, tarefa, acao, resultado (nota no formato STAR), enviada_em
trilhas              id, nome, publico, descricao, ordem
itens_trilha         id, trilha_id, ordem, titulo, provedor, url, tipo (curso|teste|leitura), carga_horaria_aprox
progresso_trilha     id, usuario_id, item_id, status (a_fazer|fazendo|concluido), certificado (storage), concluido_em
simulados            id, tipo (logica|matematica|portugues|excel), titulo, versao, tempo_limite_min
questoes_simulado    id, simulado_id, enunciado, alternativas (jsonb), correta, explicacao
tentativas_simulado  id, usuario_id, simulado_id, respostas (jsonb), acertos, total, iniciada_em, finalizada_em
resultados_externos  id, usuario_id, tipo ('EF SET'), nivel_cefr, nota, comprovante (storage), compartilhar_com_ministerio (bool)
mentorias            id, mentor_id, mentorado_id, area, inicio, fim_previsto (inicio + 90 dias), status
resultados           id, usuario_id, tipo (contratacao|negocio_fechado), vaga_id (nulo), data, observacao
denuncias            id, autor_id, alvo_tipo, alvo_id, motivo, status, tratada_por, tratada_em
auditoria            id, ator_id, acao, entidade, entidade_id, em
```

Revisões propostas a este modelo estão na seção 12.8 (aguardando aprovação).

---

## 6. Telas do MVP

| Área | Telas | Observações |
| --- | --- | --- |
| Entrada | Login, consentimento LGPD, onboarding em 3 passos (nível, área, o que busca) | Sem consentimento, não avança |
| Início | Resumo pessoal: próxima etapa da trilha, vagas novas compatíveis com o nível, mentor | Mobile-first, uma coluna |
| Perfil | Ver e editar perfil; controles de visibilidade por campo; modo discreto | Mostrar ao lado de cada campo quem pode ver |
| Vitrine | Lista com busca e filtro por categoria e bairro; detalhe do negócio; cadastrar/editar meu negócio | Botão de contato copia o WhatsApp e abre o link `wa.me` |
| Vagas | Lista filtrada por nível e modalidade; detalhe; "Tenho interesse"; vagas externas abrem o link | Selo "curada pelo ministério" |
| Trilhas | 4 trilhas (Recolocação, Primeiro emprego, Empreendedor/MEI, Crescimento de carreira); checklist; envio de certificado | Itens são links externos |
| Avaliações | Simulados de lógica e matemática (cronometrados, com correção e explicação); registro do resultado do EF SET | **Nenhum teste de personalidade** no MVP |
| Ministério | Fila de revisão (negócios e vagas), cadastro de vaga, indicação com nota STAR, mentorias, denúncias, painel de indicadores | Só `voluntario` e `coordenacao` |
| Privacidade | Baixar meus dados, revogar consentimento, excluir conta, política e termos | |

Painel de indicadores (coordenação): perfis ativos, negócios publicados e atualizados nos últimos 90 dias, vagas curadas por mês, interesses e indicações, contratações e negócios fechados registrados, trilhas concluídas, mentorias ativas. Sem gráficos complexos no MVP: números e uma tabela por mês.

---

## 7. Identidade visual (tokens)

Aplique estes tokens como variáveis CSS e no tema do Tailwind. Não use cores fora da paleta.

| Token | Claro | Escuro (derivado) | Uso |
| --- | --- | --- | --- |
| `--primaria` | `#437066` | `#7DB3A5` | Botões principais, links, estados ativos |
| `--sobre-primaria` | `#FFFFFF` | `#10201C` | Texto sobre a cor primária |
| `--secundaria` | `#D8E5DF` | `#24352F` | Chips, fundos suaves, seleção |
| `--fundo` | `#F5F1E9` | `#121A18` | Fundo do app |
| `--superficie` | `#FFFFFF` | `#1A2522` | Cartões, folhas, campos |
| `--texto` | `#272D45` | `#E7ECE8` | Títulos e texto principal |
| `--texto-2` | `#5A6072` | `#A7B3AE` | Texto secundário |
| `--linha` | `#E3DED3` | `#2C3B36` | Bordas e divisórias |
| `--destaque` | `#B89964` | `#D3B47E` | Selos e detalhes. **Nunca** como cor de texto sobre fundo claro (contraste insuficiente) |
| `--alerta` | `#B3452F` | `#E08A6E` | Erros, rejeição, denúncia |

Tipografia (Google Fonts): títulos em **Kanit** (300 em títulos grandes, 400–500 em pequenos); corpo em **Martel Sans** (400 e 600) com `line-height` entre 1.45 e 1.6. Sempre com fontes de reserva do sistema.

Forma: cantos de 12 px em botões e 16 px em cartões, bordas de 1 px, quase sem sombras, ícones de traço fino (1,5 px).

Princípios: **clareza antes de ornamentação; leitura confortável no celular; acolhimento com contraste acessível.** Mobile-first, uma coluna, áreas de toque de pelo menos 44 px, muito espaço em branco, um botão principal por tela, sem emoji, tema claro e escuro, contraste AA, foco visível, rótulos em todos os campos.

Se `rede-oportunidades.html` estiver na pasta, use-o como guia de layout e de textos de interface, não como código-fonte.

---

## 8. Dados de exemplo (seed)

Script de seed com **dados fictícios marcados como exemplo** (ex.: "Padaria Exemplo"): 8 negócios, 10 vagas (metade externas), as 4 trilhas com 4 a 6 itens cada (links reais e gratuitos: Escola Virtual da Fundação Bradesco, Escola Virtual.Gov, Sebrae, EF SET — conferir se abrem), 1 simulado de lógica e 1 de matemática com 10 questões cada, e um usuário de teste por papel. **Nunca** usar nomes de pessoas reais.

---

## 9. Fases de entrega

| Fase | Entrega | Pronto quando |
| --- | --- | --- |
| 0 | Projeto criado, Supabase conectado, tokens de design, layout base, PWA | App abre no celular e instala na tela inicial |
| 1 | Login, consentimento LGPD, onboarding, perfil com visibilidade e modo discreto | Testes de RLS de `perfis` e `consentimentos` passam |
| 2 | Vitrine de negócios + fila de revisão | Negócio só aparece depois de aprovado; dono edita, ninguém mais |
| 3 | Mural de vagas + interesse + indicação STAR | Voluntário indica; membro vê o status do próprio interesse |
| 4 | Trilhas, certificados e simulados | Simulado cronometrado corrige e explica; progresso salvo |
| 5 | Painel do ministério, mentorias, denúncias, auditoria | Indicadores batem com os dados do seed |
| 6 | Privacidade (exportar, revogar, excluir), revisão de segurança, README de operação | Exclusão remove dados pessoais; todos os testes passam |

Ao final da Fase 6, escrever um **checklist de revisão de segurança** para uma pessoa de fora conferir antes do lançamento.

---

## 10. O que NÃO fazer

- Não criar avaliações públicas (estrelas) de negócios no MVP.
- Não exibir "membro da igreja X" em nenhuma página acessível sem login.
- Não aplicar nem interpretar testes psicológicos (é atividade privativa de psicólogos).
- Não implementar destaque pago na vitrine.
- Não enviar dados pessoais para serviços de terceiros (analytics, IA) sem aprovação.
- Não guardar segredos no código; usar variáveis de ambiente e explicar como configurá-las.

---

## 11. Primeira tarefa (concluída em 04/11/2026)

Perguntas, estrutura de pastas, esquema revisado e plano da Fase 0 foram entregues. Respostas na seção 12.

---

## 12. Decisões tomadas

1. **Pasta:** `~/RedeDeOportunidades`. O pacote npm se chama `rede-de-oportunidades` (o npm não aceita maiúsculas).
2. **Docker:** OrbStack instalado. Supabase local e testes pgTAP (`supabase test db`) rodam nele.
3. **Cadastro:** só vale **depois de aprovado pela coordenação**. Até lá, a pessoa vê apenas uma tela de "aguardando aprovação".
4. **Login:** código de 6 dígitos por e-mail (OTP). Motivo: no iPhone, o PWA instalado não compartilha sessão com o Safari, então o link mágico não funciona bem.
   - **Desenvolvimento:** Supabase local, com os e-mails caindo na caixa de teste local (porta 54324). Nada sai da máquina.
   - **Produção:** conferido na documentação oficial em 04/11/2026, o e-mail embutido do Supabase **só entrega para endereços da equipe do projeto**, tem limite de 2 por hora e "não é para produção". Por isso, um **SMTP próprio é obrigatório antes do primeiro membro real**. A escolha do provedor **exige aprovação**, porque ele recebe e-mails de membros.
   - **Monitor (Fase 1):** mesmo com SMTP próprio, o limite padrão é de 30 e-mails por hora. Registrar cada falha de envio por limite (só contagem e horário, sem e-mail) e mostrar um aviso para a coordenação e o admin quando passar de um limiar. O aviso indica o que ajustar (limite de envio ou plano do provedor).
5. **Menores de 18:** fora do MVP. Quem responde "não" em "sou maior de 18" não consegue concluir o cadastro.
6. **Contas** (Supabase, hospedagem): no e-mail pessoal do responsável técnico por enquanto; migrar para um e-mail da igreja depois. Documentar a migração no README.
7. **Ícone e marca:** provisórios, feitos com os tokens.
8. **Revisões do modelo (aguardando aprovação; não implementar antes do OK):** `papel` em tabela própria `papeis`; `email` fora de `perfis`; visibilidade por campo aplicada por função (`ver_perfis()`), não por RLS de coluna; `compartilhar_com_ministerio` também em `tentativas_simulado`; gabarito oculto até finalizar a tentativa; mudanças de status só por funções que gravam auditoria; negócio editado volta para revisão e sai do ar; buckets privados com URL assinada; exclusão com `cascade` nos dados pessoais e `set null` nos registros de impacto; nota STAR visível ao membro só na exportação de dados.
9. **Hospedagem:** o Vercel Hobby é restrito a "uso pessoal não comercial" e não trata de ONGs. Avaliar Netlify e Cloudflare antes do primeiro deploy público.

---

10. **Mudança de rumo (novembro de 2026):** o escopo atual é um **protótipo navegável para teste interno** na igreja, com dados fictícios e sem backend. Depois, **um desenvolvedor faz banco de dados, login e segurança**. As fases da seção 9 continuam valendo para esse trabalho. Guia em `para-o-desenvolvedor/README.md`.
11. **Publicação do protótipo:** GitHub Pages, conta `tannertiago-eng`, repositório público (`npm run publicar`). Nada de dados reais, nome da igreja ou segredos no repositório. Sugestões dos testadores chegam por WhatsApp (botão no topo).

---

## 13. Notas técnicas conferidas (Next 16.4 / Supabase)

- **Next 16:** `middleware.ts` virou `src/proxy.ts`, que exporta `proxy`. Leia `node_modules/next/dist/docs/` antes de usar qualquer API do Next.
- **Protótipo:** exportação estática, por isso sem proxy, cabeçalhos, redirects e `cacheComponents` no `next.config.ts`. Rotas de detalhe usam `?id=` porque itens criados no aparelho não existem no build. Dados: `src/dados/` (localStorage).
- **`cacheComponents: true`** (vem ligado no template; desligado no protótipo): ler `cookies()` fora de um `<Suspense>` **quebra o build**. Leitura de sessão fica dentro de componentes sob `<Suspense>`, nunca no topo de um layout. Guia: `02-guides/authentication-with-cache-components.md`.
- **Tema sem "piscar":** script inline no `<head>` lê a preferência e aplica `data-tema` no `<html>` antes da pintura (`02-guides/preventing-flash-before-hydration.md`).
- **PWA:** para instalar bastam manifest (`src/app/manifest.ts`) e HTTPS. Service worker não é necessário.
- **Tailwind v4:** sem `tailwind.config`. Os tokens vão em `@theme` no CSS.
- **Supabase SSR (`@supabase/ssr`):** cookies com `getAll`/`setAll`. O `setAll` recebe também `headers` anti-cache, que precisam ir para a resposta. Um cliente novo por requisição. No servidor, use **`getClaims()`** para autorização, nunca `getSession()`. Chame `getClaims()` logo no início do proxy.
- **Variáveis:** `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`. Chave secreta nunca com prefixo `NEXT_PUBLIC_`.
- **Permissões padrão do banco** (migração `20261104000000`): o `anon` não recebe nada em objetos novos do `public`. Funções criadas pelo `postgres` **não** ganham mais `EXECUTE` para PUBLIC, em nenhum esquema. No `public`, o `authenticated` recebe por padrão; fora dele, conceda explicitamente. O teste `00_base_anonimo` também exige RLS ligado em toda tabela do `public`.
- **Tipos de rota:** `LayoutProps`/`PageProps` são gerados; por isso `npm run tipos` roda `next typegen` antes do `tsc`.
- **Fontes:** via `next/font/google`, servidas pelo próprio site. O navegador do membro não chama o Google.
