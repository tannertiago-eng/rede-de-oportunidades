import Link from "next/link";

// Texto provisório. Precisa de revisão jurídica antes de qualquer uso com dados reais.
export default function PaginaTermos() {
  return (
    <main className="mx-auto w-full max-w-xl px-4 py-6">
      <Link href="/" className="inline-flex min-h-11 items-center text-sm font-semibold text-primaria">
        Voltar
      </Link>
      <h1 className="text-3xl">Termos de uso</h1>
      <p className="mt-2 font-semibold text-alerta">[REVISAR COM ADVOGADO] Texto provisório.</p>
      <div className="mt-4 flex flex-col gap-3">
        <p>
          <strong className="font-semibold">Revisão não é recomendação.</strong> Negócios e vagas passam por revisão de voluntários, mas o cadastro revisado não é uma recomendação da instituição. Confira as informações antes de fechar qualquer acordo.
        </p>
        <p>
          <strong className="font-semibold">É proibido publicar:</strong>
        </p>
        <ul className="list-disc pl-5">
          <li>marketing multinível;</li>
          <li>&quot;oportunidades de investimento&quot;;</li>
          <li>empréstimos entre membros;</li>
          <li>política partidária;</li>
          <li>vagas que exijam religião.</li>
        </ul>
        <p>
          <strong className="font-semibold">Denúncias.</strong> Todo conteúdo pode ser denunciado. A coordenação analisa e pode remover o que descumprir estes termos.
        </p>
      </div>
    </main>
  );
}
