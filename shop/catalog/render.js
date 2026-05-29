import {els} from './elements.js';
import {state} from './state.js';
import {renderCards} from '../shared/product-card/render.js';
import {loadProductsData} from "../shared/product-store.js";

export async function updateCatalog() {
    if (!els.catalogGrid) return;

    // Фильтруем по всем уровням
    let filtered;
    try {
        const products = await loadProductsData();
        filtered = [...products];
    } catch (err) {
        console.error('Не удалось загрузить товары:', err);
        if (els.emptyEl) {
            els.emptyEl.textContent = 'Ошибка загрузки товаров';
            els.emptyEl.classList.remove('hidden');
        }
        return;
    }

    if (state.currentGroup !== 'all') {
        filtered = filtered.filter(p => p.group === state.currentGroup);
    }
    if (state.currentType !== 'all') {
        filtered = filtered.filter(p => p.type === state.currentType);
    }
    if (state.currentSubtype !== 'all') {
        filtered = filtered.filter(p => p.subtype === state.currentSubtype);
    }
    if (state.currentVariety !== 'all') {
        filtered = filtered.filter(p => p.variety === state.currentVariety);
    }
    filtered = filtered.sort((a, b) => {
        const aIn = a.stock > 0 ? 0 : 1;
        const bIn = b.stock > 0 ? 0 : 1;
        return aIn - bIn;
    });

    const result = renderCards({
        container: els.catalogGrid,
        products: filtered,
        category: 'all', // отключаем встроенный фильтр renderCards
        search: state.currentSearch,
        sort: state.currentSort,
        limit: state.currentLimit,
        emptyEl: els.emptyEl
    });

    if (els.loadMoreWrap && result) {
        const hasMore = result.total > result.shown;
        els.loadMoreWrap.classList.toggle('hidden', !hasMore);
    }
}