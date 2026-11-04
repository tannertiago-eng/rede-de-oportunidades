"use client";

import { Icone } from "@/componentes/ui/Icone";

function temaAtualEscuro() {
  const escolhido = document.documentElement.dataset.tema;
  if (escolhido) return escolhido === "escuro";
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

// O ícone certo aparece só por CSS (variante escuro:), então não há estado para sincronizar.
export function AlternarTema() {
  function alternar() {
    const novo = temaAtualEscuro() ? "claro" : "escuro";
    document.documentElement.dataset.tema = novo;
    try {
      localStorage.setItem("tema", novo);
    } catch {
      // Sem armazenamento (aba anônima): o tema vale só até fechar a página.
    }
  }

  return (
    <button
      type="button"
      onClick={alternar}
      aria-label="Alternar entre tema claro e escuro"
      className="inline-flex size-11 items-center justify-center rounded-botao text-texto-2 hover:bg-secundaria"
    >
      <Icone nome="lua" className="escuro:hidden" />
      <Icone nome="sol" className="hidden escuro:block" />
    </button>
  );
}
