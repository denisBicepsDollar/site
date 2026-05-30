import {els} from './elements.js';
import {
    addToCart,
    decreaseItem,
    removeFromCart,
    clearCart,
    getCartTotal,
    getTotalItems
} from '../cart.js';
import {renderCartPage} from './render.js';
import {MIN_ORDER_PRICE} from './constants.js';
import {showStep} from '../navigation.js';

function goToStep(step) {
    if (typeof showStep === 'function') {
        showStep(step);
    }
}

export function updateNextStep1Button() {
    if (!els.nextToStep2) return;

    const total = getCartTotal();
    const itemsCount = getTotalItems();

    els.nextToStep2.disabled = !(itemsCount > 0 && total >= MIN_ORDER_PRICE);
}

export function bindCartStep1Events() {
    els.cartItemsContainer?.addEventListener('click', function (event) {
        const cartItem = event.target.closest('.cart-item');
        if (!cartItem) return;

        const productId = cartItem.dataset.productId;
        if (!productId) return;

        if (event.target.closest('.cart-item__btn--plus')) {
            const variantId = cartItem.dataset.variantId || null;
            const price = +cartItem.dataset.price || null;
            const volume = cartItem.dataset.volume || null;
            const maxStock = +cartItem.dataset.maxStock || null;
            addToCart(productId, variantId, price, volume, maxStock);
            renderCartPage();
            return;
        }

        if (event.target.closest('.cart-item__btn--minus')) {
            const cartKey = cartItem.dataset.cartKey || productId;
            decreaseItem(cartKey);
            renderCartPage();
            return;
        }

        if (event.target.closest('.cart-item__remove')) {
            const cartKey = cartItem.dataset.cartKey || productId;
            removeFromCart(cartKey);
            renderCartPage();
        }
    });

    els.nextToStep2?.addEventListener('click', () => goToStep(2));

    els.clearCartButton?.addEventListener('click', function () {
        if (confirm('Очистить корзину?')) {
            clearCart();
            renderCartPage();
        }
    });
}