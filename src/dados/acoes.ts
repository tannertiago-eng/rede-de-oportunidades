import type {
  CampoVisivel,
  Denuncia,
  Estado,
  Nivel,
  Papel,
  Perfil,
  StatusInteresse,
  StatusProgresso,
  Vaga,
  Visibilidade,
} from "../dominio/tipos.ts";
import { corrigirSimulado } from "../dominio/simulado.ts";
import { SIMULADOS } from "./conteudo.ts";
import { ID_PESSOA_NOVA, VERSAO_TERMO } from "./exemplo.ts";
import { atualizar } from "./loja.ts";

const novoId = () => crypto.randomUUID();
const agora = () => new Date().toISOString();

function auditar(e: Estado, acao: string, entidade: string, entidade_id: string) {
  e.auditoria.unshift({ id: novoId(), ator_id: e.sessao.usuario_id, acao, entidade, entidade_id, em: agora() });
}

function exigir<T>(valor: T | undefined): T {
  if (valor === undefined) throw new Error("Registro não encontrado");
  return valor;
}

// Para onde a sessão atual deve ir.
export function destinoDaSessao(e: Estado) {
  const perfil = e.perfis.find((p) => p.id === e.sessao.usuario_id);
  if (!perfil) return "/entrar";
  const consentiu = e.consentimentos.some((c) => c.usuario_id === perfil.id && !c.revogado_em);
  if (!consentiu) return "/consentimento";
  if (!perfil.onboarding_concluido) return "/boas-vindas";
  if (perfil.situacao_cadastro !== "aprovado") return "/aguardando";
  return "/inicio";
}

// --- Sessão e entrada ---

export function entrarComo(usuario_id: string) {
  atualizar((e) => {
    e.sessao.usuario_id = usuario_id;
  });
}

export function sair() {
  atualizar((e) => {
    e.sessao.usuario_id = null;
  });
}

export function criarPessoaNova() {
  atualizar((e) => {
    apagarDadosDe(e, ID_PESSOA_NOVA);
    const momento = agora();
    e.perfis.push({
      id: ID_PESSOA_NOVA,
      nome: "Pessoa de Teste",
      telefone_whatsapp: "",
      maior_de_18: true,
      nivel: "operacional",
      area: "",
      o_que_busca: "",
      resumo: "",
      experiencias: [],
      buscando: false,
      modo_discreto: false,
      disponibilidade: { turno: "", cnh: "", bairro: "" },
      linkedin_url: "",
      // Privacidade por padrão: nada liberado até a pessoa escolher.
      visibilidade: {
        telefone_whatsapp: "so_eu",
        nivel: "so_eu",
        area: "so_eu",
        resumo: "so_eu",
        experiencias: "so_eu",
        disponibilidade: "so_eu",
        linkedin_url: "so_eu",
        buscando: "so_eu",
      },
      papel: "membro",
      situacao_cadastro: "pendente",
      onboarding_concluido: false,
      perfil_de_teste: true,
      criado_em: momento,
      atualizado_em: momento,
    });
    e.sessao.usuario_id = ID_PESSOA_NOVA;
  });
}

export function aceitarConsentimento() {
  atualizar((e) => {
    const usuario_id = exigir(e.sessao.usuario_id ?? undefined);
    e.consentimentos.push({ id: novoId(), usuario_id, tipo: "lgpd_dados_sensiveis", versao: VERSAO_TERMO, aceito_em: agora(), revogado_em: null });
    auditar(e, "aceitar_consentimento", "consentimento", usuario_id);
  });
}

export function concluirOnboarding(dados: { nome: string; nivel: Nivel; area: string; o_que_busca: string }) {
  atualizar((e) => {
    const perfil = exigir(e.perfis.find((p) => p.id === e.sessao.usuario_id));
    Object.assign(perfil, dados, { buscando: dados.o_que_busca === "Trabalho", onboarding_concluido: true, atualizado_em: agora() });
  });
}

export function decidirCadastro(usuario_id: string, situacao: "aprovado" | "recusado") {
  atualizar((e) => {
    exigir(e.perfis.find((p) => p.id === usuario_id)).situacao_cadastro = situacao;
    auditar(e, situacao === "aprovado" ? "aprovar_cadastro" : "recusar_cadastro", "perfil", usuario_id);
  });
}

export function definirPapel(usuario_id: string, papel: Papel) {
  atualizar((e) => {
    exigir(e.perfis.find((p) => p.id === usuario_id)).papel = papel;
    auditar(e, `definir_papel_${papel}`, "perfil", usuario_id);
  });
}

// --- Perfil ---

