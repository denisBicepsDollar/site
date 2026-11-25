import ProductsScreen from "@/pages-flat/products/ui/products-screen";
import { getProducts } from "@/shared/api/api";
import { redirect } from "next/navigation";
import { Suspense } from "react";

type PageProps = {
  params: Promise<{ category: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function normalizeFilters(
  search: Record<string, string | string[] | undefined>,
  route: Record<string, string>,
): Record<string, string> {
  const filters: Record<string, string> = {};

  for (const [key, value] of Object.entries(search)) {
    if (key === "page" || value === undefined) continue;
    const normalized = Array.isArray(value) ? value[value.length - 1] : value;
    if (normalized) {
      filters[key] = normalized;
    }
  }

  for (const [key, value] of Object.entries(route)) {
    if (value) {
      filters[key] = value;
    }
  }

  return filters;
}

async function CategoryCatalogLoader({ params, searchParams }: PageProps) {
  const [resolvedSearch, resolvedRoute] = await Promise.all([
    searchParams,
    params,
  ]);

  const initialFilters = normalizeFilters(resolvedSearch, resolvedRoute);
  const data = await getProducts({ ...initialFilters, page: "1" });

  if (
    !data?.isError &&
    Array.isArray(data?.data) &&
    data.data.length === 0 &&
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
    redirect(`/products/${resolvedRoute.category}${query ? `?${query}` : ""}`);
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
