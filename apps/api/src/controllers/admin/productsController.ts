import { randomUUID } from "node:crypto";
import type { Request, Response } from "express";
import { and, asc, count, desc, eq, ilike, inArray, or, sql } from "drizzle-orm";
import db from "@/db/index.js";
import {
  productsInProducts,
  productVariantsImagesInProducts,
  productVariantsInProducts,
} from "@drizzle/schema";
import getLogger from "@/utils/logger.js";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const RU_TRANSLIT: Record<string, string> = {
  а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "yo", ж: "zh",
  з: "z", и: "i", й: "y", к: "k", л: "l", м: "m", н: "n", о: "o",
  п: "p", р: "r", с: "s", т: "t", у: "u", ф: "f", х: "kh", ц: "ts",
  ч: "ch", ш: "sh", щ: "shch", ъ: "", ы: "y", ь: "", э: "e", ю: "yu", я: "ya",
};

function slugifyName(name: string): string {
  const transliterated = name
    .toLowerCase()
    .split("")
    .map((ch) => RU_TRANSLIT[ch] ?? ch)
    .join("");
  const base = transliterated
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
  return base || `plant-${randomUUID().slice(0, 8)}`;
}

async function generateUniqueSlug(
  tx: Parameters<Parameters<typeof db.transaction>[0]>[0],
  name: string,
  excludeProductId?: string,
): Promise<string> {
  const base = slugifyName(name);
  let candidate = base;
  for (let attempt = 0; attempt < 5; attempt++) {
    const existing = await tx
      .select({ id: productsInProducts.id })
      .from(productsInProducts)
      .where(eq(productsInProducts.slug, candidate))
      .limit(1);
    if (!existing.length || (excludeProductId && existing[0]?.id === excludeProductId)) {
      return candidate;
    }
    candidate = `${base}-${randomUUID().slice(0, 4)}`;
  }
  return `${base}-${randomUUID().slice(0, 8)}`;
}

const sortableFields = {
  name: productsInProducts.name,
  category: productsInProducts.category,
  status: productsInProducts.status,
  createdAt: productsInProducts.createdAt,
} as const;
const statuses = ["active", "draft", "archived"] as const;

type ProductStatus = (typeof statuses)[number];

interface NormalizedVariantInput {
  id?: string;
  name: string | null;
  price: number;
  stock: number;
  previewImage: string | null;
  images: string[];
}

interface NormalizedProductPayload {
  name: string;
  description: string | null;
  category: string;
  subcategory: string;
  status: ProductStatus;
  price: number;
  sku?: string;
  previewImage: string | null;
  careInstructions: string | null;
  variants: NormalizedVariantInput[];
}

function sanitizeImageUrl(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed || trimmed.startsWith("blob:") || trimmed === "/default-image.png") {
    return null;
  }
  return trimmed;
}

