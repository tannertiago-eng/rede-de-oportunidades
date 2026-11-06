import Link from "next/link";

// Texto provisório. Precisa de revisão jurídica antes de qualquer uso com dados reais.
export default function PaginaPolitica() {
  return (
    <main className="mx-auto w-full max-w-xl px-4 py-6">
      <Link href="/" className="inline-flex min-h-11 items-center text-sm font-semibold text-primaria">
        Voltar
      </Link>
      <h1 className="text-3xl">Política de privacidade</h1>
      <p className="mt-2 font-semibold text-alerta">[REVISAR COM ADVOGADO] Texto provisório.</p>
      <div className="mt-4 flex flex-col gap-3">
        <p>
          <strong className="font-semibold">Quais dados.</strong> Nome, WhatsApp, nível e área profissional, resumo e experiências, disponibilidade (só nível operacional), LinkedIn e o que você busca. Não coletamos CPF, endereço completo, data de nascimento completa, estado civil ou dados da família.
        </p>
        <p>
          <strong className="font-semibold">Dado sensível.</strong> Participar desta rede pode revelar convicção religiosa, por isso pedimos seu consentimento específico.
        </p>
        <p>
          <strong className="font-semibold">Para quê.</strong> Conectar você a oportunidades de trabalho, negócios e crescimento profissional, com acompanhamento humano de voluntários do ministério.
        </p>
        <p>
          <strong className="font-semibold">Quem vê.</strong> Cada campo tem um nível: só eu, ministério ou membros. Em modo discreto, só a coordenação sabe que você busca oportunidade. Perfis executivos só são vistos pela coordenação. Resultados de avaliações são seus, a menos que você compartilhe.
        </p>
        <p>
          <strong className="font-semibold">Seus direitos.</strong> Baixar seus dados, corrigir, revogar o consentimento e excluir sua conta, com exclusão real dos dados pessoais. Os registros de impacto ficam anonimizados.
        </p>
        <p>
          <strong className="font-semibold">Terceiros.</strong> Não enviamos seus dados a serviços de análise ou inteligência artificial.
        </p>
      </div>
    </main>
  );
}
