import {els} from './elements.js';
import {state} from './state.js';
import {getProducts} from '../shared/api.js';
import {
    GROUP_LABELS,
    TYPE_LABELS,
    SUBTYPE_LABELS,
    VARIETY_LABELS
} from './labels.js';
import {loadProductsData} from "../shared/product-store.js";

// =============================================
// УНИВЕРСАЛЬНЫЕ ПОМОЩНИКИ
// =============================================

function createFilterButtonHTML(value, activeValue, label, filterType) {
    const isActive = value === activeValue ? 'catalog-filter--active' : '';

    return `
        <button 
            type="button"
            class="catalog-filter ${isActive}"
            data-filter-type="${filterType}"
            data-filter-value="${value}"
        >
            ${label}
        </button>
    `;
}

function getUniqueValues(products, field) {
    return [...new Set(products.map(p => p[field]).filter(Boolean))];
}


// =============================================
// 1. ГРУППЫ (Садовые, Комнатные...)
// =============================================
export async function renderGroupFilters() {
    if (!els.groupFilters) return;

    const PRODUCTS = await loadProductsData();

    const groups = ['all', ...getUniqueValues(PRODUCTS, 'group')];

    els.groupFilters.innerHTML = groups
        .map(group => createFilterButtonHTML(
            group,
            state.currentGroup,
            GROUP_LABELS[group] || group,
            'group'
        ))
        .join('');
}


// =============================================
// 2. ВИДЫ (Гортензия, Роза, ...)
// =============================================
export async function renderTypeFilters() {
    if (!els.typeFilters || !els.typeBlock) return;

    if (state.currentGroup === 'all') {
        els.typeBlock.classList.add('hidden');
        return;
    }
    const PRODUCTS = await loadProductsData();

    let filteredProducts = PRODUCTS.filter(p => p.group === state.currentGroup);
    const types = ['all', ...getUniqueValues(filteredProducts, 'type')];

    if (types.length <= 2) {
        els.typeBlock.classList.add('hidden');
        return;
    }

    els.typeBlock.classList.remove('hidden');
    els.typeFilters.innerHTML = types
        .map(type => createFilterButtonHTML(
            type,
            state.currentType,
            TYPE_LABELS[type] || type,
            'type'
        ))
        .join('');
}

// =============================================
// 3. ПОДВИДЫ (Метельчатая, Древовидная...)
// =============================================
export async function renderSubtypeFilters() {
    if (!els.subtypeFilters || !els.subtypeBlock) return;

    if (state.currentType === 'all') {
        els.subtypeBlock.classList.add('hidden');
        return;
    }
    const PRODUCTS = await loadProductsData();

    let filteredProducts = PRODUCTS
        .filter(p => p.group === state.currentGroup)
        .filter(p => p.type === state.currentType);

    const subtypes = ['all', ...getUniqueValues(filteredProducts, 'subtype')];

    if (subtypes.length <= 2) {
        els.subtypeBlock.classList.add('hidden');
        return;
    }

    els.subtypeBlock.classList.remove('hidden');
    els.subtypeFilters.innerHTML = subtypes
        .map(subtype => createFilterButtonHTML(
            subtype,
            state.currentSubtype,
            SUBTYPE_LABELS[subtype] || subtype,
            'subtype'
        ))
        .join('');
}


// =============================================
// 4. СОРТА (Candybelle, ...)
// =============================================
export async function renderVarietyFilters() {
    if (!els.varietyFilters || !els.varietyBlock) return;

    if (state.currentSubtype === 'all') {
        els.varietyBlock.classList.add('hidden');
        return;
    }
    const PRODUCTS = await loadProductsData();

    let filteredProducts = PRODUCTS
        .filter(p => p.group === state.currentGroup)
        .filter(p => p.type === state.currentType)
        .filter(p => p.subtype === state.currentSubtype);

    const varieties = ['all', ...getUniqueValues(filteredProducts, 'variety')];

    if (varieties.length <= 2) {
        els.varietyBlock.classList.add('hidden');
        return;
    }

    els.varietyBlock.classList.remove('hidden');
    els.varietyFilters.innerHTML = varieties
        .map(variety => createFilterButtonHTML(
            variety,
            state.currentVariety,
            VARIETY_LABELS[variety] || variety,
            'variety'
        ))
        .join('');
}


// =============================================
// РЕНДЕР ВСЕХ УРОВНЕЙ
// =============================================
export async function renderAllFilters() {
    await renderGroupFilters();
    await renderTypeFilters();
    await renderSubtypeFilters();
    await renderVarietyFilters();
}
