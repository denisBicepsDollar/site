import {addToCart} from '../../cart/cart.js';
import {openModal} from "../product-modal/events.js";

export function bindProductCardEvents() {
    document.addEventListener('click', function (event) {
        const addToCartButton = event.target.closest('.product-card__btn');
        const aboutButton = event.target.closest('.button__about');
        const cardImage = event.target.closest('.product-card__image-wrapper');
        const productCard = event.target.closest('.product-card');
        const productCardName = event.target.closest('.product-card__name');

        if (addToCartButton && !addToCartButton.disabled) {
            const productId = addToCartButton.dataset.productId;

            // Получаем товар с вариантами
            fetch(`/api/products/${productId}`)
                .then(res => res.json())
                .then(product => {
                    const variant = product.variants
                        ?.filter(v => v.stock > 0)
                        .sort((a, b) => a.price - b.price)[0];

                    if (!variant) {
                        alert('Нет в наличии');
                        return;
                    }

                    addToCart(productId, variant.id, variant.price, variant.volume, variant.stock, variant.image);

                    addToCartButton.classList.remove('button--outline');
                    addToCartButton.textContent = 'В корзине';
                    addToCartButton.style.pointerEvents = 'none';

                    setTimeout(() => {
                        addToCartButton.classList.add('button--outline');
                        addToCartButton.textContent = 'В корзину';
                        addToCartButton.style.pointerEvents = '';
                    }, 2000);
                });

            return;
        }

        if (aboutButton || cardImage || productCardName) {
            const productId = aboutButton?.dataset?.productId ?? productCard.dataset.productId;
            openModal(productId);
        }
    });
}