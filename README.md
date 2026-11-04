# Rede de Oportunidades

Web app (PWA) que conecta membros da igreja a trabalho, negócios e crescimento profissional, com curadoria humana do ministério.

As regras do produto, as decisões e as notas técnicas estão no [CLAUDE.md](CLAUDE.md).

## Requisitos

- Node 24 ou superior
- [OrbStack](https://orbstack.dev) ou Docker Desktop (o Supabase local roda em contêineres)
- Supabase CLI: `brew install supabase/tap/supabase`

## Rodar na sua máquina

```bash
npm install
supabase start              # sobe banco, autenticação e caixa de e-mail de teste
cp .env.example .env.local  # preencha com a saída de "supabase status"
npm run dev                 # http://localhost:3000
```

Endereços locais, depois do `supabase start`:

| O quê | Endereço |
| --- | --- |
| App | <http://localhost:3000> |
| Painel do banco (Studio) | <http://127.0.0.1:54323> |
| Caixa de e-mail de teste | <http://127.0.0.1:54324> |

Nenhum e-mail sai da máquina em desenvolvimento: os códigos de login caem na caixa de teste.

## Verificações

```bash
npm run lint        # padrão de código
npm run tipos       # TypeScript
npm run testes:db   # testes de segurança do banco (pgTAP), precisa do supabase start
npm run verificar   # os três acima
npm run build       # build de produção
```

Nenhuma fase é dada como concluída sem `npm run verificar` e `npm run build` passando.

## Variáveis de ambiente

| Variável | Onde pegar | Pode ir para o navegador? |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | `supabase status` (local) ou painel > Project Settings > API | Sim |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Mesmo lugar, chave "Publishable" | Sim |

A chave **secreta** do Supabase nunca vai para o código, nem com prefixo `NEXT_PUBLIC_`. O `.env.local` está no `.gitignore`.

## Avisos de operação

### Pausa do Supabase gratuito

No plano Free, um projeto com **pouca atividade no banco durante uma semana é pausado**. O app fica fora do ar até alguém reativá-lo pelo painel do Supabase (os dados não se perdem). Planos pagos não pausam.

- **Durante o desenvolvimento:** o plano Free basta. Se pausar, reative pelo painel.
- **Em produção, com membros reais:** usar o plano **Pro** (US$ 25/mês na data desta nota; confira em supabase.com/pricing). Um app que some do ar sem aviso quebra a confiança, que é justamente o diferencial do projeto.

Outros limites do Free (fontes secundárias; confira em supabase.com/pricing): 2 projetos ativos, 500 MB de banco, 1 GB de arquivos, 50 mil usuários ativos por mês.

### E-mail de login

O e-mail embutido do Supabase **só entrega para endereços da equipe do projeto**, envia no máximo 2 mensagens por hora e não é feito para produção (documentação oficial, conferida em 04/11/2026). **Antes do primeiro membro real, é obrigatório configurar um SMTP próprio** (painel > Authentication > Emails > SMTP Settings). A escolha do provedor precisa de aprovação, porque ele recebe os e-mails dos membros.

### Hospedagem

Ainda não definida. O plano gratuito da Vercel (Hobby) é restrito a "uso pessoal não comercial" e não fala de ONGs. Netlify e Cloudflare serão avaliados antes do primeiro deploy público.

### Contas

As contas de Supabase e hospedagem estão, por enquanto, no e-mail pessoal do responsável técnico. Quando houver um e-mail da igreja: convidar esse e-mail como **Owner** da organização no Supabase e na hospedagem, confirmar o acesso e só então remover o e-mail pessoal.

## Instalar no celular

A instalação na tela inicial exige **HTTPS**. Por isso, o teste no celular é feito no endereço publicado, não no `localhost`.

- **Android (Chrome):** menu ⋮ > "Instalar app".
- **iPhone (Safari):** botão Compartilhar > "Adicionar à Tela de Início".

## Estrutura

```text
src/
  proxy.ts                 renova a sessão a cada requisição (Next 16: substitui o middleware.ts)
  app/
    (aberto)/              páginas sem login (sem nome da igreja)
    (app)/                 área do membro, com navegação inferior
    manifest.ts            manifesto do PWA
  componentes/ui/          Botao, Cartao, Campo, Chip, Selo, Icone
  componentes/layout/      Cabecalho, NavegacaoInferior, AlternarTema
  estilos/tokens.css       cores da identidade, claro e escuro
  lib/supabase/            clientes do navegador, do servidor e do proxy
supabase/
  migrations/              mudanças no banco, em ordem
  tests/                   testes pgTAP de permissões
```