export function salvarPerfil(dados: Partial<Perfil>, visibilidade: Record<CampoVisivel, Visibilidade>) {
  atualizar((e) => {
    const perfil = exigir(e.perfis.find((p) => p.id === e.sessao.usuario_id));
    Object.assign(perfil, dados, { visibilidade, atualizado_em: agora() });
  });
}

// --- Vitrine ---

export type DadosNegocio = { nome: string; categoria: string; descricao: string; bairro: string; whatsapp: string; instagram: string };

// Qualquer edição tira o negócio do ar até nova revisão (nada sem revisão fica visível).
export function salvarNegocio(id: string | null, dados: DadosNegocio, enviar: boolean) {
  atualizar((e) => {
    const dono_id = exigir(e.sessao.usuario_id ?? undefined);
    const status = enviar ? "em_revisao" : "rascunho";
    if (id) {
      const negocio = exigir(e.negocios.find((n) => n.id === id && n.dono_id === dono_id));
      Object.assign(negocio, dados, { status, motivo_rejeicao: null, atualizado_em: agora() });
      auditar(e, enviar ? "enviar_revisao" : "salvar_rascunho", "negocio", id);
    } else {
      const novo = novoId();
      e.negocios.push({ id: novo, dono_id, ...dados, status, motivo_rejeicao: null, revisado_por: null, revisado_em: null, atualizado_em: agora() });
      auditar(e, enviar ? "enviar_revisao" : "salvar_rascunho", "negocio", novo);
    }
  });
}

export function revisarNegocio(id: string, publicar: boolean, motivo = "") {
  atualizar((e) => {
    const negocio = exigir(e.negocios.find((n) => n.id === id));
    Object.assign(negocio, {
      status: publicar ? "publicado" : "rejeitado",
      motivo_rejeicao: publicar ? null : motivo,
      revisado_por: e.sessao.usuario_id,
      revisado_em: agora(),
    });
    auditar(e, publicar ? "publicar" : "rejeitar", "negocio", id);
  });
}

export function arquivarNegocio(id: string) {
  atualizar((e) => {
    exigir(e.negocios.find((n) => n.id === id)).status = "arquivado";
    auditar(e, "arquivar", "negocio", id);
  });
}

// --- Vagas ---

export type DadosVaga = Pick<Vaga, "titulo" | "empresa" | "nivel" | "tipo_contrato" | "modalidade" | "bairro_cidade" | "descricao" | "link_externo">;

export function cadastrarVaga(dados: DadosVaga, publicar: boolean) {
  atualizar((e) => {
    const id = novoId();
    const momento = new Date();
    e.vagas.unshift({
      ...dados,
      id,
      origem: dados.link_externo ? "externa" : "interna",
      status: publicar ? "publicado" : "em_revisao",
      motivo_rejeicao: null,
      curador_id: exigir(e.sessao.usuario_id ?? undefined),
      publicada_em: publicar ? momento.toISOString() : null,
      expira_em: new Date(momento.getTime() + 30 * 86_400_000).toISOString(),
    });
    auditar(e, publicar ? "publicar" : "enviar_revisao", "vaga", id);
  });
}

export function revisarVaga(id: string, publicar: boolean, motivo = "") {
  atualizar((e) => {
    const vaga = exigir(e.vagas.find((v) => v.id === id));
    Object.assign(vaga, {
      status: publicar ? "publicado" : "rejeitado",
      motivo_rejeicao: publicar ? null : motivo,
      publicada_em: publicar ? agora() : null,
    });
    auditar(e, publicar ? "publicar" : "rejeitar", "vaga", id);
  });
}

export function demonstrarInteresse(vaga_id: string) {
  atualizar((e) => {
    const usuario_id = exigir(e.sessao.usuario_id ?? undefined);
    if (e.interesses_vaga.some((i) => i.vaga_id === vaga_id && i.usuario_id === usuario_id)) return;
    e.interesses_vaga.unshift({ id: novoId(), vaga_id, usuario_id, status: "interessado", criado_em: agora() });
  });
}

export function atualizarInteresse(id: string, status: StatusInteresse) {
  atualizar((e) => {
    const interesse = exigir(e.interesses_vaga.find((i) => i.id === id));
    interesse.status = status;
    auditar(e, `interesse_${status}`, "interesse", id);
    const jaRegistrado = e.resultados.some((r) => r.tipo === "contratacao" && r.usuario_id === interesse.usuario_id && r.vaga_id === interesse.vaga_id);
    if (status === "contratado" && !jaRegistrado) {
      e.resultados.unshift({ id: novoId(), usuario_id: interesse.usuario_id, tipo: "contratacao", vaga_id: interesse.vaga_id, data: agora(), observacao: "" });
    }
  });
}

