import {initProductCards} from './shared/product-card/index.js';
import {initProductModal} from './shared/product-modal/index.js';
import {renderCards} from './shared/product-card/render.js';
import {loadProductsData} from "./shared/product-store.js";

async function renderHomePageCards() {
    try {
        const products = await loadProductsData();

        renderCards({
            container: '.section--popular .section__cards',
            products: products,
            sort: 'popular',
            limit: 4,
        });

        renderCards({
            container: '.section--new .section__cards',
            products: products,
            sort: 'new',
            limit: 4,
        });
    } catch (err) {
        console.error('Не удалось загрузить товары:', err);
    }
}

document.addEventListener('DOMContentLoaded',() => {
    initProductCards();
    initProductModal();
    renderHomePageCards();
});