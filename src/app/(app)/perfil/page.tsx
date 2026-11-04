import type { Metadata } from "next";
import { Cabecalho } from "@/componentes/layout/Cabecalho";
import { EmBreve } from "@/componentes/layout/EmBreve";

export const metadata: Metadata = { title: "Perfil" };

export default function PaginaPerfil() {
  return (
    <>
      <Cabecalho titulo="Perfil" />
      <EmBreve fase={1} texto="Seu perfil, com controle de quem vê cada informação." />
    </>
  );
}
