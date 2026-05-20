export const modalEls = {};

export function initModalElements() {
    modalEls.modal = document.getElementById('product-modal');
    modalEls.overlay = document.getElementById('product-modal-overlay');
    modalEls.closeBtn = document.getElementById('product-modal-close');

    modalEls.image = document.getElementById('modal-product-image');
    modalEls.name = document.getElementById('modal-product-name');
    modalEls.price = document.getElementById('modal-product-price');
    modalEls.priceOld = document.getElementById('modal-product-price-old');
    modalEls.badge = document.getElementById('modal-product-badge');
    modalEls.volume = document.getElementById('modal-product-volume');
    modalEls.description = document.getElementById('modal-product-description');

    modalEls.qtyMinus = document.getElementById('modal-qty-minus');
    modalEls.qtyPlus = document.getElementById('modal-qty-plus');
    modalEls.qtyValue = document.getElementById('modal-qty-value');

    modalEls.addToCartBtn = document.getElementById('modal-add-to-cart');
}