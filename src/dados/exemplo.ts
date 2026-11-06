import type { CampoVisivel, Estado, Negocio, Perfil, Visibilidade } from "../dominio/tipos.ts";

export const VERSAO_ESTADO = 1;
export const VERSAO_TERMO = "0.1-provisoria";

// Todos os dados são fictícios. O DDD 00 não existe, então nenhum telefone chega a uma pessoa real.
function visibilidade(parcial: Partial<Record<CampoVisivel, Visibilidade>> = {}): Record<CampoVisivel, Visibilidade> {
  return {
    telefone_whatsapp: "ministerio",
    nivel: "ministerio",
    area: "membros",
    resumo: "membros",
    experiencias: "ministerio",
    disponibilidade: "ministerio",
    linkedin_url: "membros",
    buscando: "ministerio",
    ...parcial,
  };
}

export const ID_MEMBRO = "u-membro";
export const ID_VOLUNTARIO = "u-voluntario";
export const ID_COORDENACAO = "u-coordenacao";
export const ID_PESSOA_NOVA = "u-pessoa-nova";

export function criarEstadoInicial(agora: Date): Estado {
  const diasAtras = (dias: number) => new Date(agora.getTime() - dias * 86_400_000).toISOString();
  const diasFrente = (dias: number) => new Date(agora.getTime() + dias * 86_400_000).toISOString();

  const perfil = (dados: Partial<Perfil> & Pick<Perfil, "id" | "nome" | "area" | "nivel">): Perfil => ({
    telefone_whatsapp: "(00) 90000-0000",
    maior_de_18: true,
    o_que_busca: "Trabalho",
    resumo: "Perfil fictício para o teste.",
    experiencias: ["Experiência de exemplo"],
    buscando: false,
    modo_discreto: false,
    disponibilidade: { turno: "", cnh: "", bairro: "" },
    linkedin_url: "",
    visibilidade: visibilidade(),
    papel: "membro",
    situacao_cadastro: "aprovado",
    onboarding_concluido: true,
    perfil_de_teste: false,
    criado_em: diasAtras(120),
    atualizado_em: diasAtras(20),
    ...dados,
  });

  const perfis: Perfil[] = [
    perfil({ id: ID_MEMBRO, nome: "Ana Exemplo", nivel: "operacional", area: "Administrativo", papel: "membro", perfil_de_teste: true, buscando: true, telefone_whatsapp: "(00) 90000-0001", resumo: "Auxiliar administrativa em busca de recolocação (perfil fictício).", disponibilidade: { turno: "Manhã", cnh: "B", bairro: "Centro" } }),
    perfil({ id: ID_VOLUNTARIO, nome: "Bruno Exemplo", nivel: "gestao", area: "Recursos humanos", papel: "voluntario", perfil_de_teste: true, telefone_whatsapp: "(00) 90000-0002" }),
    perfil({ id: ID_COORDENACAO, nome: "Carla Exemplo", nivel: "gestao", area: "Recursos humanos", papel: "coordenacao", perfil_de_teste: true, telefone_whatsapp: "(00) 90000-0003" }),
    perfil({ id: "u-davi", nome: "Davi Exemplo", nivel: "tecnico", area: "Tecnologia", buscando: true, modo_discreto: true, telefone_whatsapp: "(00) 90000-0004", resumo: "Está empregado e busca oportunidade em modo discreto." }),
    perfil({ id: "u-elisa", nome: "Elisa Exemplo", nivel: "executivo", area: "Diretoria financeira", buscando: true, telefone_whatsapp: "(00) 90000-0005", resumo: "Perfil executivo: só a coordenação enxerga." }),
    perfil({ id: "u-fabio", nome: "Fábio Exemplo", nivel: "operacional", area: "Logística", buscando: true, telefone_whatsapp: "(00) 90000-0006", visibilidade: visibilidade({ telefone_whatsapp: "so_eu", area: "ministerio", resumo: "so_eu" }), disponibilidade: { turno: "Noite", cnh: "D", bairro: "Vila Exemplo" } }),
    perfil({ id: "u-gabi", nome: "Gabi Exemplo", nivel: "operacional", area: "Atendimento", situacao_cadastro: "pendente", telefone_whatsapp: "(00) 90000-0007", criado_em: diasAtras(1) }),
    perfil({ id: "u-hugo", nome: "Hugo Exemplo", nivel: "tecnico", area: "Contabilidade", situacao_cadastro: "pendente", telefone_whatsapp: "(00) 90000-0008", criado_em: diasAtras(2) }),
  ];

  const negocio = (dados: Partial<Negocio> & Pick<Negocio, "id" | "dono_id" | "nome" | "categoria" | "bairro">): Negocio => ({
    descricao: `${dados.nome} é um negócio fictício criado para este teste.`,
    whatsapp: "(00) 90000-0100",
    instagram: "@exemplo",
    status: "publicado",
    motivo_rejeicao: null,
    revisado_por: ID_VOLUNTARIO,
    revisado_em: diasAtras(30),
    atualizado_em: diasAtras(30),
    ...dados,
  });

  const negocios: Negocio[] = [
    negocio({ id: "n1", dono_id: ID_MEMBRO, nome: "Doces Exemplo", categoria: "Alimentação", bairro: "Centro", descricao: "Bolos e doces por encomenda para festas e eventos (exemplo)." }),
    negocio({ id: "n2", dono_id: "u-davi", nome: "Padaria Exemplo", categoria: "Alimentação", bairro: "Vila Exemplo", descricao: "Pães artesanais e café da manhã (exemplo)." }),
    negocio({ id: "n3", dono_id: "u-fabio", nome: "Mudanças Exemplo", categoria: "Serviços", bairro: "Vila Exemplo", descricao: "Pequenos fretes e mudanças (exemplo).", atualizado_em: diasAtras(120), revisado_em: diasAtras(120) }),
    negocio({ id: "n4", dono_id: ID_VOLUNTARIO, nome: "Contabilidade Exemplo", categoria: "Serviços", bairro: "Centro", descricao: "Abertura de MEI e declaração anual (exemplo)." }),
    negocio({ id: "n5", dono_id: "u-elisa", nome: "Salão Exemplo", categoria: "Beleza", bairro: "Jardim Exemplo", descricao: "Corte, escova e manicure (exemplo)." }),
    negocio({ id: "n6", dono_id: ID_COORDENACAO, nome: "Reformas Exemplo", categoria: "Reformas", bairro: "Jardim Exemplo", descricao: "Pintura e pequenos reparos (exemplo).", atualizado_em: diasAtras(100), revisado_em: diasAtras(100) }),
    negocio({ id: "n7", dono_id: "u-fabio", nome: "Aulas Exemplo", categoria: "Educação", bairro: "Centro", status: "em_revisao", revisado_por: null, revisado_em: null, atualizado_em: diasAtras(1), descricao: "Reforço escolar de matemática (exemplo)." }),
    negocio({ id: "n8", dono_id: "u-davi", nome: "Investimentos Exemplo", categoria: "Serviços", bairro: "Centro", status: "rejeitado", motivo_rejeicao: "Os termos de uso proíbem oportunidades de investimento.", atualizado_em: diasAtras(10), descricao: "Cadastro de exemplo rejeitado na revisão." }),
  ];

  const CATHO = "https://www.catho.com.br/vagas/";
  const LINKEDIN = "https://www.linkedin.com/jobs/";
  const vaga = (id: string, titulo: string, nivel: Estado["vagas"][number]["nivel"], extra: Partial<Estado["vagas"][number]> = {}): Estado["vagas"][number] => ({
    id,
    titulo,
    empresa: "Empresa Exemplo",
    nivel,
    tipo_contrato: "CLT",
    modalidade: "presencial",
    bairro_cidade: "Centro",
    descricao: "Vaga fictícia criada para este teste. Não é uma oportunidade real.",
    link_externo: null,
    origem: "interna",
    status: "publicado",
    motivo_rejeicao: null,
    curador_id: ID_VOLUNTARIO,
    publicada_em: diasAtras(5),
    expira_em: diasFrente(30),
    ...extra,
  });

  const vagas = [
    vaga("v1", "Auxiliar administrativo (exemplo)", "operacional"),
    vaga("v2", "Atendente de loja (exemplo)", "operacional", { modalidade: "presencial", bairro_cidade: "Vila Exemplo", publicada_em: diasAtras(2) }),
    vaga("v3", "Assistente de contabilidade (exemplo)", "tecnico", { modalidade: "hibrido", publicada_em: diasAtras(40) }),
    vaga("v4", "Coordenador de equipe (exemplo)", "gestao", { publicada_em: diasAtras(40) }),
    vaga("v5", "Motorista de entregas (exemplo)", "operacional", { status: "em_revisao", publicada_em: null, curador_id: "u-davi" }),
    vaga("v6", "Auxiliar de logística (externa, exemplo)", "operacional", { origem: "externa", link_externo: CATHO, empresa: "Publicada na Catho" }),
    vaga("v7", "Recepcionista (externa, exemplo)", "operacional", { origem: "externa", link_externo: CATHO, empresa: "Publicada na Catho", publicada_em: diasAtras(70) }),
    vaga("v8", "Analista de dados (externa, exemplo)", "tecnico", { origem: "externa", link_externo: LINKEDIN, empresa: "Publicada no LinkedIn", modalidade: "remoto" }),
    vaga("v9", "Gerente comercial (externa, exemplo)", "gestao", { origem: "externa", link_externo: LINKEDIN, empresa: "Publicada no LinkedIn", modalidade: "hibrido" }),
    vaga("v10", "Estagiário de marketing (externa, exemplo)", "operacional", { origem: "externa", link_externo: CATHO, empresa: "Publicada na Catho", tipo_contrato: "Estágio", status: "em_revisao", publicada_em: null, curador_id: "u-davi" }),
  ];

  return {
    versao: VERSAO_ESTADO,
    sessao: { usuario_id: null },
    perfis,
    consentimentos: perfis
      .filter((p) => p.situacao_cadastro === "aprovado")
      .map((p) => ({ id: `c-${p.id}`, usuario_id: p.id, tipo: "lgpd_dados_sensiveis" as const, versao: VERSAO_TERMO, aceito_em: p.criado_em, revogado_em: null })),
    negocios,
    vagas,
    interesses_vaga: [
      { id: "i1", vaga_id: "v1", usuario_id: ID_MEMBRO, status: "indicado", criado_em: diasAtras(3) },
      { id: "i2", vaga_id: "v2", usuario_id: "u-fabio", status: "interessado", criado_em: diasAtras(1) },
      { id: "i3", vaga_id: "v3", usuario_id: "u-davi", status: "contratado", criado_em: diasAtras(35) },
    ],
    indicacoes: [
      { id: "ind1", interesse_id: "i1", voluntario_id: ID_VOLUNTARIO, situacao: "Atuou por 3 anos em escritório (exemplo).", tarefa: "Organizava documentos e atendimento (exemplo).", acao: "Reorganizou o arquivo da empresa (exemplo).", resultado: "Reduziu o tempo de busca de documentos (exemplo).", enviada_em: diasAtras(2) },
    ],
    progresso_trilha: [
      ...["rec-1", "rec-2"].map((item_id) => ({ id: `p-${item_id}`, usuario_id: ID_MEMBRO, trilha_id: "recolocacao", item_id, status: "concluido" as const, certificado_registrado: false, concluido_em: diasAtras(10) })),
      { id: "p-rec-3", usuario_id: ID_MEMBRO, trilha_id: "recolocacao", item_id: "rec-3", status: "fazendo" as const, certificado_registrado: false, concluido_em: null },
      ...["emp-1", "emp-2", "emp-3", "emp-4"].map((item_id) => ({ id: `p-f-${item_id}`, usuario_id: "u-fabio", trilha_id: "empreendedor", item_id, status: "concluido" as const, certificado_registrado: true, concluido_em: diasAtras(15) })),
    ],
    tentativas_simulado: [],
    resultados_externos: [],
    mentorias: [
      { id: "m1", mentor_id: ID_VOLUNTARIO, mentorado_id: ID_MEMBRO, area: "Recolocação", inicio: diasAtras(20), fim_previsto: diasFrente(70), status: "ativa" },
      { id: "m2", mentor_id: ID_COORDENACAO, mentorado_id: "u-fabio", area: "Empreendedorismo", inicio: diasAtras(120), fim_previsto: diasAtras(30), status: "encerrada" },
    ],
    resultados: [
      { id: "r1", usuario_id: "u-davi", tipo: "contratacao", vaga_id: "v3", data: diasAtras(8), observacao: "Registro de exemplo." },
      { id: "r2", usuario_id: "u-fabio", tipo: "negocio_fechado", vaga_id: null, data: diasAtras(12), observacao: "Registro de exemplo." },
    ],
    denuncias: [
      { id: "d1", autor_id: "u-fabio", alvo_tipo: "negocio", alvo_id: "n5", motivo: "Denúncia de exemplo: informação desatualizada.", status: "aberta", tratada_por: null, tratada_em: null },
    ],
    auditoria: [
      { id: "a1", ator_id: ID_VOLUNTARIO, acao: "publicar", entidade: "negocio", entidade_id: "n1", em: diasAtras(30) },
      { id: "a2", ator_id: ID_VOLUNTARIO, acao: "rejeitar", entidade: "negocio", entidade_id: "n8", em: diasAtras(10) },
      { id: "a3", ator_id: ID_VOLUNTARIO, acao: "indicar", entidade: "interesse", entidade_id: "i1", em: diasAtras(2) },
    ],
  };
}
