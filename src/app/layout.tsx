import type { Metadata, Viewport } from "next";
import { Kanit, Martel_Sans } from "next/font/google";
import "./globals.css";

// next/font baixa as fontes no build e serve do próprio site:
// o navegador do membro não faz requisição ao Google.
const kanit = Kanit({
  variable: "--fonte-kanit",
  weight: ["300", "400", "500"],
  subsets: ["latin"],
  display: "swap",
});

const martelSans = Martel_Sans({
  variable: "--fonte-martel",
  weight: ["400", "600"],
  subsets: ["latin"],
  display: "swap",
});

// Nome neutro: nenhuma página aberta menciona a igreja (CLAUDE.md, seção 10).
export const metadata: Metadata = {
  title: {
    default: "Rede de Oportunidades",
    template: "%s · Rede de Oportunidades",
  },
  description: "Trabalho, negócios e crescimento profissional.",
  applicationName: "Rede de Oportunidades",
  appleWebApp: {
    title: "Oportunidades",
    statusBarStyle: "default",
  },
  // Nada é público: não indexar em buscadores.
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F5F1E9" },
    { media: "(prefers-color-scheme: dark)", color: "#121A18" },
  ],
};

// Aplica o tema escolhido antes da primeira pintura, para não piscar.
// Ver node_modules/next/dist/docs/01-app/02-guides/preventing-flash-before-hydration.md
const scriptTema = `(function(){try{var t=localStorage.getItem("tema");if(t==="claro"||t==="escuro")document.documentElement.setAttribute("data-tema",t)}catch(e){}})()`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${kanit.variable} ${martelSans.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: scriptTema }} />
      </head>
      <body className="min-h-full bg-fundo text-texto">{children}</body>
    </html>
  );
}
