import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getCachedCatalogLabels,
  getCachedCatalogProducts,
} from "@/shared/api/catalog-cache";
import { DEFAULT_OG_IMAGE, SITE_NAME } from "@/shared/config/site";
import {
  decodeRouteSegment,
  getCategoryLabel,
  getCategoryPageTitle,
  getSubcategoryLabel,
  getTypeLabel,
} from "../config/catalog-labels";
import { isUnknownEmptyCatalogRoute } from "./catalog-route";

type RawSearchParams = Record<string, string | string[] | undefined>;

export interface CatalogMetadataInput {
  category?: string;
  subcategory?: string;
  type?: string;
  searchParams?: Promise<RawSearchParams>;
}

function getSingleParam(value: string | string[] | undefined): string | undefined {
  if (value === undefined) return undefined;
  const raw = Array.isArray(value) ? value[value.length - 1] : value;
  const trimmed = raw?.trim();
  return trimmed || undefined;
}

export async function buildCatalogMetadata({
  category,
  subcategory,
  type,
  searchParams,
}: CatalogMetadataInput = {}): Promise<Metadata> {
  const resolvedSearch: RawSearchParams = searchParams
    ? await searchParams
    : {};

  const pageNum = Math.max(
    1,
    Number(getSingleParam(resolvedSearch.page)) || 1,
  );
  const q = getSingleParam(resolvedSearch.q);
  const size = getSingleParam(resolvedSearch.size);
  const minPrice = getSingleParam(resolvedSearch.minPrice);
  const maxPrice = getSingleParam(resolvedSearch.maxPrice);
  const sort = getSingleParam(resolvedSearch.sort);
  const typeQuery = getSingleParam(resolvedSearch.type);

  const hasFacetParams = Boolean(
    q ||
      size ||
      minPrice ||
      maxPrice ||
      (sort && sort !== "score") ||
      typeQuery,
  );

  const decodedCategory = decodeRouteSegment(category)?.trim();
  const decodedSubcategory = decodeRouteSegment(subcategory)?.trim();
  const decodedType = decodeRouteSegment(type ?? typeQuery)?.trim();

  const [labels, routeData] = await Promise.all([
    getCachedCatalogLabels(),
    decodedCategory
      ? getCachedCatalogProducts({
          category: decodedCategory,
          subcategory: decodedSubcategory,
          type: type ? decodedType : undefined,
          page: "1",
        })
      : Promise.resolve(undefined),
  ]);

  if (
    decodedCategory &&
    routeData &&
    isUnknownEmptyCatalogRoute(routeData, {
      category: decodedCategory,
      ...(decodedSubcategory ? { subcategory: decodedSubcategory } : {}),
      ...(type && decodedType ? { type: decodedType } : {}),
    })
  ) {
    notFound();
  }

  const categoryLabel = decodedCategory
    ? getCategoryLabel(decodedCategory, labels)
    : undefined;
  const categoryTitle = decodedCategory
    ? getCategoryPageTitle(decodedCategory, labels)
    : undefined;
  const subcategoryLabel = decodedSubcategory
    ? getSubcategoryLabel(decodedSubcategory, labels)
    : undefined;
  const typeLabel = decodedType
    ? getTypeLabel(decodedType, labels)
    : undefined;

  let baseTitle = "Каталог растений";
  let description = `Полный каталог комнатных и садовых растений интернет-магазина «${SITE_NAME}». Фильтры по категориям, размеру горшка и цене с доставкой.`;

  if (decodedCategory && decodedSubcategory && decodedType && subcategoryLabel && typeLabel && categoryLabel) {
    const combinedHeading =
      typeLabel !== subcategoryLabel
        ? `${subcategoryLabel} — ${typeLabel}`
        : subcategoryLabel;
    baseTitle = `${combinedHeading} (${categoryLabel})`;
    description = `${combinedHeading} в разделе «${categoryLabel}»: актуальные цены, размеры горшков и наличие в интернет-магазине «${SITE_NAME}».`;
  } else if (decodedCategory && decodedSubcategory && subcategoryLabel && categoryLabel) {
    baseTitle = `${subcategoryLabel} — ${categoryLabel}`;
    description = `${subcategoryLabel} в категории «${categoryLabel}»: подбор по сорту, размеру и цене с бережной доставкой в «${SITE_NAME}».`;
  } else if (decodedCategory && categoryTitle) {
    baseTitle = categoryTitle;
    description = `${categoryTitle} в интернет-магазине «${SITE_NAME}». Удобный подбор по видам, размеру горшка и цене с доставкой.`;
  }

  const title =
    pageNum > 1
      ? `${baseTitle} — страница ${pageNum} | ${SITE_NAME}`
      : `${baseTitle} | ${SITE_NAME}`;

  const finalDescription =
    pageNum > 1 ? `${description} Страница ${pageNum}.` : description;

  const segments = [
    decodedCategory,
    decodedSubcategory,
    type ? decodedType : undefined,
  ].filter(Boolean) as string[];

  const canonicalPath =
    segments.length > 0
      ? `/products/${segments.map((s) => encodeURIComponent(s)).join("/")}`
      : "/products";

  return {
    title,
    description: finalDescription,
    alternates: {
      canonical: canonicalPath,
    },
    robots:
      hasFacetParams || pageNum > 1
        ? { index: false, follow: true }
        : { index: true, follow: true },
    openGraph: {
      type: "website",
      locale: "ru_RU",
      title,
      description: finalDescription,
      url: canonicalPath,
      siteName: SITE_NAME,
      images: [
        {
          url: DEFAULT_OG_IMAGE,
          alt: baseTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: finalDescription,
      images: [DEFAULT_OG_IMAGE],
    },
  };
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams?: Promise<RawSearchParams>;
}) {
  return buildCatalogMetadata({ searchParams });
}
