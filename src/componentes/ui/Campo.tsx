import type { InputHTMLAttributes } from "react";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  id: string;
  rotulo: string;
  dica?: string;
  erro?: string;
};

// Todo campo tem rótulo visível; dica e erro ficam ligados ao campo por aria-describedby.
export function Campo({ id, rotulo, dica, erro, className = "", ...resto }: Props) {
  const descricoes = [dica && `${id}-dica`, erro && `${id}-erro`].filter(Boolean).join(" ") || undefined;

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label htmlFor={id} className="font-semibold">
        {rotulo}
      </label>
      <input
        id={id}
        aria-invalid={erro ? true : undefined}
        aria-describedby={descricoes}
        className={`min-h-11 rounded-botao border bg-superficie px-4 text-texto placeholder:text-texto-2 ${
          erro ? "border-alerta" : "border-linha"
        }`}
        {...resto}
      />
      {dica && (
        <p id={`${id}-dica`} className="text-sm text-texto-2">
          {dica}
        </p>
      )}
      {erro && (
        <p id={`${id}-erro`} className="text-sm text-alerta">
          {erro}
        </p>
      )}
    </div>
  );
}
