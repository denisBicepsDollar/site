import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ProductsScreen } from "@/pages-flat/products";
import {
  isUnknownEmptyCatalogRoute,
  normalizeCatalogFilters,
} from "@/pages-flat/products/model/catalog-route";
import { buildCatalogMetadata } from "@/pages-flat/products/model/generate-metadata";
import { fetchCatalogPageData } from "@/shared/api/catalog-cache";

type PageProps = {
  params: Promise<{ category: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({ params, searchParams }: PageProps) {
  const { category } = await params;
  return buildCatalogMetadata({ category, searchParams });
}

async function CategoryCatalogLoader({ params, searchParams }: PageProps) {
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

export default function ProductsCategoryPage(props: PageProps) {
  return (
    <Suspense fallback={<div>Загрузка каталога...</div>}>
      <CategoryCatalogLoader {...props} />
    </Suspense>
  );
}
