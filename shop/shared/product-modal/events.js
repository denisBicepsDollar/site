import {modalEls} from './elements.js';
import {renderProductModal} from './render.js';
import {addToCart} from '../../cart/cart.js';
import {getProductById, loadProductsData} from "../product-store.js";


let currentQty = 1;

export async function openModal(productId) {
    let product;

    try {
        // Запрашиваем полный товар с вариантами
        const res = await fetch(`/api/products/${productId}`);
        if (res.ok) {
            product = await res.json();
        }
    } catch (err) {
        console.error('Ошибка загрузки товара:', err);
    }

    // Фолбэк — берём из кэша если API недоступен
    if (!product) {
        product = getProductById(productId);
        if (!product) {
            const products = await loadProductsData();
            product = products.find(p => String(p.id) === String(productId));
        }
    }

    if (!product) {
        try {
            const products = await loadProductsData();
            product = products.find(p => String(p.id) === String(productId));
        } catch (err) {
            console.error('Не удалось загрузить товар:', err);
            return;
        }
    }

    if (!product) {
        console.warn('Товар не найден:', productId);
        return;
    }

    currentQty = 1;
    renderProductModal(product);

    modalEls.modal?.classList.remove('hidden');
    modalEls.modal?.classList.add('active');

    document.body.style.overflow = 'hidden';
}

export function closeModal() {
    modalEls.modal?.classList.remove('active');
    modalEls.modal?.classList.add('hidden');
    document.body.style.overflow = '';
}

function updateQty(delta) {
    const maxStock = Number(modalEls.addToCartBtn?.dataset.maxStock || 99);
    currentQty = Math.max(1, Math.min(currentQty + delta, maxStock));

    if (modalEls.qtyValue) {
        modalEls.qtyValue.textContent = currentQty;
    }
}

export function bindModalEvents() {
    modalEls.closeBtn?.addEventListener('click', closeModal);
    modalEls.overlay?.addEventListener('click', closeModal);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });

    modalEls.qtyMinus?.addEventListener('click', () => updateQty(-1));
    modalEls.qtyPlus?.addEventListener('click', () => updateQty(1));

    modalEls.addToCartBtn?.addEventListener('click', () => {
        const productId = modalEls.addToCartBtn.dataset.productId;
        if (!productId) return;

        const variantId = modalEls.addToCartBtn.dataset.variantId || null;
        const price = modalEls.addToCartBtn.dataset.price ? +modalEls.addToCartBtn.dataset.price : null;
        const volume = modalEls.addToCartBtn.dataset.volume || null;
        const maxStock = +modalEls.addToCartBtn.dataset.maxStock || 0;

        for (let i = 0; i < currentQty; i++) {
            addToCart(productId, variantId, price, volume, maxStock);
        }

        modalEls.addToCartBtn.textContent = 'Добавлено!';
        modalEls.addToCartBtn.disabled = true;

        setTimeout(() => {
            modalEls.addToCartBtn.textContent = 'В корзину';
            modalEls.addToCartBtn.disabled = false;
        }, 1500);
    });
}