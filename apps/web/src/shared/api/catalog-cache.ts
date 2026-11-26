import "server-only";

import { cacheLife, cacheTag } from "next/cache";
import type {
  CatalogLabels,
  ProductsApiResponse,
} from "@/pages-flat/products";
import { getProducts } from "./api";

const getBackendUrl = () =>
  process.env.BACKEND_URL || "http://localhost:3000";

const CATALOG_CACHE_LIFE = {
  stale: 60,
  revalidate: 60,
  expire: 3600,
} as const;

const NO_ERROR_CACHE_LIFE = {
  stale: 0,
  revalidate: 0,
  expire: 0,
} as const;

type CachedResult<T> = {
  ok: boolean;
  data: T;
};

type CachedProductResult = {
  ok: boolean;
  notFound: boolean;
  data: any | null;
};

async function fetchCatalogLabelsCached(): Promise<CachedResult<CatalogLabels>> {
  "use cache";
  cacheTag("catalog", "catalog-labels");

  try {
    const res = await fetch(`${getBackendUrl()}/api/v1/products/labels`);
    if (!res.ok) {
      cacheLife(NO_ERROR_CACHE_LIFE);
      return { ok: false, data: {} };
    }

    const data = (await res.json()) as CatalogLabels;
    cacheLife(CATALOG_CACHE_LIFE);
    return { ok: true, data };
  } catch {
    cacheLife(NO_ERROR_CACHE_LIFE);
    return { ok: false, data: {} };
  }
}

export async function getCachedCatalogLabels(): Promise<CatalogLabels> {
  try {
    const result = await fetchCatalogLabelsCached();
    return result.data;
  } catch {
    return {};
  }
}

async function fetchCatalogProductsCached(
  category: string,
  subcategory: string,
  type: string,
  page: string,
): Promise<CachedResult<ProductsApiResponse>> {
  "use cache";
  cacheTag(
    "catalog",
    "catalog-products",
    ...(category ? [`catalog-category:${category}`] : []),
    ...(subcategory ? [`catalog-subcategory:${subcategory}`] : []),
    ...(type ? [`catalog-type:${type}`] : []),
  );

  const params = new URLSearchParams();
  if (category) params.set("category", category);
  if (subcategory) params.set("subcategory", subcategory);
  if (type) params.set("type", type);
  if (page) params.set("page", page);

  try {
    const res = await fetch(
      `${getBackendUrl()}/api/v1/products?${params.toString()}`,
    );
    if (!res.ok) {
      cacheLife(NO_ERROR_CACHE_LIFE);
      return { ok: false, data: { data: [], meta: {}, isError: true } };
    }

    const data = (await res.json()) as ProductsApiResponse;
    cacheLife(CATALOG_CACHE_LIFE);
    return { ok: true, data };
  } catch {
    cacheLife(NO_ERROR_CACHE_LIFE);
    return { ok: false, data: { data: [], meta: {}, isError: true } };
  }
}

export async function getCachedCatalogProducts(filters: {
  category?: string;
  subcategory?: string;
  type?: string;
  page?: string;
}): Promise<ProductsApiResponse> {
  try {
    const result = await fetchCatalogProductsCached(
      filters.category ?? "",
      filters.subcategory ?? "",
      filters.type ?? "",
      filters.page ?? "1",
    );
    return result.data;
  } catch {
    return { data: [], meta: {}, isError: true };
  }
}

async function fetchProductBySlugCached(
  slug: string,
): Promise<CachedProductResult> {
  "use cache";
  cacheTag("catalog", `product:${slug}`);

  try {
    const res = await fetch(
      `${getBackendUrl()}/api/v1/products/${encodeURIComponent(slug)}`,
    );
    if (res.status === 404) {
      cacheLife(CATALOG_CACHE_LIFE);
      return { ok: true, notFound: true, data: null };
    }
    if (!res.ok) {
      cacheLife(NO_ERROR_CACHE_LIFE);
      return { ok: false, notFound: false, data: null };
    }

    const data = await res.json();
    cacheLife(CATALOG_CACHE_LIFE);
    return { ok: true, notFound: false, data };
  } catch {
    cacheLife(NO_ERROR_CACHE_LIFE);
    return { ok: false, notFound: false, data: null };
  }
}

export async function getCachedProductBySlug(slug: string): Promise<{
  data: any | null;
  isError: boolean;
}> {
  try {
    const result = await fetchProductBySlugCached(slug);
    return {
      data: result.data,
      isError: !result.ok,
    };
  } catch {
    return { data: null, isError: true };
  }
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
