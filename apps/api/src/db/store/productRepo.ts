import type { SearchParams } from "@/controllers/store/productController";
import db from "@/db/index";
import { productsInProducts, productVariantsInProducts } from "@drizzle/schema";
import { and, eq, gt, gte, inArray, lte, sql } from "drizzle-orm";
import { buildProductSearchSql } from "./productSearch";

const formattedDates = {
  created_at: sql<string>`TO_CHAR(${productsInProducts.createdAt}, 'DD.MM.YYYY HH24:MI:SS')`,
  updated_at: sql<string>`TO_CHAR(${productsInProducts.updated}, 'DD.MM.YYYY HH24:MI:SS')`,
};

export type ProductSort = "score" | "sales" | "new" | "price" | "price_desc";

export async function list(
  category?: string,
  subcategory?: string,
  type?: string,
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
  const searchActive = Boolean(buildProductSearchSql(productsInProducts, search));
  const hasRawWhere = Boolean(category || searchActive || subcategory || type);

  return await db.query.productsInProducts.findMany({
    where: {
      ...(hasVariantFilter && { productVariantsInProducts: variantFilter }),
      ...(hasRawWhere && {
        RAW: (p) => {
          const conditions = [
            category
              ? sql`lower(btrim(${p.category})) = lower(btrim(${category}))`
              : undefined,
            searchActive ? buildProductSearchSql(p, search) : undefined,
            subcategory
              ? sql`lower(coalesce(nullif(btrim(${p.subcategory}), ''), nullif(btrim(${p.type}), ''))) = lower(btrim(${subcategory}))`
              : undefined,
            type
              ? sql`lower(nullif(btrim(${p.type}), '')) = lower(btrim(${type}))`
              : undefined,
          ].filter(Boolean);

          return conditions.length === 1 ? conditions[0]! : and(...conditions)!;
        },
      }),
    },
    limit,
    offset,
    orderBy: (p, { desc }) => {
      const matchingVariantFilters = [
        eq(productVariantsInProducts.productId, p.id),
        sizes && sizes.length > 0
          ? inArray(productVariantsInProducts.name, sizes)
          : undefined,
        minPrice !== undefined
          ? gte(productVariantsInProducts.price, minPrice)
          : undefined,
        maxPrice !== undefined
          ? lte(productVariantsInProducts.price, maxPrice)
          : undefined,
      ];

      const effectiveMinPrice = sql<number | null>`coalesce(
        (
          select min(${productVariantsInProducts.price})
          from ${productVariantsInProducts}
          where ${and(
            ...matchingVariantFilters,
            gt(productVariantsInProducts.stock, 0),
            gt(productVariantsInProducts.price, 0),
          )}
        ),
        (
          select min(${productVariantsInProducts.price})
          from ${productVariantsInProducts}
          where ${and(
            ...matchingVariantFilters,
            gt(productVariantsInProducts.price, 0),
          )}
        ),
        nullif(${p.price}, 0)
      )`;

      const hasStock = sql<boolean>`exists(
        select 1 from ${productVariantsInProducts}
        where ${and(
          ...matchingVariantFilters,
          gt(productVariantsInProducts.stock, 0),
        )}
      )`;

      switch (sort) {
        case "price":
          return [
            desc(hasStock),
            sql`${effectiveMinPrice} asc nulls last`,
            desc(p.id),
          ];
        case "price_desc":
          return [
            desc(hasStock),
            sql`${effectiveMinPrice} desc nulls last`,
            desc(p.id),
          ];
        case "new":
          return [
            desc(hasStock),
            sql`${p.createdAt} desc nulls last`,
            desc(p.id),
          ];
        case "sales":
          return [
            desc(p.salesCount),
            desc(hasStock),
            desc(p.id),
          ];
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
          oldPrice: true,
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

export async function getOneProduct(slugOrId: string) {
  const normalized = slugOrId.trim();
  if (!normalized) return null;

  const isUuid =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      normalized,
    );

  const product = await db.query.productsInProducts.findFirst({
    where: {
      RAW: (p) =>
        isUuid
          ? sql`(lower(btrim(${p.slug})) = lower(btrim(${normalized})) OR ${p.id} = ${normalized})`
          : sql`lower(btrim(${p.slug})) = lower(btrim(${normalized}))`,
    },
    with: {
      productVariantsInProducts: {
        orderBy: { price: "asc" },
        with: {
          productVariantsImagesInProducts: true,
        },
      },
    },
  });

  return product ?? null;
}

export async function getVariants(variantIds: string[]) {
  const validIds = Array.from(
    new Set(
      (variantIds ?? [])
        .map((id) => String(id).trim())
        .filter((id) =>
          /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
            id,
          ),
        ),
    ),
  );

  if (validIds.length === 0) return [];

  const rows = await db
    .select({
      price: productVariantsInProducts.price,
      oldPrice: productVariantsInProducts.oldPrice,
      stock: productVariantsInProducts.stock,
      previewImage: productVariantsInProducts.previewImage,
      name: productVariantsInProducts.name,
      id: productVariantsInProducts.id,
      productId: productVariantsInProducts.productId,
      productName: productsInProducts.name,
      slug: productsInProducts.slug,
      productPreviewImage: productsInProducts.previewImage,
    })
    .from(productVariantsInProducts)
    .innerJoin(
      productsInProducts,
      eq(productVariantsInProducts.productId, productsInProducts.id),
    )
    .where(inArray(productVariantsInProducts.id, validIds));

  return rows.map((row) => ({
    id: row.id,
    variantId: row.id,
    price: Number(row.price) || 0,
    oldPrice: row.oldPrice,
    stock: Number(row.stock) || 0,
    previewImage:
      row.previewImage?.trim() || row.productPreviewImage?.trim() || null,
    name: row.name?.trim() || "Стандарт",
    productId: row.productId,
    productName: row.productName,
    slug: row.slug || row.productId,
  }));
}
