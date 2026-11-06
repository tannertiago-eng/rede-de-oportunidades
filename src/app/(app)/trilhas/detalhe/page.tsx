"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Cabecalho } from "@/componentes/layout/Cabecalho";
import { Botao, classesBotao } from "@/componentes/ui/Botao";
import { Cartao } from "@/componentes/ui/Cartao";
import { Selecao } from "@/componentes/ui/Formulario";
import { Selo } from "@/componentes/ui/Selo";
import { marcarItem, registrarCertificado } from "@/dados/acoes";
import { TRILHAS } from "@/dados/conteudo";
import { useEstado, useUsuario } from "@/dados/ganchos";
import { ROTULO_PROGRESSO } from "@/dominio/rotulos";
import type { StatusProgresso } from "@/dominio/tipos";

const OPCOES = (Object.keys(ROTULO_PROGRESSO) as StatusProgresso[]).map((valor) => ({ valor, rotulo: ROTULO_PROGRESSO[valor] }));

function Conteudo() {
  const id = useSearchParams().get("id");
  const estado = useEstado();
  const usuario = useUsuario();
  const trilha = TRILHAS.find((t) => t.id === id);
  const voltar = { href: "/trilhas", rotulo: "Trilhas" };

  if (!trilha) {
    return (
      <>
        <Cabecalho titulo="Não encontrada" voltar={voltar} />
        <p className="text-texto-2">Esta trilha não existe.</p>
      </>
    );
  }

  return (
    <>
      <Cabecalho titulo={trilha.nome} voltar={voltar} />
      <p className="mb-4 text-texto-2">{trilha.descricao}</p>
      <ol className="flex flex-col gap-3">
        {trilha.itens.map((item, indice) => {
          const registro = estado.progresso_trilha.find((p) => p.usuario_id === usuario.id && p.item_id === item.id);
          const status = registro?.status ?? "a_fazer";
          return (
            <li key={item.id}>
              <Cartao>
                <p className="text-sm text-texto-2">
                  Etapa {indice + 1} · {item.provedor}
                  {item.carga_horaria_aprox ? ` · cerca de ${item.carga_horaria_aprox} h` : ""}
                </p>
                <h2 className="mt-1 text-lg">{item.titulo}</h2>
                <a href={item.url} target="_blank" rel="noopener noreferrer" className={`${classesBotao("secundario", true)} mt-3`}>
                  Abrir no site
                </a>
                <div className="mt-3">
                  <Selecao id={`status-${item.id}`} rotulo="Minha situação" value={status} onChange={(e) => marcarItem(trilha.id, item.id, e.target.value as StatusProgresso)} opcoes={OPCOES} />
                </div>
                {status === "concluido" && item.tipo === "curso" && (
                  <div className="mt-3">
                    {registro?.certificado_registrado ? (
                      <Selo>Certificado registrado</Selo>
                    ) : (
                      <>
                        <Botao variante="texto" onClick={() => registrarCertificado(item.id)}>
                          Simular envio do certificado
                        </Botao>
                        <p className="text-sm text-texto-2">Na versão final, aqui você envia o arquivo.</p>
                      </>
                    )}
                  </div>
                )}
              </Cartao>
            </li>
          );
        })}
      </ol>
    </>
  );
}

export default function PaginaDetalheTrilha() {
  return (
    <Suspense>
      <Conteudo />
    </Suspense>
  );
}
