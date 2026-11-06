"use client";

import Link from "next/link";
import { useState } from "react";
import { Cabecalho } from "@/componentes/layout/Cabecalho";
import { classesBotao } from "@/componentes/ui/Botao";
import { Campo } from "@/componentes/ui/Campo";
import { Cartao } from "@/componentes/ui/Cartao";
import { Chip } from "@/componentes/ui/Chip";
import { Selecao } from "@/componentes/ui/Formulario";
import { Icone } from "@/componentes/ui/Icone";
import { useEstado } from "@/dados/ganchos";

const unicos = (lista: string[]) => [...new Set(lista)].sort((a, b) => a.localeCompare(b, "pt-BR"));

export default function PaginaVitrine() {
  const estado = useEstado();
  const [busca, setBusca] = useState("");
  const [categoria, setCategoria] = useState("");
  const [bairro, setBairro] = useState("");

  const publicados = estado.negocios.filter((n) => n.status === "publicado");
  const termo = busca.trim().toLocaleLowerCase("pt-BR");
  const lista = publicados.filter(
    (n) =>
      (!categoria || n.categoria === categoria) &&
      (!bairro || n.bairro === bairro) &&
      (!termo || `${n.nome} ${n.descricao}`.toLocaleLowerCase("pt-BR").includes(termo)),
  );

  return (
    <>
      <Cabecalho titulo="Vitrine" />
      <div className="flex flex-col gap-4">
        <Campo id="busca" rotulo="Buscar negócio" type="search" value={busca} onChange={(e) => setBusca(e.target.value)} />
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrar por categoria">
          {unicos(publicados.map((n) => n.categoria)).map((c) => (
            <Chip key={c} ativo={categoria === c} onClick={() => setCategoria(categoria === c ? "" : c)}>
              {c}
            </Chip>
          ))}
        </div>
        <Selecao id="bairro" rotulo="Bairro" value={bairro} onChange={(e) => setBairro(e.target.value)} opcoes={[{ valor: "", rotulo: "Todos os bairros" }, ...unicos(publicados.map((n) => n.bairro)).map((b) => ({ valor: b, rotulo: b }))]} />

        <ul className="flex flex-col gap-3">
          {lista.map((n) => (
            <li key={n.id}>
              <Link href={`/vitrine/detalhe?id=${n.id}`}>
                <Cartao className="flex items-center gap-4">
                  <div className="min-w-0 flex-1">
                    <h2 className="text-lg">{n.nome}</h2>
                    <p className="text-sm text-texto-2">
                      {n.categoria} · {n.bairro}
                    </p>
                  </div>
                  <Icone nome="seta" className="shrink-0 text-texto-2" />
                </Cartao>
              </Link>
            </li>
          ))}
          {lista.length === 0 && <li className="text-texto-2">Nenhum negócio encontrado com esses filtros.</li>}
        </ul>

        <Link href="/vitrine/editar" className={classesBotao("principal", true)}>
          Meu negócio
        </Link>
      </div>
    </>
  );
}
