-- Fase 0 — base de segurança.
-- Regra 1 do CLAUDE.md: nenhuma tabela legível por usuário anônimo.
--
-- O Supabase concede, por padrão, acesso do papel "anon" a tudo que for criado
-- no esquema public (o RLS é que filtraria). Aqui tiramos esse acesso de vez:
-- o anônimo não chega nem a consultar a tabela, com ou sem RLS.
-- O papel "authenticated" mantém os privilégios; quem decide o que ele vê é o RLS.

alter default privileges for role postgres in schema public
  revoke all on tables from anon;

alter default privileges for role postgres in schema public
  revoke all on sequences from anon;

-- Funções: o Postgres dá EXECUTE a PUBLIC (e, portanto, ao anon) por padrão.
alter default privileges for role postgres in schema public
  revoke execute on functions from public, anon;

alter default privileges for role postgres in schema public
  grant execute on functions to authenticated, service_role;
