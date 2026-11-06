"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { Cabecalho } from "@/componentes/layout/Cabecalho";
import { Denunciar } from "@/componentes/layout/Denunciar";
import { Aviso } from "@/componentes/ui/Aviso";
import { Botao } from "@/componentes/ui/Botao";
import { Cartao } from "@/componentes/ui/Cartao";
import { useEstado, useUsuario } from "@/dados/ganchos";
import { ehMinisterio } from "@/dominio/permissoes";

function Conteudo() {
  const id = useSearchParams().get("id");
  const estado = useEstado();
  const usuario = useUsuario();
  const [copiado, setCopiado] = useState(false);
  const negocio = estado.negocios.find((n) => n.id === id);
  const voltar = { href: "/vitrine", rotulo: "Vitrine" };

  // Só aparece publicado; o dono e o ministério veem também os demais estados.
  const podeVer = negocio && (negocio.status === "publicado" || negocio.dono_id === usuario.id || ehMinisterio(usuario.papel));
  if (!podeVer) {
    return (
      <>
        <Cabecalho titulo="Não encontrado" voltar={voltar} />
        <p className="text-texto-2">Este negócio não existe ou não está publicado.</p>
      </>
    );
  }

  return (
    <>
      <Cabecalho titulo={negocio.nome} voltar={voltar} />
      <div className="flex flex-col gap-4 md:max-w-2xl">
        <Cartao>
          <p className="text-sm text-texto-2">
            {negocio.categoria} · {negocio.bairro}
          </p>
          <p className="mt-2">{negocio.descricao}</p>
          <dl className="mt-3 text-sm">
            <dt className="text-texto-2">WhatsApp</dt>
            <dd>{negocio.whatsapp}</dd>
            {negocio.instagram && (
              <>
                <dt className="mt-2 text-texto-2">Instagram</dt>
                <dd>{negocio.instagram}</dd>
              </>
            )}
          </dl>
        </Cartao>

        {/* No sistema real este botão também abre https://wa.me/. Aqui não abre, porque os números são fictícios. */}
        <Botao
          largo
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(negocio.whatsapp);
            } catch {
              // Sem acesso à área de transferência: o número continua visível acima.
            }
            setCopiado(true);
          }}
        >
          Entrar em contato
        </Botao>
        {copiado && <Aviso>Número copiado. No sistema real, este botão também abre a conversa no WhatsApp do negócio.</Aviso>}

        <p className="text-sm text-texto-2">Cadastro revisado não é recomendação. Confira as informações antes de fechar negócio.</p>
        <Denunciar alvoTipo="negocio" alvoId={negocio.id} />
      </div>
    </>
  );
}

export default function PaginaDetalheNegocio() {
  return (
    <Suspense>
      <Conteudo />
    </Suspense>
  );
}
