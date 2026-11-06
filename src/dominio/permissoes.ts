import type { Papel } from "./tipos.ts";

// No protótipo estas regras só escondem telas. Na versão real, quem garante é o RLS do banco.
export const ehMinisterio = (papel: Papel) => papel === "voluntario" || papel === "coordenacao";
export const ehCoordenacao = (papel: Papel) => papel === "coordenacao";
