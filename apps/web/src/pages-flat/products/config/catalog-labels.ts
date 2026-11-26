export interface CatalogLabels {
  categories?: Record<string, string>;
  pageTitles?: Record<string, string>;
  subcategories?: Record<string, string>;
  types?: Record<string, string>;
  order?: {
    category?: Record<string, number>;
    subcategory?: Record<string, number>;
    type?: Record<string, number>;
  };
}

export function decodeRouteSegment(value?: string): string | undefined {
  if (!value) return undefined;
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function findInMap(
  map: Record<string, string> | undefined,
  key: string,
): string | undefined {
  if (!map) return undefined;
  if (map[key]) return map[key];

  const lower = key.toLowerCase();
  if (map[lower]) return map[lower];

  for (const [entryKey, entryValue] of Object.entries(map)) {
    if (entryKey.toLowerCase() === lower && entryValue) {
      return entryValue;
    }
  }

  return undefined;
}

function lookupLabel(
  key: string,
  primary?: Record<string, string>,
  secondary?: Record<string, string>,
): string {
  const trimmed = key.trim();
  if (!trimmed) return key;

  return (
    findInMap(primary, trimmed) ??
    findInMap(secondary, trimmed) ??
    trimmed
  );
}

export function getCategoryLabel(key: string, labels?: CatalogLabels): string {
  return lookupLabel(key, labels?.categories);
}

export function getCategoryPageTitle(
  key: string,
  labels?: CatalogLabels,
): string {
  return lookupLabel(key, labels?.pageTitles, labels?.categories);
}

export function getSubcategoryLabel(
  key: string,
  labels?: CatalogLabels,
): string {
  return lookupLabel(key, labels?.subcategories, labels?.types);
}

export function getTypeLabel(key: string, labels?: CatalogLabels): string {
  return lookupLabel(key, labels?.types, labels?.subcategories);
}

export function getLabelSortOrder(
  kind: "category" | "subcategory" | "type",
  key: string,
  labels?: CatalogLabels,
): number | undefined {
  const map = labels?.order?.[kind];
  if (!map) return undefined;
  if (map[key] !== undefined) return map[key];

  const lower = key.toLowerCase();
  if (map[lower] !== undefined) return map[lower];

  for (const [entryKey, order] of Object.entries(map)) {
    if (entryKey.toLowerCase() === lower) {
      return order;
    }
  }

  return undefined;
}
