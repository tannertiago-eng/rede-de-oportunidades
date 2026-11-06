"use client";

import { useState } from "react";
import { Botao } from "@/componentes/ui/Botao";
import { AreaTexto } from "@/componentes/ui/Formulario";
import { Aviso } from "@/componentes/ui/Aviso";
import { denunciar } from "@/dados/acoes";
import type { Denuncia } from "@/dominio/tipos";

export function Denunciar({ alvoTipo, alvoId }: { alvoTipo: Denuncia["alvo_tipo"]; alvoId: string }) {
  const [etapa, setEtapa] = useState<"fechado" | "aberto" | "enviado">("fechado");

  if (etapa === "enviado") return <Aviso>Denúncia enviada. A coordenação vai analisar.</Aviso>;
  if (etapa === "fechado") {
    return (
      <Botao variante="texto" onClick={() => setEtapa("aberto")}>
        Denunciar conteúdo
      </Botao>
    );
  }
  return (
    <form
      className="flex flex-col gap-3"
      onSubmit={(evento) => {
        evento.preventDefault();
        denunciar(alvoTipo, alvoId, String(new FormData(evento.currentTarget).get("motivo")));
        setEtapa("enviado");
      }}
    >
      <AreaTexto id="motivo" name="motivo" rotulo="O que há de errado?" required />
      <div className="flex gap-2">
        <Botao type="submit" variante="secundario">
          Enviar denúncia
        </Botao>
        <Botao variante="texto" onClick={() => setEtapa("fechado")}>
          Cancelar
        </Botao>
      </div>
    </form>
  );
}
