"use client";

import {
  createContext,
  createElement,
  useContext,
  useEffect,
  useMemo,
  type ReactNode,
} from "react";
import {
  useInfiniteQuery,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useParams, useSearchParams } from "next/navigation";
import type { CatalogLabels } from "../config/catalog-labels";
import { ALLOWED_CATALOG_SEARCH_KEYS } from "./catalog-route";

export interface ProductsMeta {
  counts?: {
    total?: number;
    categories?: Record<string, number>;
    subcategories?: Record<string, number>;
    byCategory?: Record<string, Record<string, number>>;
    typesByCategory?: Record<string, Record<string, Record<string, number>>>;
  };
  labels?: CatalogLabels;
  prices?: { minPrice?: number | null; maxPrice?: number | null };
  sizes?: Array<{ size: string; stock: number }>;
  hasMore?: boolean;
  page?: number;
  limit?: number;
  totalPages?: number;
  total?: number;
}

export interface ProductsApiResponse {
  data: any[];
  meta?: ProductsMeta;
  isError?: boolean;
}

const PRODUCTS_PER_PAGE = 12;
const PRODUCTS_META_KEY = ["products-meta"] as const;

async function fetchProducts(
  params: Record<string, string>,
  page: number,
): Promise<ProductsApiResponse> {
  const urlParams = new URLSearchParams({
    ...params,
    page: String(page),
  });
  const res = await fetch(`/api/products?${urlParams.toString()}`);
  if (!res.ok) throw new Error("Ошибка загрузки товаров");
  return res.json();
}

function decodeParamValue(value?: string | string[]): string | undefined {
  const raw = Array.isArray(value) ? value[0] : value;
  if (!raw) return undefined;
  try {
    return decodeURIComponent(raw).trim() || undefined;
  } catch {
    return raw.trim() || undefined;
  }
}

function buildFilters(
  routeParams: Record<string, string | string[] | undefined> | null,
  searchParams: { forEach(cb: (value: string, key: string) => void): void },
): Record<string, string> {
  const filters: Record<string, string> = {};

  searchParams.forEach((value, key) => {
    if (!ALLOWED_CATALOG_SEARCH_KEYS.has(key)) return;
    const trimmed = value.trim();
    if (!trimmed) return;
    if (key === "sort" && trimmed === "score") return;
    filters[key] = trimmed;
  });

  const category = decodeParamValue(routeParams?.category);
  if (category) {
    filters.category = category;
  }

  const subcategory = decodeParamValue(routeParams?.subcategory);
  if (subcategory) {
    filters.subcategory = subcategory;
  }

  const type = decodeParamValue(routeParams?.type);
  if (type) {
    filters.type = type;
  }

  return filters;
}

function serializeFilters(filters: Record<string, string>): string {
  return Object.keys(filters)
    .sort()
    .map((key) => `${key}=${filters[key]}`)
    .join("&");
}

function isValidInitialResponse(data: any): data is ProductsApiResponse {
  return Boolean(data && !data.isError && Array.isArray(data.data));
}

function hasMetaContent(meta: any): meta is ProductsMeta {
  return Boolean(
    meta &&
      typeof meta === "object" &&
      (meta.counts !== undefined ||
        meta.labels !== undefined ||
        meta.prices !== undefined ||
        meta.sizes !== undefined),
  );
}

function hasLabelsContent(labels?: CatalogLabels): boolean {
  return Boolean(
    labels &&
      (Object.keys(labels.categories ?? {}).length > 0 ||
        Object.keys(labels.subcategories ?? {}).length > 0 ||
        Object.keys(labels.types ?? {}).length > 0),
  );
}

const CatalogLabelsContext = createContext<CatalogLabels | undefined>(
  undefined,
);

const CatalogMetaContext = createContext<ProductsMeta | undefined>(undefined);

export function CatalogLabelsProvider({
  initialLabels,
  initialMeta,
  children,
}: {
  initialLabels?: CatalogLabels;
  initialMeta?: ProductsMeta;
  children: ReactNode;
}) {
  return createElement(
    CatalogLabelsContext.Provider,
    { value: initialLabels },
    createElement(CatalogMetaContext.Provider, { value: initialMeta }, children),
  );
}

