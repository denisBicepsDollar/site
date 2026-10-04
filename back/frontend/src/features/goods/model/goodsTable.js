/* ============================================================================
   GOODS TABLE — чистая логика таблицы товаров: фильтр, пагинация, счётчики.

   Без React: «список → список», «список → срез страницы». Хук useGoodsTable
   только хранит состояние и дёргает эти функции.
   ============================================================================ */

/* Фильтр по статусу + поиск по названию и артикулу */
export function filterGoods(goods, status, query) {
    const normalizedQuery = query.toLowerCase().trim();

    return goods
        .filter(item => status === 'all' || item.status === status)
        .filter(item => {
            if (!normalizedQuery) return true;

            return item.name.toLowerCase().trim().includes(normalizedQuery)
                || item.sku.toLowerCase().trim().includes(normalizedQuery);
        });
}

/* Нарезка страницы. Возвращает «безопасный» номер страницы:
   если после фильтрации страниц стало меньше, не показываем пустую таблицу. */
export function paginate(items, page, perPage) {
    const totalPages = Math.max(1, Math.ceil(items.length / perPage));
    const safePage = Math.min(Math.max(1, page), totalPages);
    const indexOfLastItem = safePage * perPage;
    const indexOfFirstItem = indexOfLastItem - perPage;

    return {
        page: safePage,
        totalPages,
        indexOfFirstItem,
        indexOfLastItem,
        items: items.slice(indexOfFirstItem, indexOfLastItem),
    };
}

/* Счётчики для фильтра по статусам: 'all' + каждый статус отдельно */
export function countByStatus(goods) {
    const counts = new Map([['all', goods.length]]);

    for (const item of goods) {
        counts.set(item.status, (counts.get(item.status) ?? 0) + 1);
    }

    return counts;
}
