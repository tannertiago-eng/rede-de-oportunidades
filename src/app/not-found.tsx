import Link from "next/link";
import { classesBotao } from "@/componentes/ui/Botao";

export default function NaoEncontrado() {
  return (
    <main className="mx-auto w-full max-w-xl px-4 py-10">
      <h1 className="text-3xl">Página não encontrada</h1>
      <p className="mt-2 text-texto-2">O endereço pode estar errado ou a página pode ter saído do ar.</p>
      <Link href="/" className={`${classesBotao("principal", true)} mt-6`}>
        Voltar para o início
      </Link>
    </main>
  );
}
