import type { Request, Response } from "express";
import * as productService from "@/services/store/productService.js";
import getLogger from "@/utils/logger";

const moduleName = "productController";

export type SearchParams = {
  size?: string | undefined; // приходит строкой а надо массивом
  category?: string | undefined;
  subcategory?: string | undefined;
  type?: string | undefined;
  minPrice?: string | undefined;
  maxPrice?: string | undefined;
  q?: string | undefined;
  page?: string | undefined;
  sort?: string | undefined;
};

function normalizeQueryString(value: unknown): string | undefined {
  if (typeof value === "string") return value;
  if (Array.isArray(value)) {
    for (let i = value.length - 1; i >= 0; i -= 1) {
      if (typeof value[i] === "string" && value[i].trim() !== "") {
        return value[i];
      }
    }
  }
  return undefined;
}

function normalizeSizeQuery(value: unknown): string | undefined {
  if (typeof value === "string") return value;
  if (Array.isArray(value)) {
    const joined = value
      .filter((item): item is string => typeof item === "string")
      .join(",");
    return joined || undefined;
  }
  return undefined;
}

function normalizeSearchParams(rawQuery: Record<string, unknown>): SearchParams {
  return {
    size: normalizeSizeQuery(rawQuery.size),
    category: normalizeQueryString(rawQuery.category),
    subcategory: normalizeQueryString(rawQuery.subcategory),
    type: normalizeQueryString(rawQuery.type),
    minPrice: normalizeQueryString(rawQuery.minPrice),
    maxPrice: normalizeQueryString(rawQuery.maxPrice),
    q: normalizeQueryString(rawQuery.q),
    page: normalizeQueryString(rawQuery.page),
    sort: normalizeQueryString(rawQuery.sort),
  };
}

export async function list(req: Request, res: Response) {
  getLogger(moduleName).child({
    function: "list",
  });

  const searchParams = normalizeSearchParams(
    (req.query ?? {}) as Record<string, unknown>,
  );
  const page = Math.max(1, Number(searchParams.page) || 1);

  // Если это 2-я страница и дальше — не грузим базу лишними запросами за sizes, prices и counts
  if (page > 1) {
    const { items, hasMore, limit } = await productService.listPage(searchParams);

    return res.status(200).json({
      data: items,
      meta: { hasMore, page, limit },
    });
  }

  // Только для первой страницы (или при смене фильтров) считаем всю мету
  const [{ items, hasMore, limit }, sizes, prices, counts, labels] =
    await Promise.all([
      productService.listPage(searchParams),
      productService.sizes(searchParams),
      productService.prices(searchParams),
      productService.counts(searchParams),
      productService.labels(),
    ]);

  const meta = { sizes, prices, counts, labels, hasMore, page, limit };

  return res.status(200).json({
    data: items,
    meta,
  });
}

export async function getLabels(_req: Request, res: Response) {
  const labels = await productService.labels();
  return res.status(200).json(labels);
}

export async function getOneProduct(req: Request, res: Response) {
  getLogger(moduleName).child({
    function: "getOne",
  });
  const slug = String(req.params.slug ?? "");
  const product = await productService.getOneProduct(slug);
  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }
  return res.status(200).json(product);
}

export async function getVariants(req: Request, res: Response) {
  getLogger(moduleName).child({
    function: "getOneVariant",
  });
  const { variantId: variantIds } = req.query;
  const normalizedIds = Array.isArray(variantIds)
    ? variantIds.filter((id): id is string => typeof id === "string" && id.trim() !== "")
    : typeof variantIds === "string" && variantIds.trim() !== ""
      ? [variantIds]
      : [];
  const product = await productService.getVariants(normalizedIds);
  return res.status(200).json(product);
}
