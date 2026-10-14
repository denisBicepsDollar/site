import {getProducts} from './api.js';
import {state} from "../catalog/state.js";

let cache = null;
let loadingPromise = null;

function buildSearchIndex(product) {
    const parts = [
        product.name,
        product.description,
        product.category,
        product.group,
        product.type,
        product.subtype,
        product.variety,
        ...(Array.isArray(product.tags) ? product.tags : []),
    ];
    // Преобразуем все части в строки, фильтруем пустые, объединяем
    const text = parts
        .map(p => (p ?? '').toString())
        .filter(s => s.length > 0)
        .join(' ');
    return normalizeText(text);
}

export function normalizeText(text = '') {
    return text
        .toString()
        .toLowerCase()
        .replace(/ё/g, 'е')
        .replace(/й/g, 'и')
        .replace(/[^a-zа-я0-9\s]/gi, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

export async function loadProductsData() {
    if (cache) return cache;
    if (loadingPromise) return loadingPromise;

    loadingPromise = getProducts({})
        .then(data => {

            const products = Array.isArray(data) ? data : (data.data || []);
            products.forEach(product => {
                const index = buildSearchIndex(product);
                if (product.name?.includes(state.currentSearch)) {

                    product._searchIndex = index;
                    product._searchWords = index.split(' ');
                }
            });

            cache = products;
            loadingPromise = null;
            return products;
        })
        .catch(err => {
            loadingPromise = null;
            throw err;
        });

    return loadingPromise;
}

export function getProductById(id) {
    if (!cache) return null;
    return cache.find(p => String(p.id) === String(id));
}