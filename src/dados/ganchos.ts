"use client";

import { useSyncExternalStore } from "react";
import { assinar, estadoDoBuild, lerEstado } from "./loja.ts";

const semAssinatura = () => () => {};

export function useEstado() {
  return useSyncExternalStore(assinar, lerEstado, () => estadoDoBuild);
}

// false no HTML do build; true depois que o navegador assumiu a página.
export function useHidratado() {
  return useSyncExternalStore(semAssinatura, () => true, () => false);
}

export function useUsuario() {
  const estado = useEstado();
  // Só usado dentro de <Guarda>, que garante uma sessão ativa.
  return estado.perfis.find((p) => p.id === estado.sessao.usuario_id)!;
}
