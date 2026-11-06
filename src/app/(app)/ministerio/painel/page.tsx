"use client";

import { useState } from "react";
import { Cabecalho } from "@/componentes/layout/Cabecalho";
import { SoCoordenacao } from "@/componentes/layout/SoCoordenacao";
import { Cartao } from "@/componentes/ui/Cartao";
import { TRILHAS } from "@/dados/conteudo";
import { useEstado } from "@/dados/ganchos";
import { calcularIndicadores, tabelaPorMes } from "@/dominio/indicadores";

function Conteudo() {
  const estado = useEstado();
  const [hoje] = useState(() => new Date());
  const i = calcularIndicadores(estado, TRILHAS, hoje);
  const linhas = tabelaPorMes(estado, hoje);
  const nome = (id: string | null) => (id ? estado.perfis.find((p) => p.id === id)?.nome ?? "Pessoa removida" : "Anonimizado");

  const numeros = [
    { rotulo: "Perfis ativos", valor: i.perfis_ativos },
    { rotulo: "Negócios publicados", valor: i.negocios_publicados },
    { rotulo: "Atualizados em 90 dias", valor: i.negocios_atualizados_90d },
    { rotulo: "Interesses em vagas", valor: i.interesses },
    { rotulo: "Indicações", valor: i.indicacoes },
    { rotulo: "Contratações", valor: i.contratacoes },
    { rotulo: "Negócios fechados", valor: i.negocios_fechados },
    { rotulo: "Trilhas concluídas", valor: i.trilhas_concluidas },
    { rotulo: "Mentorias ativas", valor: i.mentorias_ativas },
  ];

  return (
    <>
      <Cabecalho titulo="Indicadores" voltar={{ href: "/ministerio", rotulo: "Ministério" }} />
      <p className="mb-4 text-sm text-texto-2">Contratações e negócios fechados são autodeclarados.</p>
      <ul className="grid grid-cols-2 gap-3">
        {numeros.map((n) => (
          <li key={n.rotulo}>
            <Cartao className="h-full">
              <p className="font-titulo text-3xl font-light">{n.valor}</p>
              <p className="text-sm text-texto-2">{n.rotulo}</p>
            </Cartao>
          </li>
        ))}
      </ul>

      <h2 className="mt-6 text-xl">Por mês</h2>
      <p className="mb-2 text-sm text-texto-2">Deslize a tabela para o lado para ver todas as colunas.</p>
      <Cartao className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-linha text-left">
              <th scope="col" className="py-2 pr-3 font-semibold">Mês</th>
              <th scope="col" className="px-3 py-2 text-right font-semibold">Vagas</th>
              <th scope="col" className="px-3 py-2 text-right font-semibold">Interesses</th>
              <th scope="col" className="px-3 py-2 text-right font-semibold">Indicações</th>
              <th scope="col" className="px-3 py-2 text-right font-semibold">Contratações</th>
              <th scope="col" className="px-3 py-2 text-right font-semibold">Negócios</th>
            </tr>
          </thead>
          <tbody>
            {linhas.map((l) => (
              <tr key={l.mes} className="border-b border-linha last:border-0">
                <th scope="row" className="py-2 pr-3 text-left font-normal whitespace-nowrap">{l.mes.split("-").reverse().join("/")}</th>
                <td className="px-3 py-2 text-right">{l.vagas}</td>
                <td className="px-3 py-2 text-right">{l.interesses}</td>
                <td className="px-3 py-2 text-right">{l.indicacoes}</td>
                <td className="px-3 py-2 text-right">{l.contratacoes}</td>
                <td className="px-3 py-2 text-right">{l.negocios_fechados}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Cartao>

      <h2 className="mt-6 mb-2 text-xl">Auditoria</h2>
      <Cartao>
        <ul className="flex flex-col gap-2 text-sm">
          {[...estado.auditoria].sort((a, b) => b.em.localeCompare(a.em)).slice(0, 15).map((a) => (
            <li key={a.id}>
              <span className="font-semibold">{a.acao.replaceAll("_", " ")}</span> · {a.entidade} · {nome(a.ator_id)} · {new Date(a.em).toLocaleDateString("pt-BR")}
            </li>
          ))}
        </ul>
      </Cartao>
    </>
  );
}

export default function PaginaPainel() {
  return (
    <SoCoordenacao>
      <Conteudo />
    </SoCoordenacao>
  );
}
