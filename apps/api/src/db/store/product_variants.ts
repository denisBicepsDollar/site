import db from "@/db/index";
import { productsInProducts, productVariantsInProducts } from "@drizzle/schema";
import {
  and,
  asc,
  desc,
  eq,
  gte,
  inArray,
  isNotNull,
  lte,
  sql,
  sum,
} from "drizzle-orm";
import { buildProductSearchSql } from "./productSearch";

export async function sizes(
  category?: string,
  subcategory?: string,
  type?: string,
  minPrice?: number,
  maxPrice?: number,
  search?: string,
) {
  const searchSql = buildProductSearchSql(productsInProducts, search);
  const stockExpr = sql<number>`cast(coalesce(${sum(productVariantsInProducts.stock)}, 0) as int)`;

  const rows = await db
    .select({
      size: productVariantsInProducts.name,
      stock: stockExpr,
    })
    .from(productVariantsInProducts)
    .innerJoin(
      productsInProducts,
      eq(productVariantsInProducts.productId, productsInProducts.id),
    )
    .where(
      and(
        isNotNull(productVariantsInProducts.name),
        sql`trim(${productVariantsInProducts.name}) <> ''`,
        category ? eq(productsInProducts.category, category) : undefined,
        subcategory
          ? sql`coalesce(nullif(btrim(${productsInProducts.subcategory}), ''), nullif(btrim(${productsInProducts.type}), '')) = ${subcategory}`
          : undefined,
        type
          ? sql`nullif(btrim(${productsInProducts.type}), '') = ${type}`
          : undefined,
        minPrice !== undefined
          ? gte(productVariantsInProducts.price, minPrice)
          : undefined,
        maxPrice !== undefined
          ? lte(productVariantsInProducts.price, maxPrice)
          : undefined,
        searchSql,
      ),
    )
    .groupBy(productVariantsInProducts.name)
    .orderBy(desc(stockExpr), asc(productVariantsInProducts.name));

  return rows.filter(
    (row): row is { size: string; stock: number } =>
      typeof row.size === "string" && row.size.trim().length > 0,
  );
}

export async function prices(
  category?: string,
  subcategory?: string,
  type?: string,
  sizes?: string[],
  search?: string,
) {
  const searchSql = buildProductSearchSql(productsInProducts, search);
  const [result] = await db
    .select({
      minPrice: sql<number | null>`coalesce(
        min(case when ${productVariantsInProducts.stock} > 0 and ${productVariantsInProducts.price} > 0 then ${productVariantsInProducts.price} end),
        min(case when ${productVariantsInProducts.price} > 0 then ${productVariantsInProducts.price} end)
      )`,
      maxPrice: sql<number | null>`coalesce(
        max(case when ${productVariantsInProducts.stock} > 0 and ${productVariantsInProducts.price} > 0 then ${productVariantsInProducts.price} end),
        max(case when ${productVariantsInProducts.price} > 0 then ${productVariantsInProducts.price} end)
      )`,
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
          ? sql`coalesce(nullif(btrim(${productsInProducts.subcategory}), ''), nullif(btrim(${productsInProducts.type}), '')) = ${subcategory}`
          : undefined,
        type
          ? sql`nullif(btrim(${productsInProducts.type}), '') = ${type}`
          : undefined,
        sizes && sizes.length > 0
          ? inArray(productVariantsInProducts.name, sizes)
          : undefined,
        searchSql,
      ),
    );

  return {
    minPrice:
      result?.minPrice !== null && result?.minPrice !== undefined
        ? Number(result.minPrice)
        : null,
    maxPrice:
      result?.maxPrice !== null && result?.maxPrice !== undefined
        ? Number(result.maxPrice)
        : null,
  };
}
