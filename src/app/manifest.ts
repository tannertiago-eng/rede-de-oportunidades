import type { MetadataRoute } from "next";

// Exigido pela exportação estática do protótipo.
export const dynamic = "force-static";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Rede de Oportunidades",
    short_name: "Oportunidades",
    description: "Trabalho, negócios e crescimento profissional.",
    lang: "pt-BR",
    start_url: `${basePath}/`,
    scope: `${basePath}/`,
    display: "standalone",
    background_color: "#F5F1E9",
    theme_color: "#437066",
    icons: [
      { src: `${basePath}/icones/icone-192.png`, sizes: "192x192", type: "image/png", purpose: "any" },
      { src: `${basePath}/icones/icone-512.png`, sizes: "512x512", type: "image/png", purpose: "any" },
      { src: `${basePath}/icones/icone-maskable-512.png`, sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
