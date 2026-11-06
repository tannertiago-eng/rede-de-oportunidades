import type { NextConfig } from "next";

// Protótipo: exportação estática para o GitHub Pages, sem servidor.
// Na versão de produção, o desenvolvedor retira output/basePath e restaura
// o proxy e os cabeçalhos (ver para-o-desenvolvedor/README.md).
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
