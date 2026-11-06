"use client";

import Link from "next/link";
import { Cabecalho } from "@/componentes/layout/Cabecalho";
import { Cartao } from "@/componentes/ui/Cartao";
import { Icone } from "@/componentes/ui/Icone";
import { useEstado, useUsuario } from "@/dados/ganchos";
import { ehCoordenacao } from "@/dominio/permissoes";

export default function PaginaMinisterio() {
  const estado = useEstado();
  const usuario = useUsuario();
  const coordenacao = ehCoordenacao(usuario.papel);

  const emRevisao = estado.negocios.filter((n) => n.status === "em_revisao").length + estado.vagas.filter((v) => v.status === "em_revisao").length;
  const aIndicar = estado.interesses_vaga.filter((i) => i.status === "interessado").length;

  const itens = [
    { href: "/ministerio/revisao", titulo: "Fila de revisão", detalhe: `${emRevisao} aguardando` },
    { href: "/ministerio/vagas", titulo: "Cadastrar vaga", detalhe: "Vagas internas ou links externos" },
    { href: "/ministerio/indicacoes", titulo: "Indicações", detalhe: `${aIndicar} interesses sem indicação` },
    { href: "/ministerio/mentorias", titulo: "Mentorias", detalhe: `${estado.mentorias.filter((m) => m.status === "ativa").length} ativas` },
    { href: "/ministerio/perfis", titulo: "Perfis", detalhe: "Só o que cada pessoa liberou" },
    ...(coordenacao
      ? [
          { href: "/ministerio/cadastros", titulo: "Cadastros e papéis", detalhe: `${estado.perfis.filter((p) => p.situacao_cadastro === "pendente" && p.onboarding_concluido).length} aguardando aprovação` },
          { href: "/ministerio/denuncias", titulo: "Denúncias", detalhe: `${estado.denuncias.filter((d) => d.status === "aberta").length} abertas` },
          { href: "/ministerio/painel", titulo: "Painel de indicadores", detalhe: "Números e auditoria" },
        ]
      : []),
  ];

  return (
    <>
      <Cabecalho titulo="Ministério" />
      <ul className="flex flex-col gap-3 md:grid md:grid-cols-2 lg:grid-cols-3">
        {itens.map((item) => (
          <li key={item.href}>
            <Link href={item.href}>
              <Cartao className="flex h-full items-center gap-4 transition-colors hover:border-primaria">
                <div className="min-w-0 flex-1">
                  <h2 className="text-lg">{item.titulo}</h2>
                  <p className="text-sm text-texto-2">{item.detalhe}</p>
                </div>
                <Icone nome="seta" className="shrink-0 text-texto-2" />
              </Cartao>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
