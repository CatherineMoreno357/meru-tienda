import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { listAllProducts, upsertProduct } from "@/lib/data/productsStore";
import { slugify } from "@/lib/utils";

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  return NextResponse.json(await listAllProducts());
}

export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const body = await req.json();
  const id = `p${Date.now()}`;
  const product = await upsertProduct({
    id,
    slug: body.slug || slugify(body.name),
    name: body.name,
    shortDescription: body.shortDescription || "",
    description: body.description || "",
    category: body.category,
    subcategory: body.subcategory,
    price: Number(body.price) || 0,
    previousPrice: body.previousPrice ? Number(body.previousPrice) : undefined,
    sku: body.sku || id.toUpperCase(),
    images: body.images?.length ? body.images : ["https://picsum.photos/seed/" + id + "/800/800"],
    tags: body.tags || [],
    stock: Number(body.stock) || 0,
    active: body.active ?? true,
  });

  return NextResponse.json(product, { status: 201 });
}
