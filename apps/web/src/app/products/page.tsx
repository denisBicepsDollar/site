import { Suspense } from "react";
import { ProductsScreen } from "@/pages-flat/products";
import { normalizeCatalogFilters } from "@/pages-flat/products/model/catalog-route";
import { buildCatalogMetadata } from "@/pages-flat/products/model/generate-metadata";
import { fetchCatalogPageData } from "@/shared/api/catalog-cache";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({ searchParams }: PageProps) {
  return buildCatalogMetadata({ searchParams });
}

async function CatalogLoader({ searchParams }: PageProps) {
  const resolvedSearch = await searchParams;
  const initialFilters = normalizeCatalogFilters(resolvedSearch);
  const data = await fetchCatalogPageData(initialFilters);

  return <ProductsScreen initialData={data} initialFilters={initialFilters} />;
}

export default function ProductsPage(props: PageProps) {
  return (
    <Suspense fallback={<div>Загрузка каталога...</div>}>
      <CatalogLoader {...props} />
    </Suspense>
  );
}
