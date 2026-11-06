import type { SVGProps } from "react";

// Ícones de traço fino (1,5 px), desenhados à mão: sem biblioteca externa.
const caminhos = {
  inicio: (
    <>
      <path d="M4 10.5 12 4l8 6.5" />
      <path d="M6 9v10.5h12V9" />
      <path d="M10 19.5v-5h4v5" />
    </>
  ),
  vitrine: (
    <>
      <path d="M4 9.5 5.5 4.5h13L20 9.5" />
      <path d="M4 9.5c0 1.4 1.2 2.5 2.7 2.5s2.6-1.1 2.6-2.5c0 1.4 1.2 2.5 2.7 2.5s2.7-1.1 2.7-2.5c0 1.4 1.1 2.5 2.6 2.5S20 10.9 20 9.5" />
      <path d="M5.5 12v7.5h13V12" />
      <path d="M10 19.5V15h4v4.5" />
    </>
  ),
  vagas: (
    <>
      <rect x="3.75" y="7.5" width="16.5" height="12" rx="2" />
      <path d="M9 7.5V6a1.5 1.5 0 0 1 1.5-1.5h3A1.5 1.5 0 0 1 15 6v1.5" />
      <path d="M3.75 12.5h16.5" />
    </>
  ),
  trilhas: (
    <>
      <circle cx="6" cy="18" r="2" />
      <circle cx="18" cy="6" r="2" />
      <path d="M8 18h7.5a2.5 2.5 0 0 0 0-5h-7a2.5 2.5 0 0 1 0-5H16" />
    </>
  ),
  perfil: (
    <>
      <circle cx="12" cy="8.5" r="3.75" />
      <path d="M4.75 19.5c.9-3.4 3.8-5.5 7.25-5.5s6.35 2.1 7.25 5.5" />
    </>
  ),
  ministerio: (
    <>
      <circle cx="8.5" cy="9" r="3" />
      <circle cx="16.5" cy="9.5" r="2.5" />
      <path d="M3.5 19c.6-3 2.6-4.75 5-4.75s4.4 1.75 5 4.75" />
      <path d="M15.5 14.4c2.3-.3 4.2 1.4 4.75 4.1" />
    </>
  ),
  avaliacao: (
    <>
      <rect x="5" y="4.5" width="14" height="15.5" rx="2" />
      <path d="m8.5 9.5 1.2 1.2 2-2.2M8.5 15l1.2 1.2 2-2.2M14 10h2M14 15.5h2" />
    </>
  ),
  sol: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2.75v2M12 19.25v2M2.75 12h2M19.25 12h2M5.5 5.5l1.4 1.4M17.1 17.1l1.4 1.4M5.5 18.5l1.4-1.4M17.1 6.9l1.4-1.4" />
    </>
  ),
  lua: <path d="M19.5 14.5A7.5 7.5 0 0 1 9.5 4.5a7.5 7.5 0 1 0 10 10Z" />,
  seta: <path d="m9 5.5 6.5 6.5L9 18.5" />,
} as const;

export type NomeIcone = keyof typeof caminhos;

type Props = SVGProps<SVGSVGElement> & {
  nome: NomeIcone;
  tamanho?: number;
  // Sem rótulo, o ícone é decorativo e fica oculto para leitores de tela.
  rotulo?: string;
};

export function Icone({ nome, tamanho = 24, rotulo, ...resto }: Props) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={tamanho}
      height={tamanho}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      role={rotulo ? "img" : undefined}
      aria-label={rotulo}
      aria-hidden={rotulo ? undefined : true}
      {...resto}
    >
      {caminhos[nome]}
    </svg>
  );
}
