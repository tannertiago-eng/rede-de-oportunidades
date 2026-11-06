"use client";

import Link from "next/link";
import { useState } from "react";
import { Cabecalho } from "@/componentes/layout/Cabecalho";
import { Aviso } from "@/componentes/ui/Aviso";
import { Botao, classesBotao } from "@/componentes/ui/Botao";
import { Cartao } from "@/componentes/ui/Cartao";
import { dadosDoTitular, excluirConta, revogarConsentimento } from "@/dados/acoes";
import { useEstado, useUsuario } from "@/dados/ganchos";

export default function PaginaPrivacidade() {
  const estado = useEstado();
  const usuario = useUsuario();
  const [confirmar, setConfirmar] = useState<"revogar" | "excluir" | null>(null);

  function baixar() {
    const arquivo = new Blob([JSON.stringify(dadosDoTitular(estado, usuario.id), null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(arquivo);
    const link = document.createElement("a");
    link.href = url;
    link.download = "meus-dados.json";
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <>
      <Cabecalho titulo="Privacidade" voltar={{ href: "/perfil", rotulo: "Perfil" }} />
      <div className="flex flex-col gap-3 md:grid md:grid-cols-2">
        <Cartao>
          <h2 className="text-xl">Baixar meus dados</h2>
          <p className="mt-1">Um arquivo com tudo o que a plataforma guarda sobre você.</p>
          <Botao variante="secundario" largo className="mt-3" onClick={baixar}>
            Baixar arquivo
          </Botao>
        </Cartao>

        <Cartao>
          <h2 className="text-xl">Corrigir meus dados</h2>
          <p className="mt-1">Tudo pode ser alterado no seu perfil.</p>
          <Link href="/perfil" className={`${classesBotao("secundario", true)} mt-3`}>
            Ir para o perfil
          </Link>
        </Cartao>

        <Cartao>
          <h2 className="text-xl">Revogar consentimento</h2>
          <p className="mt-1">Você deixa de usar a plataforma até aceitar de novo.</p>
          {confirmar === "revogar" ? (
            <div className="mt-3 flex gap-2">
              <Botao variante="secundario" onClick={revogarConsentimento}>
                Sim, revogar
              </Botao>
              <Botao variante="texto" onClick={() => setConfirmar(null)}>
                Cancelar
              </Botao>
            </div>
          ) : (
            <Botao variante="secundario" largo className="mt-3" onClick={() => setConfirmar("revogar")}>
              Revogar
            </Botao>
          )}
        </Cartao>

        <Cartao>
          <h2 className="text-xl">Excluir minha conta</h2>
          <p className="mt-1">Apaga de verdade seus dados pessoais. Contratações e negócios fechados continuam nos números do ministério, sem nenhum vínculo com você.</p>
          {confirmar === "excluir" ? (
            <div className="mt-3 flex flex-col gap-2">
              <Aviso tipo="alerta">Na versão final, isso não pode ser desfeito.</Aviso>
              <div className="flex gap-2">
                <Botao variante="secundario" onClick={excluirConta}>
                  Sim, excluir
                </Botao>
                <Botao variante="texto" onClick={() => setConfirmar(null)}>
                  Cancelar
                </Botao>
              </div>
            </div>
          ) : (
            <Botao variante="secundario" largo className="mt-3" onClick={() => setConfirmar("excluir")}>
              Excluir conta
            </Botao>
          )}
        </Cartao>

        <p className="text-sm text-texto-2 md:col-span-2">
          <Link href="/politica" className="underline">
            Política de privacidade
          </Link>{" "}
          ·{" "}
          <Link href="/termos" className="underline">
            Termos de uso
          </Link>
        </p>
      </div>
    </>
  );
}
