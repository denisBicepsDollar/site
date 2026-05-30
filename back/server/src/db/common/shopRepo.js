import pool from './defaultClient.js';

// ── helpers ────────────────────────────────────────────────────────────────
// экранируем имя таблицы/колонки "products" → "products"
function quoteIdent(name) {
    return `"${String(name).replace(/"/g, '""')}"`;
}
// экранируем значение 'O''Brien' → 'O''Brien'
function quoteValue(val) {
    return `'${String(val).replace(/'/g, "''")}'`;
}

function parsePostgresArray(val) {
    if (!val) return [];
    if (Array.isArray(val)) return val;
    // PostgreSQL возвращает {item1,item2}
    return String(val)
        .replace(/^\{|\}$/g, '')  // убираем { и }
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);
}

// ── helpers ────────────────────────────────────────────────────────────────
function mapProduct(row, variants = []) {
    const images = parsePostgresArray(row.images);
    const mainImage = row.image || null;
    const allImages = [mainImage, ...images].filter(Boolean).filter((v, i, a) => a.indexOf(v) === i);

    // Если варианты переданы — считаем из них, иначе берём из SQL подзапроса
    let price;
    if (variants.length > 0) {
        const availableVariants = variants.filter(v => v.stock > 0);
        price = availableVariants.length > 0
            ? Math.min(...availableVariants.map(v => v.price))
            : (variants[0]?.price ?? 0);
    } else {
        price = row.min_price ?? 0;  // ← из SQL подзапроса
    }

    return {
        id:              row.id,
        name:            row.name,
        description:     row.description,
        fullDescription: row.full_description,
        price,
        oldPrice:        null,
        image:           mainImage,
        images:          allImages,
        group:           row.group_name,
        type:            row.type,
        subtype:         row.subtype,
        variety:         row.variety,
        stock:           row.stock,
        tags:            row.tags || [],
        variants:        variants,
    };
}

// ── 1. СПИСОК ТОВАРОВ ДЛЯ КАТАЛОГА ─────────────────────────────────────────
export async function getProducts({ group, type, subtype, variety, search, sort='popular', limit=1000, offset=0 } = {}) {
    console.log('[shopRepo] getProducts', {group,type,search});

    // собираем WHERE по частям
    const where = [];
    if (group)   where.push(`${quoteIdent('group_name')} = ${quoteValue(group)}`);
    if (type)    where.push(`${quoteIdent('type')} = ${quoteValue(type)}`);
    if (subtype) where.push(`${quoteIdent('subtype')} = ${quoteValue(subtype)}`);
    if (variety) where.push(`${quoteIdent('variety')} = ${quoteValue(variety)}`);
    if (search) {
        const p = `%${search}%`; // LIKE '%роза%'
        where.push(`(${quoteIdent('name')} ILIKE ${quoteValue(p)} OR ${quoteIdent('description')} ILIKE ${quoteValue(p)})`);
    }

    // сортировка
    let order = `${quoteIdent('created_at')} DESC`; // по умолчанию новые
    if (sort === 'price_asc')  order = `(SELECT MIN(v.price) FROM product_variants v WHERE v.product_id = p.id AND v.stock > 0) ASC NULLS LAST`;
    if (sort === 'price_desc') order = `(SELECT MIN(v.price) FROM product_variants v WHERE v.product_id = p.id AND v.stock > 0) DESC NULLS LAST`;
    if (sort === 'popular')    order = `CASE WHEN 'popular' = ANY(tags) THEN 0 ELSE 1 END, created_at DESC`;

    // финальный SQL
    const sql = `
        SELECT p.*,
               (SELECT MIN(v.price) FROM product_variants v
                WHERE v.product_id = p.id AND v.stock > 0) AS min_price
        FROM "products" p
            ${where.length ? 'WHERE ' + where.join(' AND ') : ''}
        ORDER BY ${order}
            LIMIT ${parseInt(limit)} OFFSET ${parseInt(offset)}
    `;

    const { rows } = await pool.query(sql);
    console.log('first row min_price:', rows[0]?.min_price);
    return rows.map(r => mapProduct(r, []));
}

