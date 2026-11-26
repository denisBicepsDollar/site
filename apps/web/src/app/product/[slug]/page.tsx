// src/app/product/[slug]/page.js
import { Header } from "@/widgets/header";
import { Footer } from "@/widgets/footer";
import { getCatalogLabels, getProductBySlug, getProducts } from "@/shared/api";
import { ProductScreen } from "@/pages-flat/product";

export default async function ProductPage({ params }) {
  const resolvedParams = await params;

  const slug = resolvedParams.slug;

  const [{ data: product }, { data: products, meta }] = await Promise.all([
    getProductBySlug(slug),
    getProducts(),
  ]);
  const labels = meta?.labels ?? (await getCatalogLabels());

  return (
    <>
      <Header />
      <ProductScreen product={product} products={products} labels={labels} />
      <Footer />
    </>
  );
}
