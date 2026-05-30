-- Таблица товаров
CREATE TABLE IF NOT EXISTS products (
                                        id TEXT PRIMARY KEY,
                                        name TEXT NOT NULL,
                                        description TEXT,
                                        full_description TEXT,
                                        price INTEGER NOT NULL,
                                        old_price INTEGER,
                                        image TEXT,
                                        group_name TEXT NOT NULL,
                                        type TEXT NOT NULL,
                                        subtype TEXT,
                                        variety TEXT,
                                        volume TEXT,
                                        stock INTEGER DEFAULT 0,
                                        tags TEXT[] DEFAULT '{}',
                                        created_at TIMESTAMPTZ DEFAULT now(),
                                        images TEXT[] DEFAULT '{}'
    );

-- Таблица заказов
CREATE TABLE IF NOT EXISTS orders (
                                      id SERIAL PRIMARY KEY,
                                      customer_name TEXT NOT NULL,
                                      email TEXT NOT NULL,
                                      phone TEXT NOT NULL,
                                      delivery_method TEXT NOT NULL,   -- pickup / delivery
                                      delivery_company TEXT,           -- pochta / cdek
                                      delivery_type TEXT,              -- office / courier / pvz
                                      delivery_price INTEGER DEFAULT 0,
                                      address TEXT,
                                      pochta_tariff_id TEXT,           -- идентификатор тарифа Почты
                                      pochta_tariff_name TEXT,         -- название тарифа Почты
                                      cdek_tariff_id TEXT,             -- идентификатор тарифа СДЭК
                                      cdek_tariff_name TEXT,           -- название тарифа СДЭК
                                      total_price INTEGER NOT NULL,
                                      status TEXT DEFAULT 'new',
                                      created_at TIMESTAMPTZ DEFAULT now(),
                                      comment TEXT
    );

-- Позиции заказа
CREATE TABLE IF NOT EXISTS order_items (
                                           id SERIAL PRIMARY KEY,
                                           order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
    product_id TEXT REFERENCES products(id),
    name TEXT NOT NULL,
    price INTEGER NOT NULL,
    quantity INTEGER NOT NULL
    );

-- Контакты
CREATE TABLE IF NOT EXISTS contacts (
                                        id SERIAL PRIMARY KEY,
                                        name TEXT,
                                        email TEXT,
                                        phone TEXT,
                                        message TEXT NOT NULL,
                                        created_at TIMESTAMPTZ DEFAULT now()
    );
-- Варианты товара
CREATE TABLE IF NOT EXISTS product_variants (
                                                id          SERIAL PRIMARY KEY,
                                                product_id  TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    volume      TEXT NOT NULL,
    price       INTEGER NOT NULL,
    old_price   INTEGER,
    stock       INTEGER NOT NULL DEFAULT 0,
    created_at  TIMESTAMPTZ DEFAULT now()
    );

CREATE INDEX IF NOT EXISTS product_variants_product_id_idx ON product_variants(product_id);

-- Триггер: возврат stock при удалении заказа (с поддержкой вариантов)
CREATE OR REPLACE FUNCTION restore_stock_on_order_delete()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.variant_id IS NOT NULL THEN
UPDATE product_variants
SET stock = stock + OLD.quantity
WHERE id = OLD.variant_id;

UPDATE products
SET stock = (
    SELECT COALESCE(SUM(stock), 0)
    FROM product_variants
    WHERE product_id = OLD.product_id
)
WHERE id = OLD.product_id;
ELSE
UPDATE products
SET stock = stock + OLD.quantity
WHERE id = OLD.product_id;
END IF;
RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER restore_stock_after_delete
    AFTER DELETE ON order_items
    FOR EACH ROW
    EXECUTE FUNCTION restore_stock_on_order_delete();