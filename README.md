# Rede de Oportunidades

Web app (PWA) que conecta membros da igreja a trabalho, negócios e crescimento profissional, com curadoria humana do ministério.

As regras do produto, as decisões e as notas técnicas estão no [CLAUDE.md](CLAUDE.md).

## Estado atual: protótipo

Protótipo navegável para teste interno, **sem backend**: dados fictícios, tudo salvo só no aparelho de quem testa.

- **Para testar:** <https://tannertiago-eng.github.io/rede-de-oportunidades/>
- **Para o desenvolvedor que vai construir o sistema real:** [para-o-desenvolvedor/README.md](para-o-desenvolvedor/README.md)

## Rodar na sua máquina

```bash
npm install
npm run dev         # http://localhost:3000
```

## Verificações e publicação

```bash
npm run verificar   # lint, tipos e testes das regras
npm run build       # build de produção
npm run publicar    # verifica, gera e publica no GitHub Pages
```

O número que recebe as sugestões do WhatsApp fica em `.env.publicar`, fora do git: `NEXT_PUBLIC_WHATSAPP_SUGESTOES=5565999999999` (com DDI, sem símbolos). Sem ele, o WhatsApp pede para escolher o contato. **O número fica visível para quem abrir o protótipo.**

## Banco de dados local (para a versão real)

Precisa de [OrbStack](https://orbstack.dev) ou Docker Desktop e do Supabase CLI (`brew install supabase/tap/supabase`).

```bash
supabase start      # banco, autenticação e caixa de e-mail de teste (http://127.0.0.1:54324)
npm run testes:db   # testes de segurança do banco (pgTAP)
```

Variáveis da versão real: `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (modelo em `.env.example`). A chave **secreta** nunca vai para o código, nem com prefixo `NEXT_PUBLIC_`.

## Avisos de operação

Estes avisos valem para a versão real, com Supabase.

### Pausa do Supabase gratuito

No plano Free, um projeto com **pouca atividade no banco durante uma semana é pausado**. O app fica fora do ar até alguém reativá-lo pelo painel do Supabase (os dados não se perdem). Planos pagos não pausam.

- **Durante o desenvolvimento:** o plano Free basta. Se pausar, reative pelo painel.
- **Em produção, com membros reais:** usar o plano **Pro** (US$ 25/mês na data desta nota; confira em supabase.com/pricing). Um app que some do ar sem aviso quebra a confiança, que é justamente o diferencial do projeto.

Outros limites do Free (fontes secundárias; confira em supabase.com/pricing): 2 projetos ativos, 500 MB de banco, 1 GB de arquivos, 50 mil usuários ativos por mês.

### E-mail de login

O e-mail embutido do Supabase **só entrega para endereços da equipe do projeto**, envia no máximo 2 mensagens por hora e não é feito para produção (documentação oficial, conferida em 04/11/2026). **Antes do primeiro membro real, é obrigatório configurar um SMTP próprio** (painel > Authentication > Emails > SMTP Settings). A escolha do provedor precisa de aprovação, porque ele recebe os e-mails dos membros.

### Hospedagem

O protótipo fica no GitHub Pages. A hospedagem da versão real ainda não está definida: o plano gratuito da Vercel (Hobby) é restrito a "uso pessoal não comercial" e não fala de ONGs.

### Contas

As contas de Supabase e hospedagem estão, por enquanto, no e-mail pessoal do responsável técnico. Quando houver um e-mail da igreja: convidar esse e-mail como **Owner** da organização no Supabase e na hospedagem, confirmar o acesso e só então remover o e-mail pessoal.

## Instalar no celular ou no computador

- **Android (Chrome):** menu ⋮ > "Instalar app".
- **iPhone (Safari):** botão Compartilhar > "Adicionar à Tela de Início".
- **Computador (Chrome ou Edge):** ícone de instalar, na barra de endereço. Instalar é opcional: o app também funciona direto no navegador.

## Estrutura

```text
src/
  app/
    (aberto)/              entrada, política, termos e guia do teste (sem nome da igreja)
    (entrada)/             consentimento, cadastro e aguardando aprovação
    (app)/                 área do membro e do ministério
    manifest.ts            manifesto do PWA
  componentes/ui/          Botao, Cartao, Campo, Formulario, Chip, Selo, Aviso, Icone
  componentes/layout/      Cabecalho, NavegacaoPrincipal, Guarda, FaixaPrototipo...
  estilos/tokens.css       cores da identidade, claro e escuro
  dominio/                 tipos e regras (visibilidade, simulado, indicadores)
  dados/                   dados fictícios e loja local: o que será trocado pelo Supabase
  lib/supabase/            clientes do Supabase, prontos para a versão real
para-o-desenvolvedor/      guia de transição e proxy de sessão
scripts/publicar.sh        publicação no GitHub Pages
supabase/
  migrations/              mudanças no banco, em ordem
  tests/                   testes pgTAP de permissões
```
