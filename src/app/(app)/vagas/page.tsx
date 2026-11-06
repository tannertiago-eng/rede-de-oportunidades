"use client";

import Link from "next/link";
import { useState } from "react";
import { Cabecalho } from "@/componentes/layout/Cabecalho";
import { Cartao } from "@/componentes/ui/Cartao";
import { Chip } from "@/componentes/ui/Chip";
import { Selecao } from "@/componentes/ui/Formulario";
import { Icone } from "@/componentes/ui/Icone";
import { Selo } from "@/componentes/ui/Selo";
import { useEstado, useUsuario } from "@/dados/ganchos";
import { ROTULO_INTERESSE, ROTULO_MODALIDADE, ROTULO_NIVEL } from "@/dominio/rotulos";
import type { Modalidade, Nivel } from "@/dominio/tipos";

export default function PaginaVagas() {
  const estado = useEstado();
  const usuario = useUsuario();
  const [nivel, setNivel] = useState<Nivel | "">(usuario.nivel);
  const [modalidade, setModalidade] = useState<Modalidade | "">("");

  const lista = estado.vagas.filter((v) => v.status === "publicado" && (!nivel || v.nivel === nivel) && (!modalidade || v.modalidade === modalidade));
  const meusInteresses = estado.interesses_vaga.filter((i) => i.usuario_id === usuario.id);

  return (
    <>
      <Cabecalho titulo="Vagas" />
      <div className="flex flex-col gap-4">
        {meusInteresses.length > 0 && (
          <Cartao>
            <h2 className="text-xl">Meus interesses</h2>
            <ul className="mt-2 flex flex-col gap-2">
              {meusInteresses.map((i) => {
                const vaga = estado.vagas.find((v) => v.id === i.vaga_id);
                return (
                  <li key={i.id}>
                    <Link href={`/vagas/detalhe?id=${i.vaga_id}`} className="block">
                      <span className="block font-semibold">{vaga?.titulo}</span>
                      <span className="block text-sm text-texto-2">{ROTULO_INTERESSE[i.status]}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </Cartao>
        )}

        <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrar por nível">
          {(Object.keys(ROTULO_NIVEL) as Nivel[]).filter((n) => n !== "executivo").map((n) => (
            <Chip key={n} ativo={nivel === n} onClick={() => setNivel(nivel === n ? "" : n)}>
              {ROTULO_NIVEL[n]}
            </Chip>
          ))}
        </div>
        <div className="md:max-w-xs">
        <Selecao id="modalidade" rotulo="Modalidade" value={modalidade} onChange={(e) => setModalidade(e.target.value as Modalidade | "")} opcoes={[{ valor: "", rotulo: "Todas" }, ...(Object.keys(ROTULO_MODALIDADE) as Modalidade[]).map((m) => ({ valor: m, rotulo: ROTULO_MODALIDADE[m] }))]} />
        </div>

        <ul className="flex flex-col gap-3 md:grid md:grid-cols-2 lg:grid-cols-3">
          {lista.map((v) => (
            <li key={v.id}>
              <Link href={`/vagas/detalhe?id=${v.id}`}>
                <Cartao className="flex h-full items-center gap-4 transition-colors hover:border-primaria">
                  <div className="min-w-0 flex-1">
                    <Selo>Curada pelo ministério</Selo>
                    <h2 className="mt-2 text-lg">{v.titulo}</h2>
                    <p className="text-sm text-texto-2">
                      {v.empresa} · {ROTULO_MODALIDADE[v.modalidade]} · {v.tipo_contrato}
                    </p>
                  </div>
                  <Icone nome="seta" className="shrink-0 text-texto-2" />
                </Cartao>
              </Link>
            </li>
          ))}
          {lista.length === 0 && <li className="text-texto-2">Nenhuma vaga com esses filtros.</li>}
        </ul>
      </div>
    </>
  );
}
