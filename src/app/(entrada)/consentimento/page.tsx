"use client";

import Link from "next/link";
import { useState } from "react";
import { Guarda } from "@/componentes/layout/Guarda";
import { Botao } from "@/componentes/ui/Botao";
import { Cartao } from "@/componentes/ui/Cartao";
import { Marcar } from "@/componentes/ui/Formulario";
import { aceitarConsentimento, excluirConta, sair } from "@/dados/acoes";
import { VERSAO_TERMO } from "@/dados/exemplo";

function Conteudo() {
  const [aceito, setAceito] = useState(false);

  return (
    <main className="mx-auto w-full max-w-xl px-4 py-6">
      <h1 className="text-3xl">Antes de começar</h1>
      <p className="mt-2 text-texto-2">Sem este consentimento, não é possível usar a plataforma.</p>

      <Cartao className="mt-5">
        <h2 className="text-xl">Dados sensíveis</h2>
        <p className="mt-2">
          Participar desta rede pode revelar que você faz parte de uma comunidade religiosa. Para a Lei Geral de Proteção de Dados, isso é um <strong className="font-semibold">dado pessoal sensível</strong>.
        </p>
        <p className="mt-2">Autorizo o tratamento dos meus dados para me conectar a oportunidades de trabalho, negócios e crescimento profissional, com acompanhamento do ministério.</p>
        <ul className="mt-2 list-disc pl-5">
          <li>Você decide quem vê cada informação do seu perfil.</li>
          <li>Não pedimos CPF, endereço completo, data de nascimento, estado civil ou dados da família.</li>
          <li>Você pode baixar seus dados, revogar este consentimento ou excluir sua conta quando quiser.</li>
        </ul>
        <p className="mt-3 text-sm text-texto-2">Versão {VERSAO_TERMO} · Texto provisório [REVISAR COM ADVOGADO]</p>
        <p className="mt-1 text-sm">
          <Link href="/politica" className="font-semibold text-primaria underline">
            Política de privacidade
          </Link>{" "}
          ·{" "}
          <Link href="/termos" className="font-semibold text-primaria underline">
            Termos de uso
          </Link>
        </p>
      </Cartao>

      <div className="mt-4">
        <Marcar id="aceite" checked={aceito} onChange={(e) => setAceito(e.target.checked)}>
          Li e autorizo o tratamento dos meus dados, inclusive dados sensíveis, para essa finalidade.
        </Marcar>
      </div>

      <div className="mt-4 flex flex-col gap-2">
        <Botao largo disabled={!aceito} onClick={aceitarConsentimento}>
          Aceitar e continuar
        </Botao>
        <Botao variante="texto" largo onClick={sair}>
          Agora não
        </Botao>
        <Botao variante="texto" largo onClick={excluirConta}>
          Não quero participar: excluir meu cadastro
        </Botao>
      </div>
    </main>
  );
}

export default function PaginaConsentimento() {
  return (
    <Guarda etapa="/consentimento">
      <Conteudo />
    </Guarda>
  );
}
