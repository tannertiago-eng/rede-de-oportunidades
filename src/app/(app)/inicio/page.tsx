import type { Metadata } from "next";
import Link from "next/link";
import { Cabecalho } from "@/componentes/layout/Cabecalho";
import { classesBotao } from "@/componentes/ui/Botao";
import { Cartao } from "@/componentes/ui/Cartao";
import { Chip } from "@/componentes/ui/Chip";
import { Icone } from "@/componentes/ui/Icone";
import { Selo } from "@/componentes/ui/Selo";

export const metadata: Metadata = { title: "Início" };

// Fase 0: prévia do layout com dados de exemplo fixos. O resumo pessoal real chega na Fase 1.
export default function PaginaInicio() {
  return (
    <>
      <Cabecalho titulo="Olá" />
      <p className="text-texto-2">Seu resumo da semana aparece aqui.</p>

      <div className="mt-6 flex flex-col gap-4">
        <Cartao>
          <p className="text-sm font-semibold text-texto-2">Próxima etapa da trilha</p>
          <h2 className="mt-1 text-xl">Currículo que abre portas</h2>
          <p className="mt-1 text-texto-2">Trilha Recolocação · 2 de 5 concluídas</p>
          <Link href="/trilhas" className={`${classesBotao("principal", true)} mt-4`}>
            Continuar trilha
          </Link>
        </Cartao>

        <section aria-labelledby="titulo-vagas">
          <h2 id="titulo-vagas" className="mt-2 mb-3 text-xl">
            Vagas novas para você
          </h2>
          <div className="mb-3 flex flex-wrap gap-2">
            <Chip ativo>Operacional</Chip>
            <Chip>Presencial</Chip>
            <Chip>Remoto</Chip>
          </div>
          <Cartao className="flex items-center gap-4">
            <div className="flex-1">
              <Selo>Curada pelo ministério</Selo>
              <h3 className="mt-2 text-lg">Auxiliar administrativo (exemplo)</h3>
              <p className="text-sm text-texto-2">Empresa Exemplo · Centro · CLT</p>
            </div>
            <Icone nome="seta" className="text-texto-2" />
          </Cartao>
        </section>
      </div>
    </>
  );
}
