import type { Simulado, Trilha } from "../dominio/tipos.ts";

// Links conferidos em 06/11/2026: cada endereço abriu com o título esperado.
const EV = "Escola Virtual Fundação Bradesco";
const novoEmprego = { titulo: "Como Conseguir um Novo Emprego", provedor: EV, url: "https://www.ev.org.br/cursos/Como-Conseguir-um-Novo-Emprego", tipo: "curso", carga_horaria_aprox: 4 } as const;
const escrita = { titulo: "Comunicação Escrita: Ortografia, Gramática e Texto", provedor: EV, url: "https://www.ev.org.br/cursos/comunicacao_escrita", tipo: "curso", carga_horaria_aprox: 16 } as const;
const atendimento = { titulo: "Atendimento ao Público", provedor: EV, url: "https://www.ev.org.br/cursos/atendimento-ao-publico", tipo: "curso", carga_horaria_aprox: 10 } as const;
const empresarial = { titulo: "Comunicação Empresarial", provedor: EV, url: "https://www.ev.org.br/cursos/comunicacao-empresarial", tipo: "curso", carga_horaria_aprox: 12 } as const;
const contabilidade = { titulo: "Contabilidade Empresarial", provedor: EV, url: "https://www.ev.org.br/cursos/Contabilidade-Empresarial", tipo: "curso", carga_horaria_aprox: 10 } as const;
const protecao = { titulo: "Construindo minha Proteção Financeira", provedor: EV, url: "https://www.ev.org.br/cursos/Construindo-minha-Protecao-Financeira", tipo: "curso", carga_horaria_aprox: 2 } as const;
const powerBi = { titulo: "Análise de Dados no Power BI", provedor: EV, url: "https://www.ev.org.br/cursos/analise-de-dados-no-power-bi", tipo: "curso", carga_horaria_aprox: 4 } as const;
const efset = { titulo: "Teste de inglês EF SET", provedor: "EF SET", url: "https://www.efset.org/pt/", tipo: "teste", carga_horaria_aprox: 1 } as const;
const gov = { titulo: "Catálogo de cursos da Escola Virtual.Gov", provedor: "Escola Virtual.Gov", url: "https://www.escolavirtual.gov.br/catalogo", tipo: "curso", carga_horaria_aprox: null } as const;
const sebrae = { titulo: "Cursos online do Sebrae", provedor: "Sebrae", url: "https://sebrae.com.br/sites/PortalSebrae/cursosonline", tipo: "curso", carga_horaria_aprox: null } as const;
const mei = { titulo: "Portal do Empreendedor (MEI)", provedor: "gov.br", url: "https://www.gov.br/empresas-e-negocios/pt-br/empreendedor", tipo: "leitura", carga_horaria_aprox: null } as const;
const catho = { titulo: "Pesquisar vagas na Catho", provedor: "Catho", url: "https://www.catho.com.br/vagas/", tipo: "leitura", carga_horaria_aprox: null } as const;
const linkedin = { titulo: "Pesquisar vagas no LinkedIn", provedor: "LinkedIn", url: "https://www.linkedin.com/jobs/", tipo: "leitura", carga_horaria_aprox: null } as const;

function itens(prefixo: string, lista: readonly Omit<Trilha["itens"][number], "id">[]): Trilha["itens"] {
  return lista.map((item, i) => ({ ...item, id: `${prefixo}-${i + 1}` }));
}

export const TRILHAS: Trilha[] = [
  { id: "recolocacao", nome: "Recolocação", publico: "Para quem busca voltar ao mercado", descricao: "Currículo, comunicação e como procurar vagas com método.", itens: itens("rec", [novoEmprego, escrita, atendimento, catho, efset]) },
  { id: "primeiro-emprego", nome: "Primeiro emprego", publico: "Para quem está começando", descricao: "O básico para chegar bem preparado à primeira oportunidade.", itens: itens("pri", [novoEmprego, empresarial, atendimento, gov]) },
  { id: "empreendedor", nome: "Empreendedor/MEI", publico: "Para quem tem ou quer abrir um negócio", descricao: "Formalização, finanças e gestão de um pequeno negócio.", itens: itens("emp", [mei, sebrae, contabilidade, protecao]) },
  { id: "crescimento", nome: "Crescimento de carreira", publico: "Para quem quer dar o próximo passo", descricao: "Comunicação, dados e inglês para crescer onde já está.", itens: itens("cre", [empresarial, powerBi, efset, gov, linkedin]) },
];