// ── 2. ОДИН ТОВАР ПО ID ────────────────────────────────────────────────────
export async function getProductById(id) {
    console.log('[shopRepo] getProductById', id);
    const { rows } = await pool.query(
        `SELECT * FROM products WHERE id = $1 LIMIT 1`, [id]
    );
    if (!rows[0]) return null;

    const { rows: variants } = await pool.query(
        `SELECT id, volume, price, old_price, stock
         FROM product_variants
         WHERE product_id = $1
         ORDER BY price ASC`, [id]
    );

    console.log('[shopRepo] variants:', variants); // ← добавь
    return mapProduct(rows[0], variants);
}

// ── 3. СОЗДАНИЕ ЗАКАЗА (самое важное) ──────────────────────────────────────
export async function createOrder(order, items) {
    console.log('[shopRepo] createOrder START', order);
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        // ШАГ 1: достаём товары из БД
        const ids = items.map(i => quoteValue(i.productId)).join(',');
        const { rows: dbProducts } = await client.query(
            `SELECT id, name, price, stock FROM products WHERE id IN (${ids})`
        );
        const map = Object.fromEntries(dbProducts.map(p => [p.id, p]));

        // ШАГ 2: считаем сумму и проверяем остатки
        let total = Number(order.deliveryPrice || 0);

        for (const it of items) {
            const p = map[it.productId];
            if (!p) throw new Error('Товар не найден: ' + it.productId);

            if (it.variantId) {
                // Берём цену и stock из варианта
                const { rows: [variant] } = await client.query(
                    `SELECT price, stock FROM product_variants WHERE id = $1 AND product_id = $2`,
                    [it.variantId, it.productId]
                );
                if (!variant) throw new Error('Вариант не найден: ' + it.variantId);
                if (variant.stock < it.quantity) throw new Error('Нет в наличии: ' + p.name);
                it._price = variant.price; // сохраняем для шага 4
                it._stock = 'variant';
                total += variant.price * it.quantity;
            } else {
                if (p.stock < it.quantity) throw new Error('Нет в наличии: ' + p.name);
                it._price = p.price;
                it._stock = 'product';
                total += p.price * it.quantity;
            }
        }

        // ШАГ 3: пишем заказ
        const orderSql = `
            INSERT INTO orders (customer_name,email,phone,delivery_method,delivery_company,delivery_type,delivery_price,address,pochta_tariff_id,pochta_tariff_name,cdek_tariff_id,cdek_tariff_name,total_price,comment)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14) RETURNING id
        `;
        const orderVals = [
            order.customerName, order.email, order.phone,
            order.deliveryMethod, order.deliveryCompany, order.deliveryType,
            order.deliveryPrice, order.address,
            order.pochtaTariffId, order.pochtaTariffName,
            order.cdekTariffId, order.cdekTariffName,
            total, order.comment || null
        ];
        const { rows: [newOrder] } = await client.query(orderSql, orderVals);

        // ШАГ 4: пишем позиции + списываем stock
        for (const it of items) {
            const p = map[it.productId];

            await client.query(
                `INSERT INTO order_items (order_id, product_id, name, price, quantity, variant_id, volume)
                 VALUES ($1,$2,$3,$4,$5,$6,$7)`,
                [newOrder.id, p.id, p.name, it._price, it.quantity, it.variantId || null, it.volume || p.volume || null]
            );

            if (it.variantId) {
                // Списываем из варианта
                await client.query(
                    `UPDATE product_variants SET stock = stock - $1 WHERE id = $2`,
                    [it.quantity, it.variantId]
                );
            } else {
                // Списываем из products
                await client.query(
                    `UPDATE products SET stock = stock - $1 WHERE id = $2`,
                    [it.quantity, p.id]
                );
            }
        }

        await client.query('COMMIT');
        console.log('[shopRepo] createOrder OK id=', newOrder.id);
        return { orderId: newOrder.id, total };

    } catch (e) {
        await client.query('ROLLBACK');
        console.log('[shopRepo] createOrder FAIL', e.message);
        throw e;
    } finally {
        client.release();
    }
}
export async function createContact({ name, email, phone, message }) {
    console.log('[shopRepo] createContact', {name,email});
    // тут всё просто — один INSERT, без транзакции
    const sql = `
        INSERT INTO ${quoteIdent('contacts')} (name,email,phone,message)
        VALUES ($1,$2,$3,$4) RETURNING id
    `;
    const vals = [name||null, email||null, phone||null, message];
    const { rows: [row] } = await pool.query(sql, vals);
    console.log('[shopRepo] contact saved id=', row.id);
    return row.id;
}
