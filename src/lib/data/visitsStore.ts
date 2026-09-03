// Contador simple de visitas a la tienda pública. Cada vez que alguien entra
// (una sola vez por sesión de navegador, ver StoreChrome.tsx) se guarda una
// fila en la tabla "visits" de Supabase. El admin solo necesita el total.
import { isSupabaseAdminConfigured, getSupabaseAdmin } from "@/lib/supabase/admin";

export async function logVisit(path: string): Promise<void> {
  if (!isSupabaseAdminConfigured()) return;
  const db = getSupabaseAdmin();
  await db.from("visits").insert({ path });
}

export async function getVisitCount(): Promise<number> {
  if (!isSupabaseAdminConfigured()) return 0;
  const db = getSupabaseAdmin();
  const { count, error } = await db
    .from("visits")
    .select("*", { count: "exact", head: true });
  if (error) return 0;
  return count ?? 0;
}
