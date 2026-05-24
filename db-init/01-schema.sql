-- Удаляем старый тест
CREATE TABLE IF NOT EXISTS products (
                                        id TEXT PRIMARY KEY,
                                        name TEXT NOT NULL,
                                        description TEXT,
                                        full_description TEXT,
                                        price INTEGER NOT NULL,
                                        old_price INTEGER,
                                        image TEXT,
                                        group_name TEXT NOT NULL, -- garden/indoor/bulbs/cut
                                        type TEXT NOT NULL,       -- roza, gortenziya...
                                        subtype TEXT,
                                        variety TEXT,
                                        volume TEXT,
                                        stock INTEGER DEFAULT 0,
                                        tags TEXT[] DEFAULT '{}',
                                        created_at TIMESTAMPTZ DEFAULT now()
    );

CREATE TABLE IF NOT EXISTS orders (
                                      id SERIAL PRIMARY KEY,
                                      customer_name TEXT NOT NULL,
                                      email TEXT NOT NULL,
                                      phone TEXT NOT NULL,
                                      delivery_method TEXT NOT NULL, -- pickup / delivery
                                      delivery_company TEXT, -- pochta / cdek
                                      delivery_type TEXT, -- office / courier / pvz
                                      delivery_price INTEGER DEFAULT 0,
                                      address TEXT,
                                      pochta_tariff JSONB,
                                      cdek_tariff JSONB,
                                      total_price INTEGER NOT NULL,
                                      status TEXT DEFAULT 'new',
                                      created_at TIMESTAMPTZ DEFAULT now()
    );

CREATE TABLE IF NOT EXISTS order_items (
                                           id SERIAL PRIMARY KEY,
                                           order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
    product_id TEXT REFERENCES products(id),
    name TEXT NOT NULL,
    price INTEGER NOT NULL,
    quantity INTEGER NOT NULL
    );

CREATE TABLE IF NOT EXISTS contacts (
                                        id SERIAL PRIMARY KEY,
                                        name TEXT,
                                        email TEXT,
                                        phone TEXT,
                                        message TEXT NOT NULL,
                                        created_at TIMESTAMPTZ DEFAULT now()
    );