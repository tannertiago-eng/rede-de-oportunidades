"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Aviso } from "@/componentes/ui/Aviso";
import { Botao, classesBotao } from "@/componentes/ui/Botao";
import { Cartao } from "@/componentes/ui/Cartao";
import { destinoDaSessao, entrarComo, sair } from "@/dados/acoes";
import { useEstado, useHidratado } from "@/dados/ganchos";
import { lerEstado, recomecarTeste } from "@/dados/loja";
import { ROTULO_PAPEL } from "@/dominio/rotulos";

const ROTEIROS = [
  {
    titulo: "Pessoa nova",
    passos: ["Saia e entre pelo e-mail, como quem chega pela primeira vez.", "Leia o consentimento: o texto ficou claro?", "Faça o cadastro e simule a aprovação.", "No Perfil, escolha quem vê cada informação."],
  },
  {
    titulo: "Membro",
    passos: ["Ache uma vaga do seu nível e clique em Tenho interesse.", "Na Vitrine, procure um negócio e cadastre o seu.", "Marque itens de uma trilha e faça um simulado.", "Em Privacidade, baixe seus dados."],
  },
  {
    titulo: "Voluntário",
    passos: ["Na fila de revisão, publique um negócio e rejeite outro.", "Cadastre uma vaga.", "Indique Fábio Exemplo com a nota STAR.", "Em Perfis, repare no que você não consegue ver."],
  },
  {
    titulo: "Coordenação",
    passos: ["Aprove um cadastro pendente.", "Em Perfis, veja quem está em modo discreto.", "Trate a denúncia aberta.", "Confira o painel de indicadores."],
  },
];

export default function PaginaPrototipo() {
  const router = useRouter();
  const hidratado = useHidratado();
  const estado = useEstado();
  const [confirmando, setConfirmando] = useState(false);
  const atual = estado.sessao.usuario_id;
  const perfisDeTeste = estado.perfis.filter((p) => p.perfil_de_teste);

  function trocar(id: string) {
    entrarComo(id);
    router.push(destinoDaSessao(lerEstado()));
  }

  return (
    <main className="mx-auto w-full max-w-xl px-4 py-6">
      <h1 className="text-3xl">Como testar</h1>
      <p className="mt-2 text-texto-2">Este é um protótipo para coletar opiniões. Nada aqui é real.</p>

      <div className="mt-4 flex flex-col gap-3">
        <Aviso tipo="alerta">
          Não digite seus dados verdadeiros. Tudo fica salvo só neste aparelho e nenhuma informação vai para um servidor, mas este protótipo não tem a proteção da versão final.
        </Aviso>

        {hidratado && (
          <Cartao>
            <h2 className="text-xl">Trocar de papel</h2>
            <ul className="mt-3 flex flex-col gap-2">
              {perfisDeTeste.map((p) => (
                <li key={p.id}>
                  <Botao variante={p.id === atual ? "principal" : "secundario"} largo onClick={() => trocar(p.id)}>
                    {ROTULO_PAPEL[p.papel]} · {p.nome}
                  </Botao>
                </li>
              ))}
              {atual && (
                <li>
                  <Botao variante="texto" largo onClick={sair}>
                    Sair (entrar como pessoa nova)
                  </Botao>
                </li>
              )}
            </ul>
          </Cartao>
        )}

        {ROTEIROS.map((r) => (
          <Cartao key={r.titulo}>
            <h2 className="text-xl">{r.titulo}</h2>
            <ol className="mt-2 list-decimal pl-5">
              {r.passos.map((passo) => (
                <li key={passo}>{passo}</li>
              ))}
            </ol>
          </Cartao>
        ))}

        <Cartao>
          <h2 className="text-xl">Encontrou algo?</h2>
          <p className="mt-1">Toque em Sugestão, no topo da tela que você estiver vendo. O WhatsApp abre com o nome da tela preenchido. Vale tudo: o que confundiu, o que faltou, o que você não confiaria em preencher.</p>
        </Cartao>

        <Cartao>
          <h2 className="text-xl">Recomeçar o teste</h2>
          <p className="mt-1">Apaga o que você fez neste aparelho e volta aos dados de exemplo.</p>
          <div className="mt-3">
            {confirmando ? (
              <div className="flex gap-2">
                <Botao
                  variante="secundario"
                  onClick={() => {
                    recomecarTeste();
                    setConfirmando(false);
                  }}
                >
                  Sim, recomeçar
                </Botao>
                <Botao variante="texto" onClick={() => setConfirmando(false)}>
                  Cancelar
                </Botao>
              </div>
            ) : (
              <Botao variante="secundario" onClick={() => setConfirmando(true)}>
                Recomeçar
              </Botao>
            )}
          </div>
        </Cartao>

        <Link href="/" className={classesBotao("principal", true)}>
          Voltar para o app
        </Link>
      </div>
    </main>
  );
}
