import { ProductsScreen } from "@/pages-flat/products";
import { getProducts } from "@/shared/api";
import { Suspense } from "react";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function normalizeFilters(
  search: Record<string, string | string[] | undefined>,
): Record<string, string> {
  const filters: Record<string, string> = {};

  for (const [key, value] of Object.entries(search)) {
    if (key === "page" || value === undefined) continue;
    const normalized = Array.isArray(value) ? value[value.length - 1] : value;
    if (normalized) {
      filters[key] = normalized;
    }
  }

  return filters;
}

export async function generateMetadata() {
  return {
    title: "Каталог товаров | Имя Вашего Бренда",
    description: "Изучите полный каталог товаров...",
  };
}

async function CatalogLoader({ searchParams }: PageProps) {
  const resolvedSearch = await searchParams;
  const initialFilters = normalizeFilters(resolvedSearch);
  const data = await getProducts(
    { ...initialFilters, page: "1" },
    { noStore: true },
  );

  return <ProductsScreen initialData={data} initialFilters={initialFilters} />;
}

export default function ProductsPage(props: PageProps) {
  return (
    <Suspense fallback={<div>Загрузка каталога...</div>}>
      <CatalogLoader {...props} />
    </Suspense>
  );
}
