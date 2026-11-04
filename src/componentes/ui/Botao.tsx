import type { ButtonHTMLAttributes } from "react";

export type VarianteBotao = "principal" | "secundario" | "texto";

const base =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-botao px-5 font-corpo font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50";

const variantes: Record<VarianteBotao, string> = {
  principal: "bg-primaria text-sobre-primaria hover:opacity-90",
  secundario: "border border-linha bg-superficie text-texto hover:bg-secundaria",
  texto: "text-primaria hover:bg-secundaria",
};

// Também usado em <Link> quando o "botão" navega.
export function classesBotao(variante: VarianteBotao = "principal", largo = false) {
  return `${base} ${variantes[variante]}${largo ? " w-full" : ""}`;
}

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variante?: VarianteBotao;
  largo?: boolean;
};

export function Botao({ variante = "principal", largo, className = "", type = "button", ...resto }: Props) {
  return <button type={type} className={`${classesBotao(variante, largo)} ${className}`} {...resto} />;
}
