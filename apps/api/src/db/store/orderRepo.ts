import db from "@/db/index";
import {
  orderItemsInOrders,
  ordersInOrders,
  productsInProducts,
  productVariantsInProducts,
} from "@drizzle/schema";
import { and, desc, eq, gte, inArray, sql } from "drizzle-orm";

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

export type AdminOrderStatusUpdate =
  | { kind: "updated" }
  | { kind: "not_found" }
  | { kind: "conflict"; currentStatus: string };

function toAdminOrder(row: typeof ordersInOrders.$inferSelect, items: Array<typeof orderItemsInOrders.$inferSelect>) {
  const createdAt = row.createdAt instanceof Date
    ? row.createdAt.toISOString()
    : new Date(row.createdAt ?? Date.now()).toISOString();
  const year = new Date(createdAt).getFullYear();
  const nameParts = row.customerName.trim().split(/\s+/).filter(Boolean);
  const productsTotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryCompany = row.deliveryCompany === "cdek"
    ? "СДЭК"
    : row.deliveryCompany === "russian_post"
      ? "Почта России"
      : row.deliveryCompany ?? "—";

  return {
    id: row.id,
    orderNumber: `ORD-${year}-${String(row.id).padStart(5, "0")}`,
    status: row.status ?? "new",
    createdAt,
    customer: {
      name: row.customerName,
      firstName: nameParts[0] ?? "",
      lastName: nameParts.slice(1).join(" "),
      initials: nameParts.slice(0, 2).map((part) => part[0]?.toLocaleUpperCase("ru-RU") ?? "").join(""),
      email: row.email,
      phone: row.phone,
    },
    payment: {
      method: "Оплата после подтверждения заказа",
      status: "Ожидает оплаты",
      isPaid: false,
    },
    delivery: {
      company: deliveryCompany,
      method: row.deliveryMethod === "pickup" ? "Самовывоз" : row.deliveryType ?? "Доставка",
      address: row.address ?? "—",
    },
    deliveryPrice: row.deliveryPrice ?? 0,
    items: items.map((item) => ({
      id: item.id,
      productId: item.productId ?? "",
      variantId: item.variantId ?? "",
      title: item.name,
      name: item.name,
      options: item.volume ?? "",
      quantity: item.quantity,
      price: item.price,
    })),
    summary: {
      itemsPrice: productsTotal,
      deliveryPrice: row.deliveryPrice ?? 0,
      totalPrice: row.totalPrice,
    },
    comment: row.comment ?? "",
  };
}

async function attachItems(rows: Array<typeof ordersInOrders.$inferSelect>) {
  if (rows.length === 0) return [];
  const ids = rows.map((row) => row.id);
  const itemRows = await db
    .select()
    .from(orderItemsInOrders)
    .where(inArray(orderItemsInOrders.orderId, ids));
  const itemsByOrder = new Map<number, Array<typeof orderItemsInOrders.$inferSelect>>();
  for (const item of itemRows) {
    if (item.orderId === null) continue;
    const grouped = itemsByOrder.get(item.orderId) ?? [];
    grouped.push(item);
    itemsByOrder.set(item.orderId, grouped);
  }
  return rows.map((row) => toAdminOrder(row, itemsByOrder.get(row.id) ?? []));
}

export async function listAdminOrders() {
  const rows = await db
    .select()
    .from(ordersInOrders)
    .orderBy(desc(ordersInOrders.createdAt), desc(ordersInOrders.id));
  return attachItems(rows);
}

export async function getAdminOrderById(id: number) {
  const [row] = await db
    .select()
    .from(ordersInOrders)
    .where(eq(ordersInOrders.id, id))
    .limit(1);
  if (!row) return null;
  const [order] = await attachItems([row]);
  return order ?? null;
}

export async function updateAdminOrderStatus(
  id: number,
  status: string,
  allowedFrom: string[],
): Promise<AdminOrderStatusUpdate> {
  return db.transaction(async (tx) => {
    const [order] = await tx
      .select()
      .from(ordersInOrders)
      .where(eq(ordersInOrders.id, id))
      .for("update");
    if (!order) return {kind: "not_found"};
    const currentStatus = order.status ?? "new";
    if (currentStatus === status) return {kind: "updated"};
    if (!allowedFrom.includes(currentStatus)) {
      return {kind: "conflict", currentStatus};
    }

    if (status === "cancelled") {
      const items = await tx
        .select()
        .from(orderItemsInOrders)
        .where(eq(orderItemsInOrders.orderId, id));
      for (const item of items) {
        if (!item.variantId) continue;
        await tx
          .update(productVariantsInProducts)
          .set({stock: sql`${productVariantsInProducts.stock} + ${item.quantity}`})
          .where(eq(productVariantsInProducts.id, item.variantId));
        if (item.productId) {
          await tx
            .update(productsInProducts)
            .set({salesCount: sql`greatest(${productsInProducts.salesCount} - ${item.quantity}, 0)`})
            .where(eq(productsInProducts.id, item.productId));
        }
      }
    }

    await tx
      .update(ordersInOrders)
      .set({status})
      .where(eq(ordersInOrders.id, id));
    return {kind: "updated"};
  });
}
