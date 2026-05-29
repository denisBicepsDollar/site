import {els} from './elements.js';
import {state} from './state.js';
import {getProducts} from '../shared/api.js';
import {
    GROUP_LABELS,
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
    if (Array.isArray(field)) {
        const values = products.map(p => {
            let current = [];
            for (const key of field) {
                if (p[key] !== undefined) {
                    current.push(p[key]);
                }
            }
            return current;
        })
        return (values.filter(Boolean));
    }
    const values = products.map(p => p[field])
    let result = [...new Set(values)]
    return result;
}


// =============================================
// 1. ГРУППЫ (Садовые, Комнатные)
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
// 2. ВИДЫ
// =============================================
export async function renderTypeFilters() {
    if (!els.typeFilters || !els.typeBlock) return;

    if (state.currentGroup === 'all') {
        els.typeBlock.classList.add('hidden');
        return;
    }
    const PRODUCTS = await loadProductsData();

    let filteredProducts = PRODUCTS.filter(p => p.group === state.currentGroup);
    const names = [['all'], ...getUniqueValues(filteredProducts, ['name','type'])];

    const uniqueTypes = new Set(
        names
            .map(row => {
                const token = row[0].split(/\s+/)[0] ?? '';
                // убрать обрамляющие кавычки и нежелательные символы с концов
                const cleaned = token.replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, '');
                return cleaned;
            })
    )

    const rawTypes = new Set(names.map(nameArray =>
        nameArray.at(-1)
    ))

    if (names.length <= 2) {
        els.typeBlock.classList.add('hidden');
        return;
    }

    els.typeBlock.classList.remove('hidden');
    const uniqueArr = Array.from(uniqueTypes);
    const rawArr = Array.from(rawTypes);
    const len = Math.min(uniqueArr.length, rawArr.length);

    els.typeFilters.innerHTML = Array.from({ length: len }, (_, i) => {
        const label = String(uniqueArr[i] === 'all' ? 'Все виды' : uniqueArr[i]);               // метка из uniqueTypes
        const rawValue = rawArr[i];                       // значение из rawTypes
        return createFilterButtonHTML(rawValue, state.currentType, label, 'type');
    }).join('');
}

// =============================================
// 3. ПОДВИДЫ
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
    if (state.currentGroup === 'indoor') {
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