export function indicar(interesse_id: string, nota: { situacao: string; tarefa: string; acao: string; resultado: string }) {
  atualizar((e) => {
    e.indicacoes.unshift({ id: novoId(), interesse_id, voluntario_id: e.sessao.usuario_id, ...nota, enviada_em: agora() });
    exigir(e.interesses_vaga.find((i) => i.id === interesse_id)).status = "indicado";
    auditar(e, "indicar", "interesse", interesse_id);
  });
}

// --- Trilhas ---

export function marcarItem(trilha_id: string, item_id: string, status: StatusProgresso) {
  atualizar((e) => {
    const usuario_id = exigir(e.sessao.usuario_id ?? undefined);
    let registro = e.progresso_trilha.find((p) => p.usuario_id === usuario_id && p.item_id === item_id);
    if (!registro) {
      registro = { id: novoId(), usuario_id, trilha_id, item_id, status, certificado_registrado: false, concluido_em: null };
      e.progresso_trilha.push(registro);
    }
    registro.status = status;
    registro.concluido_em = status === "concluido" ? agora() : null;
  });
}

export function registrarCertificado(item_id: string) {
  atualizar((e) => {
    const registro = e.progresso_trilha.find((p) => p.usuario_id === e.sessao.usuario_id && p.item_id === item_id);
    if (registro) registro.certificado_registrado = true;
  });
}

// --- Avaliações ---

export function iniciarTentativa(simulado_id: string) {
  const id = novoId();
  atualizar((e) => {
    e.tentativas_simulado.unshift({ id, usuario_id: exigir(e.sessao.usuario_id ?? undefined), simulado_id, respostas: {}, acertos: 0, total: 0, iniciada_em: agora(), finalizada_em: null, compartilhar_com_ministerio: false });
  });
  return id;
}

export function responder(tentativa_id: string, questao_id: string, alternativa: number) {
  atualizar((e) => {
    const tentativa = exigir(e.tentativas_simulado.find((t) => t.id === tentativa_id));
    if (!tentativa.finalizada_em) tentativa.respostas[questao_id] = alternativa;
  });
}

export function finalizarTentativa(tentativa_id: string) {
  atualizar((e) => {
    const tentativa = exigir(e.tentativas_simulado.find((t) => t.id === tentativa_id));
    if (tentativa.finalizada_em) return;
    const simulado = exigir(SIMULADOS.find((s) => s.id === tentativa.simulado_id));
    Object.assign(tentativa, corrigirSimulado(simulado, tentativa.respostas), { finalizada_em: agora() });
  });
}

export function compartilharTentativa(tentativa_id: string, compartilhar: boolean) {
  atualizar((e) => {
    exigir(e.tentativas_simulado.find((t) => t.id === tentativa_id)).compartilhar_com_ministerio = compartilhar;
  });
}

export function salvarResultadoExterno(nivel_cefr: string, nota: string, compartilhar_com_ministerio: boolean) {
  atualizar((e) => {
    const usuario_id = exigir(e.sessao.usuario_id ?? undefined);
    e.resultados_externos = e.resultados_externos.filter((r) => r.usuario_id !== usuario_id);
    e.resultados_externos.push({ id: novoId(), usuario_id, tipo: "EF SET", nivel_cefr, nota, compartilhar_com_ministerio });
  });
}

// --- Impacto ---

export function registrarConquista(tipo: "contratacao" | "negocio_fechado", observacao: string) {
  atualizar((e) => {
    const id = novoId();
    e.resultados.unshift({ id, usuario_id: e.sessao.usuario_id, tipo, vaga_id: null, data: agora(), observacao });
    auditar(e, `registrar_${tipo}`, "resultado", id);
  });
}

// --- Mentorias ---

export function criarMentoria(mentor_id: string, mentorado_id: string, area: string) {
  atualizar((e) => {
    const id = novoId();
    const inicio = new Date();
    e.mentorias.unshift({ id, mentor_id, mentorado_id, area, inicio: inicio.toISOString(), fim_previsto: new Date(inicio.getTime() + 90 * 86_400_000).toISOString(), status: "ativa" });
    auditar(e, "criar_mentoria", "mentoria", id);
  });
}

export function encerrarMentoria(id: string) {
  atualizar((e) => {
    exigir(e.mentorias.find((m) => m.id === id)).status = "encerrada";
    auditar(e, "encerrar_mentoria", "mentoria", id);
  });
}

// --- Denúncias ---

export function denunciar(alvo_tipo: Denuncia["alvo_tipo"], alvo_id: string, motivo: string) {
  atualizar((e) => {
    e.denuncias.unshift({ id: novoId(), autor_id: e.sessao.usuario_id, alvo_tipo, alvo_id, motivo, status: "aberta", tratada_por: null, tratada_em: null });
  });
}

