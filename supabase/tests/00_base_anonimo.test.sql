-- Fase 0: garante as regras gerais que valem para TODAS as tabelas do esquema public.
-- Roda com: supabase test db

begin;
create extension if not exists pgtap with schema extensions;

select plan(8);

-- Objetos-sonda criados como postgres, como faria uma migração nova.
create table public.sonda_teste (id int primary key);
alter table public.sonda_teste enable row level security;
create function public.sonda_funcao() returns int language sql as 'select 1';

-- O anônimo não recebe nenhum privilégio em tabela nova.
select ok(not has_table_privilege('anon', 'public.sonda_teste', 'select'), 'anon não lê tabela nova');
select ok(not has_table_privilege('anon', 'public.sonda_teste', 'insert'), 'anon não insere em tabela nova');
select ok(not has_table_privilege('anon', 'public.sonda_teste', 'update'), 'anon não altera tabela nova');
select ok(not has_table_privilege('anon', 'public.sonda_teste', 'delete'), 'anon não apaga em tabela nova');
select ok(not has_function_privilege('anon', 'public.sonda_funcao()', 'execute'), 'anon não executa função nova');

-- Logado mantém acesso de base; o RLS de cada tabela decide o resto.
select ok(has_table_privilege('authenticated', 'public.sonda_teste', 'select'), 'authenticated mantém acesso (RLS decide)');

-- Varreduras que protegem as próximas fases.
select is_empty(
  $$ select table_name from information_schema.role_table_grants
     where grantee = 'anon' and table_schema = 'public' $$,
  'nenhuma tabela do public tem privilégio para anon'
);

select is_empty(
  $$ select c.relname from pg_class c join pg_namespace n on n.oid = c.relnamespace
     where n.nspname = 'public' and c.relkind in ('r', 'p') and not c.relrowsecurity $$,
  'toda tabela do public tem RLS ligado'
);

select * from finish();
rollback;
