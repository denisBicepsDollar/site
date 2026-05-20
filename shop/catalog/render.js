import {els} from './elements.js';
import {state} from './state.js';
import {PRODUCTS} from '../shared/products.js';
import {renderCards} from '../shared/product-card/render.js';

export function updateCatalog() {
    if (!els.catalogGrid) return;

    // Фильтруем по всем уровням
    let filtered = [...PRODUCTS];

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