import ProductsScreen from "@/pages-flat/products/ui/products-screen";
import { getProducts } from "@/shared/api/api";
import { redirect } from "next/navigation";
export default async function ProductsCategoryPage({ params, searchParams }) {
  const resolvedSearch = await searchParams;
  const resolvedRoute = await params;

  const resolvedParams = {
    ...resolvedSearch,
    ...resolvedRoute,
  };

  const data = await getProducts(resolvedParams);

  if (
    data.data.length === 0 &&
    (resolvedParams.size || resolvedParams.minPrice || resolvedParams.maxPrice)
  ) {
    const newParams = new URLSearchParams(resolvedSearch);
    newParams.delete("size");
    newParams.delete("minPrice");
    newParams.delete("maxPrice");

    const query = newParams.toString();
    redirect(`/products/${resolvedRoute.category}${query ? `?${query}` : ""}`);
  }
  return <ProductsScreen data={data} />;
}
