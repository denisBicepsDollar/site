ALTER TABLE "orders"."order_items"
ALTER COLUMN "variant_id" TYPE text USING "variant_id"::text;
