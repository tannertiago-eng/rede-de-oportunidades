"use client";

import { Cabecalho } from "@/componentes/layout/Cabecalho";
import { Botao } from "@/componentes/ui/Botao";
import { Campo } from "@/componentes/ui/Campo";
import { Cartao } from "@/componentes/ui/Cartao";
import { Selecao } from "@/componentes/ui/Formulario";
import { Selo } from "@/componentes/ui/Selo";
import { criarMentoria, encerrarMentoria } from "@/dados/acoes";
import { useEstado, useUsuario } from "@/dados/ganchos";
import { ehCoordenacao, ehMinisterio } from "@/dominio/permissoes";

export default function PaginaMentorias() {
  const estado = useEstado();
  const usuario = useUsuario();
  const coordenacao = ehCoordenacao(usuario.papel);
  const nome = (id: string) => estado.perfis.find((p) => p.id === id)?.nome ?? "Pessoa removida";
  const visiveis = coordenacao ? estado.mentorias : estado.mentorias.filter((m) => m.mentor_id === usuario.id);
  const aprovados = estado.perfis.filter((p) => p.situacao_cadastro === "aprovado");

  return (
    <>
      <Cabecalho titulo="Mentorias" voltar={{ href: "/ministerio", rotulo: "Ministério" }} />
      <p className="mb-4 text-sm text-texto-2">Cada mentoria dura 90 dias.</p>
      <div className="flex flex-col gap-3 md:grid md:grid-cols-2 md:items-start">
        {visiveis.map((m) => (
          <Cartao key={m.id}>
            <Selo>{m.status === "ativa" ? "Ativa" : "Encerrada"}</Selo>
            <h2 className="mt-2 text-lg">
              {nome(m.mentor_id)} com {nome(m.mentorado_id)}
            </h2>
            <p className="text-sm text-texto-2">
              {m.area} · até {new Date(m.fim_previsto).toLocaleDateString("pt-BR")}
            </p>
            {m.status === "ativa" && (
              <Botao variante="secundario" className="mt-3" onClick={() => encerrarMentoria(m.id)}>
                Encerrar
              </Botao>
            )}
          </Cartao>
        ))}
        {visiveis.length === 0 && <p className="text-texto-2">Nenhuma mentoria.</p>}

        {coordenacao && (
          <Cartao>
            <h2 className="text-xl">Nova mentoria</h2>
            <form
              className="mt-3 flex flex-col gap-3"
              onSubmit={(evento) => {
                evento.preventDefault();
                const d = new FormData(evento.currentTarget);
                criarMentoria(String(d.get("mentor")), String(d.get("mentorado")), String(d.get("area")));
                evento.currentTarget.reset();
              }}
            >
              <Selecao id="mentor" name="mentor" rotulo="Mentor" opcoes={aprovados.filter((p) => ehMinisterio(p.papel)).map((p) => ({ valor: p.id, rotulo: p.nome }))} />
              <Selecao id="mentorado" name="mentorado" rotulo="Mentorado" opcoes={aprovados.map((p) => ({ valor: p.id, rotulo: p.nome }))} />
              <Campo id="area-mentoria" name="area" rotulo="Área" required />
              <Botao type="submit" largo>
                Criar mentoria
              </Botao>
            </form>
          </Cartao>
        )}
      </div>
    </>
  );
}
