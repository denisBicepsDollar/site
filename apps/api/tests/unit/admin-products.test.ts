import {after, before, describe, it} from "node:test";
import assert from "node:assert/strict";
import {existsSync, readFileSync} from "node:fs";
import http from "node:http";
import {dirname, join, resolve} from "node:path";
import {fileURLToPath} from "node:url";

process.env.CONNECTION_STRING ??= "postgres://test:test@127.0.0.1:5432/test";
process.env.SECRET_KEY ??= "unit-test-secret";

const testDir = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(testDir, "../../../..");

const {drizzle} = await import("drizzle-orm/node-postgres");
const {relations} = await import("@drizzle/relations");
const {default: db} = await import("@/db/index");
const {default: pool} = await import("@/db/defaultClient");
const {createApp} = await import("@/app");
const productsController = await import("@/controllers/admin/productsController");
const {adminProductImageDirectory} = await import("@/controllers/admin/productImagesController");
const productService = await import("@/services/store/productService");
const schema = await import("@drizzle/schema");

const UUID_1 = "11111111-1111-4111-8111-111111111111";
const UUID_2 = "22222222-2222-4222-8222-222222222222";
const UUID_V1 = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
const UUID_MISSING = "99999999-9999-4999-8999-999999999999";

interface StoredProduct {
  id: string;
  name: string;
  slug: string | null;
  description: string | null;
  category: string;
  subcategory: string;
  status: string;
  price: string;
  sku: string;
  previewImage: string | null;
  careInstructions: string | null;
  updated: Date;
  createdAt: Date;
  productVariantsInProducts: Array<{
    id: string;
    productId: string;
    name: string | null;
    price: number;
    stock: number;
    previewImage: string | null;
    productVariantsImagesInProducts: Array<{
      id: string;
      variantId: string;
      imgUrl: string;
      isMain: boolean;
    }>;
  }>;
}

