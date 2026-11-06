"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { Cabecalho } from "@/componentes/layout/Cabecalho";
import { Aviso } from "@/componentes/ui/Aviso";
import { Botao, classesBotao } from "@/componentes/ui/Botao";
import { Campo } from "@/componentes/ui/Campo";
import { Cartao } from "@/componentes/ui/Cartao";
import { AreaTexto } from "@/componentes/ui/Formulario";
import { Selo } from "@/componentes/ui/Selo";
import { arquivarNegocio, salvarNegocio } from "@/dados/acoes";
import { useEstado, useUsuario } from "@/dados/ganchos";
import { ROTULO_STATUS } from "@/dominio/rotulos";
import type { Negocio } from "@/dominio/tipos";

function Formulario({ negocio }: { negocio?: Negocio }) {
  const router = useRouter();
  const [enviar, setEnviar] = useState(true);

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={(evento) => {
        evento.preventDefault();
        const d = new FormData(evento.currentTarget);
        const v = (n: string) => String(d.get(n) ?? "").trim();
        salvarNegocio(negocio?.id ?? null, { nome: v("nome"), categoria: v("categoria"), descricao: v("descricao"), bairro: v("bairro"), whatsapp: v("whatsapp"), instagram: v("instagram") }, enviar);
        router.push("/vitrine/editar");
      }}
    >
      {negocio?.status === "publicado" && <Aviso>Ao enviar uma alteração, o negócio sai do ar até o ministério revisar de novo.</Aviso>}
      {negocio?.status === "rejeitado" && <Aviso tipo="alerta">Rejeitado: {negocio.motivo_rejeicao}</Aviso>}
      <Campo id="nome" name="nome" rotulo="Nome do negócio" required defaultValue={negocio?.nome} />
      <Campo id="categoria" name="categoria" rotulo="Categoria" required defaultValue={negocio?.categoria} placeholder="Ex.: Alimentação" />
      <AreaTexto id="descricao" name="descricao" rotulo="Descrição" required defaultValue={negocio?.descricao} />
      <Campo id="bairro" name="bairro" rotulo="Bairro" required defaultValue={negocio?.bairro} dica="Só o bairro, nunca o endereço." />
      <Campo id="whatsapp" name="whatsapp" rotulo="WhatsApp do negócio" required inputMode="tel" defaultValue={negocio?.whatsapp} dica="Use um número fictício neste teste." />
      <Campo id="instagram" name="instagram" rotulo="Instagram (opcional)" defaultValue={negocio?.instagram} />
      <Aviso>O envio de fotos entra na versão final.</Aviso>
      <p className="text-sm text-texto-2">Marketing multinível, oportunidades de investimento e empréstimos entre membros são proibidos pelos termos de uso.</p>
      <div className="flex flex-col gap-2">
        <Botao type="submit" largo onClick={() => setEnviar(true)}>
          Enviar para revisão
        </Botao>
        <Botao type="submit" variante="secundario" largo onClick={() => setEnviar(false)}>
          Salvar rascunho
        </Botao>
      </div>
    </form>
  );
}

function Conteudo() {
  const parametros = useSearchParams();
  const id = parametros.get("id");
  const novo = parametros.get("novo") === "1";
  const estado = useEstado();
  const usuario = useUsuario();
  const meus = estado.negocios.filter((n) => n.dono_id === usuario.id && n.status !== "arquivado");
  const voltar = { href: "/vitrine", rotulo: "Vitrine" };

  if (novo) {
    return (
      <>
        <Cabecalho titulo="Novo negócio" voltar={{ href: "/vitrine/editar", rotulo: "Meu negócio" }} />
        <Formulario />
      </>
    );
  }

  if (id) {
    // Só o dono edita.
    const negocio = meus.find((n) => n.id === id);
    if (!negocio) {
      return (
        <>
          <Cabecalho titulo="Sem permissão" voltar={voltar} />
          <p className="text-texto-2">Só o dono pode editar um negócio.</p>
        </>
      );
    }
    return (
      <>
        <Cabecalho titulo="Editar negócio" voltar={{ href: "/vitrine/editar", rotulo: "Meu negócio" }} />
        <Formulario key={negocio.id} negocio={negocio} />
      </>
    );
  }

  return (
    <>
      <Cabecalho titulo="Meu negócio" voltar={voltar} />
      <div className="flex flex-col gap-3">
        {meus.map((n) => (
          <Cartao key={n.id}>
            <Selo>{ROTULO_STATUS[n.status]}</Selo>
            <h2 className="mt-2 text-lg">{n.nome}</h2>
            {n.motivo_rejeicao && <p className="mt-1 text-sm text-alerta">Motivo: {n.motivo_rejeicao}</p>}
            <div className="mt-3 flex flex-wrap gap-2">
              <Link href={`/vitrine/editar?id=${n.id}`} className={classesBotao("secundario")}>
                Editar
              </Link>
              <Botao variante="texto" onClick={() => arquivarNegocio(n.id)}>
                Arquivar
              </Botao>
            </div>
          </Cartao>
        ))}
        {meus.length === 0 && <p className="text-texto-2">Você ainda não cadastrou um negócio.</p>}
        <Link href="/vitrine/editar?novo=1" className={classesBotao("principal", true)}>
          Cadastrar negócio
        </Link>
      </div>
    </>
  );
}

export default function PaginaMeuNegocio() {
  return (
    <Suspense>
      <Conteudo />
    </Suspense>
  );
}
