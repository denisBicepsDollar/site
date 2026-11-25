import type { SearchParams } from "@/controllers/store/productController";
import db from "@/db/index";
import { productsInProducts, productVariantsInProducts } from "@drizzle/schema";

import {
  and,
  count,
  eq,
  exists,
  gte,
  ilike,
  inArray,
  lte,
  or,
} from "drizzle-orm";

export async function counts(
  minPrice?: number,
  maxPrice?: number,
  sizes?: string[],
  search?: string,
) {
  const searchPattern = search ? `%${search}%` : undefined;
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
        searchPattern
          ? or(
              ilike(productsInProducts.name, searchPattern),
              ilike(productsInProducts.shortDescription, searchPattern),
              ilike(productsInProducts.sku, searchPattern),
            )
          : undefined,
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
  }

  return result;
}
