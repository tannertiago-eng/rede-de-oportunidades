import type { Estado, Trilha } from "./tipos.ts";

const NOVENTA_DIAS = 90 * 24 * 60 * 60 * 1000;

export function trilhasConcluidas(estado: Pick<Estado, "progresso_trilha">, trilhas: Trilha[]) {
  let total = 0;
  const usuarios = new Set(estado.progresso_trilha.map((p) => p.usuario_id));
  for (const usuario of usuarios) {
    for (const trilha of trilhas) {
      const completa = trilha.itens.every((item) =>
        estado.progresso_trilha.some(
          (p) => p.usuario_id === usuario && p.item_id === item.id && p.trilha_id === trilha.id && p.status === "concluido",
        ),
      );
      if (completa) total += 1;
    }
  }
  return total;
}

export function calcularIndicadores(estado: Estado, trilhas: Trilha[], agora: Date) {
  const publicados = estado.negocios.filter((n) => n.status === "publicado");
  return {
    perfis_ativos: estado.perfis.filter((p) => p.situacao_cadastro === "aprovado").length,
    negocios_publicados: publicados.length,
    negocios_atualizados_90d: publicados.filter(
      (n) => agora.getTime() - new Date(n.atualizado_em).getTime() <= NOVENTA_DIAS,
    ).length,
    interesses: estado.interesses_vaga.length,
    indicacoes: estado.indicacoes.length,
    contratacoes: estado.resultados.filter((r) => r.tipo === "contratacao").length,
    negocios_fechados: estado.resultados.filter((r) => r.tipo === "negocio_fechado").length,
    trilhas_concluidas: trilhasConcluidas(estado, trilhas),
    mentorias_ativas: estado.mentorias.filter((m) => m.status === "ativa").length,
  };
}

export type LinhaMes = {
  mes: string;
  vagas: number;
  interesses: number;
  indicacoes: number;
  contratacoes: number;
  negocios_fechados: number;
};

const chaveMes = (iso: string) => iso.slice(0, 7);

// Tabela dos últimos meses, do mais recente para o mais antigo.
export function tabelaPorMes(estado: Estado, agora: Date, meses = 6): LinhaMes[] {
  const linhas: LinhaMes[] = [];
  for (let i = 0; i < meses; i++) {
    const data = new Date(Date.UTC(agora.getUTCFullYear(), agora.getUTCMonth() - i, 1));
    const mes = data.toISOString().slice(0, 7);
    linhas.push({
      mes,
      vagas: estado.vagas.filter((v) => v.publicada_em && chaveMes(v.publicada_em) === mes).length,
      interesses: estado.interesses_vaga.filter((x) => chaveMes(x.criado_em) === mes).length,
      indicacoes: estado.indicacoes.filter((x) => chaveMes(x.enviada_em) === mes).length,
      contratacoes: estado.resultados.filter((r) => r.tipo === "contratacao" && chaveMes(r.data) === mes).length,
      negocios_fechados: estado.resultados.filter((r) => r.tipo === "negocio_fechado" && chaveMes(r.data) === mes).length,
    });
  }
  return linhas;
}
