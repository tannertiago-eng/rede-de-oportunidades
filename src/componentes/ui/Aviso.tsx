import type { ReactNode } from "react";

export function Aviso({ children, tipo = "neutro" }: { children: ReactNode; tipo?: "neutro" | "alerta" }) {
  return (
    <p
      role="status"
      className={`rounded-botao border px-4 py-3 text-sm ${
        tipo === "alerta" ? "border-alerta text-alerta" : "border-linha bg-secundaria text-texto"
      }`}
    >
      {children}
    </p>
  );
}
