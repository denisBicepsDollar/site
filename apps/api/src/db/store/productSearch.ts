import { and, or, sql, type SQL } from "drizzle-orm";
import { productsInProducts, productVariantsInProducts } from "@drizzle/schema";

export function escapeLikePattern(value: string): string {
  return value.replace(/[\\%_]/g, "\\$&");
}

export function normalizeSearchText(value: string): string {
  return value.trim().toLowerCase().replace(/ё/g, "е");
}

export function splitSearchTokens(search?: string): string[] {
  if (!search) return [];
  const normalized = normalizeSearchText(search);
  if (!normalized) return [];
  return Array.from(new Set(normalized.split(/\s+/).filter(Boolean))).slice(
    0,
    8,
  );
}

function normalizedTextContains(column: unknown, pattern: string): SQL {
  return sql`replace(lower(coalesce(${column}, '')), 'ё', 'е') like ${pattern} escape '\\'`;
}

export function buildProductSearchSql(
  productsTable: Pick<
    typeof productsInProducts,
    | "id"
    | "name"
    | "shortDescription"
    | "description"
    | "careInstructions"
    | "sku"
    | "slug"
    | "category"
    | "subcategory"
    | "type"
    | "subtype"
    | "tags"
  >,
  search?: string,
): SQL | undefined {
  const tokens = splitSearchTokens(search);
  if (tokens.length === 0) return undefined;

  const tokenConditions = tokens.map((token) => {
    const pattern = `%${escapeLikePattern(token)}%`;

    return or(
      normalizedTextContains(productsTable.name, pattern),
      normalizedTextContains(productsTable.shortDescription, pattern),
      normalizedTextContains(productsTable.description, pattern),
      normalizedTextContains(productsTable.careInstructions, pattern),
      normalizedTextContains(productsTable.sku, pattern),
      normalizedTextContains(productsTable.slug, pattern),
      normalizedTextContains(productsTable.category, pattern),
      normalizedTextContains(productsTable.subcategory, pattern),
      normalizedTextContains(productsTable.type, pattern),
      normalizedTextContains(productsTable.subtype, pattern),
      normalizedTextContains(
        sql`array_to_string(${productsTable.tags}, ' ')`,
        pattern,
      ),
      sql`exists (
        select 1
        from ${productVariantsInProducts} as "pv_search"
        where "pv_search"."product_id" = ${productsTable.id}
          and replace(lower(coalesce("pv_search"."name", '')), 'ё', 'е') like ${pattern} escape '\\'
      )`,
    )!;
  });

  return tokenConditions.length === 1
    ? tokenConditions[0]
    : and(...tokenConditions);
}
