import type {
  CampoVisivel,
  Modalidade,
  Nivel,
  Papel,
  StatusConteudo,
  StatusInteresse,
  StatusProgresso,
  Visibilidade,
} from "./tipos.ts";

export const ROTULO_PAPEL: Record<Papel, string> = {
  membro: "Membro",
  voluntario: "Voluntário",
  coordenacao: "Coordenação",
};

export const ROTULO_NIVEL: Record<Nivel, string> = {
  operacional: "Operacional",
  tecnico: "Técnico",
  gestao: "Gestão",
  executivo: "Executivo",
};

export const ROTULO_VISIBILIDADE: Record<Visibilidade, string> = {
  so_eu: "Só eu",
  ministerio: "Ministério",
  membros: "Membros",
};

export const ROTULO_CAMPO: Record<CampoVisivel, string> = {
  telefone_whatsapp: "WhatsApp",
  nivel: "Nível",
  area: "Área",
  resumo: "Resumo",
  experiencias: "Experiências",
  disponibilidade: "Disponibilidade",
  linkedin_url: "LinkedIn",
  buscando: "Buscando oportunidade",
};

export const ROTULO_MODALIDADE: Record<Modalidade, string> = {
  presencial: "Presencial",
  hibrido: "Híbrido",
  remoto: "Remoto",
};

export const ROTULO_STATUS: Record<StatusConteudo, string> = {
  rascunho: "Rascunho",
  em_revisao: "Em revisão",
  publicado: "Publicado",
  rejeitado: "Rejeitado",
  arquivado: "Arquivado",
};

export const ROTULO_INTERESSE: Record<StatusInteresse, string> = {
  interessado: "Interesse registrado",
  indicado: "Indicado pelo ministério",
  entrevista: "Em entrevista",
  contratado: "Contratado",
  nao_seguiu: "Não seguiu",
};

export const ROTULO_PROGRESSO: Record<StatusProgresso, string> = {
  a_fazer: "A fazer",
  fazendo: "Fazendo",
  concluido: "Concluído",
};

export function textoDoCampo(valor: unknown) {
  if (typeof valor === "boolean") return valor ? "Sim" : "Não";
  if (Array.isArray(valor)) return valor.join("; ");
  if (valor && typeof valor === "object") return Object.values(valor).filter(Boolean).join(" · ");
  return String(valor ?? "");
}
