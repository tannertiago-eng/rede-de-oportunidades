"use client";

import Link from "next/link";
import { useState } from "react";
import { Cabecalho } from "@/componentes/layout/Cabecalho";
import { Aviso } from "@/componentes/ui/Aviso";
import { Botao, classesBotao } from "@/componentes/ui/Botao";
import { Campo } from "@/componentes/ui/Campo";
import { Cartao } from "@/componentes/ui/Cartao";
import { Chip } from "@/componentes/ui/Chip";
import { AreaTexto, Marcar, Selecao } from "@/componentes/ui/Formulario";
import { salvarPerfil } from "@/dados/acoes";
import { useUsuario } from "@/dados/ganchos";
import { ROTULO_CAMPO, ROTULO_NIVEL, ROTULO_PAPEL, ROTULO_VISIBILIDADE, textoDoCampo as texto } from "@/dominio/rotulos";
import type { CampoVisivel, Nivel, Papel, Perfil, Visibilidade } from "@/dominio/tipos";
import { verPerfil } from "@/dominio/visibilidade";

const OPCOES_VIS = (Object.keys(ROTULO_VISIBILIDADE) as Visibilidade[]).map((valor) => ({ valor, rotulo: ROTULO_VISIBILIDADE[valor] }));
const OPCOES_NIVEL = (Object.keys(ROTULO_NIVEL) as Nivel[]).map((valor) => ({ valor, rotulo: ROTULO_NIVEL[valor] }));

function QuemVe({ campo, atual }: { campo: CampoVisivel; atual: Visibilidade }) {
  return (
    <div className="mt-2 rounded-botao bg-secundaria p-3">
      <Selecao id={`vis-${campo}`} name={`vis-${campo}`} rotulo="Quem pode ver" defaultValue={atual} opcoes={OPCOES_VIS} />
    </div>
  );
}

function Previa({ perfil }: { perfil: Perfil }) {
  const [papel, setPapel] = useState<Papel>("membro");
  const visto = verPerfil(perfil, { id: "visitante", papel });
  const campos = visto ? Object.entries(visto.campos).filter(([, v]) => texto(v)) : [];

  return (
    <Cartao>
      <h2 className="text-xl">Como outras pessoas veem</h2>
      <p className="mt-1 text-sm text-texto-2">Mostra o que está salvo. Salve antes de conferir.</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {(Object.keys(ROTULO_PAPEL) as Papel[]).map((p) => (
          <Chip key={p} ativo={papel === p} onClick={() => setPapel(p)}>
            {ROTULO_PAPEL[p]}
          </Chip>
        ))}
      </div>
      <div className="mt-4">
        {visto ? (
          <>
            <p className="font-semibold">{visto.nome}</p>
            {campos.length === 0 && <p className="text-texto-2">Só o nome aparece.</p>}
            <dl className="mt-1">
              {campos.map(([campo, valor]) => (
                <div key={campo} className="py-1">
                  <dt className="text-sm text-texto-2">{ROTULO_CAMPO[campo as CampoVisivel]}</dt>
                  <dd>{texto(valor)}</dd>
                </div>
              ))}
            </dl>
          </>
        ) : (
          <p className="text-texto-2">Seu perfil não aparece para quem tem esse papel.</p>
        )}
      </div>
    </Cartao>
  );
}

