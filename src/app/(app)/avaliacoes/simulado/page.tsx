"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { Cabecalho } from "@/componentes/layout/Cabecalho";
import { Aviso } from "@/componentes/ui/Aviso";
import { Botao } from "@/componentes/ui/Botao";
import { Cartao } from "@/componentes/ui/Cartao";
import { Marcar } from "@/componentes/ui/Formulario";
import { compartilharTentativa, finalizarTentativa, responder } from "@/dados/acoes";
import { SIMULADOS } from "@/dados/conteudo";
import { useEstado, useUsuario } from "@/dados/ganchos";
import { segundosRestantes } from "@/dominio/simulado";
import type { Simulado, TentativaSimulado } from "@/dominio/tipos";

const voltar = { href: "/avaliacoes", rotulo: "Avaliações" };

function formatar(segundos: number) {
  return `${String(Math.floor(segundos / 60)).padStart(2, "0")}:${String(segundos % 60).padStart(2, "0")}`;
}

function Prova({ simulado, tentativa }: { simulado: Simulado; tentativa: TentativaSimulado }) {
  const [indice, setIndice] = useState(0);
  const [agora, setAgora] = useState(() => Date.now());
  const restante = segundosRestantes(tentativa.iniciada_em, simulado.tempo_limite_min, agora);
  const questao = simulado.questoes[indice];
  const ultima = indice === simulado.questoes.length - 1;

  useEffect(() => {
    const relogio = setInterval(() => setAgora(Date.now()), 1000);
    return () => clearInterval(relogio);
  }, []);

  // Tempo esgotado: corrige com o que foi respondido.
  useEffect(() => {
    if (restante === 0) finalizarTentativa(tentativa.id);
  }, [restante, tentativa.id]);

  return (
    <div className="md:max-w-2xl">
      <Cabecalho titulo={simulado.titulo} voltar={voltar} />
      <div className="flex items-center justify-between font-semibold">
        <p>
          Questão {indice + 1} de {simulado.questoes.length}
        </p>
        <p role="timer" aria-label="Tempo restante" className={restante < 60 ? "text-alerta" : ""}>
          {formatar(restante)}
        </p>
      </div>
      <Cartao className="mt-3">
        <fieldset>
          <legend className="font-semibold">{questao.enunciado}</legend>
          <div className="mt-3 flex flex-col gap-2">
            {questao.alternativas.map((alternativa, i) => {
              const marcada = tentativa.respostas[questao.id] === i;
              return (
                <label key={alternativa} className={`flex min-h-11 items-center gap-3 rounded-botao border p-3 ${marcada ? "border-primaria bg-secundaria" : "border-linha"}`}>
                  <input type="radio" name={questao.id} checked={marcada} onChange={() => responder(tentativa.id, questao.id, i)} className="size-5 accent-primaria" />
                  {alternativa}
                </label>
              );
            })}
          </div>
        </fieldset>
      </Cartao>
      <div className="mt-4 flex gap-2">
        {indice > 0 && (
          <Botao variante="secundario" onClick={() => setIndice(indice - 1)}>
            Anterior
          </Botao>
        )}
        {ultima ? (
          <Botao className="flex-1" onClick={() => finalizarTentativa(tentativa.id)}>
            Finalizar e corrigir
          </Botao>
        ) : (
          <Botao className="flex-1" onClick={() => setIndice(indice + 1)}>
            Próxima
          </Botao>
        )}
      </div>
    </div>
  );
}

function Correcao({ simulado, tentativa }: { simulado: Simulado; tentativa: TentativaSimulado }) {
  return (
    <>
      <Cabecalho titulo="Resultado" voltar={voltar} />
      <Cartao>
        <p className="text-sm text-texto-2">{simulado.titulo}</p>
        <p className="font-titulo text-4xl font-light">
          {tentativa.acertos} de {tentativa.total}
        </p>
        <p className="mt-2 text-sm text-texto-2">Este resultado é só um treino. Não mede sua capacidade nem substitui um processo seletivo.</p>
        <Marcar id="compartilhar" checked={tentativa.compartilhar_com_ministerio} onChange={(e) => compartilharTentativa(tentativa.id, e.target.checked)}>
          Compartilhar este resultado com o ministério
        </Marcar>
      </Cartao>
      <ol className="mt-4 flex flex-col gap-3 md:grid md:grid-cols-2">
        {simulado.questoes.map((q, i) => {
          const resposta = tentativa.respostas[q.id];
          const acertou = resposta === q.correta;
          return (
            <li key={q.id}>
              <Cartao>
                <p className={`text-sm font-semibold ${acertou ? "text-primaria" : "text-alerta"}`}>
                  Questão {i + 1}: {acertou ? "acertou" : resposta === undefined || resposta === null ? "em branco" : "errou"}
                </p>
                <p className="mt-1">{q.enunciado}</p>
                {!acertou && resposta !== undefined && resposta !== null && <p className="mt-2 text-sm text-texto-2">Sua resposta: {q.alternativas[resposta]}</p>}
                <p className="mt-2 text-sm font-semibold">Resposta certa: {q.alternativas[q.correta]}</p>
                <p className="mt-1 text-sm">{q.explicacao}</p>
              </Cartao>
            </li>
          );
        })}
      </ol>
    </>
  );
}

function Conteudo() {
  const id = useSearchParams().get("id");
  const estado = useEstado();
  const usuario = useUsuario();
  const tentativa = estado.tentativas_simulado.find((t) => t.id === id && t.usuario_id === usuario.id);
  const simulado = tentativa && SIMULADOS.find((s) => s.id === tentativa.simulado_id);

  if (!tentativa || !simulado) {
    return (
      <>
        <Cabecalho titulo="Não encontrado" voltar={voltar} />
        <Aviso>Este simulado não existe.</Aviso>
      </>
    );
  }
  return tentativa.finalizada_em ? <Correcao simulado={simulado} tentativa={tentativa} /> : <Prova simulado={simulado} tentativa={tentativa} />;
}

export default function PaginaSimulado() {
  return (
    <Suspense>
      <Conteudo />
    </Suspense>
  );
}
