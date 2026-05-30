import {els} from './elements.js';
import {loadCart, getCartTotal, getTotalItems} from '../cart.js';
import {MIN_ORDER_PRICE} from './constants.js';
import {updateNextStep1Button} from './ui.js';
import {NO_IMAGE, safeImage} from "../../shared/utils.js";
import {formatPrice} from "../validation.js";

export function renderCartPage() {
    const cart = loadCart();

    if (cart.length === 0) {
        els.cartEmptyBlock?.classList.remove('hidden');
        els.cartPageBlock?.classList.add('hidden');
        updateNextStep1Button();
        return;
    }

    els.cartEmptyBlock?.classList.add('hidden');
    els.cartPageBlock?.classList.remove('hidden');

    els.cartItemsContainer.innerHTML = '';

    cart.forEach(function (item) {
        const itemHTML = `
            <div class="cart-item"
                 data-product-id="${item.id}"
                 data-cart-key="${item.cartKey || item.id}"
                 data-variant-id="${item.variantId || ''}"
                 data-price="${item.price}"
                 data-volume="${item.volume || ''}"
                 data-max-stock="${item.maxStock || 99}">
  
                <img class="cart-item__image"
                     src="${safeImage(item.image)}" 
                     alt="${item.name}"
                     loading="lazy"
                     onerror="this.onerror=null; this.src='${NO_IMAGE}';">

                <div class="cart-item__info">
                    <h3 class="cart-item__name">${item.name}</h3>
                    <p class="cart-item__price">${formatPrice(item.price)}</p>
                ${item.volume ? `<p class="cart-item__volume">${item.volume}</p>` : ''}
                </div>

                <div class="cart-item__controls">
                    <button class="cart-item__btn cart-item__btn--minus" type="button">−</button>
                    <span class="cart-item__count">${item.count}</span>
                    <button class="cart-item__btn cart-item__btn--plus" type="button">+</button>
                </div>

                <p class="cart-item__subtotal">${formatPrice(item.price * item.count)}</p>
                <button class="cart-item__remove" type="button" title="Удалить">✕</button>
            </div>
        `;

        els.cartItemsContainer.insertAdjacentHTML('beforeend', itemHTML);
    });

    const total = getCartTotal();

    els.cartTotalItems.textContent = `${getTotalItems()} шт.`;
    els.cartTotalPrice.textContent = `${formatPrice(total)}`;

    if (els.minOrderText) {
        if (total >= MIN_ORDER_PRICE) {
            els.minOrderText.classList.add('hidden');
        } else {
            els.minOrderText.classList.remove('hidden');
        }
    }

    updateNextStep1Button();
}