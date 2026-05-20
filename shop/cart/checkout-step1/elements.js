export const els = {};

export function initElements1() {
    // --- Элементы корзины ---
    els.cartItemsContainer = document.getElementById('cart-items');
    els.cartEmptyBlock = document.getElementById('cart-empty');
    els.cartPageBlock = document.getElementById('cart-page');

    els.cartTotalItems = document.getElementById('cart-total-items');
    els.cartTotalPrice = document.getElementById('cart-total-price');
    els.clearCartButton = document.getElementById('clear-cart-button');
    //Кнопка далее
    els.nextToStep2 = document.getElementById('next-to-step-2');
    els.minOrderText = document.querySelector('.min-order-text');
}