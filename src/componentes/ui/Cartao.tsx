import type { HTMLAttributes } from "react";

export function Cartao({ className = "", ...resto }: HTMLAttributes<HTMLElement>) {
  return <section className={`rounded-cartao border border-linha bg-superficie p-5 ${className}`} {...resto} />;
}
