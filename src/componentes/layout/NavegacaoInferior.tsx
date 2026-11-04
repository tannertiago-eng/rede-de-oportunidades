"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icone, type NomeIcone } from "@/componentes/ui/Icone";

const itens: { href: string; rotulo: string; icone: NomeIcone }[] = [
  { href: "/inicio", rotulo: "Início", icone: "inicio" },
  { href: "/vagas", rotulo: "Vagas", icone: "vagas" },
  { href: "/vitrine", rotulo: "Vitrine", icone: "vitrine" },
  { href: "/trilhas", rotulo: "Trilhas", icone: "trilhas" },
  { href: "/perfil", rotulo: "Perfil", icone: "perfil" },
];

export function NavegacaoInferior() {
  const caminho = usePathname();

  return (
    <nav
      aria-label="Navegação principal"
      className="fixed inset-x-0 bottom-0 border-t border-linha bg-superficie pb-[env(safe-area-inset-bottom)]"
    >
      <ul className="mx-auto grid max-w-xl grid-cols-5">
        {itens.map((item) => {
          const ativo = caminho === item.href || caminho.startsWith(`${item.href}/`);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={ativo ? "page" : undefined}
                className={`flex min-h-14 flex-col items-center justify-center gap-0.5 text-xs ${
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
