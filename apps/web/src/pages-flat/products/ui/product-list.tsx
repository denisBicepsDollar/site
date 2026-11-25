import { ProductCard } from "@/entities/product/ui/product-card/product-card";
import { ListingPagination } from "@/features/products-pagination/ui/products-pagination";
import {
  PRODUCTS_PER_PAGE,
  sortOptions,
} from "@/pages-flat/products/config/sortOptions";
import { getProducts } from "@/shared/api/api";
import { useProductsStore } from "../model/useProductsStore";

export function ProductList() {
  const products = useProductsStore((state) => state.products);
  const currentPage = 1;

  const totalPages = 2;

  if (products.length === 0) {
    return (
      <div className="py-24 text-center">
        <p className="text-lg text-muted-foreground">
          No products match these filters.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-6">
        {products.map((product, index) => (
          <>
            <ProductCard
              key={product.slug}
              product={product}
              priority={index === 0}
            />
          </>
        ))}
      </div>
    </>
  );
}
