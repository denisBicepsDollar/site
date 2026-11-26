import { ProductsScreen } from "@/pages-flat/products";
import { getProducts } from "@/shared/api";
import { Suspense } from "react";
import { cacheLife, cacheTag } from "next/cache";

async function getInitialCatalog() {
  "use cache";
  cacheTag("products");
  cacheLife({ revalidate: 60 }); // аналог старого export const revalidate = 60

  return getProducts({ page: "1" });
}

export async function generateMetadata() {
  return {
    title: "Каталог товаров | Имя Вашего Бренда",
    description: "Изучите полный каталог товаров...",
  };
}

export default async function ProductsPage() {
  const data = await getInitialCatalog();

  return (
    <Suspense fallback={<div>Загрузка каталога...</div>}>
      <ProductsScreen initialData={data} />
    </Suspense>
  );
}
