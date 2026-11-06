"use client";

import { Cabecalho } from "@/componentes/layout/Cabecalho";
import { SoCoordenacao } from "@/componentes/layout/SoCoordenacao";
import { Botao } from "@/componentes/ui/Botao";
import { Cartao } from "@/componentes/ui/Cartao";
import { Selecao } from "@/componentes/ui/Formulario";
import { decidirCadastro, definirPapel } from "@/dados/acoes";
import { useEstado, useUsuario } from "@/dados/ganchos";
import { ROTULO_PAPEL } from "@/dominio/rotulos";
import type { Papel } from "@/dominio/tipos";

const OPCOES = (Object.keys(ROTULO_PAPEL) as Papel[]).map((valor) => ({ valor, rotulo: ROTULO_PAPEL[valor] }));

function Conteudo() {
  const estado = useEstado();
  const usuario = useUsuario();
  const pendentes = estado.perfis.filter((p) => p.situacao_cadastro === "pendente" && p.onboarding_concluido);
  const aprovados = estado.perfis.filter((p) => p.situacao_cadastro === "aprovado");

  return (
    <>
      <Cabecalho titulo="Cadastros e papéis" voltar={{ href: "/ministerio", rotulo: "Ministério" }} />
      <h2 className="mb-2 text-xl">Aguardando aprovação ({pendentes.length})</h2>
      <div className="flex flex-col gap-3">
        {pendentes.map((p) => (
          <Cartao key={p.id}>
            <h3 className="text-lg">{p.nome}</h3>
            <p className="text-sm text-texto-2">{p.area}</p>
            <div className="mt-3 flex gap-2">
              <Botao className="flex-1" onClick={() => decidirCadastro(p.id, "aprovado")}>
                Aprovar
              </Botao>
              <Botao variante="secundario" onClick={() => decidirCadastro(p.id, "recusado")}>
                Recusar
              </Botao>
            </div>
          </Cartao>
        ))}
        {pendentes.length === 0 && <p className="text-texto-2">Nenhum cadastro aguardando.</p>}
      </div>

      <h2 className="mt-6 mb-2 text-xl">Papéis</h2>
      <Cartao className="flex flex-col gap-3">
        {aprovados.map((p) => (
          <Selecao key={p.id} id={`papel-${p.id}`} rotulo={p.nome} value={p.papel} disabled={p.id === usuario.id} onChange={(e) => definirPapel(p.id, e.target.value as Papel)} opcoes={OPCOES} />
        ))}
      </Cartao>
    </>
  );
}

export default function PaginaCadastros() {
  return (
    <SoCoordenacao>
      <Conteudo />
    </SoCoordenacao>
  );
}
