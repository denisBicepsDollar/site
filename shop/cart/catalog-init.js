import {
    initCart,
    addToCart,
    decreaseItem,
    removeFromCart,
    clearCart,
    getCartTotal,
    getTotalItems
} from './cart.js';

// мост для старых обычных script-файлов
window.addToCart = addToCart;
window.decreaseItem = decreaseItem;
window.removeFromCart = removeFromCart;
window.clearCart = clearCart;
window.getCartTotal = getCartTotal;
window.getTotalItems = getTotalItems;

document.addEventListener('DOMContentLoaded', () => {
    initCart();
});