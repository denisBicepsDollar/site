import db from "@/db/index";
import {
  orderItemsInOrders,
  ordersInOrders,
  productsInProducts,
  productVariantsInProducts,
} from "@drizzle/schema";
import { and, eq, gte, inArray, sql } from "drizzle-orm";

export interface CreateOrderItemInput {
  variantId: string;
  quantity: number;
}

export interface CreateOrderRepoInput {
  customerName: string;
  email: string;
  phone: string;
  deliveryMethod: string;
  deliveryCompany: string | null;
  deliveryType: string | null;
  deliveryPrice: number;
  address: string | null;
  pochtaTariffId: string | null;
  pochtaTariffName: string | null;
  cdekTariffId: string | null;
  cdekTariffName: string | null;
  paymentMethod: string;
  comment: string | null;
  items: CreateOrderItemInput[];
}

export interface InsufficientStockItem {
  variantId: string;
  name: string;
  availableStock: number;
  requestedQuantity: number;
  missing: boolean;
}

export interface CreatedOrderRecord {
  id: number;
  orderNumber: string;
  status: string;
  createdAt: string;
  customerName: string;
  email: string;
  phone: string;
  deliveryMethod: string;
  deliveryCompany: string | null;
  deliveryType: string | null;
  deliveryPrice: number;
  address: string | null;
  pochtaTariffId: string | null;
  pochtaTariffName: string | null;
  cdekTariffId: string | null;
  cdekTariffName: string | null;
  paymentMethod: string;
  comment: string | null;
  productsTotal: number;
  totalPrice: number;
  items: Array<{
    variantId: string;
    productId: string;
    name: string;
    volume: string;
    price: number;
    quantity: number;
    previewImage: string | null;
    slug: string | null;
  }>;
}

export type CreateOrderRepoResult =
  | { ok: true; order: CreatedOrderRecord }
  | {
      ok: false;
      code: "INSUFFICIENT_STOCK";
      insufficientItems: InsufficientStockItem[];
    };

