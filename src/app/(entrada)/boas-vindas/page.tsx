"use client";

import { useState } from "react";
import { Guarda } from "@/componentes/layout/Guarda";
import { Aviso } from "@/componentes/ui/Aviso";
import { Botao } from "@/componentes/ui/Botao";
import { Campo } from "@/componentes/ui/Campo";
import { Chip } from "@/componentes/ui/Chip";
import { concluirOnboarding, excluirConta } from "@/dados/acoes";
import { ROTULO_NIVEL } from "@/dominio/rotulos";
import type { Nivel } from "@/dominio/tipos";

const NIVEIS: { valor: Nivel; descricao: string }[] = [
  { valor: "operacional", descricao: "Funções de execução, início de carreira" },
  { valor: "tecnico", descricao: "Formação ou especialização técnica" },
  { valor: "gestao", descricao: "Coordena pessoas ou áreas" },
  { valor: "executivo", descricao: "Direção. Seu perfil só é visto pela coordenação" },
];
const BUSCAS = ["Trabalho", "Clientes para meu negócio", "Crescer na carreira", "Aprender algo novo"];

function Conteudo() {
  const [passo, setPasso] = useState<"idade" | "menor" | 1 | 2 | 3>("idade");
  const [nivel, setNivel] = useState<Nivel>("operacional");
  const [area, setArea] = useState("");
  const [busca, setBusca] = useState(BUSCAS[0]);

  if (passo === "idade") {
    return (
      <>
        <h1 className="text-3xl">Você tem 18 anos ou mais?</h1>
        <p className="mt-2 text-texto-2">Não pedimos sua data de nascimento. Só esta resposta.</p>
        <div className="mt-6 flex flex-col gap-2">
          <Botao largo onClick={() => setPasso(1)}>
            Sim, sou maior de 18
          </Botao>
          <Botao variante="secundario" largo onClick={() => setPasso("menor")}>
            Não
          </Botao>
        </div>
      </>
    );
  }

  if (passo === "menor") {
    return (
      <>
        <h1 className="text-3xl">Por enquanto, só para maiores de 18</h1>
        <p className="mt-2 text-texto-2">Nesta primeira versão, a plataforma não atende menores de idade. Procure o ministério para saber de outras ações.</p>
        <div className="mt-6">
          <Botao largo onClick={excluirConta}>
            Encerrar e apagar meus dados
          </Botao>
        </div>
      </>
    );
  }

  return (
    <>
      <p className="text-sm font-semibold text-texto-2">Passo {passo} de 3</p>
      {passo === 1 && (
        <>
          <h1 className="mt-1 text-3xl">Qual o seu nível profissional?</h1>
          <ul className="mt-5 flex flex-col gap-2">
            {NIVEIS.map((n) => (
              <li key={n.valor}>
                <button
                  type="button"
                  aria-pressed={nivel === n.valor}
                  onClick={() => setNivel(n.valor)}
                  className={`w-full rounded-botao border p-4 text-left ${nivel === n.valor ? "border-primaria bg-secundaria" : "border-linha bg-superficie"}`}
                >
                  <span className="block font-semibold">{ROTULO_NIVEL[n.valor]}</span>
                  <span className="block text-sm text-texto-2">{n.descricao}</span>
                </button>
              </li>
            ))}
          </ul>
          <div className="mt-6">
            <Botao largo onClick={() => setPasso(2)}>
              Continuar
            </Botao>
          </div>
        </>
      )}
      {passo === 2 && (
        <form
          onSubmit={(evento) => {
            evento.preventDefault();
            setPasso(3);
          }}
        >
          <h1 className="mt-1 text-3xl">Em que área você atua?</h1>
          <div className="mt-5">
            <Campo id="area" rotulo="Área" required value={area} onChange={(e) => setArea(e.target.value)} placeholder="Ex.: administrativo, vendas, tecnologia" />
          </div>
          <div className="mt-6">
            <Botao type="submit" largo>
              Continuar
            </Botao>
          </div>
        </form>
      )}
      {passo === 3 && (
        <>
          <h1 className="mt-1 text-3xl">O que você busca agora?</h1>
          <div className="mt-5 flex flex-wrap gap-2">
            {BUSCAS.map((b) => (
              <Chip key={b} ativo={busca === b} onClick={() => setBusca(b)}>
                {b}
              </Chip>
            ))}
          </div>
          <div className="mt-5">
            <Aviso>Tudo começa como &quot;só eu&quot;. No seu perfil, você escolhe o que liberar e para quem.</Aviso>
          </div>
          <div className="mt-6">
            <Botao largo onClick={() => concluirOnboarding({ nome: "Pessoa de Teste", nivel, area, o_que_busca: busca })}>
              Concluir cadastro
            </Botao>
          </div>
        </>
      )}
    </>
  );
}

export default function PaginaBoasVindas() {
  return (
    <Guarda etapa="/boas-vindas">
      <main className="mx-auto w-full max-w-xl px-4 py-6">
        <Conteudo />
      </main>
    </Guarda>
  );
}