export default function PaginaPerfil() {
  const perfil = useUsuario();
  const [salvo, setSalvo] = useState(false);
  const [nivel, setNivel] = useState<Nivel>(perfil.nivel);
  const [buscando, setBuscando] = useState(perfil.buscando);
  const [discreto, setDiscreto] = useState(perfil.modo_discreto);
  const vis = perfil.visibilidade;

  return (
    <>
      <Cabecalho titulo="Perfil" />
      <div className="flex flex-col gap-4">
        <Aviso>Use dados fictícios neste teste. Nada sai deste aparelho.</Aviso>

        <form
          className="flex flex-col gap-4"
          onChange={() => setSalvo(false)}
          onSubmit={(evento) => {
            evento.preventDefault();
            const d = new FormData(evento.currentTarget);
            const valor = (nome: string) => String(d.get(nome) ?? "").trim();
            const visibilidade = Object.fromEntries((Object.keys(vis) as CampoVisivel[]).map((c) => [c, (d.get(`vis-${c}`) ?? vis[c]) as Visibilidade])) as Perfil["visibilidade"];
            salvarPerfil(
              {
                nome: valor("nome"),
                telefone_whatsapp: valor("telefone"),
                nivel,
                area: valor("area"),
                resumo: valor("resumo"),
                experiencias: valor("experiencias").split("\n").map((l) => l.trim()).filter(Boolean),
                disponibilidade: { turno: valor("turno"), cnh: valor("cnh"), bairro: valor("bairro") },
                linkedin_url: valor("linkedin"),
                buscando,
                modo_discreto: discreto,
              },
              visibilidade,
            );
            setSalvo(true);
          }}
        >
          <Cartao>
            <Campo id="nome" name="nome" rotulo="Nome" required defaultValue={perfil.nome} />
            <p className="mt-2 text-sm text-texto-2">Seu nome é visto por quem pode ver seu perfil.</p>
          </Cartao>
          <Cartao>
            <Campo id="telefone" name="telefone" rotulo="WhatsApp" inputMode="tel" defaultValue={perfil.telefone_whatsapp} />
            <QuemVe campo="telefone_whatsapp" atual={vis.telefone_whatsapp} />
          </Cartao>
          <Cartao>
            <Selecao id="nivel" rotulo="Nível profissional" value={nivel} onChange={(e) => setNivel(e.target.value as Nivel)} opcoes={OPCOES_NIVEL} />
            {nivel === "executivo" && <p className="mt-2 text-sm text-texto-2">Perfis executivos nunca aparecem em listagens. Só a coordenação vê.</p>}
            <QuemVe campo="nivel" atual={vis.nivel} />
          </Cartao>
          <Cartao>
            <Campo id="area" name="area" rotulo="Área" defaultValue={perfil.area} />
            <QuemVe campo="area" atual={vis.area} />
          </Cartao>
          <Cartao>
            <AreaTexto id="resumo" name="resumo" rotulo="Resumo" defaultValue={perfil.resumo} />
            <QuemVe campo="resumo" atual={vis.resumo} />
          </Cartao>
          <Cartao>
            <AreaTexto id="experiencias" name="experiencias" rotulo="Experiências" dica="Uma por linha." defaultValue={perfil.experiencias.join("\n")} />
            <QuemVe campo="experiencias" atual={vis.experiencias} />
          </Cartao>
          {nivel === "operacional" && (
            <Cartao>
              <h2 className="text-lg">Disponibilidade</h2>
              <div className="mt-2 flex flex-col gap-3">
                <Campo id="turno" name="turno" rotulo="Turno" defaultValue={perfil.disponibilidade.turno} />
                <Campo id="cnh" name="cnh" rotulo="CNH" defaultValue={perfil.disponibilidade.cnh} />
                <Campo id="bairro" name="bairro" rotulo="Bairro" dica="Só o bairro, nunca o endereço." defaultValue={perfil.disponibilidade.bairro} />
              </div>
              <QuemVe campo="disponibilidade" atual={vis.disponibilidade} />
            </Cartao>
          )}
          <Cartao>
            <Campo id="linkedin" name="linkedin" rotulo="LinkedIn" type="url" placeholder="https://www.linkedin.com/in/..." defaultValue={perfil.linkedin_url} />
            <QuemVe campo="linkedin_url" atual={vis.linkedin_url} />
          </Cartao>
          <Cartao>
            <Marcar id="buscando" checked={buscando} onChange={(e) => setBuscando(e.target.checked)}>
              Estou buscando oportunidade
            </Marcar>
            <Marcar id="discreto" checked={discreto} onChange={(e) => setDiscreto(e.target.checked)}>
              Modo discreto: só a coordenação sabe que estou buscando
            </Marcar>
            {discreto ? <p className="mt-2 text-sm text-texto-2">Com o modo discreto ligado, a escolha abaixo não vale para esta informação.</p> : null}
            <QuemVe campo="buscando" atual={vis.buscando} />
          </Cartao>

          {salvo && <Aviso>Perfil salvo.</Aviso>}
          <Botao type="submit" largo>
            Salvar perfil
          </Botao>
        </form>

        <Previa perfil={perfil} />

        <div className="flex flex-col gap-2">
          <Link href="/vitrine/editar" className={classesBotao("secundario", true)}>
            Meu negócio
          </Link>
          <Link href="/avaliacoes" className={classesBotao("secundario", true)}>
            Avaliações
          </Link>
          <Link href="/privacidade" className={classesBotao("secundario", true)}>
            Privacidade e meus dados
          </Link>
        </div>
      </div>
    </>
  );
}
