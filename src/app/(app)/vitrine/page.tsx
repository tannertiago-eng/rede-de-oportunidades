import type { Metadata } from "next";
import { Cabecalho } from "@/componentes/layout/Cabecalho";
import { EmBreve } from "@/componentes/layout/EmBreve";

export const metadata: Metadata = { title: "Vitrine" };

export default function PaginaVitrine() {
  return (
    <>
      <Cabecalho titulo="Vitrine" />
      <EmBreve fase={2} texto="Negócios de membros, revisados pelo ministério antes de aparecer aqui." />
    </>
  );
}
