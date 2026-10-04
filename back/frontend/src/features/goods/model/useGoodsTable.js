/* ============================================================================
   useGoodsTable — состояние таблицы товаров: страница, выделение строк,
   сколько строк влезает по ширине экрана.

   Таблица остаётся «глупой»: GoodsTable renders то, что вернул хук.
   ============================================================================ */

import {useEffect, useState} from 'react';
import {filterGoods, paginate} from './goodsTable.js';

/* Сколько строк показывать в зависимости от ширины окна */
function resolveItemsPerPage(width) {
    if (width < 640) return 4;
    if (width < 1600) return 5;
    return 8;
}

export function useGoodsTable(goods, {status = 'all', query = ''} = {}) {
    const [selectedIds, setSelectedIds] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    /* Сразу считаем по текущей ширине — без «мигания» и без setState в эффекте */
    const [itemsPerPage, setItemsPerPage] = useState(() =>
        typeof window === 'undefined' ? 4 : resolveItemsPerPage(window.innerWidth),
    );

    useEffect(() => {
        const handleResize = () => setItemsPerPage(resolveItemsPerPage(window.innerWidth));

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const filtered = filterGoods(goods, status, query);
    const {page, totalPages, indexOfLastItem, items} = paginate(filtered, currentPage, itemsPerPage);

    const isAllSelected = items.length > 0 && items.every(item => selectedIds.includes(item.id));
    const statuses = [...new Set(filtered.map(item => item.status))];

    /* Выбрать/снять одну строку */
    const toggleOne = id => setSelectedIds(prev =>
        prev.includes(id) ? prev.filter(itemId => itemId !== id) : [...prev, id],
    );

    /* Чекбокс в шапке: выбрали всё на странице или сняли весь выбор */
    const toggleAll = shouldSelect => setSelectedIds(prev => {
        if (!shouldSelect) return [];

        const pageIds = items.map(item => item.id);
        return [...new Set([...prev, ...pageIds])];
    });

    const clearSelection = () => setSelectedIds([]);

    return {
        items,
        page,
        totalPages,
        indexOfLastItem,
        totalCount: filtered.length,
        statuses,
        isAllSelected,
        selectedIds,
        toggleOne,
        toggleAll,
        clearSelection,
        goToPrevPage: () => setCurrentPage(page - 1),
        goToNextPage: () => setCurrentPage(page + 1),
    };
}