export async function createOrder(
  input: CreateOrderRepoInput,
): Promise<CreateOrderRepoResult> {
  const variantIds = input.items.map((item) => item.variantId);

  return await db.transaction(async (tx) => {
    const rows = await tx
      .select({
        variantId: productVariantsInProducts.id,
        productId: productVariantsInProducts.productId,
        price: productVariantsInProducts.price,
        stock: productVariantsInProducts.stock,
        variantName: productVariantsInProducts.name,
        variantPreviewImage: productVariantsInProducts.previewImage,
        productName: productsInProducts.name,
        productPreviewImage: productsInProducts.previewImage,
        slug: productsInProducts.slug,
      })
      .from(productVariantsInProducts)
      .innerJoin(
        productsInProducts,
        eq(productVariantsInProducts.productId, productsInProducts.id),
      )
      .where(inArray(productVariantsInProducts.id, variantIds))
      .for("update");

    const rowByVariantId = new Map(rows.map((r) => [r.variantId, r]));

    const insufficientItems: InsufficientStockItem[] = [];
    for (const item of input.items) {
      const row = rowByVariantId.get(item.variantId);
      if (!row) {
        insufficientItems.push({
          variantId: item.variantId,
          name: "Удалённый товар",
          availableStock: 0,
          requestedQuantity: item.quantity,
          missing: true,
        });
        continue;
      }

      const available = Math.max(0, Number(row.stock) || 0);
      if (available < item.quantity) {
        const label = row.variantName?.trim()
          ? `${row.productName} (${row.variantName.trim()})`
          : row.productName;
        insufficientItems.push({
          variantId: item.variantId,
          name: label,
          availableStock: available,
          requestedQuantity: item.quantity,
          missing: false,
        });
      }
    }

    if (insufficientItems.length > 0) {
      return {
        ok: false,
        code: "INSUFFICIENT_STOCK",
        insufficientItems,
      };
    }

    const orderItemsToInsert = input.items.map((item) => {
      const row = rowByVariantId.get(item.variantId)!;
      const unitPrice = Math.max(0, Math.round(Number(row.price) || 0));
      const volume = row.variantName?.trim() || "Стандарт";
      return {
        variantId: row.variantId,
        productId: row.productId,
        name: row.productName,
        volume,
        price: unitPrice,
        quantity: item.quantity,
        previewImage:
          row.variantPreviewImage?.trim() ||
          row.productPreviewImage?.trim() ||
          null,
        slug: row.slug ?? null,
      };
    });

    const productsTotal = orderItemsToInsert.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    const deliveryPrice =
      input.deliveryMethod === "pickup"
        ? 0
        : Math.max(0, Math.round(Number(input.deliveryPrice) || 0));
    const totalPrice = productsTotal + deliveryPrice;

    // Atomically decrement variant stock and aggregate product salesCount
    const salesByProduct = new Map<string, number>();
    for (const item of orderItemsToInsert) {
      const updatedVariants = await tx
        .update(productVariantsInProducts)
        .set({
          stock: sql`${productVariantsInProducts.stock} - ${item.quantity}`,
        })
        .where(
          and(
            eq(productVariantsInProducts.id, item.variantId),
            gte(productVariantsInProducts.stock, item.quantity),
          ),
        )
        .returning({ id: productVariantsInProducts.id });

      if (updatedVariants.length === 0) {
        const row = rowByVariantId.get(item.variantId);
        return {
          ok: false,
          code: "INSUFFICIENT_STOCK",
          insufficientItems: [
            {
              variantId: item.variantId,
              name: row?.productName ?? "Товар",
              availableStock: 0,
              requestedQuantity: item.quantity,
              missing: false,
            },
          ],
        };
      }

      salesByProduct.set(
        item.productId,
        (salesByProduct.get(item.productId) ?? 0) + item.quantity,
      );
    }

    for (const [productId, soldQty] of salesByProduct.entries()) {
      await tx
        .update(productsInProducts)
        .set({
          salesCount: sql`${productsInProducts.salesCount} + ${soldQty}`,
        })
        .where(eq(productsInProducts.id, productId));
    }

    const [insertedOrder] = await tx
      .insert(ordersInOrders)
      .values({
        customerName: input.customerName,
        email: input.email,
        phone: input.phone,
        deliveryMethod: input.deliveryMethod,
        deliveryCompany: input.deliveryCompany,
        deliveryType: input.deliveryType,
        deliveryPrice,
        address: input.address,
        pochtaTariffId: input.pochtaTariffId,
        pochtaTariffName: input.pochtaTariffName,
        cdekTariffId: input.cdekTariffId,
        cdekTariffName: input.cdekTariffName,
        totalPrice,
        status: "new",
        comment: input.comment,
      })
      .returning();

    if (!insertedOrder) {
      throw new Error("Failed to insert order record");
    }

    await tx.insert(orderItemsInOrders).values(
      orderItemsToInsert.map((item) => ({
        orderId: insertedOrder.id,
        productId: item.productId,
        variantId: item.variantId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        volume: item.volume,
      })),
    );

    const createdAtIso =
      insertedOrder.createdAt instanceof Date
        ? insertedOrder.createdAt.toISOString()
        : new Date().toISOString();
    const year = new Date(createdAtIso).getFullYear();

    return {
      ok: true,
      order: {
        id: insertedOrder.id,
        orderNumber: `ORD-${year}-${String(insertedOrder.id).padStart(5, "0")}`,
        status: insertedOrder.status ?? "new",
        createdAt: createdAtIso,
        customerName: insertedOrder.customerName,
        email: insertedOrder.email,
        phone: insertedOrder.phone,
        deliveryMethod: insertedOrder.deliveryMethod,
        deliveryCompany: insertedOrder.deliveryCompany ?? null,
        deliveryType: insertedOrder.deliveryType ?? null,
        deliveryPrice: insertedOrder.deliveryPrice ?? deliveryPrice,
        address: insertedOrder.address ?? null,
        pochtaTariffId: insertedOrder.pochtaTariffId ?? null,
        pochtaTariffName: insertedOrder.pochtaTariffName ?? null,
        cdekTariffId: insertedOrder.cdekTariffId ?? null,
        cdekTariffName: insertedOrder.cdekTariffName ?? null,
        paymentMethod: input.paymentMethod,
        comment: insertedOrder.comment ?? null,
        productsTotal,
        totalPrice: insertedOrder.totalPrice,
        items: orderItemsToInsert,
      },
    };
  });
}
