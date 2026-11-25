import type { SearchParams } from "@/controllers/store/productController";
import db from "@/db/index";
import { productsInProducts, productVariantsInProducts } from "@drizzle/schema";
import {
  gt,
  inArray,
  max,
  min,
  eq,
  and,
  lte,
  gte,
  sql,
  sum,
  or,
  ilike,
} from "drizzle-orm";

export async function sizes(
  category?: string,
  subcategory?: string,
  minPrice?: number,
  maxPrice?: number,
  search?: string,
) {
  const searchPattern = search ? `%${search}%` : undefined;
  return await db
    .select({
      size: productVariantsInProducts.name,
      stock: sql<number>`cast(coalesce(${sum(productVariantsInProducts.stock)}, 0) as int)`,
    })
    .from(productVariantsInProducts)
    .innerJoin(
      productsInProducts,
      eq(productVariantsInProducts.productId, productsInProducts.id),
    )
    .where(
      and(
        category ? eq(productsInProducts.category, category) : undefined,
        subcategory
          ? eq(productsInProducts.subcategory, subcategory)
          : undefined,
        minPrice !== undefined
          ? gte(productVariantsInProducts.price, minPrice)
          : undefined,
        maxPrice !== undefined
          ? lte(productVariantsInProducts.price, maxPrice)
          : undefined,
        searchPattern
          ? or(
              ilike(productsInProducts.name, searchPattern),
              ilike(productsInProducts.shortDescription, searchPattern),
              ilike(productsInProducts.sku, searchPattern),
            )
          : undefined,
      ),
    )
    .groupBy(productVariantsInProducts.name);
}

export async function prices(category, subcategory, sizes, search) {
  const searchPattern = search ? `%${search}%` : undefined;
  const [result] = await db
    .select({
      minPrice: min(productVariantsInProducts.price),
      maxPrice: max(productVariantsInProducts.price),
    })
    .from(productVariantsInProducts)
    .innerJoin(
      productsInProducts,
      eq(productVariantsInProducts.productId, productsInProducts.id),
    )
    .where(
      and(
        gt(productVariantsInProducts.stock, 0),
        category ? eq(productsInProducts.category, category) : undefined,
        subcategory
          ? eq(productsInProducts.subcategory, subcategory)
          : undefined,
        sizes && sizes.length > 0
          ? inArray(productVariantsInProducts.name, sizes)
          : undefined,
        searchPattern
          ? or(
              ilike(productsInProducts.name, searchPattern),
              ilike(productsInProducts.shortDescription, searchPattern),
              ilike(productsInProducts.sku, searchPattern),
            )
          : undefined,
      ),
    );

  return result ?? { minPrice: null, maxPrice: null };
}
