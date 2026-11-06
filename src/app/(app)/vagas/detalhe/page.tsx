"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Cabecalho } from "@/componentes/layout/Cabecalho";
import { Denunciar } from "@/componentes/layout/Denunciar";
import { Aviso } from "@/componentes/ui/Aviso";
import { Botao, classesBotao } from "@/componentes/ui/Botao";
import { Cartao } from "@/componentes/ui/Cartao";
import { Selo } from "@/componentes/ui/Selo";
import { atualizarInteresse, demonstrarInteresse } from "@/dados/acoes";
import { useEstado, useUsuario } from "@/dados/ganchos";
import { ehMinisterio } from "@/dominio/permissoes";
import { ROTULO_INTERESSE, ROTULO_MODALIDADE, ROTULO_NIVEL } from "@/dominio/rotulos";

function Conteudo() {
  const id = useSearchParams().get("id");
  const estado = useEstado();
  const usuario = useUsuario();
  const vaga = estado.vagas.find((v) => v.id === id);
  const voltar = { href: "/vagas", rotulo: "Vagas" };

  if (!vaga || (vaga.status !== "publicado" && !ehMinisterio(usuario.papel))) {
    return (
      <>
        <Cabecalho titulo="Não encontrada" voltar={voltar} />
        <p className="text-texto-2">Esta vaga não existe ou não está publicada.</p>
      </>
    );
  }

  const interesse = estado.interesses_vaga.find((i) => i.vaga_id === vaga.id && i.usuario_id === usuario.id);
  const encerrado = interesse?.status === "contratado" || interesse?.status === "nao_seguiu";

  return (
    <>
      <Cabecalho titulo={vaga.titulo} voltar={voltar} />
      <div className="flex flex-col gap-4">
        <Cartao>
          <Selo>Curada pelo ministério</Selo>
          <p className="mt-2 font-semibold">{vaga.empresa}</p>
          <p className="text-sm text-texto-2">
            {ROTULO_NIVEL[vaga.nivel]} · {vaga.tipo_contrato} · {ROTULO_MODALIDADE[vaga.modalidade]} · {vaga.bairro_cidade}
          </p>
          <p className="mt-3">{vaga.descricao}</p>
          <p className="mt-3 text-sm text-texto-2">Válida até {new Date(vaga.expira_em).toLocaleDateString("pt-BR")}</p>
        </Cartao>

        {interesse ? (
          <Aviso>Situação: {ROTULO_INTERESSE[interesse.status]}</Aviso>
        ) : vaga.origem === "interna" ? (
          <Botao largo onClick={() => demonstrarInteresse(vaga.id)}>
            Tenho interesse
          </Botao>
        ) : null}

        {vaga.link_externo && (
          <>
            <a href={vaga.link_externo} target="_blank" rel="noopener noreferrer" className={classesBotao("principal", true)}>
              Ver vaga no site
            </a>
            <p className="text-sm text-texto-2">Protótipo: o link abre o site real, mas esta vaga de exemplo não existe lá.</p>
            {!interesse && (
              <Botao variante="secundario" largo onClick={() => demonstrarInteresse(vaga.id)}>
                Avisar o ministério que tenho interesse
              </Botao>
            )}
          </>
        )}

        {interesse && !encerrado && (
          <div className="flex flex-col gap-2">
            <Botao variante="secundario" largo onClick={() => atualizarInteresse(interesse.id, "contratado")}>
              Fui contratado(a)
            </Botao>
            <Botao variante="texto" largo onClick={() => atualizarInteresse(interesse.id, "nao_seguiu")}>
              Não vou seguir com esta vaga
            </Botao>
          </div>
        )}

        <Denunciar alvoTipo="vaga" alvoId={vaga.id} />
      </div>
    </>
  );
}

export default function PaginaDetalheVaga() {
  return (
    <Suspense>
      <Conteudo />
    </Suspense>
  );
}
