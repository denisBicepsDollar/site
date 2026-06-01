-- Таблица товаров
CREATE TABLE IF NOT EXISTS products (
                                        id            TEXT PRIMARY KEY,
                                        name          TEXT NOT NULL,
                                        description   TEXT,
                                        full_description TEXT,
                                        group_name    TEXT NOT NULL,
                                        type          TEXT NOT NULL,
                                        subtype       TEXT,
                                        variety       TEXT,
                                        stock         INTEGER DEFAULT 0,
                                        tags          TEXT[] DEFAULT '{}',
                                        created_at    TIMESTAMPTZ DEFAULT now()
    );

-- Таблица заказов
CREATE TABLE IF NOT EXISTS orders (
                                      id                  SERIAL PRIMARY KEY,
                                      customer_name       TEXT NOT NULL,
                                      email               TEXT NOT NULL,
                                      phone               TEXT NOT NULL,
                                      delivery_method     TEXT NOT NULL,
                                      delivery_company    TEXT,
                                      delivery_type       TEXT,
                                      delivery_price      INTEGER DEFAULT 0,
                                      address             TEXT,
                                      pochta_tariff_id    TEXT,
                                      pochta_tariff_name  TEXT,
                                      cdek_tariff_id      TEXT,
                                      cdek_tariff_name    TEXT,
                                      total_price         INTEGER NOT NULL,
                                      status              TEXT DEFAULT 'new',
                                      created_at          TIMESTAMPTZ DEFAULT now(),
    comment             TEXT
    );

-- Варианты товара
CREATE TABLE IF NOT EXISTS product_variants (
                                                id          SERIAL PRIMARY KEY,
                                                product_id  TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    volume      TEXT NOT NULL,
    price       INTEGER NOT NULL DEFAULT 0,
    old_price   INTEGER,
    stock       INTEGER NOT NULL DEFAULT 0,
    image TEXT,
    created_at  TIMESTAMPTZ DEFAULT now()
    );

CREATE INDEX IF NOT EXISTS product_variants_product_id_idx ON product_variants(product_id);

-- Позиции заказа
CREATE TABLE IF NOT EXISTS order_items (
                                           id          SERIAL PRIMARY KEY,
                                           order_id    INTEGER REFERENCES orders(id) ON DELETE CASCADE,
    product_id  TEXT REFERENCES products(id),
    variant_id  INTEGER REFERENCES product_variants(id) ON DELETE SET NULL,
    name        TEXT NOT NULL,
    price       INTEGER NOT NULL,
    quantity    INTEGER NOT NULL,
    volume      TEXT
    );

-- Контакты
CREATE TABLE IF NOT EXISTS contacts (
                                        id          SERIAL PRIMARY KEY,
                                        name        TEXT,
                                        email       TEXT,
                                        phone       TEXT,
                                        message     TEXT NOT NULL,
                                        created_at  TIMESTAMPTZ DEFAULT now()
    );

-- ── ТРИГГЕР 1: синхронизация stock в products при изменении вариантов ──────
CREATE OR REPLACE FUNCTION sync_product_stock()
RETURNS TRIGGER AS $$
BEGIN
UPDATE products
SET stock = (
    SELECT COALESCE(SUM(stock), 0)
    FROM product_variants
    WHERE product_id = COALESCE(NEW.product_id, OLD.product_id)
)
WHERE id = COALESCE(NEW.product_id, OLD.product_id);
RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER sync_stock_after_variant_change
    AFTER INSERT OR UPDATE OR DELETE ON product_variants
    FOR EACH ROW
    EXECUTE FUNCTION sync_product_stock();

-- ── ТРИГГЕР 2: возврат stock при удалении заказа ────────────────────────────
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

-- ── ТРИГГЕР 3: автосоздание вариантов при добавлении товара ─────────────────
CREATE OR REPLACE FUNCTION create_default_variants()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.group_name = 'garden' THEN
        INSERT INTO product_variants (product_id, volume, price, stock)
        VALUES
            (NEW.id, 'Контейнер P9', 0, 0),
            (NEW.id, 'Контейнер C1', 0, 0),
            (NEW.id, 'Контейнер C2', 0, 0);
    ELSIF NEW.group_name = 'indoor' THEN
        INSERT INTO product_variants (product_id, volume, price, stock)
        VALUES
            (NEW.id, 'Горшок D5', 0, 0),
            (NEW.id, 'Горшок P7', 0, 0),
            (NEW.id, 'Горшок D10', 0, 0);
END IF;
RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER create_variants_after_insert
    AFTER INSERT ON products
    FOR EACH ROW
    EXECUTE FUNCTION create_default_variants();
