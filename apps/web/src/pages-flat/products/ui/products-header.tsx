"use client";

import { usePathname } from "next/navigation";
import {
  CATEGORY_PAGE_TITLES,
  SUBCATEGORY_LABELS,
} from "../config/catalog-labels";

export function ProductsHeader() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  const category = segments[0] === "products" ? segments[1] : undefined;
  const subcategory = segments[0] === "products" ? segments[2] : undefined;

  const title =
    (subcategory && SUBCATEGORY_LABELS[subcategory]) ||
    (category && CATEGORY_PAGE_TITLES[category]) ||
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
