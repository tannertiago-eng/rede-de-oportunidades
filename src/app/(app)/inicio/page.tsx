"use client";

import Link from "next/link";
import { useState } from "react";
import { Cabecalho } from "@/componentes/layout/Cabecalho";
import { Aviso } from "@/componentes/ui/Aviso";
import { Botao, classesBotao } from "@/componentes/ui/Botao";
import { Cartao } from "@/componentes/ui/Cartao";
import { AreaTexto, Selecao } from "@/componentes/ui/Formulario";
import { Icone } from "@/componentes/ui/Icone";
import { Selo } from "@/componentes/ui/Selo";
import { registrarConquista } from "@/dados/acoes";
import { TRILHAS } from "@/dados/conteudo";
import { useEstado, useUsuario } from "@/dados/ganchos";
import { ehMinisterio } from "@/dominio/permissoes";
import { ROTULO_MODALIDADE } from "@/dominio/rotulos";

function RegistrarConquista() {
  const [etapa, setEtapa] = useState<"fechado" | "aberto" | "feito">("fechado");
  if (etapa === "feito") return <Aviso>Conquista registrada. Parabéns! Ela entra nos números do ministério, sem expor seus detalhes.</Aviso>;
  if (etapa === "fechado") {
    return (
      <Botao variante="secundario" largo onClick={() => setEtapa("aberto")}>
        Registrar uma conquista
      </Botao>
    );
  }
  return (
    <Cartao>
      <form
        className="flex flex-col gap-3"
        onSubmit={(evento) => {
          evento.preventDefault();
          const dados = new FormData(evento.currentTarget);
          registrarConquista(dados.get("tipo") as "contratacao" | "negocio_fechado", String(dados.get("observacao")));
          setEtapa("feito");
        }}
      >
        <Selecao id="tipo" name="tipo" rotulo="O que aconteceu?" opcoes={[{ valor: "contratacao", rotulo: "Fui contratado(a)" }, { valor: "negocio_fechado", rotulo: "Fechei um negócio" }]} />
        <AreaTexto id="observacao" name="observacao" rotulo="Quer contar algo? (opcional)" />
        <Botao type="submit" variante="secundario">
          Registrar
        </Botao>
      </form>
    </Cartao>
  );
}

export default function PaginaInicio() {
  const estado = useEstado();
  const usuario = useUsuario();

  const meuProgresso = estado.progresso_trilha.filter((p) => p.usuario_id === usuario.id);
  const trilhaAtual = TRILHAS.find((t) => meuProgresso.some((p) => p.trilha_id === t.id && p.status !== "concluido")) ?? TRILHAS.find((t) => meuProgresso.some((p) => p.trilha_id === t.id));
  const concluidos = trilhaAtual ? trilhaAtual.itens.filter((i) => meuProgresso.some((p) => p.item_id === i.id && p.status === "concluido")).length : 0;
  const proximoItem = trilhaAtual?.itens.find((i) => !meuProgresso.some((p) => p.item_id === i.id && p.status === "concluido"));

  const vagas = estado.vagas.filter((v) => v.status === "publicado" && v.nivel === usuario.nivel).slice(0, 3);
  const mentoria = estado.mentorias.find((m) => m.mentorado_id === usuario.id && m.status === "ativa");
  const mentor = mentoria && estado.perfis.find((p) => p.id === mentoria.mentor_id);

  return (
    <>
      <Cabecalho titulo={`Olá, ${usuario.nome.split(" ")[0]}`} />
      <div className="flex flex-col gap-4 md:grid md:grid-cols-2">
        <Cartao className={mentor ? "" : "md:col-span-2"}>
          <p className="text-sm font-semibold text-texto-2">Próxima etapa</p>
          {trilhaAtual && proximoItem ? (
            <>
              <h2 className="mt-1 text-xl">{proximoItem.titulo}</h2>
              <p className="mt-1 text-texto-2">
                Trilha {trilhaAtual.nome} · {concluidos} de {trilhaAtual.itens.length} concluídas
              </p>
              <Link href={`/trilhas/detalhe?id=${trilhaAtual.id}`} className={`${classesBotao("principal", true)} mt-4 md:w-auto`}>
                Continuar trilha
              </Link>
            </>
          ) : (
            <>
              <h2 className="mt-1 text-xl">Escolha uma trilha</h2>
              <p className="mt-1 text-texto-2">Cursos gratuitos, organizados pelo ministério, para o momento que você está vivendo.</p>
              <Link href="/trilhas" className={`${classesBotao("principal", true)} mt-4 md:w-auto`}>
                Ver trilhas
              </Link>
            </>
          )}
        </Cartao>

        {mentor && (
          <Cartao>
            <p className="text-sm font-semibold text-texto-2">Sua mentoria</p>
            <h2 className="mt-1 text-xl">{mentor.nome}</h2>
            <p className="text-texto-2">
              {mentoria.area} · até {new Date(mentoria.fim_previsto).toLocaleDateString("pt-BR")}
            </p>
          </Cartao>
        )}

        <section aria-labelledby="titulo-vagas" className="md:col-span-2">
          <h2 id="titulo-vagas" className="mt-2 mb-3 text-xl">
            Vagas para o seu nível
          </h2>
          <ul className="flex flex-col gap-3 md:grid md:grid-cols-2 lg:grid-cols-3">
            {vagas.map((vaga) => (
              <li key={vaga.id}>
                <Link href={`/vagas/detalhe?id=${vaga.id}`}>
                  <Cartao className="flex h-full items-center gap-4 transition-colors hover:border-primaria">
                    <div className="min-w-0 flex-1">
                      <Selo>Curada pelo ministério</Selo>
                      <h3 className="mt-2 text-lg">{vaga.titulo}</h3>
                      <p className="text-sm text-texto-2">
                        {vaga.empresa} · {ROTULO_MODALIDADE[vaga.modalidade]}
                      </p>
                    </div>
                    <Icone nome="seta" className="shrink-0 text-texto-2" />
                  </Cartao>
                </Link>
              </li>
            ))}
            {vagas.length === 0 && <li className="text-texto-2">Nenhuma vaga para o seu nível neste momento.</li>}
          </ul>
        </section>

        <div className="flex flex-col gap-2 md:col-span-2 md:grid md:grid-cols-2 md:items-start lg:grid-cols-3">
          <Link href="/avaliacoes" className={classesBotao("secundario", true)}>
            <Icone nome="avaliacao" /> Avaliações
          </Link>
          <RegistrarConquista />
          {ehMinisterio(usuario.papel) && (
            <Link href="/ministerio" className={classesBotao("secundario", true)}>
              <Icone nome="ministerio" /> Área do ministério
            </Link>
          )}
        </div>
      </div>
    </>
  );
}
