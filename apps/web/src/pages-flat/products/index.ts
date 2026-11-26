export { default as ProductsScreen } from "./ui/products-screen";
export { ProductsHeader } from "./ui/products-header";
export { ProductsLayoutShell } from "./ui/products-layout-shell";
export { SidebarGroupCategory } from "./ui/sidebar-group-category";
export { SidebarGroupPrice } from "./ui/sidebar-group-price";
export { SidebarGroupSize } from "./ui/sidebar-group-size";
export {
  CatalogLabelsProvider,
  ProductsCatalogProvider,
  useProductsCatalog,
  type ProductsApiResponse,
  type ProductsMeta,
} from "./model/use-products-store";
export type { CatalogLabels } from "./config/catalog-labels";
