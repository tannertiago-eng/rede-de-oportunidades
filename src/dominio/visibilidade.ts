import { ehCoordenacao, ehMinisterio } from "./permissoes.ts";
import type { CampoVisivel, Papel, Perfil } from "./tipos.ts";

export type Visitante = { id: string; papel: Papel };

export type PerfilVisivel = {
  id: string;
  nome: string;
  campos: Partial<Pick<Perfil, CampoVisivel>>;
};

const CAMPOS: CampoVisivel[] = [
  "telefone_whatsapp",
  "nivel",
  "area",
  "resumo",
  "experiencias",
  "disponibilidade",
  "linkedin_url",
  "buscando",
];

function liberado(perfil: Perfil, campo: CampoVisivel, visitante: Visitante) {
  // Regra 3: em modo discreto, "buscando" só aparece para a coordenação.
  if (campo === "buscando" && perfil.modo_discreto) return false;
  // Disponibilidade só existe para o nível operacional.
  if (campo === "disponibilidade" && perfil.nivel !== "operacional") return false;
  const nivel = perfil.visibilidade[campo];
  if (nivel === "membros") return true;
  return nivel === "ministerio" && ehMinisterio(visitante.papel);
}

// O que um visitante pode ver de um perfil. null = o perfil não aparece para ele.
// Espelha as regras 2 a 5 do CLAUDE.md; a versão real deve ficar no banco (função ver_perfis).
export function verPerfil(perfil: Perfil, visitante: Visitante): PerfilVisivel | null {
  const proprio = perfil.id === visitante.id;
  const coordenacao = ehCoordenacao(visitante.papel);

  if (!proprio && !coordenacao) {
    if (perfil.situacao_cadastro !== "aprovado") return null;
    if (perfil.nivel === "executivo") return null; // Regra 4
    if (!perfil.maior_de_18) return null; // Regra 5
  }

  const campos: PerfilVisivel["campos"] = {};
  for (const campo of CAMPOS) {
    if (proprio || coordenacao || liberado(perfil, campo, visitante)) {
      Object.assign(campos, { [campo]: perfil[campo] });
    }
  }
  return { id: perfil.id, nome: perfil.nome, campos };
}
