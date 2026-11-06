"use client";

import { useState, type ReactNode } from "react";
import { Cabecalho } from "@/componentes/layout/Cabecalho";
import { Botao } from "@/componentes/ui/Botao";
import { Cartao } from "@/componentes/ui/Cartao";
import { AreaTexto } from "@/componentes/ui/Formulario";
import { revisarNegocio, revisarVaga } from "@/dados/acoes";
import { useEstado } from "@/dados/ganchos";
import { ROTULO_MODALIDADE, ROTULO_NIVEL } from "@/dominio/rotulos";

function ItemRevisao({ id, titulo, children, aoDecidir }: { id: string; titulo: string; children: ReactNode; aoDecidir: (publicar: boolean, motivo?: string) => void }) {
  const [rejeitando, setRejeitando] = useState(false);
  return (
    <Cartao>
      <h3 className="text-lg">{titulo}</h3>
      <div className="mt-1 text-sm">{children}</div>
      {rejeitando ? (
        <form
          className="mt-3 flex flex-col gap-2"
          onSubmit={(evento) => {
            evento.preventDefault();
            aoDecidir(false, String(new FormData(evento.currentTarget).get("motivo")));
          }}
        >
          <AreaTexto id={`motivo-${id}`} name="motivo" rotulo="Motivo da rejeição" dica="Quem cadastrou vai ler este motivo." required />
          <div className="flex gap-2">
            <Botao type="submit" variante="secundario">
              Confirmar rejeição
            </Botao>
            <Botao variante="texto" onClick={() => setRejeitando(false)}>
              Cancelar
            </Botao>
          </div>
        </form>
      ) : (
        <div className="mt-3 flex gap-2">
          <Botao className="flex-1" onClick={() => aoDecidir(true)}>
            Publicar
          </Botao>
          <Botao variante="secundario" onClick={() => setRejeitando(true)}>
            Rejeitar
          </Botao>
        </div>
      )}
    </Cartao>
  );
}

export default function PaginaRevisao() {
  const estado = useEstado();
  const negocios = estado.negocios.filter((n) => n.status === "em_revisao");
  const vagas = estado.vagas.filter((v) => v.status === "em_revisao");

  return (
    <>
      <Cabecalho titulo="Fila de revisão" voltar={{ href: "/ministerio", rotulo: "Ministério" }} />
      <p className="mb-4 text-sm text-texto-2">Recuse marketing multinível, oportunidades de investimento, empréstimos entre membros, política partidária e vagas que exijam religião.</p>
      <h2 className="mb-2 text-xl">Negócios ({negocios.length})</h2>
      <div className="flex flex-col gap-3">
        {negocios.map((n) => (
          <ItemRevisao key={n.id} id={n.id} titulo={n.nome} aoDecidir={(publicar, motivo) => revisarNegocio(n.id, publicar, motivo)}>
            <p className="text-texto-2">
              {n.categoria} · {n.bairro}
            </p>
            <p className="mt-1">{n.descricao}</p>
          </ItemRevisao>
        ))}
        {negocios.length === 0 && <p className="text-texto-2">Nenhum negócio aguardando.</p>}
      </div>
      <h2 className="mt-6 mb-2 text-xl">Vagas ({vagas.length})</h2>
      <div className="flex flex-col gap-3">
        {vagas.map((v) => (
          <ItemRevisao key={v.id} id={v.id} titulo={v.titulo} aoDecidir={(publicar, motivo) => revisarVaga(v.id, publicar, motivo)}>
            <p className="text-texto-2">
              {v.empresa} · {ROTULO_NIVEL[v.nivel]} · {ROTULO_MODALIDADE[v.modalidade]}
            </p>
            <p className="mt-1">{v.descricao}</p>
          </ItemRevisao>
        ))}
        {vagas.length === 0 && <p className="text-texto-2">Nenhuma vaga aguardando.</p>}
      </div>
    </>
  );
}
