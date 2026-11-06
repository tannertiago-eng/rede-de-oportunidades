"use client";

import type { ReactNode } from "react";
import { Cabecalho } from "@/componentes/layout/Cabecalho";
import { useUsuario } from "@/dados/ganchos";
import { ehMinisterio } from "@/dominio/permissoes";

export default function LayoutMinisterio({ children }: { children: ReactNode }) {
  const usuario = useUsuario();
  if (!ehMinisterio(usuario.papel)) {
    return (
      <>
        <Cabecalho titulo="Sem acesso" voltar={{ href: "/inicio", rotulo: "Início" }} />
        <p className="text-texto-2">Esta área é só para voluntários e coordenação do ministério.</p>
      </>
    );
  }
  return children;
}
