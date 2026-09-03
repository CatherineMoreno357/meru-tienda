import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { deleteProduct, findProduct, toggleProductActive, upsertProduct } from "@/lib/data/productsStore";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { id } = await params;
  const existing = await findProduct(id);
  if (!existing) return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 });

  const body = await req.json();
  const updated = await upsertProduct({
    ...existing,
    ...body,
    id,
    price: Number(body.price ?? existing.price),
    previousPrice: body.previousPrice ? Number(body.previousPrice) : undefined,
    stock: Number(body.stock ?? existing.stock),
  });

  return NextResponse.json(updated);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { id } = await params;
  await deleteProduct(id);
  return NextResponse.json({ ok: true });
}

export async function PATCH(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { id } = await params;
  const product = await toggleProductActive(id);
  if (!product) return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 });
  return NextResponse.json(product);
}
