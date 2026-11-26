import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";
import { ProductsScreen } from "@/pages-flat/products";
import {
  isUnknownEmptyCatalogRoute,
  normalizeCatalogFilters,
} from "@/pages-flat/products/model/catalog-route";
import { buildCatalogMetadata } from "@/pages-flat/products/model/generate-metadata";
import { fetchCatalogPageData } from "@/shared/api/catalog-cache";

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

  if (
    !data?.isError &&
    Array.isArray(data?.data) &&
    data.data.length === 0 &&
    !initialFilters.q &&
    (initialFilters.size || initialFilters.minPrice || initialFilters.maxPrice)
  ) {
    const newParams = new URLSearchParams();
    for (const [key, value] of Object.entries(resolvedSearch)) {
      if (key === "size" || key === "minPrice" || key === "maxPrice") continue;
      if (value === undefined) continue;
      const v = Array.isArray(value) ? value[value.length - 1] : value;
      if (v) newParams.set(key, v);
    }

    const query = newParams.toString();
    redirect(
      `/products/${encodeURIComponent(initialFilters.category ?? "")}/${encodeURIComponent(initialFilters.subcategory ?? "")}/${encodeURIComponent(initialFilters.type ?? "")}${query ? `?${query}` : ""}`,
    );
  }

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
