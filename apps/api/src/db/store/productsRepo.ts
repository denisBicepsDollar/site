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
      type: productsInProducts.type,
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
    .groupBy(
      productsInProducts.category,
      productsInProducts.subcategory,
      productsInProducts.type,
    );

  const result = {
    total: 0,
    categories: {} as Record<string, number>,
    subcategories: {} as Record<string, number>,
    byCategory: {} as Record<string, Record<string, number>>,
    typesByCategory: {} as Record<
      string,
      Record<string, Record<string, number>>
    >,
  };

  for (const row of rows) {
    const num = Number(row.count);
    result.total += num;

    const cat = row.category?.trim() || "";
    const rawSub = row.subcategory?.trim() || "";
    const rawType = row.type?.trim() || "";

    // Иерархия: category -> subcategory ?? type -> type (subtype не используем)
    const effectiveSub = rawSub || rawType;
    const effectiveType = rawSub && rawType && rawType !== rawSub ? rawType : "";

    if (cat) {
      result.categories[cat] = (result.categories[cat] ?? 0) + num;
    }

    if (effectiveSub) {
      result.subcategories[effectiveSub] =
        (result.subcategories[effectiveSub] ?? 0) + num;
    }

    if (cat && effectiveSub) {
      const catSubs = result.byCategory[cat] ?? {};
      catSubs[effectiveSub] = (catSubs[effectiveSub] ?? 0) + num;
      result.byCategory[cat] = catSubs;
    }

    if (cat && effectiveSub && effectiveType) {
      const catTypes = result.typesByCategory[cat] ?? {};
      const subTypes = catTypes[effectiveSub] ?? {};
      subTypes[effectiveType] = (subTypes[effectiveType] ?? 0) + num;
      catTypes[effectiveSub] = subTypes;
      result.typesByCategory[cat] = catTypes;
    }
  }

  return result;
}
