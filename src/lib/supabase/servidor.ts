import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { supabaseChavePublica, supabaseUrl } from "./env";

// Cliente para Server Components, Server Actions e Route Handlers.
// Um cliente novo por requisição. Com cacheComponents, quem chama cookies()
// precisa estar dentro de um <Suspense> (ver CLAUDE.md, seção 13).
export async function criarClienteServidor() {
  const loja = await cookies();

  return createServerClient(supabaseUrl, supabaseChavePublica, {
    cookies: {
      getAll() {
        return loja.getAll();
      },
      setAll(cookiesParaGravar) {
        try {
          cookiesParaGravar.forEach(({ name, value, options }) => loja.set(name, value, options));
        } catch {
          // Server Components não gravam cookies; o proxy renova a sessão.
        }
      },
    },
  });
}
