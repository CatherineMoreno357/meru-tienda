import { Suspense } from "react";
import { Metadata } from "next";
import { getProducts } from "@/lib/repository";
import ProductGrid from "@/components/product/ProductGrid";
import StoreFilters from "@/components/product/StoreFilters";
import { CategorySlug, ProductTag } from "@/types";

export const metadata: Metadata = {
  title: "Tienda",
  description: "Explora todo el catálogo de Meru: hogar, moda, tecnología, decoración y más.",
};

export default async function TiendaPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const params = await searchParams;
  const category = params.categoria as CategorySlug | undefined;
  const sort = params.orden as
    | "relevancia"
    | "precio-asc"
    | "precio-desc"
    | "nuevo"
    | undefined;
  const filtro = params.filtro as ProductTag | undefined;

  let products = await getProducts({ category, sort });
  if (filtro) {
    products = products.filter((p) => p.tags.includes(filtro));
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <h1 className="font-display text-3xl font-semibold sm:text-4xl">Tienda</h1>
      <p className="mt-2 text-muted">Todo lo que necesitas, en un solo lugar.</p>

      <div className="mt-8">
        <Suspense>
          <StoreFilters />
        </Suspense>
        <ProductGrid products={products} />
      </div>
    </div>
  );
}
