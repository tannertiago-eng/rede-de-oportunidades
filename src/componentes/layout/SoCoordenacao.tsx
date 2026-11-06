"use client";

import type { ReactNode } from "react";
import { useUsuario } from "@/dados/ganchos";
import { ehCoordenacao } from "@/dominio/permissoes";
import { Cabecalho } from "./Cabecalho";

export function SoCoordenacao({ children }: { children: ReactNode }) {
  const usuario = useUsuario();
  if (!ehCoordenacao(usuario.papel)) {
    return (
      <>
        <Cabecalho titulo="Sem acesso" voltar={{ href: "/ministerio", rotulo: "Ministério" }} />
        <p className="text-texto-2">Esta tela é só para a coordenação.</p>
      </>
    );
  }
  return children;
}
