import { notFound } from "next/navigation";
import { Suspense } from "react";
import { buildCatalogMetadata, ProductsScreen } from "@/pages-flat/products";
import {
  isUnknownEmptyCatalogRoute,
  normalizeCatalogFilters,
} from "@/entities/product";
import { fetchCatalogPageData } from "@/shared/api/server";

type PageProps = {
  params: Promise<{ category: string; subcategory: string; type: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({ params, searchParams }: PageProps) {
  const { category, subcategory, type } = await params;
  return buildCatalogMetadata({ category, subcategory, type, searchParams });
}

async function TypeCatalogLoader({ params, searchParams }: PageProps) {
  const [resolvedSearch, resolvedRoute] = await Promise.all([
    searchParams,
    params,
  ]);

  const initialFilters = normalizeCatalogFilters(resolvedSearch, resolvedRoute);
  const data = await fetchCatalogPageData(initialFilters);

  if (isUnknownEmptyCatalogRoute(data, initialFilters)) {
    notFound();
  }

  return <ProductsScreen initialData={data} initialFilters={initialFilters} />;
}

export default function ProductsTypePage(props: PageProps) {
  return (
    <Suspense fallback={<div>Загрузка каталога...</div>}>
      <TypeCatalogLoader {...props} />
    </Suspense>
  );
}
