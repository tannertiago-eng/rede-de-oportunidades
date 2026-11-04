import type { NextRequest } from "next/server";
import { atualizarSessao } from "@/lib/supabase/proxy";

// Next 16: este arquivo substitui o antigo middleware.ts.
// Fase 0: só renova a sessão. O bloqueio de quem não está logado entra na Fase 1.
export async function proxy(requisicao: NextRequest) {
  const { resposta } = await atualizarSessao(requisicao);
  return resposta;
}

export const config = {
  matcher: [
    // Tudo, exceto arquivos estáticos, ícones e o manifesto.
    "/((?!_next/static|_next/image|icones/|icon\\.svg|apple-icon\\.png|manifest\\.webmanifest|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
