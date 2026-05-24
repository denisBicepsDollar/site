import {getProducts} from './api.js';

let cache = null;
let loadingPromise = null;

function buildSearchIndex(product) {
    return normalizeText([
        product.name,
        product.description,
        product.category,
        product.group,
        product.type,
        product.subtype,
        product.variety,
        ...(product.tags || [])
    ].join(' '));
}

export async function normalizeText(text = '') {
    return text
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
            data.forEach(product => {
                const index = buildSearchIndex(product);
                product._searchIndex = index;
                product._searchWords = index.split(' ');
            });

            cache = data;
            loadingPromise = null;
            return data;
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

export function clearProductsCache() {
    cache = null;
    loadingPromise = null;
}