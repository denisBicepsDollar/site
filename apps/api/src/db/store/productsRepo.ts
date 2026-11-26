import db from "@/db/index";
import { productsInProducts, productVariantsInProducts } from "@drizzle/schema";
import { and, count, eq, exists, gte, inArray, lte } from "drizzle-orm";
import { buildProductSearchSql } from "./productSearch";

export async function counts(
  minPrice?: number,
  maxPrice?: number,
  sizes?: string[],
  search?: string,
) {
  const searchSql = buildProductSearchSql(productsInProducts, search);
  const hasVariantFilters =
    minPrice !== undefined ||
    maxPrice !== undefined ||
    (sizes && sizes.length > 0);

  const rows = await db
    .select({
      category: productsInProducts.category,
      subcategory: productsInProducts.subcategory,
      count: count(),
    })
    .from(productsInProducts)
    .where(
      and(
        searchSql,
        hasVariantFilters
          ? exists(
              db
                .select()
                .from(productVariantsInProducts)
                .where(
                  and(
                    eq(
                      productVariantsInProducts.productId,
                      productsInProducts.id,
                    ),
                    minPrice !== undefined
                      ? gte(productVariantsInProducts.price, minPrice)
                      : undefined,
                    maxPrice !== undefined
                      ? lte(productVariantsInProducts.price, maxPrice)
                      : undefined,
                    sizes && sizes.length > 0
                      ? inArray(productVariantsInProducts.name, sizes)
                      : undefined,
                  ),
                ),
            )
          : undefined,
      ),
    )
    .groupBy(productsInProducts.category, productsInProducts.subcategory);

  const result = {
    total: 0,
    categories: {} as Record<string, number>,
    subcategories: {} as Record<string, number>,
    byCategory: {} as Record<string, Record<string, number>>,
  };

  for (const row of rows) {
    const num = Number(row.count);
    result.total += num;

    if (row.category) {
      result.categories[row.category] =
        (result.categories[row.category] ?? 0) + num;
    }

    if (row.subcategory) {
      result.subcategories[row.subcategory] =
        (result.subcategories[row.subcategory] ?? 0) + num;
    }

    if (row.category && row.subcategory) {
      const catSubs = result.byCategory[row.category] ?? {};
      catSubs[row.subcategory] = (catSubs[row.subcategory] ?? 0) + num;
      result.byCategory[row.category] = catSubs;
    }
  }

  return result;
}
