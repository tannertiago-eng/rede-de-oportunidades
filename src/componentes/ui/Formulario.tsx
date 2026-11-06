import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";

const classeCampo = "min-h-11 w-full rounded-botao border border-linha bg-superficie px-4 text-texto placeholder:text-texto-2";

type AreaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & { id: string; rotulo: string; dica?: string };

export function AreaTexto({ id, rotulo, dica, ...resto }: AreaProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="font-semibold">
        {rotulo}
      </label>
      <textarea id={id} rows={3} aria-describedby={dica ? `${id}-dica` : undefined} className={`${classeCampo} py-3`} {...resto} />
      {dica && (
        <p id={`${id}-dica`} className="text-sm text-texto-2">
          {dica}
        </p>
      )}
    </div>
  );
}

type SelecaoProps = SelectHTMLAttributes<HTMLSelectElement> & {
  id: string;
  rotulo: string;
  opcoes: readonly { valor: string; rotulo: string }[];
};

export function Selecao({ id, rotulo, opcoes, ...resto }: SelecaoProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="font-semibold">
        {rotulo}
      </label>
      <select id={id} className={classeCampo} {...resto}>
        {opcoes.map((o) => (
          <option key={o.valor} value={o.valor}>
            {o.rotulo}
          </option>
        ))}
      </select>
    </div>
  );
}

type MarcarProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & { id: string; children: ReactNode };

export function Marcar({ id, children, ...resto }: MarcarProps) {
  return (
    <label htmlFor={id} className="flex min-h-11 items-start gap-3 py-2">
      <input id={id} type="checkbox" className="mt-1 size-5 shrink-0 accent-primaria" {...resto} />
      <span>{children}</span>
    </label>
  );
}
