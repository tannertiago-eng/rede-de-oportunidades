import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { supabaseChavePublica, supabaseUrl } from "./env";

// Renova a sessão a cada requisição e devolve os cookies atualizados.
// A autorização de verdade é feita pelo RLS no banco; isto é só a sessão.
export async function atualizarSessao(requisicao: NextRequest) {
  let resposta = NextResponse.next({ request: requisicao });

  const supabase = createServerClient(supabaseUrl, supabaseChavePublica, {
    cookies: {
      getAll() {
        return requisicao.cookies.getAll();
      },
      setAll(cookiesParaGravar, cabecalhos) {
        cookiesParaGravar.forEach(({ name, value }) => requisicao.cookies.set(name, value));
        resposta = NextResponse.next({ request: requisicao });
        cookiesParaGravar.forEach(({ name, value, options }) => resposta.cookies.set(name, value, options));
        // Impede que CDN guarde a resposta com o token de outra pessoa.
        Object.entries(cabecalhos).forEach(([chave, valor]) => resposta.headers.set(chave, valor));
      },
    },
  });

  // getClaims() logo no início: valida o token e dispara a renovação, se precisar.
  const { data } = await supabase.auth.getClaims();

  return { resposta, claims: data?.claims ?? null };
}
