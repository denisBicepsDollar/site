import { after, before, describe, it } from "node:test";
import assert from "node:assert/strict";
import http from "node:http";
import express from "express";

import db from "@/db/index";
import { registerRoutes } from "@/routes/routes";
import * as orderService from "@/services/store/orderService";

const VALID_UUID_1 = "11111111-1111-4111-8111-111111111111";
const VALID_UUID_2 = "22222222-2222-4222-8222-222222222222";
const MISSING_UUID = "33333333-3333-4333-8333-333333333333";

interface FakeVariantRow {
  variantId: string;
  productId: string;
  price: number;
  stock: number;
  variantName: string | null;
  variantPreviewImage: string | null;
  productName: string;
  productPreviewImage: string | null;
  slug: string;
}

function createFakeTx(
  variants: FakeVariantRow[],
  captured: {
    forUpdateCalled: boolean;
    updatedVariants: Array<{ values: Record<string, unknown> }>;
    updatedProducts: Array<{ values: Record<string, unknown> }>;
    insertedOrder: Record<string, unknown> | null;
    insertedOrderItems: Array<Record<string, unknown>>;
  },
) {
  let step = 0;

  return {
    select() {
      return {
        from() {
          return {
            innerJoin() {
              return {
                where() {
                  return {
                    for(mode: string) {
                      assert.equal(mode, "update");
                      captured.forUpdateCalled = true;
                      return Promise.resolve(variants);
                    },
                  };
                },
              };
            },
          };
        },
      };
    },
    update() {
      return {
        set(values: Record<string, unknown>) {
          return {
            where() {
              const isVariantUpdate = "stock" in values;
              if (isVariantUpdate) {
                captured.updatedVariants.push({ values });
                return {
                  returning() {
                    return Promise.resolve([{ id: `ok-${++step}` }]);
                  },
                };
              }
              captured.updatedProducts.push({ values });
              return Promise.resolve();
            },
          };
        },
      };
    },
    insert() {
      return {
        values(payload: unknown) {
          if (!Array.isArray(payload)) {
            captured.insertedOrder = payload as Record<string, unknown>;
            return {
              returning() {
                return Promise.resolve([
                  {
                    id: 42,
                    status: "new",
                    createdAt: new Date("2026-11-25T10:00:00.000Z"),
                    ...(payload as Record<string, unknown>),
                  },
                ]);
              },
            };
          }
          captured.insertedOrderItems = payload as Array<Record<string, unknown>>;
          return Promise.resolve();
        },
      };
    },
  };
}

