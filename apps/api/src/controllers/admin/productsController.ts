import { randomUUID } from "node:crypto";
import type { Request, Response } from "express";
import { and, asc, count, desc, eq, ilike, or, sql } from "drizzle-orm";
import db from "@/db/index.js";
import {
  productsInProducts,
  productVariantsImagesInProducts,
  productVariantsInProducts,
} from "@drizzle/schema";
import getLogger from "@/utils/logger.js";

const sortableFields = {
  name: productsInProducts.name,
  category: productsInProducts.category,
  status: productsInProducts.status,
  createdAt: productsInProducts.createdAt,
} as const;
const statuses = ["active", "draft", "archived"] as const;

function safeInt(value: unknown, fallback: number, min: number, max: number) {
  const parsed = Number(value);
  return Number.isInteger(parsed) ? Math.min(max, Math.max(min, parsed)) : fallback;
}

function filters(req: Request) {
  const q = typeof req.query.q === "string" ? req.query.q.trim().slice(0, 100) : "";
  const status = typeof req.query.status === "string" ? req.query.status : "";
  return and(
    q ? or(ilike(productsInProducts.name, `%${q}%`), ilike(productsInProducts.sku, `%${q}%`)) : undefined,
    statuses.includes(status as (typeof statuses)[number]) ? eq(productsInProducts.status, status) : undefined,
    req.query.lowStock === "true"
      ? sql`(select coalesce(sum(v.stock), 0) from products.product_variants v where v.product_id = ${productsInProducts.id}) <= 5`
      : undefined,
  );
}

export async function list(req: Request, res: Response) {
  const page = safeInt(req.query.page, 1, 1, 100000);
  const pageSize = safeInt(req.query.pageSize, 8, 1, 100);
  const sortBy = typeof req.query.sortBy === "string" ? req.query.sortBy : "createdAt";
  const direction = req.query.sortDirection === "asc" ? "asc" : "desc";
  const where = filters(req);
  const orderBy = (product: typeof productsInProducts, helpers: { asc: typeof asc; desc: typeof desc }) => {
    const order = direction === "asc" ? helpers.asc : helpers.desc;
    if (sortBy === "price") {
      return [sql`(select min(v.price) from products.product_variants v where v.product_id = ${product.id}) ${sql.raw(direction)}`, helpers.desc(product.id)];
    }
    if (sortBy === "stock") {
      return [sql`(select coalesce(sum(v.stock), 0) from products.product_variants v where v.product_id = ${product.id}) ${sql.raw(direction)}`, helpers.desc(product.id)];
    }
    const field = Object.hasOwn(sortableFields, sortBy)
      ? sortableFields[sortBy as keyof typeof sortableFields]
      : productsInProducts.createdAt;
    return [order(field), helpers.desc(product.id)];
  };

  const [rows, countRows, statusRows] = await Promise.all([
    db.query.productsInProducts.findMany({
      ...(where ? { where: { RAW: () => where } } : {}),
      limit: pageSize,
      offset: (page - 1) * pageSize,
      orderBy,
      with: {
        productVariantsInProducts: { with: { productVariantsImagesInProducts: true } },
      },
    }),
    db.select({ total: count() }).from(productsInProducts).where(where),
    db.select({ status: productsInProducts.status, total: count() })
      .from(productsInProducts).groupBy(productsInProducts.status),
  ]);

  const total = Number(countRows[0]?.total ?? 0);
  const statusCounts = Object.fromEntries(statusRows.map((row) => [row.status ?? "draft", Number(row.total)]));
  getLogger("adminProductsController").debug({ page, pageSize, total }, "admin products listed");
  return res.json({ data: rows, meta: { page, pageSize, total, pageCount: Math.ceil(total / pageSize), statusCounts } });
}

export async function create(req: Request, res: Response) {
  const body = (req.body && typeof req.body === "object" ? req.body : {}) as {
    name?: unknown; description?: unknown; category?: unknown; subcategory?: unknown;
    status?: unknown; price?: unknown; sku?: unknown; previewImage?: unknown; careInstructions?: unknown;
    variants?: Array<{ name?: unknown; price?: unknown; stock?: unknown; previewImage?: unknown; images?: unknown }>;
  };
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const category = typeof body.category === "string" ? body.category.trim() : "";
  if (!name || !category) return res.status(400).json({ message: "Product name and category are required" });
  if (name.length > 255) return res.status(400).json({ message: "Product name is too long" });
  const status = typeof body.status === "string" ? body.status : "draft";
  if (!["active", "draft", "archived"].includes(status)) return res.status(400).json({ message: "Invalid product status" });
  const variants = Array.isArray(body.variants) ? body.variants : [];
  if (variants.some((variant) => !variant || typeof variant !== "object")) {
    return res.status(400).json({ message: "Product variants are invalid" });
  }
  const basePrice = Number(body.price ?? variants[0]?.price ?? 0);
  if (!Number.isFinite(basePrice) || basePrice < 0) return res.status(400).json({ message: "Product price must be a non-negative number" });
  for (const variant of variants) {
    if (!Number.isFinite(Number(variant.price ?? basePrice)) || Number(variant.price ?? basePrice) < 0 || !Number.isInteger(Number(variant.stock ?? 0)) || Number(variant.stock ?? 0) < 0) {
      return res.status(400).json({ message: "Variant price and stock are invalid" });
    }
  }
  try {
    const created = await db.transaction(async (tx) => {
      const [product] = await tx.insert(productsInProducts).values({
        name,
        description: typeof body.description === "string" ? body.description : null,
        category,
        subcategory: typeof body.subcategory === "string" && body.subcategory.trim() ? body.subcategory.trim() : category,
        status,
        price: String(basePrice),
        sku: typeof body.sku === "string" && body.sku.trim() ? body.sku.trim() : `PLANT-${randomUUID().slice(0, 8).toUpperCase()}`,
        previewImage: typeof body.previewImage === "string" ? body.previewImage : null,
        careInstructions: typeof body.careInstructions === "string" ? body.careInstructions : null,
        updated: new Date(),
      }).returning();
      if (!product) throw new Error("Product insert did not return a row");
      for (const variant of variants) {
        const [savedVariant] = await tx.insert(productVariantsInProducts).values({
          productId: product.id,
          name: typeof variant.name === "string" && variant.name.trim() ? variant.name.trim() : null,
          price: Number(variant.price ?? basePrice),
          stock: Number(variant.stock ?? 0),
          previewImage: typeof variant.previewImage === "string" ? variant.previewImage : null,
        }).returning();
        if (!savedVariant) throw new Error("Variant insert did not return a row");
        const variantPreviewImage = typeof variant.previewImage === "string" ? variant.previewImage : null;
        const imageUrls = Array.isArray(variant.images) ? variant.images.filter((url): url is string => typeof url === "string" && Boolean(url.trim()) && !url.startsWith("blob:")) : [];
        if (imageUrls.length) {
          await tx.insert(productVariantsImagesInProducts).values(imageUrls.map((imgUrl, index) => ({ variantId: savedVariant.id, imgUrl, isMain: imgUrl === variantPreviewImage || index === 0 })));
        }
      }
      return product;
    });
    return res.status(201).json({ data: created });
  } catch (error) {
    getLogger("adminProductsController").error({ error }, "failed to create admin product");
    return res.status(500).json({ message: "Could not create product" });
  }
}