export const SIMULADOS: Simulado[] = [
  {
    id: "logica-1",
    tipo: "logica",
    titulo: "Raciocínio lógico",
    versao: "1",
    tempo_limite_min: 15,
    questoes: [
      { id: "l1", enunciado: "Qual número continua a sequência: 2, 4, 8, 16, ...?", alternativas: ["18", "24", "32", "64"], correta: 2, explicacao: "Cada número é o dobro do anterior: 16 × 2 = 32." },
      { id: "l2", enunciado: "Todos os gatos são mamíferos. Mimi é um gato. O que podemos concluir?", alternativas: ["Mimi é um mamífero", "Todo mamífero é gato", "Mimi não é um mamífero", "Nada se pode concluir"], correta: 0, explicacao: "Se todo gato é mamífero e Mimi é gato, Mimi é mamífero. O contrário (todo mamífero é gato) não vale." },
      { id: "l3", enunciado: "Qual número continua a sequência: 1, 1, 2, 3, 5, 8, ...?", alternativas: ["10", "11", "12", "13"], correta: 3, explicacao: "Cada número é a soma dos dois anteriores: 5 + 8 = 13." },
      { id: "l4", enunciado: "Ana é mais alta que Bia. Bia é mais alta que Caio. Quem é a pessoa mais baixa?", alternativas: ["Ana", "Caio", "Bia", "Não dá para saber"], correta: 1, explicacao: "A ordem da mais alta para a mais baixa é Ana, Bia, Caio." },
      { id: "l5", enunciado: "Hoje é terça-feira. Que dia da semana será daqui a 10 dias?", alternativas: ["Quinta-feira", "Sábado", "Sexta-feira", "Domingo"], correta: 2, explicacao: "10 dias são uma semana e mais 3 dias. Terça + 3 dias = sexta-feira." },
      { id: "l6", enunciado: "Se chove, a rua fica molhada. A rua não está molhada. O que podemos concluir?", alternativas: ["Choveu pouco", "Vai chover", "A rua foi limpa", "Não choveu"], correta: 3, explicacao: "Se a chuva sempre molha a rua e a rua está seca, então não choveu." },
      { id: "l7", enunciado: "Qual destas palavras não pertence ao grupo?", alternativas: ["Cenoura", "Maçã", "Banana", "Uva"], correta: 0, explicacao: "Maçã, banana e uva são frutas. Cenoura é um legume." },
      { id: "l8", enunciado: "Mão está para luva assim como pé está para:", alternativas: ["Perna", "Meia", "Chão", "Dedo"], correta: 1, explicacao: "A luva veste a mão; a meia veste o pé." },
      { id: "l9", enunciado: "5 máquinas fazem 5 peças em 5 minutos. Quanto tempo 100 máquinas levam para fazer 100 peças?", alternativas: ["100 minutos", "20 minutos", "5 minutos", "1 minuto"], correta: 2, explicacao: "Cada máquina faz uma peça em 5 minutos. Com 100 máquinas, saem 100 peças nos mesmos 5 minutos." },
      { id: "l10", enunciado: "Qual letra continua a sequência: A, C, E, G, ...?", alternativas: ["H", "J", "K", "I"], correta: 3, explicacao: "A sequência pula uma letra a cada passo: depois de G (pulando H) vem I." },
    ],
  },
  {
    id: "matematica-1",
    tipo: "matematica",
    titulo: "Matemática do dia a dia",
    versao: "1",
    tempo_limite_min: 20,
    questoes: [
      { id: "m1", enunciado: "Quanto é 15% de 200?", alternativas: ["15", "30", "20", "45"], correta: 1, explicacao: "10% de 200 é 20 e 5% é 10. Somando: 30." },
      { id: "m2", enunciado: "Você comprou 3 cadernos de R$ 12,00 e uma caneta de R$ 4,00. Qual o total?", alternativas: ["R$ 40,00", "R$ 36,00", "R$ 28,00", "R$ 48,00"], correta: 0, explicacao: "3 × 12 = 36. Somando a caneta: 36 + 4 = 40." },
      { id: "m3", enunciado: "Um produto de R$ 80,00 teve 25% de desconto. Por quanto saiu?", alternativas: ["R$ 55,00", "R$ 75,00", "R$ 60,00", "R$ 65,00"], correta: 2, explicacao: "25% de 80 é 20. O preço final é 80 − 20 = 60." },
      { id: "m4", enunciado: "Se 3x + 5 = 20, quanto vale x?", alternativas: ["3", "4", "6", "5"], correta: 3, explicacao: "3x = 20 − 5 = 15, logo x = 15 ÷ 3 = 5." },
      { id: "m5", enunciado: "Quem trabalha 8 horas por dia durante 22 dias trabalha quantas horas no total?", alternativas: ["176", "160", "184", "198"], correta: 0, explicacao: "8 × 22 = 176 horas." },
      { id: "m6", enunciado: "Qual é a média de 6, 8 e 10?", alternativas: ["6", "7", "8", "9"], correta: 2, explicacao: "Some os valores (24) e divida pela quantidade (3): 24 ÷ 3 = 8." },
      { id: "m7", enunciado: "2 kg de um produto custam R$ 18,00. Quanto custam 5 kg?", alternativas: ["R$ 36,00", "R$ 45,00", "R$ 40,00", "R$ 54,00"], correta: 1, explicacao: "1 kg custa 18 ÷ 2 = R$ 9,00. Então 5 kg custam 5 × 9 = R$ 45,00." },
      { id: "m8", enunciado: "Quanto é 1/4 de 120?", alternativas: ["40", "24", "60", "30"], correta: 3, explicacao: "Um quarto é dividir por 4: 120 ÷ 4 = 30." },
      { id: "m9", enunciado: "Um salário de R$ 2.000,00 teve aumento de 10%. Qual o novo salário?", alternativas: ["R$ 2.200,00", "R$ 2.100,00", "R$ 2.010,00", "R$ 2.020,00"], correta: 0, explicacao: "10% de 2.000 é 200. Novo salário: 2.000 + 200 = 2.200." },
      { id: "m10", enunciado: "Qual a área de uma sala retangular de 6 m por 4 m?", alternativas: ["10 m²", "20 m²", "24 m²", "28 m²"], correta: 2, explicacao: "Área do retângulo = largura × comprimento: 6 × 4 = 24 m²." },
    ],
  },
];
