import {initProductCards} from './shared/product-card/index.js';
import {initProductModal} from './shared/product-modal/index.js';
import {renderCards} from './shared/product-card/render.js';
import {loadProductsData} from "./shared/product-store.js";

async function renderHomePageCards() {
    try {
        const products = await loadProductsData();

        const filtered = products.sort((a, b) => {
            const aIn = a.stock > 0 ? 0 : 1;
            const bIn = b.stock > 0 ? 0 : 1;
            return aIn - bIn;
        });

        renderCards({
            container: '.section--popular .section__cards',
            products: filtered,
            sort: 'popular',
            limit: 5,
        });

        renderCards({
            container: '.section--new .section__cards',
            products: filtered,
            sort: 'new',
            limit: 5,
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