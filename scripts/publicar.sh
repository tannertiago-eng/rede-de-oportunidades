#!/usr/bin/env bash
# Publica o protótipo no GitHub Pages (branch gh-pages). Uso: npm run publicar
set -euo pipefail
cd "$(dirname "$0")/.."

export NEXT_PUBLIC_BASE_PATH=/rede-de-oportunidades
# Número que recebe as sugestões: fica em .env.publicar (fora do git), com DDI, sem símbolos.
[ -f .env.publicar ] && set -a && . ./.env.publicar && set +a

npm run verificar
rm -rf out
npm run build
touch out/.nojekyll # Sem isso, o GitHub Pages ignora a pasta _next.

remoto=$(git remote get-url origin)
versao=$(git rev-parse --short HEAD)
cd out
git init -q -b gh-pages
git add -A
git commit -q -m "Publica protótipo ($versao)"
git push -q --force "$remoto" gh-pages
rm -rf .git
echo "Publicado: https://tannertiago-eng.github.io/rede-de-oportunidades/"
