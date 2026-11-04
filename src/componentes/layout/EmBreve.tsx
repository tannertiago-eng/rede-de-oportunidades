import { Cartao } from "@/componentes/ui/Cartao";

export function EmBreve({ fase, texto }: { fase: number; texto: string }) {
  return (
    <Cartao>
      <p className="text-sm font-semibold text-texto-2">Chega na Fase {fase}</p>
      <p className="mt-1">{texto}</p>
    </Cartao>
  );
}