function useProductsCatalogQuery(
  initialData?: ProductsApiResponse,
  initialFilters: Record<string, string> = {},
) {
  const queryClient = useQueryClient();
  const routeParams = useParams<Record<string, string | string[] | undefined>>();
  const searchParams = useSearchParams();

  const filters = useMemo(
    () => buildFilters(routeParams, searchParams),
    [routeParams, searchParams],
  );

  const canUseInitialData =
    isValidInitialResponse(initialData) &&
    serializeFilters(filters) === serializeFilters(initialFilters);

  const productsQuery = useInfiniteQuery({
    queryKey: ["products", filters],
    queryFn: ({ pageParam }) => fetchProducts(filters, pageParam),
    initialPageParam: 1,
    initialData: canUseInitialData
      ? { pages: [initialData], pageParams: [1] }
      : undefined,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage?.meta?.hasMore !== undefined) {
        return lastPage.meta.hasMore ? allPages.length + 1 : undefined;
      }
      const items = lastPage?.data ?? [];
      return items.length >= PRODUCTS_PER_PAGE
        ? allPages.length + 1
        : undefined;
    },
  });

  const products = useMemo(() => {
    const rawProducts =
      productsQuery.data?.pages.flatMap((page) => page?.data ?? []) ?? [];
    const seenIds = new Set<string | number>();
    return rawProducts.filter((product) => {
      if (!product || product.id == null) return false;
      if (seenIds.has(product.id)) return false;
      seenIds.add(product.id);
      return true;
    });
  }, [productsQuery.data]);

  const pageMeta = productsQuery.data?.pages?.[0]?.meta;
  const currentMeta = hasMetaContent(pageMeta)
    ? pageMeta
    : canUseInitialData && hasMetaContent(initialData?.meta)
      ? initialData.meta
      : undefined;

  useEffect(() => {
    if (currentMeta) {
      queryClient.setQueryData(PRODUCTS_META_KEY, currentMeta);
    }
  }, [currentMeta, queryClient]);

  const metaFallbackQuery = useQuery<ProductsMeta | null>({
    queryKey: PRODUCTS_META_KEY,
    queryFn: () => null,
    enabled: false,
    staleTime: Infinity,
  });

  const contextLabels = useContext(CatalogLabelsContext);
  const contextMeta = useContext(CatalogMetaContext);
  const meta = currentMeta ?? metaFallbackQuery.data ?? contextMeta ?? {};
  const labels = hasLabelsContent(meta.labels)
    ? meta.labels!
    : (contextLabels ?? meta.labels ?? {});

  return {
    ...productsQuery,
    products,
    counts: meta.counts ?? {},
    labels,
    prices: meta.prices ?? {},
    sizes: meta.sizes ?? [],
  };
}

type ProductsCatalogResult = ReturnType<typeof useProductsCatalogQuery>;

const ProductsCatalogContext = createContext<ProductsCatalogResult | null>(
  null,
);

export function ProductsCatalogProvider({
  initialData,
  initialFilters = {},
  children,
}: {
  initialData?: ProductsApiResponse;
  initialFilters?: Record<string, string>;
  children: ReactNode;
}) {
  const value = useProductsCatalogQuery(initialData, initialFilters);
  return createElement(ProductsCatalogContext.Provider, { value }, children);
}

export function useProductsCatalog() {
  const context = useContext(ProductsCatalogContext);
  const contextLabels = useContext(CatalogLabelsContext);
  const contextMeta = useContext(CatalogMetaContext);

  // Sidebar components in layout.tsx sit outside ProductsCatalogProvider and
  // passively read cached meta without initiating competing page-1 queries.
  const metaQuery = useQuery<ProductsMeta | null>({
    queryKey: PRODUCTS_META_KEY,
    queryFn: () => null,
    enabled: false,
    staleTime: Infinity,
  });

  if (context) {
    return context;
  }

  const meta = metaQuery.data ?? contextMeta ?? {};
  const labels = hasLabelsContent(meta.labels)
    ? meta.labels!
    : (contextLabels ?? meta.labels ?? {});

  return {
    products: [] as any[],
    counts: meta.counts ?? {},
    labels,
    prices: meta.prices ?? {},
    sizes: meta.sizes ?? [],
    fetchNextPage: async () => undefined,
    refetch: async () => undefined,
    hasNextPage: false,
    isFetching: false,
    isFetchingNextPage: false,
    isFetchNextPageError: false,
    isLoading: false,
    isError: false,
  };
}
