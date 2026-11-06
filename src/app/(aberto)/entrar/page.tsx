"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Aviso } from "@/componentes/ui/Aviso";
import { Botao } from "@/componentes/ui/Botao";
import { Campo } from "@/componentes/ui/Campo";
import { criarPessoaNova, destinoDaSessao, entrarComo } from "@/dados/acoes";
import { ID_COORDENACAO, ID_MEMBRO, ID_VOLUNTARIO } from "@/dados/exemplo";
import { useEstado, useHidratado } from "@/dados/ganchos";

const PERFIS_DE_TESTE = [
  { id: ID_MEMBRO, rotulo: "Membro", descricao: "Ana Exemplo" },
  { id: ID_VOLUNTARIO, rotulo: "Voluntário", descricao: "Bruno Exemplo" },
  { id: ID_COORDENACAO, rotulo: "Coordenação", descricao: "Carla Exemplo" },
];

// Página aberta: não menciona a igreja (CLAUDE.md, seção 10).
export default function PaginaEntrar() {
  const router = useRouter();
  const hidratado = useHidratado();
  const alvo = destinoDaSessao(useEstado());
  const [etapa, setEtapa] = useState<"email" | "codigo">("email");

  useEffect(() => {
    if (hidratado && alvo !== "/entrar") router.replace(alvo);
  }, [hidratado, alvo, router]);

  return (
    <main className="mx-auto flex w-full max-w-sm flex-col px-4 py-8">
      <h1 className="text-4xl">Rede de Oportunidades</h1>
      <p className="mt-2 text-texto-2">Trabalho, negócios e crescimento profissional.</p>

      {etapa === "email" ? (
        <form
          className="mt-6 flex flex-col gap-4"
          onSubmit={(evento) => {
            evento.preventDefault();
            setEtapa("codigo");
          }}
        >
          <Campo id="email" name="email" type="email" rotulo="E-mail" defaultValue="pessoa@exemplo.com" readOnly dica="No protótipo o e-mail é fixo e nenhuma mensagem é enviada." />
          <Botao type="submit" largo>
            Enviar código
          </Botao>
        </form>
      ) : (
        <form
          className="mt-6 flex flex-col gap-4"
          onSubmit={(evento) => {
            evento.preventDefault();
            criarPessoaNova();
          }}
        >
          <Aviso>No sistema real, o código chega por e-mail. Aqui ele já vem preenchido.</Aviso>
          <Campo id="codigo" name="codigo" rotulo="Código de 6 dígitos" inputMode="numeric" defaultValue="123456" readOnly />
          <Botao type="submit" largo>
            Entrar
          </Botao>
        </form>
      )}

      <section aria-labelledby="titulo-perfis" className="mt-8 border-t border-linha pt-6">
        <h2 id="titulo-perfis" className="text-xl">
          Ou entre com um perfil de teste
        </h2>
        <p className="mt-1 text-sm text-texto-2">Para ver o que cada papel enxerga, sem passar pelo cadastro.</p>
        <ul className="mt-3 flex flex-col gap-2">
          {PERFIS_DE_TESTE.map((p) => (
            <li key={p.id}>
              <Botao variante="secundario" largo onClick={() => entrarComo(p.id)}>
                {p.rotulo} · {p.descricao}
              </Botao>
            </li>
          ))}
        </ul>
      </section>

      <p className="mt-6 text-sm text-texto-2">
        <Link href="/politica" className="underline">
          Política de privacidade
        </Link>{" "}
        ·{" "}
        <Link href="/termos" className="underline">
          Termos de uso
        </Link>
      </p>
    </main>
  );
}
