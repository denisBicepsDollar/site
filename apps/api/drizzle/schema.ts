import { pgSchema, pgTable, serial, uuid, text, numeric, integer, varchar, boolean, timestamp, foreignKey, primaryKey, unique } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const messages = pgSchema("messages");
export const orders = pgSchema("orders");
export const products = pgSchema("products");
export const users = pgSchema("users");


export const contactsInMessages = messages.table("contacts", {
	id: serial().primaryKey(),
	name: text(),
	email: text(),
	phone: text(),
	message: text().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`),
});

export const orderItemsInOrders = orders.table("order_items", {
	id: serial().primaryKey(),
	orderId: integer("order_id"),
	productId: text("product_id"),
	variantId: text("variant_id"),
	name: text().notNull(),
	price: integer().notNull(),
	quantity: integer().notNull(),
	volume: text(),
});

export const ordersInOrders = orders.table("orders", {
	id: serial().primaryKey(),
	customerName: text("customer_name").notNull(),
	email: text().notNull(),
	phone: text().notNull(),
	deliveryMethod: text("delivery_method").notNull(),
	deliveryCompany: text("delivery_company"),
	deliveryType: text("delivery_type"),
	deliveryPrice: integer("delivery_price").default(0),
	address: text(),
	pochtaTariffId: text("pochta_tariff_id"),
	pochtaTariffName: text("pochta_tariff_name"),
	cdekTariffId: text("cdek_tariff_id"),
	cdekTariffName: text("cdek_tariff_name"),
	totalPrice: integer("total_price").notNull(),
	status: text().default("new"),
	createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`),
	comment: text(),
});

export const productVariantsInProducts = products.table("product_variants", {
	price: numeric({ mode: 'number', precision: 10, scale: 2 }).default(0).notNull(),
	oldPrice: integer("old_price"),
	stock: integer().default(0).notNull(),
	previewImage: text("preview_image"),
	createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`),
	name: text(),
	id: uuid().defaultRandom().primaryKey(),
	productId: uuid("product_id").notNull(),
}, (table) => [
	foreignKey({
		columns: [table.productId],
		foreignColumns: [productsInProducts.id],
		name: "fk_product_variants__products"
	}),
]);

export const productVariantsImagesInProducts = products.table("product_variants_images", {
	imgUrl: text("img_url"),
	altText: text("alt_text"),
	titleText: text("title_text"),
	isMain: boolean("is_main").default(false),
	id: uuid().defaultRandom().primaryKey(),
	variantId: uuid("variant_id").notNull(),
}, (table) => [
	foreignKey({
		columns: [table.variantId],
		foreignColumns: [productVariantsInProducts.id],
		name: "fk_product_variants_images__product_variants"
	}),
]);

export const productsInProducts = products.table("products", {
	name: text().notNull(),
	description: text(),
	subcategory: text().notNull(),
	subtype: text(),
	tags: text().array().default([]),
	createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`),
	previewImage: text("preview_image"),
	category: text(),
	status: text().default("draft"),
	sku: text(),
	price: numeric({ precision: 10, scale: 2 }),
	id: uuid().defaultRandom().primaryKey(),
	updated: timestamp({ withTimezone: true }),
	slug: varchar({ length: 255 }),
	shortDescription: varchar("short_description", { length: 255 }),
	careInstructions: text("care_instructions"),
	type: text(),
	salesCount: integer().default(0).notNull(),
	priority: integer().default(0).notNull(),
}, (table) => [
	unique("products_slug_key").on(table.slug),]);

export const catalogLabelsInProducts = products.table(
  "catalog_labels",
  {
    id: serial().primaryKey(),
    kind: text().notNull(),
    slug: text().notNull(),
    labelRu: text("label_ru").notNull(),
    pageTitleRu: text("page_title_ru"),
    sortOrder: integer("sort_order").default(0).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).default(
      sql`now()`,
    ),
  },
  (table) => [
    unique("catalog_labels_kind_slug_key").on(table.kind, table.slug),
  ],
);

export const usersInUsers = users.table("users", {
	id: uuid().defaultRandom().primaryKey(),
	username: text(),
	passwordHash: varchar("password_hash", { length: 255 }),
});
