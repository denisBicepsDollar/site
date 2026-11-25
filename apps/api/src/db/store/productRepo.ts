import type { SearchParams } from "@/controllers/store/productController";
import db from "@/db/index";
import { productsInProducts, productVariantsInProducts } from "@drizzle/schema";
import { and, eq, exists, desc, asc, inArray, sql } from "drizzle-orm";

const formattedDates = {
  created_at: sql<string>`TO_CHAR(${productsInProducts.createdAt}, 'DD.MM.YYYY HH24:MI:SS')`,
  updated_at: sql<string>`TO_CHAR(${productsInProducts.updated}, 'DD.MM.YYYY HH24:MI:SS')`,
};

export type ProductSort = "score" | "new" | "price" | "price_desc";

export async function list(
  category?: string,
  subcategory?: string,
  sizes?: string[],
  minPrice?: number,
  maxPrice?: number,
  sort: ProductSort = "score",
  search?: string,
  limit = 12,
  offset = 0,
) {
  const variantFilter: Record<string, any> = {};

  if (sizes && sizes.length > 0) {
    variantFilter.OR = sizes.map((s) => ({ name: { eq: s } }));
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    variantFilter.price = {
      ...(minPrice !== undefined && { gte: minPrice }),
      ...(maxPrice !== undefined && { lte: maxPrice }),
    };
  }

  const hasVariantFilter = Object.keys(variantFilter).length > 0;

  // Подзапрос минимальной цены варианта (учитывает выбранные размеры, если они есть)
  const minVariantPrice = sql<number>`(
    select min(${productVariantsInProducts.price})
    from ${productVariantsInProducts}
    where ${and(
      eq(productVariantsInProducts.productId, productsInProducts.id),
      sizes && sizes.length > 0
        ? inArray(productVariantsInProducts.name, sizes)
        : undefined,
    )}
  )`;

  // Проверка наличия: товары с остатком > 0 всегда выше тех, что закончились
  const hasStock = sql<boolean>`exists(
    select 1 from ${productVariantsInProducts}
    where ${productVariantsInProducts.productId} = ${productsInProducts.id}
      and ${productVariantsInProducts.stock} > 0
  )`;

  const searchPattern = search ? `%${search}%` : undefined;

  return await db.query.productsInProducts.findMany({
    where: {
      ...(category && { category: { eq: category } }),
      ...(subcategory && { subcategory: { eq: subcategory } }),
      ...(hasVariantFilter && { productVariantsInProducts: variantFilter }),
      ...(searchPattern && {
        OR: [
          { name: { ilike: searchPattern } },
          { shortDescription: { ilike: searchPattern } },
          { sku: { ilike: searchPattern } },
        ],
      }),
    },
    limit, // <-- берём 12 записей
    offset,
    orderBy: (p, { asc, desc }) => {
      const minVariantPrice = sql<number>`(
        select min(${productVariantsInProducts.price})
        from ${productVariantsInProducts}
        where ${and(
          eq(productVariantsInProducts.productId, p.id),
          sizes && sizes.length > 0
            ? inArray(productVariantsInProducts.name, sizes)
            : undefined,
        )}
      )`;

      const hasStock = sql<boolean>`exists(
        select 1 from ${productVariantsInProducts}
        where ${productVariantsInProducts.productId} = ${p.id}
          and ${productVariantsInProducts.stock} > 0
      )`;

      switch (sort) {
        case "price":
          return [desc(hasStock), asc(minVariantPrice), desc(p.id)];
        case "price_desc":
          return [desc(hasStock), desc(minVariantPrice), desc(p.id)];
        case "new":
          return [desc(hasStock), desc(p.createdAt), desc(p.id)];
        case "score":
        default:
          return [
            desc(hasStock),
            desc(p.priority),
            desc(p.salesCount),
            desc(p.id),
          ];
      }
    },
    with: {
      productVariantsInProducts: {
        columns: {
          id: true,
          name: true,
          price: true,
          stock: true,
        },
        ...(hasVariantFilter && { where: variantFilter }),
        orderBy: { price: "asc" },
        with: {
          productVariantsImagesInProducts: true,
        },
      },
    },
  });
}

export async function getOneProduct(slug) {
  console.log(slug);
  const sql = baseSql + ` WHERE p.slug = $1;`;
  const result = await pool.query(sql, [slug]);
  console.log(result.rows[0]);
  return result.rows[0] || null;
}
export async function getVariants(variantIds) {
  const sql = `
        SELECT
            pv.price,
            pv.old_price,
            pv.stock,
            pv.preview_image AS "previewImage",
            pv.name,
            pv.id,
            pv.product_id AS "productId",
            p.name AS "productName",
            p.slug

        FROM ${schema}.product_variants pv
        JOIN ${schema}.products p
        ON pv.product_id = p.id
        WHERE pv.id = ANY($1);
        `;
  const result = await pool.query(sql, [variantIds]);
  return result.rows;
}
