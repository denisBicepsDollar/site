import {initCatalogElements} from './elements.js';
import {bindCatalogEvents} from './ui.js';
import {renderAllFilters} from './filters.js';
import {updateCatalog} from './render.js';
import {initProductCards} from '../shared/product-card/index.js';
import {initProductModal} from '../shared/product-modal/index.js';

export function initCatalog() {
    initProductCards();
    initProductModal();

    initCatalogElements();
    bindCatalogEvents();
    renderAllFilters();
    updateCatalog();
}

document.addEventListener('DOMContentLoaded', () => {
    initCatalog();
});