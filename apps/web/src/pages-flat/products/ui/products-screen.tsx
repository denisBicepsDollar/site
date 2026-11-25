"use client";

import { SidebarInsetContent } from "./sidebar-inset-content";
import {
  ProductsCatalogProvider,
  type ProductsApiResponse,
} from "../model/useProductsStore";

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
