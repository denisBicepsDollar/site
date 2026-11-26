import { ProductsScreen } from "@/pages-flat/products";
import { getProducts } from "@/shared/api";
import { redirect } from "next/navigation";
import { Suspense } from "react";

type PageProps = {
  params: Promise<{ category: string; subcategory: string; type: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function decodeParam(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

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
      filters[key] = decodeParam(value);
    }
  }

  return filters;
}

async function TypeCatalogLoader({ params, searchParams }: PageProps) {
  const [resolvedSearch, resolvedRoute] = await Promise.all([
    searchParams,
    params,
  ]);

  const initialFilters = normalizeFilters(resolvedSearch, resolvedRoute);
  const data = await getProducts(
    { ...initialFilters, page: "1" },
    { noStore: true },
  );

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
      `/products/${encodeURIComponent(decodeParam(resolvedRoute.category))}/${encodeURIComponent(decodeParam(resolvedRoute.subcategory))}/${encodeURIComponent(decodeParam(resolvedRoute.type))}${query ? `?${query}` : ""}`,
    );
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
