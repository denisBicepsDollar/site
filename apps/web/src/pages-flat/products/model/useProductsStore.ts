// src/pages-flat/products/model/useProductsCatalog.ts
"use client";

import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";

// Типизируем ответ вашего Express
interface ProductsApiResponse {
  data: any[]; // Замените any на ваш тип Product
  meta?: {
    counts?: any;
    prices?: { minPrice?: number; maxPrice?: number };
    sizes?: any[];
    totalPages?: number; // Если Express присылает общее число страниц
    total?: number; // Или общее число товаров
  };
}

async function fetchProducts(params: Record<string, string>, page: number) {
  const urlParams = new URLSearchParams({
    ...params,
    page: String(page),
  });
  const res = await fetch(`/api/products?${urlParams.toString()}`);
  if (!res.ok) throw new Error("Ошибка загрузки товаров");
  return res.json();
}

export function useProductsCatalog(initialData?: any) {
  const searchParams = useSearchParams();

  const filters: Record<string, string> = {};
  searchParams.forEach((value, key) => {
    if (key !== "page" && value) {
      filters[key] = value;
    }
  });

  const isDefaultCatalog = Object.keys(filters).length === 0;

  // 1. META грузится ОДИН РАЗ (статичный ключ ["products-meta"])
  // Даже если в URL появятся фильтры, этот кеш не сбросится!
  const metaQuery = useQuery({
    queryKey: ["products-meta"],
    queryFn: async () => {
      const res = await fetchProducts({}, 1);
      return res.meta ?? {};
    },
    initialData: initialData?.meta, // Берем сразу с ISR-сервера!
    staleTime: Infinity, // Никогда не считаем устаревшим в рамках сессии
  });

  // 2. ТОВАРЫ грузятся бесконечно и меняются при смене filters
  const productsQuery = useInfiniteQuery({
    queryKey: ["products", filters],
    queryFn: ({ pageParam }) => fetchProducts(filters, pageParam),
    initialPageParam: 1,
    initialData:
      isDefaultCatalog && initialData
        ? { pages: [initialData], pageParams: [1] }
        : undefined,
    getNextPageParam: (lastPage, allPages) => {
      const items = lastPage?.data ?? [];
      return items.length === 12 ? allPages.length + 1 : undefined;
    },
  });

  const products =
    productsQuery.data?.pages.flatMap((page) => page.data ?? []) ?? [];
  const meta = metaQuery.data ?? {};

  
  return {
    ...productsQuery,
    products,
    counts: meta.counts ?? {},
    prices: meta.prices ?? {},
    sizes: meta.sizes ?? [],
  };
}
