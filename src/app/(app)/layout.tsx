import { NavegacaoInferior } from "@/componentes/layout/NavegacaoInferior";

// Área logada. Na Fase 0 ainda não exige login: o bloqueio entra na Fase 1, junto com a tela de entrada.
export default function LayoutApp({ children }: LayoutProps<"/">) {
  return (
    <>
      <main className="mx-auto w-full max-w-xl px-4 pb-28">{children}</main>
      <NavegacaoInferior />
    </>
  );
}
