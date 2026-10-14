import {initCatalogElements} from './elements.js';
import {bindCatalogEvents} from './ui.js';
import {renderAllFilters} from './filters.js';
import {updateCatalog} from './render.js';
import {initProductCards} from '../shared/product-card/index.js';
import {initProductModal} from '../shared/product-modal/index.js';
import {loadProductsData} from "../shared/product-store.js";

export async function initCatalog() {
    initProductCards();
    initProductModal();

    initCatalogElements();
    bindCatalogEvents();
    try {
        await loadProductsData();
    } catch (err) {
        console.error('Не удалось загрузить товары:', err);
        return;
    }
    await renderAllFilters();
    await updateCatalog();
}

document.addEventListener('DOMContentLoaded', () => {
    initCatalog();
});