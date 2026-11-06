import Link from "next/link";
import { Icone } from "@/componentes/ui/Icone";
import { AlternarTema } from "./AlternarTema";

type Props = { titulo: string; voltar?: { href: string; rotulo: string } };

export function Cabecalho({ titulo, voltar }: Props) {
  return (
    <header className="pt-4 pb-4">
      {voltar && (
        <Link href={voltar.href} className="-ml-1 inline-flex min-h-11 items-center gap-1 text-sm font-semibold text-primaria">
          <Icone nome="seta" tamanho={18} className="rotate-180" />
          {voltar.rotulo}
        </Link>
      )}
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-3xl">{titulo}</h1>
        <AlternarTema />
      </div>
    </header>
  );
}