function parseProductPayload(body: unknown):
  | { ok: true; data: NormalizedProductPayload }
  | { ok: false; message: string } {
  const raw = (body && typeof body === "object" ? body : {}) as {
    name?: unknown;
    description?: unknown;
    category?: unknown;
    subcategory?: unknown;
    status?: unknown;
    price?: unknown;
    sku?: unknown;
    previewImage?: unknown;
    careInstructions?: unknown;
    variants?: unknown;
  };

  const name = typeof raw.name === "string" ? raw.name.trim() : "";
  const category = typeof raw.category === "string" ? raw.category.trim() : "";
  if (!name || !category) {
    return { ok: false, message: "Product name and category are required" };
  }
  if (name.length > 255) {
    return { ok: false, message: "Product name is too long" };
  }

  const status = (typeof raw.status === "string" ? raw.status : "draft") as ProductStatus;
  if (!statuses.includes(status)) {
    return { ok: false, message: "Invalid product status" };
  }

  const variantsRaw = Array.isArray(raw.variants) ? raw.variants : [];
  if (variantsRaw.some((variant) => !variant || typeof variant !== "object")) {
    return { ok: false, message: "Product variants are invalid" };
  }

  const firstVariantPrice = (variantsRaw[0] as { price?: unknown } | undefined)?.price;
  const basePrice = Number(raw.price ?? firstVariantPrice ?? 0);
  if (!Number.isFinite(basePrice) || basePrice < 0) {
    return { ok: false, message: "Product price must be a non-negative number" };
  }

  const variants: NormalizedVariantInput[] = [];
  for (const item of variantsRaw) {
    const v = item as {
      id?: unknown;
      name?: unknown;
      price?: unknown;
      stock?: unknown;
      previewImage?: unknown;
      images?: unknown;
    };
    const vPrice = Number(v.price ?? basePrice);
    const vStock = Number(v.stock ?? 0);
    if (!Number.isFinite(vPrice) || vPrice < 0 || !Number.isInteger(vStock) || vStock < 0) {
      return { ok: false, message: "Variant price and stock are invalid" };
    }
    const imageUrls = Array.isArray(v.images)
      ? Array.from(
          new Set(
            v.images
              .map(sanitizeImageUrl)
              .filter((url): url is string => Boolean(url)),
          ),
        )
      : [];
    const variantPreview = sanitizeImageUrl(v.previewImage) ?? imageUrls[0] ?? null;
    if (variantPreview && !imageUrls.includes(variantPreview)) {
      imageUrls.unshift(variantPreview);
    }

    const id = typeof v.id === "string" && UUID_RE.test(v.id) ? v.id : undefined;
    variants.push({
      ...(id ? { id } : {}),
      name: typeof v.name === "string" && v.name.trim() ? v.name.trim() : null,
      price: vPrice,
      stock: vStock,
      previewImage: variantPreview,
      images: imageUrls,
    });
  }

  const previewImage = sanitizeImageUrl(raw.previewImage) ?? variants[0]?.previewImage ?? null;
  const sku =
    typeof raw.sku === "string" && raw.sku.trim() && raw.sku.trim() !== "Автоматически"
      ? raw.sku.trim()
      : undefined;

  return {
    ok: true,
    data: {
      name,
      description: typeof raw.description === "string" ? raw.description : null,
      category,
      subcategory:
        typeof raw.subcategory === "string" && raw.subcategory.trim()
          ? raw.subcategory.trim()
          : category,
      status,
      price: basePrice,
      ...(sku ? { sku } : {}),
      previewImage,
      careInstructions: typeof raw.careInstructions === "string" ? raw.careInstructions : null,
      variants,
    },
  };
}

function safeInt(value: unknown, fallback: number, min: number, max: number) {
  const parsed = Number(value);
  return Number.isInteger(parsed) ? Math.min(max, Math.max(min, parsed)) : fallback;
}

function filters(req: Request) {
  const q = typeof req.query.q === "string" ? req.query.q.trim().slice(0, 100) : "";
  const status = typeof req.query.status === "string" ? req.query.status : "";
  return and(
    q ? or(ilike(productsInProducts.name, `%${q}%`), ilike(productsInProducts.sku, `%${q}%`)) : undefined,
    statuses.includes(status as ProductStatus) ? eq(productsInProducts.status, status) : undefined,
    req.query.lowStock === "true"
      ? sql`(select coalesce(sum(v.stock), 0) from products.product_variants v where v.product_id = ${productsInProducts.id}) <= 5`
      : undefined,
  );
}

