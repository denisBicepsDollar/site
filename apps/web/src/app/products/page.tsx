import ProductsScreen from "@/pages-flat/products/ui/products-screen";
import { Footer } from "../../widgets/footer/ui/footer";
import { Header } from "../../widgets/header/ui/header";
import { getProducts } from "@/shared/api/api";
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
  const data = await getInitialCatalog({ page: "1" });

  return (
    <>
      <Suspense fallback={<div>Загрузка каталога...</div>}>
        <ProductsScreen initialData={data} />
      </Suspense>
    </>
  );
}
