import assert from "node:assert/strict";
import { test } from "node:test";
import { calcularIndicadores, tabelaPorMes } from "../dominio/indicadores.ts";
import { corrigirSimulado, segundosRestantes } from "../dominio/simulado.ts";
import { verPerfil } from "../dominio/visibilidade.ts";
import { SIMULADOS, TRILHAS } from "./conteudo.ts";
import { apagarDadosDe, destinoDaSessao } from "./acoes.ts";
import { criarEstadoInicial, ID_COORDENACAO, ID_MEMBRO, ID_VOLUNTARIO } from "./exemplo.ts";

const AGORA = new Date("2026-11-06T12:00:00Z");
const estado = () => criarEstadoInicial(AGORA);
const membro = { id: ID_MEMBRO, papel: "membro" as const };
const voluntario = { id: ID_VOLUNTARIO, papel: "voluntario" as const };
const coordenacao = { id: ID_COORDENACAO, papel: "coordenacao" as const };
const achar = (id: string) => estado().perfis.find((p) => p.id === id)!;

test("campo 'só eu' e 'ministério' não aparecem para membro", () => {
  const visto = verPerfil(achar("u-fabio"), membro)!;
  assert.equal(visto.campos.telefone_whatsapp, undefined);
  assert.equal(visto.campos.resumo, undefined);
  assert.equal(visto.campos.area, undefined);
});

test("voluntário vê 'ministério', mas não 'só eu'", () => {
  const visto = verPerfil(achar("u-fabio"), voluntario)!;
  assert.equal(visto.campos.area, "Logística");
  assert.equal(visto.campos.telefone_whatsapp, undefined);
});

test("modo discreto: 'buscando' só para a coordenação", () => {
  assert.equal(verPerfil(achar("u-davi"), voluntario)!.campos.buscando, undefined);
  assert.equal(verPerfil(achar("u-davi"), membro)!.campos.buscando, undefined);
  assert.equal(verPerfil(achar("u-davi"), coordenacao)!.campos.buscando, true);
});

test("executivo não aparece para membro nem voluntário", () => {
  assert.equal(verPerfil(achar("u-elisa"), membro), null);
  assert.equal(verPerfil(achar("u-elisa"), voluntario), null);
  assert.notEqual(verPerfil(achar("u-elisa"), coordenacao), null);
});

test("cadastro pendente só aparece para a coordenação", () => {
  assert.equal(verPerfil(achar("u-gabi"), voluntario), null);
  assert.notEqual(verPerfil(achar("u-gabi"), coordenacao), null);
});

test("a própria pessoa sempre vê tudo", () => {
  const visto = verPerfil(achar("u-fabio"), { id: "u-fabio", papel: "membro" })!;
  assert.equal(visto.campos.telefone_whatsapp, "(00) 90000-0006");
});

test("simulados: 10 questões, gabarito válido e explicação", () => {
  for (const simulado of SIMULADOS) {
    assert.equal(simulado.questoes.length, 10);
    for (const q of simulado.questoes) {
      assert.ok(q.correta >= 0 && q.correta < q.alternativas.length, q.id);
      assert.ok(q.alternativas[q.correta]);
      assert.ok(q.explicacao.length > 0);
    }
  }
});

test("correção conta acertos e deixa branco como erro", () => {
  const [simulado] = SIMULADOS;
  const respostas = Object.fromEntries(simulado.questoes.map((q) => [q.id, q.correta]));
  assert.deepEqual(corrigirSimulado(simulado, respostas), { acertos: 10, total: 10 });
  assert.equal(corrigirSimulado(simulado, {}).acertos, 0);
});

test("cronômetro para em zero", () => {
  const inicio = "2026-11-06T12:00:00Z";
  assert.equal(segundosRestantes(inicio, 15, new Date(inicio).getTime()), 900);
  assert.equal(segundosRestantes(inicio, 15, new Date(inicio).getTime() + 3_600_000), 0);
});

test("seed segue a seção 8 do CLAUDE.md", () => {
  const e = estado();
  assert.equal(e.negocios.length, 8);
  assert.equal(e.vagas.length, 10);
  assert.equal(e.vagas.filter((v) => v.origem === "externa").length, 5);
  assert.equal(TRILHAS.length, 4);
  for (const t of TRILHAS) assert.ok(t.itens.length >= 4 && t.itens.length <= 6, t.nome);
});

test("indicadores batem com os dados do seed", () => {
  const e = estado();
  assert.deepEqual(calcularIndicadores(e, TRILHAS, AGORA), {
    perfis_ativos: 6,
    negocios_publicados: 6,
    negocios_atualizados_90d: 4,
    interesses: 3,
    indicacoes: 1,
    contratacoes: 1,
    negocios_fechados: 1,
    trilhas_concluidas: 1,
    mentorias_ativas: 1,
  });
  const novembro = tabelaPorMes(e, AGORA)[0];
  assert.equal(novembro.mes, "2026-11");
});

test("sem consentimento a sessão não passa da tela de consentimento", () => {
  const e = estado();
  e.sessao.usuario_id = ID_MEMBRO;
  assert.equal(destinoDaSessao(e), "/inicio");
  e.consentimentos.find((c) => c.usuario_id === ID_MEMBRO)!.revogado_em = AGORA.toISOString();
  assert.equal(destinoDaSessao(e), "/consentimento");
});

test("exclusão remove dados pessoais e anonimiza o impacto", () => {
  const e = estado();
  const contratacoesAntes = e.resultados.filter((r) => r.tipo === "contratacao").length;
  apagarDadosDe(e, "u-davi");
  assert.equal(e.perfis.some((p) => p.id === "u-davi"), false);
  assert.equal(e.negocios.some((n) => n.dono_id === "u-davi"), false);
  assert.equal(e.interesses_vaga.some((i) => i.usuario_id === "u-davi"), false);
  assert.equal(e.resultados.filter((r) => r.tipo === "contratacao").length, contratacoesAntes);
  assert.equal(JSON.stringify(e).includes("u-davi"), false, "nenhum vínculo com a pessoa pode sobrar");
});
