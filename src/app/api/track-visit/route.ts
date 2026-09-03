import { NextRequest, NextResponse } from "next/server";
import { logVisit } from "@/lib/data/visitsStore";

// Endpoint público (sin autenticación) que registra una visita a la tienda.
// Lo llama StoreChrome.tsx una sola vez por sesión de navegador.
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const path = typeof body.path === "string" ? body.path.slice(0, 200) : "/";
    await logVisit(path);
  } catch {
    // Nunca romper la navegación del usuario por un fallo al registrar la visita.
  }
  return NextResponse.json({ ok: true });
}
