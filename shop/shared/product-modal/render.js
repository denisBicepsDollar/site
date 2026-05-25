import {modalEls} from './elements.js';
import {safeImage, NO_IMAGE} from '../utils.js';
import {formatPrice} from "../validation.js";

export function renderProductModal(product) {
    if (!product) return;

    if (modalEls.image) {
        modalEls.image.src = safeImage(product.image);
        modalEls.image.alt = product.name || '';

        modalEls.image.onerror = function () {
            this.onerror = null;
            this.src = NO_IMAGE;
        };
    }

    if (modalEls.name) {
        modalEls.name.textContent = product.name || '';
    }

    if (modalEls.price) {
        modalEls.price.textContent = `${formatPrice(product.price)}`;
    }

    if (modalEls.priceOld) {
        if (product.priceOld) {
            modalEls.priceOld.textContent = `${formatPrice(product.priceOld)}`;
            modalEls.priceOld.classList.remove('hidden');
        } else {
            modalEls.priceOld.textContent = '';
            modalEls.priceOld.classList.add('hidden');
        }
    }

    if (modalEls.badge) {
        if (product.stock > 0) {
            modalEls.badge.textContent = `В наличии ${product.stock}`;
            modalEls.badge.className = 'product-modal__badge product-card__badge--available';
        } else {
            modalEls.badge.textContent = 'Нет в наличии';
            modalEls.badge.className = 'product-modal__badge product-card__badge--sold';
        }
    }

    if (modalEls.volume) {
        modalEls.volume.textContent = product.volume || '—';
    }

    if (modalEls.description) {
        modalEls.description.textContent = product.fullDescription || product.description || '';
    }

    if (modalEls.qtyValue) {
        modalEls.qtyValue.textContent = '1';
    }

    if (modalEls.addToCartBtn) {
        modalEls.addToCartBtn.disabled = product.stock <= 0;
        modalEls.addToCartBtn.textContent = product.stock > 0 ? 'В корзину' : 'Нет в наличии';
    }

    // Сохраняем productId на кнопке
    if (modalEls.addToCartBtn) {
        modalEls.addToCartBtn.dataset.productId = product.id;
        modalEls.addToCartBtn.dataset.maxStock = product.stock || 0;
    }
}