async function findFullProduct(id: string) {
  return db.query.productsInProducts.findFirst({
    where: { RAW: (p) => eq(p.id, id) },
    with: {
      productVariantsInProducts: {
        orderBy: { createdAt: "asc" },
        with: { productVariantsImagesInProducts: true },
      },
    },
  });
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
      return [
        sql`coalesce((select min(v.price) from products.product_variants v where v.product_id = ${product.id}), ${product.price}) ${sql.raw(direction)} nulls last`,
        helpers.desc(product.id),
      ];
    }
    if (sortBy === "stock") {
      return [
        sql`(select coalesce(sum(v.stock), 0) from products.product_variants v where v.product_id = ${product.id}) ${sql.raw(direction)}`,
        helpers.desc(product.id),
      ];
    }
    const field = Object.hasOwn(sortableFields, sortBy)
      ? sortableFields[sortBy as keyof typeof sortableFields]
      : productsInProducts.createdAt;
    return [order(field), helpers.desc(product.id)];
  };

  const [rows, countRows, statusRows, lowStockRows] = await Promise.all([
    db.query.productsInProducts.findMany({
      ...(where ? { where: { RAW: () => where } } : {}),
      limit: pageSize,
      offset: (page - 1) * pageSize,
      orderBy,
      with: {
        productVariantsInProducts: {
          orderBy: { createdAt: "asc" },
          with: { productVariantsImagesInProducts: true },
        },
      },
    }),
    db.select({ total: count() }).from(productsInProducts).where(where),
    db.select({ status: productsInProducts.status, total: count() })
      .from(productsInProducts).groupBy(productsInProducts.status),
    db.select({ total: count() })
      .from(productsInProducts)
      .where(
        and(
          eq(productsInProducts.status, "active"),
          sql`(select coalesce(sum(v.stock), 0) from products.product_variants v where v.product_id = ${productsInProducts.id}) <= 5`,
        ),
      ),
  ]);

  const total = Number(countRows[0]?.total ?? 0);
  const statusCounts: Record<string, number> = { active: 0, draft: 0, archived: 0 };
  for (const row of statusRows) {
    const key = row.status ?? "draft";
    statusCounts[key] = (statusCounts[key] ?? 0) + Number(row.total);
  }
  const lowStockCount = Number(lowStockRows[0]?.total ?? 0);

  getLogger("adminProductsController").debug({ page, pageSize, total }, "admin products listed");
  return res.json({
    data: rows,
    meta: { page, pageSize, total, pageCount: Math.ceil(total / pageSize), statusCounts, lowStockCount },
  });
}

export async function getOne(req: Request, res: Response) {
  const id = String(req.params.id ?? "").trim();
  if (!UUID_RE.test(id)) {
    return res.status(400).json({ message: "Invalid product ID" });
  }
  const product = await findFullProduct(id);
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }
  return res.json({ data: product });
}

export async function create(req: Request, res: Response) {
  const parsed = parseProductPayload(req.body);
  if (!parsed.ok) {
    return res.status(400).json({ message: parsed.message });
  }
  const data = parsed.data;

  try {
    const createdId = await db.transaction(async (tx) => {
      const slug = await generateUniqueSlug(tx, data.name);
      const [product] = await tx.insert(productsInProducts).values({
        name: data.name,
        slug,
        description: data.description,
        category: data.category,
        subcategory: data.subcategory,
        status: data.status,
        price: String(data.price),
        sku: data.sku ?? `PLANT-${randomUUID().slice(0, 8).toUpperCase()}`,
        previewImage: data.previewImage,
        careInstructions: data.careInstructions,
        updated: new Date(),
      }).returning();
      if (!product) throw new Error("Product insert did not return a row");

      for (const variant of data.variants) {
        const [savedVariant] = await tx.insert(productVariantsInProducts).values({
          productId: product.id,
          name: variant.name,
          price: variant.price,
          stock: variant.stock,
          previewImage: variant.previewImage,
        }).returning();
        if (!savedVariant) throw new Error("Variant insert did not return a row");
        if (variant.images.length) {
          await tx.insert(productVariantsImagesInProducts).values(
            variant.images.map((imgUrl, index) => ({
              variantId: savedVariant.id,
              imgUrl,
              isMain: imgUrl === variant.previewImage || index === 0,
            })),
          );
        }
      }
      return product.id;
    });

    const fullProduct = await findFullProduct(createdId);
    return res.status(201).json({ data: fullProduct });
  } catch (error) {
    getLogger("adminProductsController").error({ error }, "failed to create admin product");
    return res.status(500).json({ message: "Could not create product" });
  }
}

