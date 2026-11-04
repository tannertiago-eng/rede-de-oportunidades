import type { Metadata } from "next";
import { Cabecalho } from "@/componentes/layout/Cabecalho";
import { EmBreve } from "@/componentes/layout/EmBreve";

export const metadata: Metadata = { title: "Trilhas" };

export default function PaginaTrilhas() {
  return (
    <>
      <Cabecalho titulo="Trilhas" />
      <EmBreve fase={4} texto="Recolocação, primeiro emprego, empreendedor e crescimento de carreira." />
    </>
  );
}
