import {initProductCards} from './shared/product-card/index.js';
import {initProductModal} from './shared/product-modal/index.js';
import {renderCards} from './shared/product-card/render.js';

document.addEventListener('DOMContentLoaded', () => {
    initProductCards();
    initProductModal();

    renderHomePageCards();
});

function renderHomePageCards() {
    renderCards({
        container: '.section--popular .section__cards',
        sort: 'popular',
        limit: 4,
    });

    renderCards({
        container: '.section--new .section__cards',
        sort: 'new',
        limit: 4,
    });
}