export async function update(req: Request, res: Response) {
  const id = String(req.params.id ?? "").trim();
  if (!UUID_RE.test(id)) {
    return res.status(400).json({ message: "Invalid product ID" });
  }

  const parsed = parseProductPayload(req.body);
  if (!parsed.ok) {
    return res.status(400).json({ message: parsed.message });
  }
  const data = parsed.data;

  try {
    const outcome = await db.transaction(async (tx) => {
      const [existing] = await tx
        .select({ id: productsInProducts.id, slug: productsInProducts.slug })
        .from(productsInProducts)
        .where(eq(productsInProducts.id, id))
        .limit(1);

      if (!existing) {
        return { kind: "not_found" as const };
      }

      const nextSlug = existing.slug?.trim()
        ? existing.slug
        : await generateUniqueSlug(tx, data.name, id);

      await tx
        .update(productsInProducts)
        .set({
          name: data.name,
          slug: nextSlug,
          description: data.description,
          category: data.category,
          subcategory: data.subcategory,
          status: data.status,
          price: String(data.price),
          ...(data.sku ? { sku: data.sku } : {}),
          previewImage: data.previewImage,
          careInstructions: data.careInstructions,
          updated: new Date(),
        })
        .where(eq(productsInProducts.id, id));

      const existingVariants = await tx
        .select({ id: productVariantsInProducts.id })
        .from(productVariantsInProducts)
        .where(eq(productVariantsInProducts.productId, id));

      const existingVariantIds = new Set(existingVariants.map((v) => v.id));
      const keptVariantIds = new Set(
        data.variants
          .map((v) => v.id)
          .filter((variantId): variantId is string => Boolean(variantId && existingVariantIds.has(variantId))),
      );

      if (existingVariants.length > 0) {
        await tx
          .delete(productVariantsImagesInProducts)
          .where(inArray(productVariantsImagesInProducts.variantId, existingVariants.map((v) => v.id)));
      }

      const variantsToDelete = existingVariants
        .map((v) => v.id)
        .filter((variantId) => !keptVariantIds.has(variantId));

      if (variantsToDelete.length > 0) {
        await tx
          .delete(productVariantsInProducts)
          .where(inArray(productVariantsInProducts.id, variantsToDelete));
      }

      for (const variant of data.variants) {
        let variantId: string;
        if (variant.id && keptVariantIds.has(variant.id)) {
          await tx
            .update(productVariantsInProducts)
            .set({
              name: variant.name,
              price: variant.price,
              stock: variant.stock,
              previewImage: variant.previewImage,
            })
            .where(eq(productVariantsInProducts.id, variant.id));
          variantId = variant.id;
        } else {
          const [insertedVariant] = await tx
            .insert(productVariantsInProducts)
            .values({
              productId: id,
              name: variant.name,
              price: variant.price,
              stock: variant.stock,
              previewImage: variant.previewImage,
            })
            .returning();
          if (!insertedVariant) throw new Error("Variant insert did not return a row");
          variantId = insertedVariant.id;
        }

        if (variant.images.length > 0) {
          await tx.insert(productVariantsImagesInProducts).values(
            variant.images.map((imgUrl, index) => ({
              variantId,
              imgUrl,
              isMain: imgUrl === variant.previewImage || index === 0,
            })),
          );
        }
      }

      return { kind: "updated" as const };
    });

    if (outcome.kind === "not_found") {
      return res.status(404).json({ message: "Product not found" });
    }

    const fullProduct = await findFullProduct(id);
    return res.status(200).json({ data: fullProduct });
  } catch (error) {
    getLogger("adminProductsController").error({ error, id }, "failed to update admin product");
    return res.status(500).json({ message: "Could not update product" });
  }
}

