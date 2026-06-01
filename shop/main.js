import {initProductCards} from './shared/product-card/index.js';
import {initProductModal} from './shared/product-modal/index.js';
import {renderCards, renderSkeletons} from './shared/product-card/render.js';
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
            container: popularContainer,
            products: filtered,
            sort: 'popular',
            limit: 5,
        });

        renderCards({
            container: newContainer,
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
    const popularContainer = document.querySelector('.section--popular .section__cards');
    const newContainer = document.querySelector('.section--new .section__cards');
    renderSkeletons(popularContainer, 5);
    renderSkeletons(newContainer, 5);
    renderHomePageCards();
});