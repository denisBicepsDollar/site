import type { ProductsApiResponse } from "../model/use-products-store";
import { decodeRouteSegment } from "../config/catalog-labels";

export function normalizeCatalogFilters(
  search: Record<string, string | string[] | undefined>,
  route: Record<string, string | undefined> = {},
): Record<string, string> {
  const filters: Record<string, string> = {};

  for (const [key, value] of Object.entries(search)) {
    if (key === "page" || value === undefined) continue;
    const normalized = Array.isArray(value) ? value[value.length - 1] : value;
    if (normalized) {
      filters[key] = normalized;
    }
  }

  for (const [key, value] of Object.entries(route)) {
    const decoded = decodeRouteSegment(value);
    if (decoded) {
      filters[key] = decoded;
    }
  }

  return filters;
}

function hasKeyIgnoreCase(
  record: Record<string, unknown> | undefined,
  target?: string,
): boolean {
  if (!record || !target) return false;
  const lower = target.toLowerCase();
  return Object.keys(record).some((key) => key.toLowerCase() === lower);
}

function findValueIgnoreCase<T>(
  record: Record<string, T> | undefined,
  target?: string,
): T | undefined {
  if (!record || !target) return undefined;
  if (record[target] !== undefined) return record[target];
  const lower = target.toLowerCase();
  for (const [key, value] of Object.entries(record)) {
    if (key.toLowerCase() === lower) return value;
  }
  return undefined;
}

export function isUnknownEmptyCatalogRoute(
  data: ProductsApiResponse | undefined,
  initialFilters: Record<string, string>,
): boolean {
  if (!data || data.isError || !Array.isArray(data.data)) return false;
  if (data.data.length > 0) return false;

  if (
    initialFilters.q ||
    initialFilters.size ||
    initialFilters.minPrice ||
    initialFilters.maxPrice
  ) {
    return false;
  }

  const { category, subcategory, type } = initialFilters;
  const counts = data.meta?.counts;
  const labels = data.meta?.labels;

  if (type && category && subcategory) {
    const catTypes = findValueIgnoreCase(counts?.typesByCategory, category);
    const subTypes = findValueIgnoreCase(catTypes, subcategory);
    return (
      !hasKeyIgnoreCase(subTypes, type) && !hasKeyIgnoreCase(labels?.types, type)
    );
  }

  if (subcategory && category) {
    const catSubs = findValueIgnoreCase(counts?.byCategory, category);
    return (
      !hasKeyIgnoreCase(catSubs, subcategory) &&
      !hasKeyIgnoreCase(labels?.subcategories, subcategory) &&
      !hasKeyIgnoreCase(labels?.types, subcategory)
    );
  }

  if (category) {
    return (
      !hasKeyIgnoreCase(counts?.categories, category) &&
      !hasKeyIgnoreCase(labels?.categories, category)
    );
  }

  return false;
}
