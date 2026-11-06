"use client";

import Link from "next/link";
import { Cabecalho } from "@/componentes/layout/Cabecalho";
import { classesBotao } from "@/componentes/ui/Botao";
import { Cartao } from "@/componentes/ui/Cartao";
import { Icone } from "@/componentes/ui/Icone";
import { TRILHAS } from "@/dados/conteudo";
import { useEstado, useUsuario } from "@/dados/ganchos";

export default function PaginaTrilhas() {
  const estado = useEstado();
  const usuario = useUsuario();

  return (
    <>
      <Cabecalho titulo="Trilhas" />
      <p className="mb-4 text-texto-2">Cursos gratuitos de outras instituições, organizados pelo ministério.</p>
      <ul className="flex flex-col gap-3 md:grid md:grid-cols-2">
        {TRILHAS.map((t) => {
          const feitos = t.itens.filter((i) => estado.progresso_trilha.some((p) => p.usuario_id === usuario.id && p.item_id === i.id && p.status === "concluido")).length;
          return (
            <li key={t.id}>
              <Link href={`/trilhas/detalhe?id=${t.id}`}>
                <Cartao className="flex h-full items-center gap-4 transition-colors hover:border-primaria">
                  <div className="min-w-0 flex-1">
                    <h2 className="text-xl">{t.nome}</h2>
                    <p className="text-sm text-texto-2">{t.publico}</p>
                    <p className="mt-1 text-sm font-semibold">
                      {feitos} de {t.itens.length} concluídos
                    </p>
                  </div>
                  <Icone nome="seta" className="shrink-0 text-texto-2" />
                </Cartao>
              </Link>
            </li>
          );
        })}
      </ul>
      <Link href="/avaliacoes" className={`${classesBotao("secundario", true)} mt-4 md:w-auto`}>
        <Icone nome="avaliacao" /> Avaliações
      </Link>
    </>
  );
}
