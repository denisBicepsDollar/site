import * as orderRepo from "@/db/store/orderRepo";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface CreateOrderPayload {
  customer?: {
    firstName?: string;
    lastName?: string;
    middleName?: string;
    email?: string;
    phone?: string;
    comment?: string;
  };
  delivery?: {
    method?: string;
    company?: string | null;
    type?: string | null;
    tariffId?: string | null;
    tariffName?: string | null;
    address?: string | null;
    price?: number;
  };
  payment?: {
    method?: string;
  };
  items?: Array<{
    variantId?: string;
    quantity?: number;
  }>;
}

export type CreateOrderServiceResult =
  | { status: 201; data: orderRepo.CreatedOrderRecord }
  | {
      status: 400;
      error: {
        code: "VALIDATION_ERROR";
        message: string;
        fields?: Record<string, string>;
      };
    }
  | {
      status: 409;
      error: {
        code: "INSUFFICIENT_STOCK";
        message: string;
        items: orderRepo.InsufficientStockItem[];
      };
    };

function cleanString(value: unknown, maxLen = 500): string {
  return typeof value === "string" ? value.trim().slice(0, maxLen) : "";
}

export async function createOrder(
  payload: CreateOrderPayload,
): Promise<CreateOrderServiceResult> {
  const customer = payload?.customer ?? {};
  const delivery = payload?.delivery ?? {};
  const payment = payload?.payment ?? {};
  const rawItems = Array.isArray(payload?.items) ? payload.items : [];

  const fields: Record<string, string> = {};

  const firstName = cleanString(customer.firstName, 100);
  const lastName = cleanString(customer.lastName, 100);
  const middleName = cleanString(customer.middleName, 100);
  const email = cleanString(customer.email, 200);
  const phone = cleanString(customer.phone, 40);
  const userComment = cleanString(customer.comment, 1000);

  if (!firstName) fields.firstName = "Укажите имя";
  if (!lastName) fields.lastName = "Укажите фамилию";

  const phoneDigits = phone.replace(/\D/g, "");
  if (phoneDigits.length < 10) {
    fields.phone = "Укажите корректный номер телефона";
  }

  if (!email || !EMAIL_RE.test(email)) {
    fields.email = "Укажите корректную электронную почту";
  }

  const deliveryMethod = cleanString(delivery.method, 50);
  if (deliveryMethod !== "pickup" && deliveryMethod !== "delivery") {
    fields.deliveryMethod = "Выберите способ получения заказа";
  }

  const deliveryCompany = cleanString(delivery.company, 50) || null;
  const deliveryType = cleanString(delivery.type, 80) || null;
  const tariffId = cleanString(delivery.tariffId, 80) || null;
  const tariffName = cleanString(delivery.tariffName, 160) || null;
  const address = cleanString(delivery.address, 500) || null;

  if (deliveryMethod === "delivery" && !address) {
    fields.address = "Укажите адрес или населённый пункт доставки";
  }

  const rawDeliveryPrice = Number(delivery.price ?? 0);
  const deliveryPrice =
    deliveryMethod === "pickup"
      ? 0
      : Number.isFinite(rawDeliveryPrice) && rawDeliveryPrice >= 0
        ? Math.round(rawDeliveryPrice)
        : 0;

  if (rawItems.length === 0) {
    fields.items = "Корзина пуста";
  }

  // Deduplicate and validate item quantities
  const itemQuantities = new Map<string, number>();
  for (const rawItem of rawItems) {
    const variantId = cleanString(rawItem?.variantId, 64);
    const qty = Number(rawItem?.quantity);
    if (!UUID_RE.test(variantId)) {
      fields.items = "Передан некорректный идентификатор варианта товара";
      break;
    }
    if (!Number.isInteger(qty) || qty < 1 || qty > 999) {
      fields.items = "Некорректное количество товара в заказе";
      break;
    }
    itemQuantities.set(variantId, (itemQuantities.get(variantId) ?? 0) + qty);
  }

  if (Object.keys(fields).length > 0) {
    const firstMessage =
      Object.values(fields)[0] ?? "Проверьте корректность данных заказа";
    return {
      status: 400,
      error: {
        code: "VALIDATION_ERROR",
        message: firstMessage,
        fields,
      },
    };
  }

  const customerName = [lastName, firstName, middleName]
    .filter(Boolean)
    .join(" ");

  const paymentMethod = cleanString(payment.method, 40) || "sbp";
  const paymentNote =
    paymentMethod === "sbp" ? "Оплата: СБП" : `Оплата: ${paymentMethod}`;
  const fullComment = userComment
    ? `${userComment}\n${paymentNote}`
    : paymentNote;

  const isPochta = deliveryCompany === "russian_post";
  const isCdek = deliveryCompany === "cdek";

  const repoResult = await orderRepo.createOrder({
    customerName,
    email,
    phone,
    deliveryMethod,
    deliveryCompany,
    deliveryType,
    deliveryPrice,
    address:
      deliveryMethod === "pickup"
        ? address || "Самовывоз: Брянская обл., Новозыбков"
        : address,
    pochtaTariffId: isPochta ? tariffId : null,
    pochtaTariffName: isPochta ? tariffName : null,
    cdekTariffId: isCdek ? tariffId : null,
    cdekTariffName: isCdek ? tariffName : null,
    comment: fullComment,
    items: Array.from(itemQuantities.entries()).map(([variantId, quantity]) => ({
      variantId,
      quantity,
    })),
  });

  if (!repoResult.ok) {
    const names = repoResult.insufficientItems
      .map((item) =>
        item.missing || item.availableStock <= 0
          ? `${item.name} (нет в наличии)`
          : `${item.name} (доступно ${item.availableStock} шт.)`,
      )
      .join(", ");

    return {
      status: 409,
      error: {
        code: "INSUFFICIENT_STOCK",
        message: `Недостаточно товара на складе: ${names}`,
        items: repoResult.insufficientItems,
      },
    };
  }

  return {
    status: 201,
    data: repoResult.order,
  };
}
