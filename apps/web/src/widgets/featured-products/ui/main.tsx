import { Suspense } from "react";
import { getProducts } from "@/shared/api";
import { getCachedCatalogProducts } from "@/shared/api/server";
import { FeaturedProducts } from "./featured-products";

async function FeaturedProductsLoader() {
  const cached = await getCachedCatalogProducts({ page: "1" });
  const response =
    cached && !cached.isError && Array.isArray(cached.data) && cached.data.length > 0
      ? cached
      : await getProducts({ page: "1" }, { noStore: true });

  const products = Array.isArray(response?.data) ? response.data : [];

  return <FeaturedProducts products={products} />;
}

export default function FeaturedProd() {
  return (
    <Suspense fallback={<FeaturedProducts products={[]} isLoading />}>
      <FeaturedProductsLoader />
    </Suspense>
  );
}
