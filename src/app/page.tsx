"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { destinoDaSessao } from "@/dados/acoes";
import { useEstado, useHidratado } from "@/dados/ganchos";

export default function PaginaRaiz() {
  const router = useRouter();
  const hidratado = useHidratado();
  const alvo = destinoDaSessao(useEstado());

  useEffect(() => {
    if (hidratado) router.replace(alvo);
  }, [hidratado, alvo, router]);

  return (
    <p role="status" className="px-4 py-10 text-center text-texto-2">
      Carregando...
    </p>
  );
}
