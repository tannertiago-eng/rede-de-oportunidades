import { createBrowserClient } from "@supabase/ssr";
import { supabaseChavePublica, supabaseUrl } from "./env";

// Cliente para Client Components (navegador).
export function criarClienteNavegador() {
  return createBrowserClient(supabaseUrl, supabaseChavePublica);
}
