"use client";

import { ProductsCatalogProvider, type ProductsApiResponse } from "@/entities/product";
import { SidebarInsetContent } from "@/widgets/catalog-grid";

export default function ProductsScreen({
  initialData,
  initialFilters = {},
}: {
  initialData?: ProductsApiResponse;
  initialFilters?: Record<string, string>;
}) {
  return (
    <ProductsCatalogProvider
      initialData={initialData}
      initialFilters={initialFilters}
    >
      <SidebarInsetContent className="m-0" />
    </ProductsCatalogProvider>
  );
}
