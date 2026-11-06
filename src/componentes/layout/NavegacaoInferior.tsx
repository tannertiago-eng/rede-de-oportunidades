"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icone, type NomeIcone } from "@/componentes/ui/Icone";
import { useUsuario } from "@/dados/ganchos";
import { ehMinisterio } from "@/dominio/permissoes";

const itens: { href: string; rotulo: string; icone: NomeIcone }[] = [
  { href: "/inicio", rotulo: "Início", icone: "inicio" },
  { href: "/vagas", rotulo: "Vagas", icone: "vagas" },
  { href: "/vitrine", rotulo: "Vitrine", icone: "vitrine" },
  { href: "/trilhas", rotulo: "Trilhas", icone: "trilhas" },
  { href: "/perfil", rotulo: "Perfil", icone: "perfil" },
];

const itemMinisterio = { href: "/ministerio", rotulo: "Ministério", icone: "ministerio" } as const;

export function NavegacaoInferior() {
  const caminho = usePathname();
  const usuario = useUsuario();
  const lista = ehMinisterio(usuario.papel) ? [...itens, itemMinisterio] : itens;

  return (
    <nav
      aria-label="Navegação principal"
      className="fixed inset-x-0 bottom-0 z-10 border-t border-linha bg-superficie pb-[env(safe-area-inset-bottom)]"
    >
      <ul className="mx-auto flex max-w-xl">
        {lista.map((item) => {
          const ativo = caminho === item.href || caminho.startsWith(`${item.href}/`);
          return (
            <li key={item.href} className="min-w-0 flex-1">
              <Link
                href={item.href}
                aria-current={ativo ? "page" : undefined}
                className={`flex min-h-14 flex-col items-center justify-center gap-0.5 text-[11px] leading-tight ${
                  ativo ? "font-semibold text-primaria" : "text-texto-2"
                }`}
              >
                <Icone nome={item.icone} />
                {item.rotulo}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
