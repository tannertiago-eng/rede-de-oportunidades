import type { Simulado } from "./tipos.ts";

// Na versão real esta correção roda no banco: o gabarito não pode chegar ao celular antes do fim.
export function corrigirSimulado(simulado: Simulado, respostas: Record<string, number | null>) {
  const acertos = simulado.questoes.filter((q) => respostas[q.id] === q.correta).length;
  return { acertos, total: simulado.questoes.length };
}

export function segundosRestantes(iniciadaEm: string, limiteMin: number, agora: number) {
  const fim = new Date(iniciadaEm).getTime() + limiteMin * 60_000;
  return Math.max(0, Math.ceil((fim - agora) / 1000));
}
