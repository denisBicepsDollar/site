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
// ── helpers ────────────────────────────────────────────────────────────────
function mapProduct(row) {
    return {
        id:              row.id,
        name:            row.name,
        description:     row.description,
        fullDescription: row.full_description,   // ← snake → camel
        price:           row.price,
        oldPrice:        row.old_price,           // ← snake → camel
        image:           row.image,
        group:           row.group_name,
        type:            row.type,
        subtype:         row.subtype,
        variety:         row.variety,
        volume:          row.volume,
        stock:           row.stock,
        tags:            row.tags || [],
    };
}

// ── 1. СПИСОК ТОВАРОВ ДЛЯ КАТАЛОГА ─────────────────────────────────────────
export async function getProducts({ group, type, subtype, variety, search, sort='popular', limit=50, offset=0 } = {}) {
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
    if (sort === 'price_asc')  order = `${quoteIdent('price')} ASC`;
    if (sort === 'price_desc') order = `${quoteIdent('price')} DESC`;
    if (sort === 'popular')    order = `CASE WHEN 'popular' = ANY(tags) THEN 0 ELSE 1 END, created_at DESC`;

    // финальный SQL
    const sql = `
        SELECT * FROM ${quoteIdent('products')}
        ${where.length ? 'WHERE ' + where.join(' AND ') : ''}
        ORDER BY ${order}
        LIMIT ${parseInt(limit)} OFFSET ${parseInt(offset)}
    `;
    console.log('[shopRepo] SQL:\n' + sql);

    const { rows } = await pool.query(sql); // выполняем
    console.log('[shopRepo] вернулось', rows.length, 'товаров');
    return rows.map(mapProduct);
}

// ── 2. ОДИН ТОВАР ПО ID ────────────────────────────────────────────────────
export async function getProductById(id) {
    console.log('[shopRepo] getProductById', id);
    const sql = `SELECT * FROM ${quoteIdent('products')} WHERE id = ${quoteValue(id)} LIMIT 1`;
    const { rows } = await pool.query(sql);
    return rows[0] ? mapProduct(rows[0]) : null; // null если не нашли
}

// ── 3. СОЗДАНИЕ ЗАКАЗА (самое важное) ──────────────────────────────────────
export async function createOrder(order, items) {
    console.log('[shopRepo] createOrder START', order);
    const client = await pool.connect(); // берём отдельное соединение для транзакции

    try {
        await client.query('BEGIN'); // ── начинаем транзакцию

        // ШАГ 1: достаём актуальные цены из БД (не верим фронту!)
        const ids = items.map(i => quoteValue(i.productId)).join(',');
        const { rows: dbProducts } = await client.query(
            `SELECT id, name, price, stock FROM products WHERE id IN (${ids})`
        );
        // делаем быстрый поиск по id: { 'gortenziya-candybelle': {...} }
        const map = Object.fromEntries(dbProducts.map(p => [p.id, p]));

        // ШАГ 2: считаем сумму и проверяем остатки
        let total = Number(order.deliveryPrice || 0); // доставка
        for (const it of items) {
            const p = map[it.productId];
            if (!p) throw new Error('Товар не найден: ' + it.productId);
            if (p.stock < it.quantity) throw new Error('Нет в наличии: ' + p.name);
            total += p.price * it.quantity; // цена БЕРЁМ ИЗ БД!
        }

        // ШАГ 3: пишем заказ в таблицу orders
        const orderSql = `
            INSERT INTO orders (customer_name, email, phone, delivery_method, delivery_company, delivery_type, delivery_price, address, pochta_tariff, cdek_tariff, total_price)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9::jsonb,$10::jsonb,$11) RETURNING id
        `;
        const orderVals = [
            order.customerName, order.email, order.phone,
            order.deliveryMethod, order.deliveryCompany, order.deliveryType,
            order.deliveryPrice, order.address,
            order.pochtaTariff, order.cdekTariff,
            total
        ];
        const { rows: [newOrder] } = await client.query(orderSql, orderVals);

        // ШАГ 4: пишем каждую позицию в order_items + списываем склад
        for (const it of items) {
            const p = map[it.productId];
            // 4а. позиция заказа
            await client.query(
                `INSERT INTO order_items (order_id,product_id,name,price,quantity) VALUES ($1,$2,$3,$4,$5)`,
                [newOrder.id, p.id, p.name, p.price, it.quantity]
            );
            // 4б. уменьшаем stock
            await client.query(
                `UPDATE products SET stock = stock - $1 WHERE id = $2`,
                [it.quantity, p.id]
            );
        }

        await client.query('COMMIT'); // ── всё ок, сохраняем
        console.log('[shopRepo] createOrder OK id=', newOrder.id);
        return { orderId: newOrder.id, total };

    } catch (e) {
        await client.query('ROLLBACK'); // ── ошибка, откатываем всё
        console.log('[shopRepo] createOrder FAIL', e.message);
        throw e;
    } finally {
        client.release(); // отдаём соединение обратно в пул
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