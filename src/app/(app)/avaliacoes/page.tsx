"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Cabecalho } from "@/componentes/layout/Cabecalho";
import { Aviso } from "@/componentes/ui/Aviso";
import { Botao, classesBotao } from "@/componentes/ui/Botao";
import { Campo } from "@/componentes/ui/Campo";
import { Cartao } from "@/componentes/ui/Cartao";
import { Marcar, Selecao } from "@/componentes/ui/Formulario";
import { iniciarTentativa, salvarResultadoExterno } from "@/dados/acoes";
import { SIMULADOS } from "@/dados/conteudo";
import { useEstado, useUsuario } from "@/dados/ganchos";

const NIVEIS_CEFR = ["A1", "A2", "B1", "B2", "C1", "C2"].map((n) => ({ valor: n, rotulo: n }));

export default function PaginaAvaliacoes() {
  const router = useRouter();
  const estado = useEstado();
  const usuario = useUsuario();
  const [salvo, setSalvo] = useState(false);
  const efSet = estado.resultados_externos.find((r) => r.usuario_id === usuario.id);

  return (
    <>
      <Cabecalho titulo="Avaliações" voltar={{ href: "/trilhas", rotulo: "Trilhas" }} />
      <p className="mb-4 text-texto-2">Os resultados são só seus. Você escolhe se compartilha com o ministério.</p>
      <div className="flex flex-col gap-3 md:grid md:grid-cols-2 md:items-start lg:grid-cols-3">
        {SIMULADOS.map((s) => {
          const tentativas = estado.tentativas_simulado.filter((t) => t.usuario_id === usuario.id && t.simulado_id === s.id);
          const aberta = tentativas.find((t) => !t.finalizada_em);
          const ultima = tentativas.find((t) => t.finalizada_em);
          return (
            <Cartao key={s.id}>
              <h2 className="text-xl">{s.titulo}</h2>
              <p className="text-sm text-texto-2">
                {s.questoes.length} questões · {s.tempo_limite_min} minutos
              </p>
              {ultima && (
                <p className="mt-1 text-sm font-semibold">
                  Último resultado: {ultima.acertos} de {ultima.total}
                </p>
              )}
              <div className="mt-3 flex flex-col gap-2">
                <Botao variante={aberta ? "principal" : "secundario"} largo onClick={() => router.push(`/avaliacoes/simulado?id=${aberta?.id ?? iniciarTentativa(s.id)}`)}>
                  {aberta ? "Continuar simulado" : "Começar simulado"}
                </Botao>
                {ultima && (
                  <Link href={`/avaliacoes/simulado?id=${ultima.id}`} className={classesBotao("texto", true)}>
                    Ver correção
                  </Link>
                )}
              </div>
            </Cartao>
          );
        })}

        <Cartao>
          <h2 className="text-xl">Inglês: EF SET</h2>
          <p className="mt-1">Teste gratuito, feito no site da EF SET. Depois, registre aqui o resultado.</p>
          <a href="https://www.efset.org/pt/" target="_blank" rel="noopener noreferrer" className={`${classesBotao("secundario", true)} mt-3`}>
            Abrir o EF SET
          </a>
          <form
            key={efSet?.id ?? "novo"}
            className="mt-4 flex flex-col gap-3"
            onChange={() => setSalvo(false)}
            onSubmit={(evento) => {
              evento.preventDefault();
              const d = new FormData(evento.currentTarget);
              salvarResultadoExterno(String(d.get("cefr")), String(d.get("nota")), d.get("compartilhar") === "on");
              setSalvo(true);
            }}
          >
            <Selecao id="cefr" name="cefr" rotulo="Nível CEFR" defaultValue={efSet?.nivel_cefr ?? "B1"} opcoes={NIVEIS_CEFR} />
            <Campo id="nota" name="nota" rotulo="Nota (opcional)" inputMode="numeric" defaultValue={efSet?.nota} />
            <Marcar id="compartilhar" name="compartilhar" defaultChecked={efSet?.compartilhar_com_ministerio ?? false}>
              Compartilhar este resultado com o ministério
            </Marcar>
            {salvo && <Aviso>Resultado salvo.</Aviso>}
            <Botao type="submit" variante="secundario">
              Salvar resultado
            </Botao>
          </form>
        </Cartao>
      </div>
    </>
  );
}