describe("Order API & Service & Repo integration", () => {
  let server: http.Server;
  let baseUrl = "";
  const origTransaction = db.transaction.bind(db);

  before(async () => {
    const app = express();
    app.use(express.json());
    registerRoutes(app);

    await new Promise<void>((resolve) => {
      server = app.listen(0, "127.0.0.1", () => {
        const addr = server.address();
        assert.ok(addr && typeof addr === "object");
        baseUrl = `http://127.0.0.1:${addr.port}`;
        resolve();
      });
    });
  });

  after(async () => {
    db.transaction = origTransaction;
    await new Promise<void>((resolve) => server.close(() => resolve()));
  });

  it("rejects invalid customer/delivery/items payloads with 400", async () => {
    const res = await fetch(`${baseUrl}/api/v1/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customer: {
          firstName: "",
          lastName: "Иванов",
          phone: "123",
          email: "bad-email",
        },
        delivery: {
          method: "delivery",
          address: "",
        },
        items: [],
      }),
    });

    assert.equal(res.status, 400);
    const body = await res.json();
    assert.equal(body.status, "error");
    assert.equal(body.code, "VALIDATION_ERROR");
    assert.ok(body.fields.firstName);
    assert.ok(body.fields.phone);
    assert.ok(body.fields.email);
    assert.ok(body.fields.address);
    assert.ok(body.fields.items);
  });

  it("returns 409 when stock is insufficient or variant is missing", async () => {
    const captured = {
      forUpdateCalled: false,
      updatedVariants: [],
      updatedProducts: [],
      insertedOrder: null,
      insertedOrderItems: [],
    };

    (db as unknown as { transaction: unknown }).transaction = async (
      cb: (tx: unknown) => Promise<unknown>,
    ) => {
      return cb(
        createFakeTx(
          [
            {
              variantId: VALID_UUID_1,
              productId: "prod-1",
              price: 1500,
              stock: 2,
              variantName: "M",
              variantPreviewImage: null,
              productName: "Монстера",
              productPreviewImage: "/m.png",
              slug: "monstera",
            },
          ],
          captured,
        ),
      );
    };

    const res = await fetch(`${baseUrl}/api/v1/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customer: {
          firstName: "Анна",
          lastName: "Петрова",
          phone: "+7 999 123-45-67",
          email: "anna@example.com",
        },
        delivery: {
          method: "pickup",
          price: 999,
        },
        payment: { method: "sbp" },
        items: [
          { variantId: VALID_UUID_1, quantity: 3 },
          { variantId: MISSING_UUID, quantity: 1 },
        ],
      }),
    });

    assert.equal(res.status, 409);
    const body = await res.json();
    assert.equal(body.code, "INSUFFICIENT_STOCK");
    assert.equal(captured.forUpdateCalled, true);
    assert.equal(captured.updatedVariants.length, 0);
    assert.equal(captured.insertedOrder, null);
    assert.equal(body.items.length, 2);
    assert.equal(body.items[0].availableStock, 2);
    assert.equal(body.items[1].missing, true);
  });

  it("creates order with 201, calculates authoritative totals, decrements stock, and zeroes pickup shipping", async () => {
    const captured = {
      forUpdateCalled: false,
      updatedVariants: [],
      updatedProducts: [],
      insertedOrder: null as Record<string, unknown> | null,
      insertedOrderItems: [] as Array<Record<string, unknown>>,
    };

    (db as unknown as { transaction: unknown }).transaction = async (
      cb: (tx: unknown) => Promise<unknown>,
    ) => {
      return cb(
        createFakeTx(
          [
            {
              variantId: VALID_UUID_1,
              productId: "prod-1",
              price: 1200,
              stock: 5,
              variantName: "12 см",
              variantPreviewImage: "/v1.png",
              productName: "Фикус",
              productPreviewImage: "/p1.png",
              slug: "fikus",
            },
            {
              variantId: VALID_UUID_2,
              productId: "prod-1",
              price: 2000,
              stock: 3,
              variantName: "17 см",
              variantPreviewImage: null,
              productName: "Фикус",
              productPreviewImage: "/p1.png",
              slug: "fikus",
            },
          ],
          captured,
        ),
      );
    };

    const res = await fetch(`${baseUrl}/api/v1/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customer: {
          firstName: "Иван",
          lastName: "Сидоров",
          middleName: "Олегович",
          phone: "+7 916 555-44-33",
          email: "ivan@example.com",
          comment: "Позвонить за час",
        },
        delivery: {
          method: "delivery",
          company: "russian_post",
          type: "pickup_post_office",
          tariffId: "first_class",
          tariffName:
            "Доставка · Почта России · Самовывоз из отделения · 1 класс",
          address: "Москва, ул. Тверская, д. 1",
          price: 350,
        },
        payment: { method: "sbp" },
        items: [
          { variantId: VALID_UUID_1, quantity: 1 },
          { variantId: VALID_UUID_1, quantity: 2 },
          { variantId: VALID_UUID_2, quantity: 1 },
        ],
      }),
    });

    assert.equal(res.status, 201);
    const body = await res.json();
    assert.equal(body.id, 42);
    assert.equal(body.orderNumber, "ORD-2026-00042");
    assert.equal(body.productsTotal, 5600);
    assert.equal(body.deliveryPrice, 350);
    assert.equal(body.totalPrice, 5950);
    assert.equal(body.customerName, "Сидоров Иван Олегович");
    assert.equal(captured.updatedVariants.length, 2);
    assert.equal(captured.updatedProducts.length, 1);
    assert.equal(captured.insertedOrderItems.length, 2);
    assert.equal(captured.insertedOrderItems[0]?.variantId, VALID_UUID_1);
    assert.equal(captured.insertedOrderItems[0]?.quantity, 3);
    assert.equal(captured.insertedOrder?.pochtaTariffId, "first_class");

    const pickupResult = await orderService.createOrder({
      customer: {
        firstName: "Ольга",
        lastName: "Смирнова",
        phone: "89991112233",
        email: "olga@example.com",
      },
      delivery: {
        method: "pickup",
        price: 500,
      },
      payment: { method: "sbp" },
      items: [{ variantId: VALID_UUID_2, quantity: 1 }],
    });
    assert.equal(pickupResult.status, 201);
    if (pickupResult.status === 201) {
      assert.equal(pickupResult.data.deliveryPrice, 0);
      assert.equal(pickupResult.data.totalPrice, 2000);
    }
  });
});
