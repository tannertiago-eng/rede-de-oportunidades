import type { Metadata } from "next";
import { Cabecalho } from "@/componentes/layout/Cabecalho";
import { EmBreve } from "@/componentes/layout/EmBreve";

export const metadata: Metadata = { title: "Vagas" };

export default function PaginaVagas() {
  return (
    <>
      <Cabecalho titulo="Vagas" />
      <EmBreve fase={3} texto="Vagas curadas pelo ministério e vagas externas, filtradas pelo seu nível." />
    </>
  );
}
