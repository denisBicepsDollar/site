-- Базовая инициализация схемы PostgreSQL для проекта «Зелёные усы»
-- Совместима с PostgreSQL 15+ и актуальной схемой Drizzle ORM (apps/api/drizzle/schema.ts).
-- Может выполняться автоматически при старте нового Docker-контейнера (/docker-entrypoint-initdb.d)
-- или вручную через psql перед заполнением тестовыми данными (seed.sql) и миграциями.

BEGIN;

CREATE SCHEMA IF NOT EXISTS "messages";
CREATE SCHEMA IF NOT EXISTS "orders";
CREATE SCHEMA IF NOT EXISTS "products";
CREATE SCHEMA IF NOT EXISTS "users";

CREATE TABLE IF NOT EXISTS "messages"."contacts" (
    "id" serial PRIMARY KEY,
    "name" text,
    "email" text,
    "phone" text,
    "message" text NOT NULL,
    "created_at" timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "orders"."orders" (
    "id" serial PRIMARY KEY,
    "customer_name" text NOT NULL,
    "email" text NOT NULL,
    "phone" text NOT NULL,
    "delivery_method" text NOT NULL,
    "delivery_company" text,
    "delivery_type" text,
    "delivery_price" integer DEFAULT 0,
    "address" text,
    "pochta_tariff_id" text,
    "pochta_tariff_name" text,
    "cdek_tariff_id" text,
    "cdek_tariff_name" text,
    "total_price" integer NOT NULL,
    "status" text DEFAULT 'new',
    "created_at" timestamp with time zone DEFAULT now(),
    "comment" text
);

CREATE TABLE IF NOT EXISTS "orders"."order_items" (
    "id" serial PRIMARY KEY,
    "order_id" integer,
    "product_id" text,
    "variant_id" text,
    "name" text NOT NULL,
    "price" integer NOT NULL,
    "quantity" integer NOT NULL,
    "volume" text
);

CREATE TABLE IF NOT EXISTS "products"."products" (
    "name" text NOT NULL,
    "description" text,
    "subcategory" text NOT NULL,
    "subtype" text,
    "tags" text[] DEFAULT '{}'::text[],
    "created_at" timestamp with time zone DEFAULT now(),
    "preview_image" text,
    "category" text,
    "status" text DEFAULT 'draft',
    "sku" text,
    "price" numeric(10, 2),
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    "updated" timestamp with time zone,
    "slug" varchar(255),
    "short_description" varchar(255),
    "care_instructions" text,
    "type" text,
    "salesCount" integer DEFAULT 0 NOT NULL,
    "priority" integer DEFAULT 0 NOT NULL,
    CONSTRAINT "products_slug_key" UNIQUE ("slug")
);

CREATE TABLE IF NOT EXISTS "products"."product_variants" (
    "price" numeric(10, 2) DEFAULT '0' NOT NULL,
    "old_price" integer,
    "stock" integer DEFAULT 0 NOT NULL,
    "preview_image" text,
    "created_at" timestamp with time zone DEFAULT now(),
    "name" text,
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    "product_id" uuid NOT NULL
);

CREATE TABLE IF NOT EXISTS "products"."product_variants_images" (
    "img_url" text,
    "alt_text" text,
    "title_text" text,
    "is_main" boolean DEFAULT false,
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    "variant_id" uuid NOT NULL
);

CREATE TABLE IF NOT EXISTS "products"."catalog_labels" (
    "id" serial PRIMARY KEY,
    "kind" text NOT NULL,
    "slug" text NOT NULL,
    "label_ru" text NOT NULL,
    "page_title_ru" text,
    "sort_order" integer DEFAULT 0 NOT NULL,
    "created_at" timestamp with time zone DEFAULT now(),
    CONSTRAINT "catalog_labels_kind_slug_key" UNIQUE ("kind", "slug")
);

CREATE TABLE IF NOT EXISTS "users"."users" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    "username" text,
    "password_hash" varchar(255)
);

DO $$
BEGIN
    ALTER TABLE "products"."product_variants"
        ADD CONSTRAINT "fk_product_variants__products"
        FOREIGN KEY ("product_id") REFERENCES "products"."products"("id");
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
    ALTER TABLE "products"."product_variants_images"
        ADD CONSTRAINT "fk_product_variants_images__product_variants"
        FOREIGN KEY ("variant_id") REFERENCES "products"."product_variants"("id");
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

COMMIT;
