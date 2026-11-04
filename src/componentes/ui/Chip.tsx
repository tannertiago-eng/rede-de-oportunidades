import type { ButtonHTMLAttributes } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  ativo?: boolean;
};

// Filtro que liga e desliga (aria-pressed informa o estado ao leitor de tela).
export function Chip({ ativo = false, className = "", type = "button", ...resto }: Props) {
  return (
    <button
      type={type}
      aria-pressed={ativo}
      className={`inline-flex min-h-11 items-center rounded-full border px-4 text-sm font-semibold transition-colors ${
        ativo ? "border-primaria bg-primaria text-sobre-primaria" : "border-linha bg-secundaria text-texto"
      } ${className}`}
      {...resto}
    />
  );
}