export async function remove(req: Request, res: Response) {
  const id = String(req.params.id ?? "").trim();
  if (!UUID_RE.test(id)) {
    return res.status(400).json({ message: "Invalid product ID" });
  }

  try {
    const deleted = await db.transaction(async (tx) => {
      const [existing] = await tx
        .select({ id: productsInProducts.id })
        .from(productsInProducts)
        .where(eq(productsInProducts.id, id))
        .limit(1);
      if (!existing) return false;

      const variants = await tx
        .select({ id: productVariantsInProducts.id })
        .from(productVariantsInProducts)
        .where(eq(productVariantsInProducts.productId, id));

      if (variants.length > 0) {
        const variantIds = variants.map((v) => v.id);
        await tx
          .delete(productVariantsImagesInProducts)
          .where(inArray(productVariantsImagesInProducts.variantId, variantIds));
        await tx
          .delete(productVariantsInProducts)
          .where(inArray(productVariantsInProducts.id, variantIds));
      }

      await tx.delete(productsInProducts).where(eq(productsInProducts.id, id));
      return true;
    });

    if (!deleted) {
      return res.status(404).json({ message: "Product not found" });
    }
    return res.status(200).json({ status: "ok", id });
  } catch (error) {
    getLogger("adminProductsController").error({ error, id }, "failed to delete admin product");
    return res.status(500).json({ message: "Could not delete product" });
  }
}

function parseUuidList(raw: unknown): string[] | null {
  if (!Array.isArray(raw) || raw.length === 0 || raw.length > 100) return null;
  const ids = Array.from(new Set(raw.map((item) => String(item ?? "").trim())));
  if (ids.some((id) => !UUID_RE.test(id))) return null;
  return ids;
}

export async function bulkUpdate(req: Request, res: Response) {
  const body = (req.body && typeof req.body === "object" ? req.body : {}) as {
    ids?: unknown;
    status?: unknown;
  };
  const ids = parseUuidList(body.ids);
  if (!ids) {
    return res.status(400).json({ message: "Invalid product ID" });
  }
  const status = typeof body.status === "string" ? body.status : "";
  if (!statuses.includes(status as ProductStatus)) {
    return res.status(400).json({ message: "Invalid product status" });
  }

  try {
    const updatedRows = await db
      .update(productsInProducts)
      .set({ status, updated: new Date() })
      .where(inArray(productsInProducts.id, ids))
      .returning({ id: productsInProducts.id });

    return res.status(200).json({ status: "ok", updatedCount: updatedRows.length });
  } catch (error) {
    getLogger("adminProductsController").error({ error, ids, status }, "failed bulk update admin products");
    return res.status(500).json({ message: "Could not update product" });
  }
}

export async function bulkRemove(req: Request, res: Response) {
  const body = (req.body && typeof req.body === "object" ? req.body : {}) as {
    ids?: unknown;
  };
  const ids = parseUuidList(body.ids);
  if (!ids) {
    return res.status(400).json({ message: "Invalid product ID" });
  }

  try {
    const deletedCount = await db.transaction(async (tx) => {
      const variants = await tx
        .select({ id: productVariantsInProducts.id })
        .from(productVariantsInProducts)
        .where(inArray(productVariantsInProducts.productId, ids));

      if (variants.length > 0) {
        const variantIds = variants.map((v) => v.id);
        await tx
          .delete(productVariantsImagesInProducts)
          .where(inArray(productVariantsImagesInProducts.variantId, variantIds));
        await tx
          .delete(productVariantsInProducts)
          .where(inArray(productVariantsInProducts.id, variantIds));
      }

      const deletedRows = await tx
        .delete(productsInProducts)
        .where(inArray(productsInProducts.id, ids))
        .returning({ id: productsInProducts.id });

      return deletedRows.length;
    });

    return res.status(200).json({ status: "ok", deletedCount });
  } catch (error) {
    getLogger("adminProductsController").error({ error, ids }, "failed bulk delete admin products");
    return res.status(500).json({ message: "Could not delete product" });
  }
}