export function tratarDenuncia(id: string, status: "procedente" | "improcedente") {
  atualizar((e) => {
    Object.assign(exigir(e.denuncias.find((d) => d.id === id)), { status, tratada_por: e.sessao.usuario_id, tratada_em: agora() });
    auditar(e, `denuncia_${status}`, "denuncia", id);
  });
}

// --- Privacidade ---

export function revogarConsentimento() {
  atualizar((e) => {
    const usuario_id = e.sessao.usuario_id;
    e.consentimentos.filter((c) => c.usuario_id === usuario_id && !c.revogado_em).forEach((c) => {
      c.revogado_em = agora();
    });
    auditar(e, "revogar_consentimento", "consentimento", usuario_id ?? "");
  });
}

// Exclusão real dos dados pessoais; registros de impacto ficam, sem vínculo com a pessoa.
export function apagarDadosDe(e: Estado, usuario_id: string) {
  const interessesDaPessoa = new Set(e.interesses_vaga.filter((i) => i.usuario_id === usuario_id).map((i) => i.id));
  const negociosDaPessoa = new Set(e.negocios.filter((n) => n.dono_id === usuario_id).map((n) => n.id));
  e.perfis = e.perfis.filter((p) => p.id !== usuario_id);
  e.consentimentos = e.consentimentos.filter((c) => c.usuario_id !== usuario_id);
  e.negocios = e.negocios.filter((n) => n.dono_id !== usuario_id);
  e.interesses_vaga = e.interesses_vaga.filter((i) => i.usuario_id !== usuario_id);
  e.indicacoes = e.indicacoes.filter((i) => !interessesDaPessoa.has(i.interesse_id));
  e.indicacoes.forEach((i) => {
    if (i.voluntario_id === usuario_id) i.voluntario_id = null;
  });
  e.progresso_trilha = e.progresso_trilha.filter((p) => p.usuario_id !== usuario_id);
  e.tentativas_simulado = e.tentativas_simulado.filter((t) => t.usuario_id !== usuario_id);
  e.resultados_externos = e.resultados_externos.filter((r) => r.usuario_id !== usuario_id);
  e.mentorias = e.mentorias.filter((m) => m.mentor_id !== usuario_id && m.mentorado_id !== usuario_id);
  e.denuncias = e.denuncias.filter((d) => !(d.alvo_tipo === "negocio" && negociosDaPessoa.has(d.alvo_id)));
  e.denuncias.forEach((d) => {
    if (d.autor_id === usuario_id) d.autor_id = null;
    if (d.tratada_por === usuario_id) d.tratada_por = null;
  });
  e.resultados.forEach((r) => {
    if (r.usuario_id === usuario_id) {
      r.usuario_id = null;
      r.observacao = "";
    }
  });
  e.negocios.forEach((n) => {
    if (n.revisado_por === usuario_id) n.revisado_por = null;
  });
  e.vagas.forEach((v) => {
    if (v.curador_id === usuario_id) v.curador_id = null;
  });
  e.auditoria.forEach((a) => {
    if (a.ator_id === usuario_id) a.ator_id = null;
    if (a.entidade === "perfil" && a.entidade_id === usuario_id) a.entidade_id = "anonimizado";
    if (a.entidade === "consentimento" && a.entidade_id === usuario_id) a.entidade_id = "anonimizado";
  });
}

export function excluirConta() {
  atualizar((e) => {
    const usuario_id = exigir(e.sessao.usuario_id ?? undefined);
    apagarDadosDe(e, usuario_id);
    e.sessao.usuario_id = null;
  });
}

export function dadosDoTitular(e: Estado, usuario_id: string) {
  const meusInteresses = e.interesses_vaga.filter((i) => i.usuario_id === usuario_id);
  const ids = new Set(meusInteresses.map((i) => i.id));
  return {
    gerado_em: agora(),
    observacao: "Protótipo: todos os dados deste arquivo são fictícios.",
    perfil: e.perfis.find((p) => p.id === usuario_id),
    consentimentos: e.consentimentos.filter((c) => c.usuario_id === usuario_id),
    negocios: e.negocios.filter((n) => n.dono_id === usuario_id),
    interesses_vaga: meusInteresses,
    indicacoes: e.indicacoes.filter((i) => ids.has(i.interesse_id)),
    progresso_trilha: e.progresso_trilha.filter((p) => p.usuario_id === usuario_id),
    tentativas_simulado: e.tentativas_simulado.filter((t) => t.usuario_id === usuario_id),
    resultados_externos: e.resultados_externos.filter((r) => r.usuario_id === usuario_id),
    mentorias: e.mentorias.filter((m) => m.mentor_id === usuario_id || m.mentorado_id === usuario_id),
    resultados: e.resultados.filter((r) => r.usuario_id === usuario_id),
    denuncias_feitas: e.denuncias.filter((d) => d.autor_id === usuario_id),
  };
}
