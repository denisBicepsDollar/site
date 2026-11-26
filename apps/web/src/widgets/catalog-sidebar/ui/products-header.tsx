"use client";

import { usePathname } from "next/navigation";
import { getPublicSiteUrl } from "@/shared/config";
import {
  decodeRouteSegment,
  getCategoryLabel,
  getCategoryPageTitle,
  getSubcategoryLabel,
  getTypeLabel,
  useProductsCatalog,
} from "@/entities/product";

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

  const categoryTitle = category
    ? getCategoryPageTitle(category, labels)
    : undefined;
  const categoryShortLabel = category
    ? getCategoryLabel(category, labels)
    : undefined;
  const subcategoryTitle = subcategory
    ? getSubcategoryLabel(subcategory, labels)
    : undefined;
  const typeTitle = type ? getTypeLabel(type, labels) : undefined;

  const title =
    (typeTitle && subcategoryTitle && typeTitle !== subcategoryTitle
      ? `${subcategoryTitle} — ${typeTitle}`
      : typeTitle) ||
    subcategoryTitle ||
    categoryTitle ||
    "Все товары";

  const siteUrl = getPublicSiteUrl();
  const breadcrumbItems: Array<{ name: string; item: string }> = [
    { name: "Главная", item: `${siteUrl}/` },
    { name: "Каталог", item: `${siteUrl}/products` },
  ];

  if (category && categoryShortLabel) {
    breadcrumbItems.push({
      name: categoryShortLabel,
      item: `${siteUrl}/products/${encodeURIComponent(category)}`,
    });
  }
  if (category && subcategory && subcategoryTitle) {
    breadcrumbItems.push({
      name: subcategoryTitle,
      item: `${siteUrl}/products/${encodeURIComponent(category)}/${encodeURIComponent(subcategory)}`,
    });
  }
  if (category && subcategory && type && typeTitle) {
    breadcrumbItems.push({
      name: typeTitle,
      item: `${siteUrl}/products/${encodeURIComponent(category)}/${encodeURIComponent(subcategory)}/${encodeURIComponent(type)}`,
    });
  }

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbItems.map((entry, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: entry.name,
      item: entry.item,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <h1 className="text-3xl sm:text-4xl font-medium tight">
        {title}
      </h1>
      <p className="mt-2 text-muted-foreground">
        Посмотрите нашу коллекцию товаров
      </p>
    </>
  );
}
