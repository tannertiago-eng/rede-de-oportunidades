import type { ReactNode } from "react";

// A cor de destaque aparece só no ponto e na borda: nunca como cor de texto (contraste).
export function Selo({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-destaque bg-superficie px-2.5 py-0.5 text-xs font-semibold text-texto">
      <span aria-hidden className="size-1.5 rounded-full bg-destaque" />
      {children}
    </span>
  );
}
