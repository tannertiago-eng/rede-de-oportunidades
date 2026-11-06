"use client";

import { useState } from "react";
import { Cabecalho } from "@/componentes/layout/Cabecalho";
import { Aviso } from "@/componentes/ui/Aviso";
import { Botao } from "@/componentes/ui/Botao";
import { Campo } from "@/componentes/ui/Campo";
import { AreaTexto, Selecao } from "@/componentes/ui/Formulario";
import { cadastrarVaga } from "@/dados/acoes";
import { ROTULO_MODALIDADE, ROTULO_NIVEL } from "@/dominio/rotulos";
import type { Modalidade, Nivel, TipoContrato } from "@/dominio/tipos";

const CONTRATOS: TipoContrato[] = ["CLT", "PJ", "Estágio", "Temporário"];

export default function PaginaCadastrarVaga() {
  const [publicar, setPublicar] = useState(true);
  const [mensagem, setMensagem] = useState("");
  const [versao, setVersao] = useState(0);

  return (
    <>
      <Cabecalho titulo="Cadastrar vaga" voltar={{ href: "/ministerio", rotulo: "Ministério" }} />
      <form
        key={versao}
        className="flex flex-col gap-4"
        onSubmit={(evento) => {
          evento.preventDefault();
          const d = new FormData(evento.currentTarget);
          const v = (n: string) => String(d.get(n) ?? "").trim();
          cadastrarVaga(
            {
              titulo: v("titulo"),
              empresa: v("empresa"),
              nivel: v("nivel") as Nivel,
              tipo_contrato: v("contrato") as TipoContrato,
              modalidade: v("modalidade") as Modalidade,
              bairro_cidade: v("local"),
              descricao: v("descricao"),
              link_externo: v("link") || null,
            },
            publicar,
          );
          setMensagem(publicar ? "Vaga publicada." : "Vaga enviada para a fila de revisão.");
          setVersao(versao + 1);
        }}
      >
        {mensagem && <Aviso>{mensagem}</Aviso>}
        <Campo id="titulo" name="titulo" rotulo="Título" required />
        <Campo id="empresa" name="empresa" rotulo="Empresa" required />
        <Selecao id="nivel" name="nivel" rotulo="Nível" opcoes={(Object.keys(ROTULO_NIVEL) as Nivel[]).map((n) => ({ valor: n, rotulo: ROTULO_NIVEL[n] }))} />
        <Selecao id="contrato" name="contrato" rotulo="Tipo de contrato" opcoes={CONTRATOS.map((c) => ({ valor: c, rotulo: c }))} />
        <Selecao id="modalidade" name="modalidade" rotulo="Modalidade" opcoes={(Object.keys(ROTULO_MODALIDADE) as Modalidade[]).map((m) => ({ valor: m, rotulo: ROTULO_MODALIDADE[m] }))} />
        <Campo id="local" name="local" rotulo="Bairro ou cidade" required />
        <AreaTexto id="descricao" name="descricao" rotulo="Descrição" required />
        <Campo id="link" name="link" type="url" rotulo="Link externo (opcional)" dica="Preencha se a vaga está em outro site, como Catho ou LinkedIn." />
        <p className="text-sm text-texto-2">Vagas que exijam religião são proibidas.</p>
        <div className="flex flex-col gap-2">
          <Botao type="submit" largo onClick={() => setPublicar(true)}>
            Publicar vaga
          </Botao>
          <Botao type="submit" variante="secundario" largo onClick={() => setPublicar(false)}>
            Enviar para revisão de outra pessoa
          </Botao>
        </div>
      </form>
    </>
  );
}
