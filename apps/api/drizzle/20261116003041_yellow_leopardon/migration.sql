-- Initial baseline schema migration (idempotent for both fresh DBs and DBs initialized via infra/db-init)
CREATE SCHEMA IF NOT EXISTS "messages";
--> statement-breakpoint
CREATE SCHEMA IF NOT EXISTS "orders";
--> statement-breakpoint
CREATE SCHEMA IF NOT EXISTS "products";
--> statement-breakpoint
CREATE SCHEMA IF NOT EXISTS "users";
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "messages"."contacts" (
	"id" serial PRIMARY KEY,
	"name" text,
	"email" text,
	"phone" text,
	"message" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "orders"."order_items" (
	"id" serial PRIMARY KEY,
	"order_id" integer,
	"product_id" text,
	"variant_id" integer,
	"name" text NOT NULL,
	"price" integer NOT NULL,
	"quantity" integer NOT NULL,
	"volume" text
);
--> statement-breakpoint
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
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "products"."product_variants" (
	"price" numeric(10,2) DEFAULT '0' NOT NULL,
	"old_price" integer,
	"stock" integer DEFAULT 0 NOT NULL,
	"preview_image" text,
	"created_at" timestamp with time zone DEFAULT now(),
	"name" text,
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"product_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "products"."product_variants_images" (
	"img_url" text,
	"alt_text" text,
	"title_text" text,
	"is_main" boolean DEFAULT false,
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"variant_id" uuid NOT NULL
);
--> statement-breakpoint
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
	"price" numeric(10,2),
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"updated" timestamp with time zone,
	"slug" varchar(255) CONSTRAINT "products_slug_key" UNIQUE,
	"short_description" varchar(255),
	"care_instructions" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users"."users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"username" text,
	"password_hash" varchar(255)
);
--> statement-breakpoint
DO $$ BEGIN
	ALTER TABLE "products"."product_variants" ADD CONSTRAINT "fk_product_variants__products" FOREIGN KEY ("product_id") REFERENCES "products"."products"("id");
EXCEPTION
	WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint
DO $$ BEGIN
	ALTER TABLE "products"."product_variants_images" ADD CONSTRAINT "fk_product_variants_images__product_variants" FOREIGN KEY ("variant_id") REFERENCES "products"."product_variants"("id");
EXCEPTION
	WHEN duplicate_object THEN NULL;
END $$;