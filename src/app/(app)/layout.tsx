"use client";

import type { ReactNode } from "react";
import { Guarda } from "@/componentes/layout/Guarda";
import { NavegacaoPrincipal } from "@/componentes/layout/NavegacaoPrincipal";

export default function LayoutApp({ children }: { children: ReactNode }) {
  return (
    <Guarda etapa="/inicio">
      <div className="lg:pl-60">
        <main className="mx-auto w-full max-w-xl px-4 pb-28 md:max-w-3xl md:px-6 lg:max-w-5xl lg:px-8 lg:pb-10">{children}</main>
      </div>
      <NavegacaoPrincipal />
    </Guarda>
  );
}
