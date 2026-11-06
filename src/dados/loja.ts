import type { Estado } from "../dominio/tipos.ts";
import { criarEstadoInicial, VERSAO_ESTADO } from "./exemplo.ts";

// Loja do protótipo: tudo fica no aparelho (localStorage), nada vai para um servidor.
// Este arquivo, acoes.ts e ganchos.ts são o que o desenvolvedor troca pelo Supabase.
const CHAVE = "rede-oportunidades-prototipo";

let atual: Estado | null = null;
const ouvintes = new Set<() => void>();

// Foto fixa usada no HTML gerado no build, antes de o navegador ler o aparelho.
export const estadoDoBuild = criarEstadoInicial(new Date());

function lerDoAparelho(): Estado | null {
  if (typeof localStorage === "undefined") return null;
  try {
    const bruto = localStorage.getItem(CHAVE);
    const lido = bruto ? (JSON.parse(bruto) as Estado) : null;
    return lido?.versao === VERSAO_ESTADO ? lido : null;
  } catch {
    return null;
  }
}

function gravarNoAparelho(estado: Estado) {
  if (typeof localStorage === "undefined") return;
  try {
    localStorage.setItem(CHAVE, JSON.stringify(estado));
  } catch {
    // Sem armazenamento (aba anônima): o teste vale até fechar a página.
  }
}

export function lerEstado(): Estado {
  atual ??= lerDoAparelho() ?? criarEstadoInicial(new Date());
  return atual;
}

export function assinar(ouvinte: () => void) {
  ouvintes.add(ouvinte);
  return () => {
    ouvintes.delete(ouvinte);
  };
}

export function atualizar(mudanca: (rascunho: Estado) => void) {
  const rascunho = structuredClone(lerEstado());
  mudanca(rascunho);
  atual = rascunho;
  gravarNoAparelho(rascunho);
  ouvintes.forEach((ouvinte) => ouvinte());
}

export function recomecarTeste() {
  atual = criarEstadoInicial(new Date());
  gravarNoAparelho(atual);
  ouvintes.forEach((ouvinte) => ouvinte());
}
