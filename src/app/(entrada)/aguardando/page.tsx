"use client";

import { Guarda } from "@/componentes/layout/Guarda";
import { Aviso } from "@/componentes/ui/Aviso";
import { Botao } from "@/componentes/ui/Botao";
import { decidirCadastro, sair } from "@/dados/acoes";
import { useUsuario } from "@/dados/ganchos";

function Conteudo() {
  const usuario = useUsuario();
  const recusado = usuario.situacao_cadastro === "recusado";

  return (
    <main className="mx-auto w-full max-w-xl px-4 py-6">
      <h1 className="text-3xl">{recusado ? "Cadastro não aprovado" : "Cadastro em análise"}</h1>
      <p className="mt-2 text-texto-2">
        {recusado
          ? "Procure a coordenação do ministério para entender o motivo."
          : "A coordenação do ministério confere cada novo cadastro. Até lá, nenhuma informação sua aparece para outras pessoas."}
      </p>
      {!recusado && (
        <div className="mt-6 flex flex-col gap-3">
          <Aviso>Protótipo: na vida real você esperaria a coordenação. Aqui dá para adiantar.</Aviso>
          <Botao largo onClick={() => decidirCadastro(usuario.id, "aprovado")}>
            Simular aprovação da coordenação
          </Botao>
        </div>
      )}
      <div className="mt-2">
        <Botao variante="texto" largo onClick={sair}>
          Sair
        </Botao>
      </div>
    </main>
  );
}

export default function PaginaAguardando() {
  return (
    <Guarda etapa="/aguardando">
      <Conteudo />
    </Guarda>
  );
}
