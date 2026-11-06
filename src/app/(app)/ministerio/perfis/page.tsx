"use client";

import { Cabecalho } from "@/componentes/layout/Cabecalho";
import { Cartao } from "@/componentes/ui/Cartao";
import { useEstado, useUsuario } from "@/dados/ganchos";
import { ehCoordenacao } from "@/dominio/permissoes";
import { ROTULO_CAMPO, textoDoCampo as texto } from "@/dominio/rotulos";
import type { CampoVisivel, Perfil } from "@/dominio/tipos";
import { verPerfil, type PerfilVisivel } from "@/dominio/visibilidade";

function Marcador({ perfil }: { perfil: Perfil }) {
  const marcas = [perfil.modo_discreto && perfil.buscando && "Modo discreto", perfil.nivel === "executivo" && "Executivo"].filter(Boolean);
  if (marcas.length === 0) return null;
  return <p className="text-sm font-semibold text-texto-2">{marcas.join(" · ")}</p>;
}

function CartaoPerfil({ perfil, visto, coordenacao }: { perfil: Perfil; visto: PerfilVisivel; coordenacao: boolean }) {
  const campos = Object.entries(visto.campos).filter(([, v]) => texto(v));
  return (
    <Cartao>
      <h2 className="text-lg">{visto.nome}</h2>
      {coordenacao && <Marcador perfil={perfil} />}
      {campos.length === 0 && <p className="text-sm text-texto-2">Esta pessoa não liberou nenhum campo para você.</p>}
      <dl className="mt-1 text-sm">
        {campos.map(([campo, valor]) => (
          <div key={campo} className="py-0.5">
            <dt className="inline font-semibold">{ROTULO_CAMPO[campo as CampoVisivel]}: </dt>
            <dd className="inline">{texto(valor)}</dd>
          </div>
        ))}
      </dl>
    </Cartao>
  );
}

export default function PaginaPerfis() {
  const estado = useEstado();
  const usuario = useUsuario();
  const coordenacao = ehCoordenacao(usuario.papel);
  const lista = estado.perfis
    .filter((p) => p.id !== usuario.id && p.situacao_cadastro === "aprovado")
    .map((perfil) => ({ perfil, visto: verPerfil(perfil, usuario) }))
    .filter((x): x is { perfil: Perfil; visto: PerfilVisivel } => x.visto !== null);

  return (
    <>
      <Cabecalho titulo="Perfis" voltar={{ href: "/ministerio", rotulo: "Ministério" }} />
      <p className="mb-4 text-sm text-texto-2">
        {coordenacao ? "A coordenação vê todos os perfis, inclusive executivos e modo discreto." : "Você vê só o que cada pessoa liberou. Perfis executivos e quem está em modo discreto não aparecem como buscando."}
      </p>
      <div className="flex flex-col gap-3 md:grid md:grid-cols-2 md:items-start">
        {lista.map(({ perfil, visto }) => (
          <CartaoPerfil key={perfil.id} perfil={perfil} visto={visto} coordenacao={coordenacao} />
        ))}
      </div>
    </>
  );
}
