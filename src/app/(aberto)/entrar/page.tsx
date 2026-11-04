import type { Metadata } from "next";
import { Botao } from "@/componentes/ui/Botao";
import { Campo } from "@/componentes/ui/Campo";

export const metadata: Metadata = { title: "Entrar" };

// Página aberta: não menciona a igreja (CLAUDE.md, seção 10).
// Fase 0: só o layout. O envio do código por e-mail chega na Fase 1.
export default function PaginaEntrar() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-sm flex-col justify-center px-4 py-10">
      <h1 className="text-4xl">Rede de Oportunidades</h1>
      <p className="mt-2 text-texto-2">Entre com seu e-mail. Enviaremos um código de 6 dígitos.</p>

      <form className="mt-8 flex flex-col gap-5">
        <Campo
          id="email"
          name="email"
          type="email"
          rotulo="E-mail"
          autoComplete="email"
          inputMode="email"
          placeholder="voce@exemplo.com"
          dica="O login chega na Fase 1."
          disabled
        />
        <Botao type="submit" largo disabled>
          Enviar código
        </Botao>
      </form>
    </main>
  );
}
