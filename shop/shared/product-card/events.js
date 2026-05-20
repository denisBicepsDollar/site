import {addToCart} from '../../cart/cart.js';
import {openModal} from "../product-modal/events.js";

export function bindProductCardEvents() {
    document.addEventListener('click', function (event) {
        const addToCartButton = event.target.closest('.product-card__btn');
        const aboutButton = event.target.closest('.button__about');

        if (addToCartButton && !addToCartButton.disabled) {
            const productId = addToCartButton.dataset.productId;
            addToCart(productId);

            addToCartButton.classList.remove('button--outline');
            addToCartButton.textContent = 'В корзине';
            addToCartButton.style.pointerEvents = 'none';

            setTimeout(() => {
                addToCartButton.classList.add('button--outline');
                addToCartButton.textContent = 'В корзину';
                addToCartButton.style.pointerEvents = '';
            }, 2000);

            return;
        }

        if (aboutButton) {
            const productId = aboutButton.dataset.productId;
            openModal(productId);
        }
    });
}