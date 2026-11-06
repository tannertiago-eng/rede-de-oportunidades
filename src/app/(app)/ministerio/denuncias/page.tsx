"use client";

import Link from "next/link";
import { Cabecalho } from "@/componentes/layout/Cabecalho";
import { SoCoordenacao } from "@/componentes/layout/SoCoordenacao";
import { Botao } from "@/componentes/ui/Botao";
import { Cartao } from "@/componentes/ui/Cartao";
import { Selo } from "@/componentes/ui/Selo";
import { tratarDenuncia } from "@/dados/acoes";
import { useEstado } from "@/dados/ganchos";

const STATUS = { aberta: "Aberta", procedente: "Procedente", improcedente: "Improcedente" };

function Conteudo() {
  const estado = useEstado();
  const alvo = (tipo: "negocio" | "vaga", id: string) =>
    tipo === "negocio" ? estado.negocios.find((n) => n.id === id)?.nome : estado.vagas.find((v) => v.id === id)?.titulo;

  return (
    <>
      <Cabecalho titulo="Denúncias" voltar={{ href: "/ministerio", rotulo: "Ministério" }} />
      <div className="flex flex-col gap-3 md:grid md:grid-cols-2 md:items-start">
        {estado.denuncias.map((d) => (
          <Cartao key={d.id}>
            <Selo>{STATUS[d.status]}</Selo>
            <h2 className="mt-2 text-lg">
              <Link className="underline" href={d.alvo_tipo === "negocio" ? `/vitrine/detalhe?id=${d.alvo_id}` : `/vagas/detalhe?id=${d.alvo_id}`}>
                {alvo(d.alvo_tipo, d.alvo_id) ?? "Conteúdo removido"}
              </Link>
            </h2>
            <p className="mt-1">{d.motivo}</p>
            {d.status === "aberta" && (
              <div className="mt-3 flex flex-wrap gap-2">
                <Botao variante="secundario" onClick={() => tratarDenuncia(d.id, "procedente")}>
                  Procedente
                </Botao>
                <Botao variante="secundario" onClick={() => tratarDenuncia(d.id, "improcedente")}>
                  Improcedente
                </Botao>
              </div>
            )}
          </Cartao>
        ))}
        {estado.denuncias.length === 0 && <p className="text-texto-2">Nenhuma denúncia.</p>}
      </div>
    </>
  );
}

export default function PaginaDenuncias() {
  return (
    <SoCoordenacao>
      <Conteudo />
    </SoCoordenacao>
  );
}
