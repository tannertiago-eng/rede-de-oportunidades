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

// No celular fica embaixo da tela; no computador vira menu lateral.
export function NavegacaoPrincipal() {
  const caminho = usePathname();
  const usuario = useUsuario();
  const lista = ehMinisterio(usuario.papel) ? [...itens, itemMinisterio] : itens;

  return (
    <nav
      aria-label="Navegação principal"
      className="fixed inset-x-0 bottom-0 z-10 border-t border-linha bg-superficie pb-[env(safe-area-inset-bottom)] lg:inset-x-auto lg:top-[45px] lg:left-0 lg:w-60 lg:border-t-0 lg:border-r lg:pb-0"
    >
      <p className="hidden px-5 pt-6 pb-4 font-titulo text-xl lg:block">Rede de Oportunidades</p>
      <ul className="mx-auto flex max-w-xl lg:max-w-none lg:flex-col lg:gap-1 lg:px-3">
        {lista.map((item) => {
          const ativo = caminho === item.href || caminho.startsWith(`${item.href}/`);
          return (
            <li key={item.href} className="min-w-0 flex-1 lg:flex-none">
              <Link
                href={item.href}
                aria-current={ativo ? "page" : undefined}
                className={`flex min-h-14 flex-col items-center justify-center gap-0.5 text-[11px] leading-tight lg:min-h-11 lg:flex-row lg:justify-start lg:gap-3 lg:rounded-botao lg:px-3 lg:text-base lg:hover:bg-secundaria lg:hover:text-texto ${
                  ativo ? "font-semibold text-primaria lg:bg-secundaria lg:text-texto" : "text-texto-2"
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
