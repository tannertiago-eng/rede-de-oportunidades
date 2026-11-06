"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEstado, useHidratado } from "@/dados/ganchos";
import { ROTULO_PAPEL } from "@/dominio/rotulos";

// Número que recebe as sugestões do teste. Vazio: o WhatsApp pede para escolher o contato.
const NUMERO_SUGESTOES = process.env.NEXT_PUBLIC_WHATSAPP_SUGESTOES ?? "";

export function FaixaPrototipo() {
  const caminho = usePathname();
  const hidratado = useHidratado();
  const estado = useEstado();
  const perfil = hidratado ? estado.perfis.find((p) => p.id === estado.sessao.usuario_id) : undefined;
  const papel = perfil ? ROTULO_PAPEL[perfil.papel] : "sem login";

  const mensagem = `Sugestão sobre o protótipo da Rede de Oportunidades\nTela: ${caminho}\nPapel: ${papel}\n\nO que encontrei: `;
  const linkSugestao = `https://wa.me/${NUMERO_SUGESTOES}?text=${encodeURIComponent(mensagem)}`;

  return (
    <div className="border-b border-linha bg-secundaria text-sm text-texto lg:sticky lg:top-0 lg:z-20">
      <div className="mx-auto flex w-full max-w-xl items-center justify-between gap-2 px-4 md:max-w-none md:px-6">
        <p className="py-1 leading-tight">
          <strong className="font-semibold">Protótipo</strong> · dados fictícios · {papel}
        </p>
        <div className="flex shrink-0 items-center">
          <a href={linkSugestao} target="_blank" rel="noopener noreferrer" className="flex min-h-11 items-center px-2 font-semibold underline">
            Sugestão
          </a>
          <Link href="/prototipo" className="flex min-h-11 items-center px-2 font-semibold underline">
            Teste
          </Link>
        </div>
      </div>
    </div>
  );
}
