// Tipos do domínio. Os nomes acompanham as tabelas e colunas do esquema (CLAUDE.md, seção 5)
// para que a troca dos dados fictícios pelo Supabase mude o mínimo possível.

export type Papel = "membro" | "voluntario" | "coordenacao";
export type Nivel = "operacional" | "tecnico" | "gestao" | "executivo";
export type Visibilidade = "so_eu" | "ministerio" | "membros";
export type CampoVisivel =
  | "telefone_whatsapp"
  | "nivel"
  | "area"
  | "resumo"
  | "experiencias"
  | "disponibilidade"
  | "linkedin_url"
  | "buscando";
export type SituacaoCadastro = "pendente" | "aprovado" | "recusado";

export type Perfil = {
  id: string;
  nome: string;
  telefone_whatsapp: string;
  maior_de_18: boolean;
  nivel: Nivel;
  area: string;
  o_que_busca: string;
  resumo: string;
  experiencias: string[];
  buscando: boolean;
  modo_discreto: boolean;
  disponibilidade: { turno: string; cnh: string; bairro: string };
  linkedin_url: string;
  visibilidade: Record<CampoVisivel, Visibilidade>;
  papel: Papel;
  situacao_cadastro: SituacaoCadastro;
  onboarding_concluido: boolean;
  // Perfil pronto para o seletor de papéis do protótipo.
  perfil_de_teste: boolean;
  criado_em: string;
  atualizado_em: string;
};

export type Consentimento = {
  id: string;
  usuario_id: string;
  tipo: "lgpd_dados_sensiveis";
  versao: string;
  aceito_em: string;
  revogado_em: string | null;
};

export type StatusConteudo = "rascunho" | "em_revisao" | "publicado" | "rejeitado" | "arquivado";

export type Negocio = {
  id: string;
  dono_id: string;
  nome: string;
  categoria: string;
  descricao: string;
  bairro: string;
  whatsapp: string;
  instagram: string;
  status: StatusConteudo;
  motivo_rejeicao: string | null;
  revisado_por: string | null;
  revisado_em: string | null;
  atualizado_em: string;
};

export type TipoContrato = "CLT" | "PJ" | "Estágio" | "Temporário";
export type Modalidade = "presencial" | "hibrido" | "remoto";

export type Vaga = {
  id: string;
  titulo: string;
  empresa: string;
  nivel: Nivel;
  tipo_contrato: TipoContrato;
  modalidade: Modalidade;
  bairro_cidade: string;
  descricao: string;
  link_externo: string | null;
  origem: "interna" | "externa";
  status: StatusConteudo;
  motivo_rejeicao: string | null;
  curador_id: string | null;
  publicada_em: string | null;
  expira_em: string;
};

export type StatusInteresse = "interessado" | "indicado" | "entrevista" | "contratado" | "nao_seguiu";

export type InteresseVaga = {
  id: string;
  vaga_id: string;
  usuario_id: string;
  status: StatusInteresse;
  criado_em: string;
};

export type Indicacao = {
  id: string;
  interesse_id: string;
  voluntario_id: string | null;
  situacao: string;
  tarefa: string;
  acao: string;
  resultado: string;
  enviada_em: string;
};

export type ItemTrilha = {
  id: string;
  titulo: string;
  provedor: string;
  url: string;
  tipo: "curso" | "teste" | "leitura";
  carga_horaria_aprox: number | null;
};

export type Trilha = {
  id: string;
  nome: string;
  publico: string;
  descricao: string;
  itens: ItemTrilha[];
};

export type StatusProgresso = "a_fazer" | "fazendo" | "concluido";

export type ProgressoTrilha = {
  id: string;
  usuario_id: string;
  trilha_id: string;
  item_id: string;
  status: StatusProgresso;
  certificado_registrado: boolean;
  concluido_em: string | null;
};

export type Questao = {
  id: string;
  enunciado: string;
  alternativas: string[];
  correta: number;
  explicacao: string;
};

export type Simulado = {
  id: string;
  tipo: "logica" | "matematica";
  titulo: string;
  versao: string;
  tempo_limite_min: number;
  questoes: Questao[];
};

export type TentativaSimulado = {
  id: string;
  usuario_id: string;
  simulado_id: string;
  // Índice da alternativa por questão; null = em branco.
  respostas: Record<string, number | null>;
  acertos: number;
  total: number;
  iniciada_em: string;
  finalizada_em: string | null;
  compartilhar_com_ministerio: boolean;
};

export type ResultadoExterno = {
  id: string;
  usuario_id: string;
  tipo: "EF SET";
  nivel_cefr: string;
  nota: string;
  compartilhar_com_ministerio: boolean;
};

export type Mentoria = {
  id: string;
  mentor_id: string;
  mentorado_id: string;
  area: string;
  inicio: string;
  fim_previsto: string;
  status: "ativa" | "encerrada";
};

export type Resultado = {
  id: string;
  usuario_id: string | null;
  tipo: "contratacao" | "negocio_fechado";
  vaga_id: string | null;
  data: string;
  observacao: string;
};

export type Denuncia = {
  id: string;
  autor_id: string | null;
  alvo_tipo: "negocio" | "vaga";
  alvo_id: string;
  motivo: string;
  status: "aberta" | "procedente" | "improcedente";
  tratada_por: string | null;
  tratada_em: string | null;
};

export type RegistroAuditoria = {
  id: string;
  ator_id: string | null;
  acao: string;
  entidade: string;
  entidade_id: string;
  em: string;
};

export type Estado = {
  versao: number;
  sessao: { usuario_id: string | null };
  perfis: Perfil[];
  consentimentos: Consentimento[];
  negocios: Negocio[];
  vagas: Vaga[];
  interesses_vaga: InteresseVaga[];
  indicacoes: Indicacao[];
  progresso_trilha: ProgressoTrilha[];
  tentativas_simulado: TentativaSimulado[];
  resultados_externos: ResultadoExterno[];
  mentorias: Mentoria[];
  resultados: Resultado[];
  denuncias: Denuncia[];
  auditoria: RegistroAuditoria[];
};