describe("Admin Auth & Products API & Admin Mocks", () => {
  let server: http.Server;
  let baseUrl = "";
  let authCookie = "";

  const origPoolQuery = pool.query.bind(pool);
  const origSelect = db.select.bind(db);
  const origUpdate = db.update.bind(db);
  const origDelete = db.delete.bind(db);
  const origTransaction = db.transaction.bind(db);
  const origFindMany = db.query.productsInProducts.findMany.bind(db.query.productsInProducts);
  const origFindFirst = db.query.productsInProducts.findFirst.bind(db.query.productsInProducts);

  let store: StoredProduct[] = [];

  function resetStore() {
    store = [
      {
        id: UUID_1,
        name: "Монстера Делициоза",
        slug: "monstera-delitsioza",
        description: "Резные листья",
        category: "Комнатные",
        subcategory: "Комнатные",
        status: "active",
        price: "3500",
        sku: "PL-001",
        previewImage: "/1.png",
        careInstructions: "Полив умеренный",
        updated: new Date("2026-11-24T10:00:00.000Z"),
        createdAt: new Date("2026-11-20T10:00:00.000Z"),
        productVariantsInProducts: [
          {
            id: UUID_V1,
            productId: UUID_1,
            name: "D9",
            price: 3500,
            stock: 3,
            previewImage: "/1.png",
            productVariantsImagesInProducts: [
              { id: "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb", variantId: UUID_V1, imgUrl: "/1.png", isMain: true },
            ],
          },
        ],
      },
      {
        id: UUID_2,
        name: "Замиокулькас",
        slug: "zamiokulkas",
        description: "Долларовое дерево",
        category: "Комнатные",
        subcategory: "Комнатные",
        status: "draft",
        price: "2900",
        sku: "PL-002",
        previewImage: "/2.png",
        careInstructions: null,
        updated: new Date("2026-11-23T10:00:00.000Z"),
        createdAt: new Date("2026-11-19T10:00:00.000Z"),
        productVariantsInProducts: [],
      },
    ];
  }

  function makeTx() {
    let seq = 1;
    const nextUuid = () => `cccc0000-0000-4000-8000-${String(seq++).padStart(12, "0")}`;

    const tx = {
      select() {
        return {
          from(table: unknown) {
            if (table === schema.productsInProducts) {
              return {
                where(condition: { queryChunks?: unknown[] }) {
                  const isSlugLookup = Boolean(condition?.queryChunks?.includes(schema.productsInProducts.slug));
                  return {
                    limit() {
                      if (isSlugLookup) {
                        return Promise.resolve([]);
                      }
                      return Promise.resolve(
                        store.slice(0, 1).map((p) => ({
                          id: p.id,
                          slug: p.slug,
                          subcategory: p.subcategory,
                          type: null,
                          shortDescription: null,
                        })),
                      );
                    },
                  };
                },
              };
            }
            if (table === schema.productVariantsInProducts) {
              return {
                where() {
                  const variants = store.flatMap((p) => p.productVariantsInProducts);
                  return Promise.resolve(variants.map((v) => ({ id: v.id })));
                },
              };
            }
            return {
              where: () => Promise.resolve([]),
            };
          },
        };
      },
      insert(table: unknown) {
        return {
          values(payload: any) {
            if (table === schema.productsInProducts) {
              const id = nextUuid();
              const created: StoredProduct = {
                id,
                name: payload.name,
                slug: payload.slug ?? null,
                description: payload.description ?? null,
                category: payload.category,
                subcategory: payload.subcategory,
                status: payload.status ?? "draft",
                price: String(payload.price ?? 0),
                sku: payload.sku ?? "PLANT-TEST",
                previewImage: payload.previewImage ?? null,
                careInstructions: payload.careInstructions ?? null,
                updated: payload.updated ?? new Date(),
                createdAt: new Date(),
                productVariantsInProducts: [],
              };
              store.push(created);
              return {
                returning: () => Promise.resolve([created]),
              };
            }
            if (table === schema.productVariantsInProducts) {
              const id = nextUuid();
              const owner = store.find((p) => p.id === payload.productId);
              const variant = {
                id,
                productId: payload.productId,
                name: payload.name ?? null,
                price: Number(payload.price ?? 0),
                stock: Number(payload.stock ?? 0),
                previewImage: payload.previewImage ?? null,
                productVariantsImagesInProducts: [],
              };
              owner?.productVariantsInProducts.push(variant);
              return {
                returning: () => Promise.resolve([variant]),
              };
            }
            if (table === schema.productVariantsImagesInProducts) {
              const items = Array.isArray(payload) ? payload : [payload];
              for (const item of items) {
                for (const p of store) {
                  const v = p.productVariantsInProducts.find((row) => row.id === item.variantId);
                  if (v) {
                    v.productVariantsImagesInProducts.push({
                      id: nextUuid(),
                      variantId: item.variantId,
                      imgUrl: item.imgUrl,
                      isMain: Boolean(item.isMain),
                    });
                  }
                }
              }
              return Promise.resolve();
            }
            return { returning: () => Promise.resolve([]) };
          },
        };
      },
      update(table: unknown) {
        return {
          set(values: any) {
            return {
              where() {
                if (table === schema.productsInProducts && store[0]) {
                  Object.assign(store[0], values);
                } else if (table === schema.productVariantsInProducts && store[0]?.productVariantsInProducts[0]) {
                  Object.assign(store[0].productVariantsInProducts[0], values);
                }
                return Promise.resolve();
              },
            };
          },
        };
      },
      delete(table: unknown) {
        return {
          where() {
            if (table === schema.productsInProducts) {
              const removed = store.splice(0, 1);
              return { returning: () => Promise.resolve(removed.map((p) => ({ id: p.id }))) };
            }
            if (table === schema.productVariantsInProducts) {
              for (const p of store) {
                p.productVariantsInProducts = p.productVariantsInProducts.filter((v) => v.id === UUID_V1);
              }
            }
            if (table === schema.productVariantsImagesInProducts) {
              for (const p of store) {
                for (const v of p.productVariantsInProducts) {
                  v.productVariantsImagesInProducts = [];
                }
              }
            }
            return { returning: () => Promise.resolve([]) };
          },
        };
      },
    };

    return tx;
  }

  before(async () => {
    resetStore();

    (pool as any).query = async (_sql: string, params?: unknown[]) => {
      const username = params?.[0];
      if (username === "admin") {
        return { rows: [{ id: UUID_1, username: "admin", password_hash: "123" }] };
      }
      return { rows: [] };
    };

    (db.query.productsInProducts as any).findMany = async () => store;
    (db.query.productsInProducts as any).findFirst = async () => {
      return store[0] ?? null;
    };

    (db as any).select = () => ({
      from() {
        return {
          where() {
            return Promise.resolve([{ total: store.length }]);
          },
          groupBy() {
            const counts = new Map<string, number>();
            for (const item of store) {
              counts.set(item.status, (counts.get(item.status) ?? 0) + 1);
            }
            return Promise.resolve(
              Array.from(counts.entries()).map(([status, total]) => ({ status, total })),
            );
          },
        };
      },
    });

    (db as any).update = () => ({
      set(values: Record<string, unknown>) {
        return {
          where() {
            for (const item of store) {
              Object.assign(item, values);
            }
            return {
              returning: () => Promise.resolve(store.map((p) => ({ id: p.id }))),
            };
          },
        };
      },
    });

    (db as any).delete = () => ({
      where() {
        const deleted = store.splice(0, store.length);
        return { returning: () => Promise.resolve(deleted.map((p) => ({ id: p.id }))) };
      },
    });

    (db as any).transaction = async (fn: (tx: any) => Promise<any>) => fn(makeTx());

    const app = createApp();
    server = app.listen(0);
    const addr = server.address() as { port: number };
    baseUrl = `http://127.0.0.1:${addr.port}`;
  });

  after(async () => {
    (pool as any).query = origPoolQuery;
    (db as any).select = origSelect;
    (db as any).update = origUpdate;
    (db as any).delete = origDelete;
    (db as any).transaction = origTransaction;
    (db.query.productsInProducts as any).findMany = origFindMany;
    (db.query.productsInProducts as any).findFirst = origFindFirst;
    await new Promise<void>((resolveClose) => server.close(() => resolveClose()));
  });

  it("enforces password check, issues non-Secure cookie on HTTP, validates and clears session on logout", async () => {
    const badRes = await fetch(`${baseUrl}/auth/v1/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: "admin", password: "wrong-password" }),
    });
    assert.equal(badRes.status, 401);

    const okRes = await fetch(`${baseUrl}/auth/v1/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: "admin", password: "123" }),
    });
    assert.equal(okRes.status, 200);

    const setCookie = okRes.headers.get("set-cookie") ?? "";
    assert.match(setCookie, /token=/);
    assert.match(setCookie, /HttpOnly/i);
    assert.match(setCookie, /Path=\//i);
    assert.doesNotMatch(setCookie, /;\s*Secure/i);
    assert.match(okRes.headers.get("cache-control") ?? "", /no-store/i);
    authCookie = setCookie.split(";")[0] ?? "";

    const validNoCookie = await fetch(`${baseUrl}/auth/v1/validation`);
    assert.equal(validNoCookie.status, 401);

    const validWithCookie = await fetch(`${baseUrl}/auth/v1/validation`, {
      headers: { Cookie: authCookie },
    });
    assert.equal(validWithCookie.status, 200);
    assert.match(validWithCookie.headers.get("cache-control") ?? "", /no-store/i);

    const logoutRes = await fetch(`${baseUrl}/auth/v1/logout`, { method: "POST" });
    assert.equal(logoutRes.status, 200);
    assert.match(logoutRes.headers.get("set-cookie") ?? "", /token=;/);
    assert.match(logoutRes.headers.get("set-cookie") ?? "", /Path=\//i);
    assert.match(logoutRes.headers.get("cache-control") ?? "", /no-store/i);
  });

  it("supports admin product CRUD, validation, slug generation, and bulk actions", async () => {
    resetStore();

    const unauth = await fetch(`${baseUrl}/api/v1/admin/products`);
    assert.equal(unauth.status, 401);

    const listRes = await fetch(`${baseUrl}/api/v1/admin/products`, {
      headers: { Cookie: authCookie },
    });
    assert.equal(listRes.status, 200);
    const listBody = await listRes.json() as {
      data: StoredProduct[];
      meta: { total: number; lowStockCount: number; statusCounts: Record<string, number> };
    };
    assert.equal(listBody.data.length, 2);
    assert.equal(typeof listBody.meta.lowStockCount, "number");
    assert.equal(listBody.meta.statusCounts.archived, 0);

    const invalidGetRes = await fetch(`${baseUrl}/api/v1/admin/products/not-a-uuid`, {
      headers: { Cookie: authCookie },
    });
    assert.equal(invalidGetRes.status, 400);

    const getRes = await fetch(`${baseUrl}/api/v1/admin/products/${UUID_1}`, {
      headers: { Cookie: authCookie },
    });
    assert.equal(getRes.status, 200);

    (db.query.productsInProducts as any).findFirst = async () => null;
    const missingGetRes = await fetch(`${baseUrl}/api/v1/admin/products/${UUID_MISSING}`, {
      headers: { Cookie: authCookie },
    });
    assert.equal(missingGetRes.status, 404);
    (db.query.productsInProducts as any).findFirst = async () => store[store.length - 1] ?? null;

    const createRes = await fetch(`${baseUrl}/api/v1/admin/products`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Cookie: authCookie },
      body: JSON.stringify({
        name: "Фикус Бенджамина",
        category: "Комнатные",
        status: "active",
        price: 2400,
        careInstructions: "Светлое место",
        variants: [{ name: "D9", price: 2400, stock: 5, images: ["/1.png"] }],
      }),
    });
    assert.equal(createRes.status, 201);
    const createdBody = await createRes.json() as { data: StoredProduct };
    assert.equal(createdBody.data.slug, "fikus-bendzhamina");

    (db.query.productsInProducts as any).findFirst = async () => store[0] ?? null;
    const patchRes = await fetch(`${baseUrl}/api/v1/admin/products/${UUID_1}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Cookie: authCookie },
      body: JSON.stringify({
        name: "Монстера Делициоза XL",
        category: "Комнатные",
        status: "archived",
        price: 4200,
        variants: [{ id: UUID_V1, name: "D12", price: 4200, stock: 2, images: ["/2.png"] }],
      }),
    });
    assert.equal(patchRes.status, 200);
    const patchedBody = await patchRes.json() as { data: StoredProduct };
    assert.equal(patchedBody.data.name, "Монстера Делициоза XL");
    assert.equal(patchedBody.data.status, "archived");

    const bulkStatusRes = await fetch(`${baseUrl}/api/v1/admin/products/bulk`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Cookie: authCookie },
      body: JSON.stringify({ ids: [UUID_1, UUID_2], status: "active" }),
    });
    assert.equal(bulkStatusRes.status, 200);

    const deleteRes = await fetch(`${baseUrl}/api/v1/admin/products/${UUID_1}`, {
      method: "DELETE",
      headers: { Cookie: authCookie },
    });
    assert.equal(deleteRes.status, 200);

    const bulkDeleteRes = await fetch(`${baseUrl}/api/v1/admin/products/bulk-delete`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Cookie: authCookie },
      body: JSON.stringify({ ids: [UUID_2] }),
    });
    assert.equal(bulkDeleteRes.status, 200);
  });

  it("ensures admin and web apps contain no mock datasets and rely on DB endpoints", () => {
    assert.equal(existsSync(join(rootDir, "apps/admin/src/shared/mock")), false);
    assert.equal(existsSync(join(rootDir, "apps/web/src/features/checkout/config/const.ts")), false);
    assert.equal(existsSync(join(rootDir, "apps/web/src/widgets/shop")), false);
    assert.equal(existsSync(join(rootDir, "apps/web/src/widgets/collections")), false);
    assert.equal(existsSync(join(rootDir, "apps/web/src/widgets/reviews")), false);

    const messagesPage = readFileSync(join(rootDir, "apps/admin/src/features/messages/message-content.tsx"), "utf8");
    assert.doesNotMatch(messagesPage, /INITIAL_MESSAGES/);
    assert.match(messagesPage, /messagesApi\.list/);

    const notification = readFileSync(join(rootDir, "apps/admin/src/features/layout/notification/notification.tsx"), "utf8");
    assert.doesNotMatch(notification, /INITIAL_NOTIFICATIONS/);
    assert.match(notification, /ordersApi\.list/);

    const uploadsProxy = join(rootDir, "apps/web/src/app/uploads/[...path]/route.ts");
    assert.equal(existsSync(uploadsProxy), true);
  });

  it("handles empty prices, preserves subcategory on update, anchors uploads dir, and resolves fallback storefront images", async () => {
    resetStore();
    assert.ok(adminProductImageDirectory.endsWith(join("apps", "api", "uploads", "admin-products")));

    (db.query.productsInProducts as any).findFirst = async () => store[store.length - 1] ?? null;
    const createEmptyPriceRes = await fetch(`${baseUrl}/api/v1/admin/products`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Cookie: authCookie },
      body: JSON.stringify({
        name: "Спатифиллум",
        category: "Комнатные",
        subcategory: "Цветущие",
        status: "active",
        price: "",
        variants: [
          {
            name: "D12",
            price: 1850,
            stock: 4,
            previewImage: "/uploads/admin-products/spati.jpg",
            images: ["/uploads/admin-products/spati.jpg", "/uploads/admin-products/spati-2.jpg"],
          },
        ],
      }),
    });
    assert.equal(createEmptyPriceRes.status, 201);
    const createdEmptyPrice = await createEmptyPriceRes.json() as { data: StoredProduct };
    assert.equal(createdEmptyPrice.data.price, "1850");
    assert.equal(createdEmptyPrice.data.subcategory, "Цветущие");
    assert.equal(createdEmptyPrice.data.previewImage, "/uploads/admin-products/spati.jpg");

    const variantImgs = createdEmptyPrice.data.productVariantsInProducts[0]?.productVariantsImagesInProducts ?? [];
    assert.equal(variantImgs.filter((img) => img.isMain).length, 1);

    if (store[0]) store[0].subcategory = "Ароидные";
    (db.query.productsInProducts as any).findFirst = async () => store[0] ?? null;
    const patchPreservingSubcat = await fetch(`${baseUrl}/api/v1/admin/products/${UUID_1}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Cookie: authCookie },
      body: JSON.stringify({
        name: "Монстера Делициоза Мини",
        category: "Комнатные",
        status: "active",
        price: 3900,
      }),
    });
    assert.equal(patchPreservingSubcat.status, 200);
    const patchedSubcat = await patchPreservingSubcat.json() as { data: StoredProduct };
    assert.equal(patchedSubcat.data.subcategory, "Ароидные");

    const formatted = productService.formatCatalogProduct({
      id: UUID_1,
      name: "Калатея",
      slug: "kalateya",
      category: "Комнатные",
      subcategory: "Комнатные",
      previewImage: null,
      productVariantsInProducts: [
        {
          id: UUID_V1,
          name: "D12",
          price: 2200,
          stock: 3,
          previewImage: null,
          productVariantsImagesInProducts: [
            { imgUrl: "/uploads/admin-products/kalateya.png", isMain: true },
          ],
        },
      ],
    });
    assert.equal(formatted.previewImage, "/uploads/admin-products/kalateya.png");
  });

  it("exposes DB-backed contact messages on /api/v1/admin/messages with auth", async () => {
    const unauthMsg = await fetch(`${baseUrl}/api/v1/admin/messages`);
    assert.equal(unauthMsg.status, 401);

    (db as any).select = () => ({
      from() {
        return {
          orderBy() {
            return Promise.resolve([
              { id: 7, name: "Елена", email: "elena@example.com", phone: null, message: "Добрый день", createdAt: new Date("2026-11-25T10:00:00.000Z") },
            ]);
          },
        };
      },
    });
    const authMsg = await fetch(`${baseUrl}/api/v1/admin/messages`, {
      headers: { Cookie: authCookie },
    });
    assert.equal(authMsg.status, 200);
    const msgBody = await authMsg.json() as { data: Array<{ id: number; name: string }> };
    assert.equal(msgBody.data.length, 1);
    assert.equal(msgBody.data[0]?.name, "Елена");
  });

  it("hides Messages and Settings from the admin sidebar navigation config", async () => {
    const navPath = join(rootDir, "apps/admin/src/widgets/sidebar/config/navigation.ts");
    const {dashboardNavigation} = await import(navPath) as {
      dashboardNavigation: Array<{to: string; label: string}>;
    };
    const paths = dashboardNavigation.map((item) => item.to);
    assert.deepEqual(paths, ["/dashboard/products", "/dashboard/orders"]);
  });

  it("comments out notifications, restores UI button CSS layers, and isolates AccessControl state across routes", () => {
    const pageHeader = readFileSync(join(rootDir, "apps/admin/src/features/dashboard/components/PageHeader.tsx"), "utf8");
    const pageHeaderWithoutComments = pageHeader.replace(/\/\*[\s\S]*?\*\/|\/\/.*$/gm, "");
    assert.doesNotMatch(pageHeaderWithoutComments, /\bNotification\b/);

    const indexCss = readFileSync(join(rootDir, "apps/admin/src/index.css"), "utf8");
    assert.ok(indexCss.includes('@source "../../../packages/ui/src";'));
    assert.ok(indexCss.includes("--color-cream:"));
    assert.ok(indexCss.includes("--color-forest:"));
    assert.ok(indexCss.includes("--color-clay:"));
    assert.ok(indexCss.includes("@layer components"));
    assert.ok(indexCss.indexOf("@layer components") < indexCss.indexOf(".btn-accent"));

    const appTsx = readFileSync(join(rootDir, "apps/admin/src/app/app.tsx"), "utf8");
    assert.ok(appTsx.includes('<AccessControl key="public" type="public">'));
    assert.ok(appTsx.includes('<AccessControl key="login" type="public">'));
    assert.ok(appTsx.includes('<AccessControl key="private" type="private">'));

    const accessControl = readFileSync(join(rootDir, "apps/admin/src/shared/components/AccessControl.tsx"), "utf8");
    assert.ok(accessControl.includes("authState.type === type ? authState.status : \"loading\""));
  });
});

