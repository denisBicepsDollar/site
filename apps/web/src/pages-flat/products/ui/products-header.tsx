"use client";

import { usePathname } from "next/navigation";
import {
  decodeRouteSegment,
  getCategoryPageTitle,
  getSubcategoryLabel,
  getTypeLabel,
} from "../config/catalog-labels";
import { useProductsCatalog } from "../model/use-products-store";

export function ProductsHeader() {
  const pathname = usePathname();
  const { labels } = useProductsCatalog();

  const segments = pathname.split("/").filter(Boolean);
  const category =
    segments[0] === "products" ? decodeRouteSegment(segments[1]) : undefined;
  const subcategory =
    segments[0] === "products" ? decodeRouteSegment(segments[2]) : undefined;
  const type =
    segments[0] === "products" ? decodeRouteSegment(segments[3]) : undefined;

  const subcategoryTitle = subcategory
    ? getSubcategoryLabel(subcategory, labels)
    : undefined;
  const typeTitle = type ? getTypeLabel(type, labels) : undefined;

  const title =
    (typeTitle && subcategoryTitle && typeTitle !== subcategoryTitle
      ? `${subcategoryTitle} — ${typeTitle}`
      : typeTitle) ||
    subcategoryTitle ||
    (category && getCategoryPageTitle(category, labels)) ||
    "Все товары";

  return (
    <>
      <h1 className="text-3xl sm:text-4xl font-medium tracking-tight">
        {title}
      </h1>
      <p className="mt-2 text-muted-foreground">
        Посмотрите нашу коллекцию товаров
      </p>
    </>
  );
}
