import { AlternarTema } from "./AlternarTema";

export function Cabecalho({ titulo }: { titulo: string }) {
  return (
    <header className="flex items-center justify-between gap-4 pt-6 pb-4">
      <h1 className="text-3xl">{titulo}</h1>
      <AlternarTema />
    </header>
  );
}
