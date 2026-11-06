"use client";

import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { destinoDaSessao } from "@/dados/acoes";
import { useEstado, useHidratado } from "@/dados/ganchos";

// Leva a pessoa para a etapa certa do fluxo (entrar > consentir > cadastro > aprovação).
// No protótipo fica no navegador. Na versão real, a sessão é validada no servidor e o RLS protege os dados.
export function Guarda({ etapa, children }: { etapa: string; children: ReactNode }) {
  const hidratado = useHidratado();
  const estado = useEstado();
  const router = useRouter();
  const alvo = destinoDaSessao(estado);

  useEffect(() => {
    if (hidratado && alvo !== etapa) router.replace(alvo);
  }, [hidratado, alvo, etapa, router]);

  if (!hidratado || alvo !== etapa) {
    return (
      <p role="status" className="px-4 py-10 text-center text-texto-2">
        Carregando...
      </p>
    );
  }
  return children;
}
