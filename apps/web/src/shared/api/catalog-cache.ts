import "server-only";

import { getCatalogLabels, getProductBySlug, getProducts } from "./api";
import {
  extractHeroDataFromResponse,
  type HeroData,
  type HeroFeaturedProduct,
} from "./hero-data";
import type { CatalogLabels, ProductsApiResponse } from "./types";

export type { HeroData, HeroFeaturedProduct };

export async function getCachedCatalogLabels(): Promise<CatalogLabels> {
  try {
    return await getCatalogLabels({ noStore: true });
  } catch {
    return {};
  }
}

export async function getCachedCatalogProducts(filters: {
  category?: string;
  subcategory?: string;
  type?: string;
  page?: string;
}): Promise<ProductsApiResponse> {
  try {
    return await getProducts(
      {
        ...(filters.category ? { category: filters.category } : {}),
        ...(filters.subcategory ? { subcategory: filters.subcategory } : {}),
        ...(filters.type ? { type: filters.type } : {}),
        page: filters.page ?? "1",
      },
      { noStore: true },
    );
  } catch {
    return { data: [], meta: {}, isError: true };
  }
}

export async function getCachedProductBySlug(slug: string): Promise<{
  data: any | null;
  isError: boolean;
}> {
  try {
    const result = await getProductBySlug(slug, { noStore: true });
    return {
      data: result?.data ?? null,
      isError: false,
    };
  } catch {
    return { data: null, isError: true };
  }
}

export async function getCachedHeroData(): Promise<HeroData> {
  try {
    const body = await getProducts({ sort: "sales" }, { noStore: true });
    if (body && !body.isError) {
      return extractHeroDataFromResponse(body);
    }
  } catch {
    // Return empty hero data if backend is unavailable.
  }

  return { product: null, totalCount: null };
}

export function isCacheableCatalogFilters(
  filters: Record<string, string>,
): boolean {
  return Boolean(
    !filters.q &&
      !filters.size &&
      !filters.minPrice &&
      !filters.maxPrice &&
      (!filters.sort || filters.sort === "score"),
  );
}

export async function fetchCatalogPageData(
  initialFilters: Record<string, string>,
): Promise<ProductsApiResponse> {
  if (isCacheableCatalogFilters(initialFilters)) {
    return await getCachedCatalogProducts({
      category: initialFilters.category,
      subcategory: initialFilters.subcategory,
      type: initialFilters.type,
      page: "1",
    });
  }

  return await getProducts(
    { ...initialFilters, page: "1" },
    { noStore: true },
  );
}