describe("Admin Products Drizzle SQL Compilation", () => {
  it("uses aliased d0 column references in all Drizzle RQB list/getOne queries", async () => {
    const origSelect = db.select.bind(db);
    const origFindMany = db.query.productsInProducts.findMany.bind(db.query.productsInProducts);
    const origFindFirst = db.query.productsInProducts.findFirst.bind(db.query.productsInProducts);

    const executed: Array<{ label: string; sql: string }> = [];
    let currentLabel = "";
    const fakeClient = {
      async query(q: any) {
        const sqlText = typeof q === "string" ? q : q.text;
        executed.push({ label: currentLabel, sql: sqlText });
        return { rows: [], rowCount: 0, fields: [] };
      },
    };
    const spyDrizzle = drizzle({ client: fakeClient as any, relations });
    (db.query.productsInProducts as any).findMany =
      spyDrizzle.query.productsInProducts.findMany.bind(spyDrizzle.query.productsInProducts);
    (db.query.productsInProducts as any).findFirst =
      spyDrizzle.query.productsInProducts.findFirst.bind(spyDrizzle.query.productsInProducts);
    (db as any).select = spyDrizzle.select.bind(spyDrizzle);

    try {
      const queries = [
        { label: "default", query: {} },
        { label: "q+status+lowStock+name_asc", query: { q: "Монстера", status: "active", lowStock: "true", sortBy: "name", sortDirection: "asc" } },
        { label: "sort_category_asc", query: { sortBy: "category", sortDirection: "asc" } },
        { label: "sort_status_desc", query: { sortBy: "status", sortDirection: "desc" } },
        { label: "sort_price_asc", query: { sortBy: "price", sortDirection: "asc" } },
        { label: "sort_price_desc", query: { sortBy: "price", sortDirection: "desc" } },
        { label: "sort_stock_asc", query: { sortBy: "stock", sortDirection: "asc" } },
        { label: "sort_stock_desc", query: { sortBy: "stock", sortDirection: "desc" } },
      ];

      for (const item of queries) {
        currentLabel = item.label;
        const res = {
          statusCode: 200,
          status(code: number) { this.statusCode = code; return this; },
          json() { return this; },
        };
        await productsController.list({ query: item.query, params: {} } as any, res as any);
        assert.equal(res.statusCode, 200);
      }

      currentLabel = "getOne";
      await productsController.getOne(
        { params: { id: UUID_1 }, query: {} } as any,
        { status() { return this; }, json() { return this; } } as any,
      );

      let rqbCount = 0;
      for (const entry of executed) {
        if (entry.sql.includes('as "d0"')) {
          rqbCount++;
          assert.equal(
            entry.sql.includes('"products"."products".'),
            false,
            `Unaliased products.products reference in RQB query (${entry.label}): ${entry.sql}`,
          );
          assert.ok(entry.sql.includes('"d0".'), `Expected d0 alias in RQB query (${entry.label})`);
        } else {
          assert.equal(
            entry.sql.includes('"d0".'),
            false,
            `Unexpected d0 alias in non-RQB query (${entry.label}): ${entry.sql}`,
          );
        }
      }
      assert.equal(rqbCount, queries.length + 1);
    } finally {
      (db as any).select = origSelect;
      (db.query.productsInProducts as any).findMany = origFindMany;
      (db.query.productsInProducts as any).findFirst = origFindFirst;
    }
  });
});
