import {modalEls} from './elements.js';
import {renderProductModal} from './render.js';
import {addToCart} from '../../cart/cart.js';
import {PRODUCTS} from '../products.js'; // путь под себя

let currentQty = 1;

export function openModal(productId) {
    const product = PRODUCTS.find((p) => String(p.id) === String(productId));

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

        for (let i = 0; i < currentQty; i++) {
            addToCart(productId);
        }

        modalEls.addToCartBtn.textContent = 'Добавлено!';
        modalEls.addToCartBtn.disabled = true;

        setTimeout(() => {
            modalEls.addToCartBtn.textContent = 'В корзину';
            modalEls.addToCartBtn.disabled = false;
        }, 1500);
    });

    // ✅ Правильный селектор
    document.addEventListener('click', (event) => {
        const detailBtn = event.target.closest('.button__about');
        if (!detailBtn) return;

        const productId = detailBtn.dataset.productId;
        if (!productId) return;

        openModal(productId);
    });
}