"use client";

import { useState } from "react";
import { Cabecalho } from "@/componentes/layout/Cabecalho";
import { Botao } from "@/componentes/ui/Botao";
import { Cartao } from "@/componentes/ui/Cartao";
import { AreaTexto, Selecao } from "@/componentes/ui/Formulario";
import { atualizarInteresse, indicar } from "@/dados/acoes";
import { useEstado, useUsuario } from "@/dados/ganchos";
import { ROTULO_INTERESSE } from "@/dominio/rotulos";
import type { InteresseVaga, StatusInteresse } from "@/dominio/tipos";
import { verPerfil } from "@/dominio/visibilidade";

const OPCOES = (Object.keys(ROTULO_INTERESSE) as StatusInteresse[]).map((valor) => ({ valor, rotulo: ROTULO_INTERESSE[valor] }));

function Interesse({ interesse }: { interesse: InteresseVaga }) {
  const estado = useEstado();
  const usuario = useUsuario();
  const [indicando, setIndicando] = useState(false);
  const vaga = estado.vagas.find((v) => v.id === interesse.vaga_id);
  const perfil = estado.perfis.find((p) => p.id === interesse.usuario_id);
  const visto = perfil && verPerfil(perfil, usuario);
  const nota = estado.indicacoes.find((i) => i.interesse_id === interesse.id);

  return (
    <Cartao>
      <h2 className="text-lg">{vaga?.titulo}</h2>
      <p className="text-sm text-texto-2">
        {visto ? visto.nome : "Perfil restrito à coordenação"}
        {visto?.campos.area ? ` · ${visto.campos.area}` : ""}
      </p>
      <div className="mt-3">
        <Selecao id={`status-${interesse.id}`} rotulo="Situação" value={interesse.status} onChange={(e) => atualizarInteresse(interesse.id, e.target.value as StatusInteresse)} opcoes={OPCOES} />
      </div>
      {nota && (
        <dl className="mt-3 text-sm">
          <dt className="font-semibold">Situação</dt>
          <dd>{nota.situacao}</dd>
          <dt className="mt-1 font-semibold">Tarefa</dt>
          <dd>{nota.tarefa}</dd>
          <dt className="mt-1 font-semibold">Ação</dt>
          <dd>{nota.acao}</dd>
          <dt className="mt-1 font-semibold">Resultado</dt>
          <dd>{nota.resultado}</dd>
        </dl>
      )}
      {!nota && !indicando && (
        <Botao largo className="mt-3" onClick={() => setIndicando(true)}>
          Indicar com nota STAR
        </Botao>
      )}
      {!nota && indicando && (
        <form
          className="mt-3 flex flex-col gap-3"
          onSubmit={(evento) => {
            evento.preventDefault();
            const d = new FormData(evento.currentTarget);
            const v = (n: string) => String(d.get(n) ?? "").trim();
            indicar(interesse.id, { situacao: v("situacao"), tarefa: v("tarefa"), acao: v("acao"), resultado: v("resultado") });
          }}
        >
          <AreaTexto id={`situacao-${interesse.id}`} name="situacao" rotulo="Situação" dica="Qual era o contexto?" required />
          <AreaTexto id={`tarefa-${interesse.id}`} name="tarefa" rotulo="Tarefa" dica="O que a pessoa precisava fazer?" required />
          <AreaTexto id={`acao-${interesse.id}`} name="acao" rotulo="Ação" dica="O que ela fez?" required />
          <AreaTexto id={`resultado-${interesse.id}`} name="resultado" rotulo="Resultado" dica="O que mudou depois?" required />
          <Botao type="submit" largo>
            Registrar indicação
          </Botao>
        </form>
      )}
    </Cartao>
  );
}

export default function PaginaIndicacoes() {
  const estado = useEstado();
  return (
    <>
      <Cabecalho titulo="Indicações" voltar={{ href: "/ministerio", rotulo: "Ministério" }} />
      <p className="mb-4 text-sm text-texto-2">A nota STAR não aparece na tela do membro, que vê só a situação. Ela entra no arquivo de &quot;baixar meus dados&quot;.</p>
      <div className="flex flex-col gap-3">
        {estado.interesses_vaga.map((i) => (
          <Interesse key={i.id} interesse={i} />
        ))}
        {estado.interesses_vaga.length === 0 && <p className="text-texto-2">Nenhum interesse registrado.</p>}
      </div>
    </>
  );
}
