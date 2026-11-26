export {
  PRODUCTS_PER_PAGE,
  SORTING_TAGS,
  sortOptions,
} from "./config/sort-options";
export {
  decodeRouteSegment,
  getCategoryLabel,
  getCategoryPageTitle,
  getLabelSortOrder,
  getSubcategoryLabel,
  getTypeLabel,
} from "./lib/catalog-labels";
export {
  ALLOWED_CATALOG_SEARCH_KEYS,
  isUnknownEmptyCatalogRoute,
  normalizeCatalogFilters,
} from "./model/catalog-route";
export type {
  ProductDetail,
  ProductsState,
  ProductVariant,
} from "./model/types";
export {
  CatalogLabelsProvider,
  ProductsCatalogProvider,
  useProductsCatalog,
} from "./model/use-products-store";
export { sortVariants, useVariants } from "./model/use-variants";
export { ProductCard } from "./ui/product-card";
export type {
  CatalogLabels,
  ProductsApiResponse,
  ProductsMeta,
} from "@/shared/api";
