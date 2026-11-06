"use client";

import type { ReactNode } from "react";
import { Guarda } from "@/componentes/layout/Guarda";
import { NavegacaoInferior } from "@/componentes/layout/NavegacaoInferior";

export default function LayoutApp({ children }: { children: ReactNode }) {
  return (
    <Guarda etapa="/inicio">
      <main className="mx-auto w-full max-w-xl px-4 pb-28">{children}</main>
      <NavegacaoInferior />
    </Guarda>
  );
}
