import {modalEls} from './elements.js';
import {safeImage, NO_IMAGE} from '../utils.js';
import {formatPrice} from "../../cart/validation.js";

// Рендер вариантов
function renderVariants(product) {
    const container = document.getElementById('modal-variants');
    if (!container) return;
    container.innerHTML = '';
    container.classList.add('hidden');
    container.onclick = null;

    if (!product.variants?.length) return;

    container.innerHTML = product.variants.map((v, i) => `
        <button 
            class="product-modal__variant ${i === 0 ? 'product-modal__variant--active' : ''}"
            data-variant-id="${v.id}"
            data-price="${v.price}"
            data-old-price="${v.old_price || ''}"
            data-stock="${v.stock}"
            data-volume="${v.volume}"
            ${v.stock <= 0 ? 'disabled' : ''}
        >
            ${v.volume}
            <span class="product-modal__variant-price">${formatPrice(v.price)}</span>
            ${v.stock <= 0 ? '<span class="product-modal__variant-sold">нет</span>' : ''}
        </button>
    `).join('');

    container.classList.remove('hidden');

    // При клике на вариант — обновляем цену и stock
    container.onclick = (e) => {
        const btn = e.target.closest('[data-variant-id]');
        if (!btn || btn.disabled) return;


        container.querySelectorAll('.product-modal__variant').forEach(b =>
            b.classList.remove('product-modal__variant--active')
        );
        btn.classList.add('product-modal__variant--active');

        // Обновляем цену
        if (modalEls.price) modalEls.price.textContent = formatPrice(+btn.dataset.price);
        if (modalEls.priceOld) {
            if (btn.dataset.oldPrice) {
                modalEls.priceOld.textContent = formatPrice(+btn.dataset.oldPrice);
                modalEls.priceOld.classList.remove('hidden');
            } else {
                modalEls.priceOld.classList.add('hidden');
            }
        }
        // Обновляем stock и кнопку
        const stock = +btn.dataset.stock;
        if (modalEls.badge) {
            if (stock > 0) {
                modalEls.badge.textContent = `В наличии ${stock}`;
                modalEls.badge.className = 'product-modal__badge product-card__badge--available';
            } else {
                modalEls.badge.textContent = 'Нет в наличии';
                modalEls.badge.className = 'product-modal__badge product-card__badge--sold';
            }
        }
        if (modalEls.addToCartBtn) {
            modalEls.addToCartBtn.disabled = stock <= 0;
            modalEls.addToCartBtn.textContent = stock > 0 ? 'В корзину' : 'Нет в наличии';
            modalEls.addToCartBtn.dataset.variantId = btn.dataset.variantId;
            modalEls.addToCartBtn.dataset.price = btn.dataset.price;
            modalEls.addToCartBtn.dataset.volume = btn.dataset.volume;
            modalEls.addToCartBtn.dataset.maxStock = stock;
        }
        if (modalEls.volume) modalEls.volume.textContent = btn.dataset.volume;
    };

    // Активируем первый
    container.querySelector('[data-variant-id]')?.click();
}
// Текущий индекс фото и массив фото
let currentImages = [];
let currentIndex = 0;

export function setModalImage(index) {
    currentIndex = index;
    const src = currentImages[index] || NO_IMAGE;
    if (modalEls.image) {
        modalEls.image.src = src;
        modalEls.image.onerror = function() { this.onerror=null; this.src=NO_IMAGE; };
    }
    // Обновляем активную миниатюру
    if (modalEls.thumbs) {
        modalEls.thumbs.querySelectorAll('.product-modal__thumb').forEach((t, i) => {
            t.classList.toggle('product-modal__thumb--active', i === index);
        });
    }
    // Показываем/скрываем кнопки листалки
    const hasMany = currentImages.length > 1;
    modalEls.imgPrev?.classList.toggle('hidden', !hasMany);
    modalEls.imgNext?.classList.toggle('hidden', !hasMany);
}

export function renderProductModal(product) {
    if (!product) return;


    // Собираем массив фото: основное + дополнительные
    currentImages = Array.isArray(product.images) && product.images.length > 0
        ? product.images
        : [product.image].filter(Boolean);
    if (currentImages.length === 0) currentImages = [NO_IMAGE];

    // Главное фото
    setModalImage(0);

    // Клик по главному фото → лайтбокс
    if (modalEls.image) {
        modalEls.image.style.cursor = 'zoom-in';
        modalEls.image.onclick = () => openLightbox(currentIndex);
    }

    // Миниатюры
    if (modalEls.thumbs) {
        if (currentImages.length > 1) {
            modalEls.thumbs.innerHTML = currentImages.map((src, i) => `
                <img 
                    class="product-modal__thumb ${i === 0 ? 'product-modal__thumb--active' : ''}"
                    src="${src}"
                    alt=""
                    data-index="${i}"
                    onerror="this.onerror=null;this.src='${NO_IMAGE}'"
                >
            `).join('');
            modalEls.thumbs.classList.remove('hidden');
        } else {
            modalEls.thumbs.innerHTML = '';
            modalEls.thumbs.classList.add('hidden');
        }
    }

    // Стрелки листалки
    if (modalEls.imgPrev) {
        modalEls.imgPrev.onclick = () => setModalImage((currentIndex - 1 + currentImages.length) % currentImages.length);
    }
    if (modalEls.imgNext) {
        modalEls.imgNext.onclick = () => setModalImage((currentIndex + 1) % currentImages.length);
    }

    // Клики по миниатюрам
    modalEls.thumbs?.addEventListener('click', e => {
        const thumb = e.target.closest('[data-index]');
        if (thumb) setModalImage(+thumb.dataset.index);
    });

    // Остальные поля
    if (modalEls.name) modalEls.name.textContent = product.name || '';
    if (modalEls.price) modalEls.price.textContent = formatPrice(product.price);

    if (modalEls.priceOld) {
        if (product.oldPrice) {
            modalEls.priceOld.textContent = formatPrice(product.oldPrice);
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

    if (modalEls.volume) modalEls.volume.textContent = product.volume || '—';
    if (modalEls.description) modalEls.description.textContent = product.fullDescription || product.description || '';
    if (modalEls.qtyValue) modalEls.qtyValue.textContent = '1';

    if (modalEls.addToCartBtn) {
        // Если есть варианты — кнопку настроит renderVariants
        if (!product.variants?.length) {
            modalEls.addToCartBtn.disabled = product.stock <= 0;
            modalEls.addToCartBtn.textContent = product.stock > 0 ? 'В корзину' : 'Нет в наличии';
        } else {
            // Временно скрываем до выбора варианта
            modalEls.addToCartBtn.disabled = true;
            modalEls.addToCartBtn.textContent = 'Выберите объём';
        }
        modalEls.addToCartBtn.dataset.productId = product.id;
        modalEls.addToCartBtn.dataset.maxStock = product.stock || 0;
    }

    renderVariants(product);
}

// ── ЛАЙТБОКС ──────────────────────────────────────────────

export function openLightbox(index) {
    currentIndex = index;
    updateLightbox();
    modalEls.lightbox?.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

export function closeLightbox() {
    modalEls.lightbox?.classList.add('hidden');
    document.body.style.overflow = '';
}

function updateLightbox() {
    if (modalEls.lightboxImg) {
        modalEls.lightboxImg.src = currentImages[currentIndex] || NO_IMAGE;
    }
    if (modalEls.lightboxCounter) {
        modalEls.lightboxCounter.textContent = `${currentIndex + 1} / ${currentImages.length}`;
    }
}

export function initLightboxEvents() {
    modalEls.lightboxClose?.addEventListener('click', closeLightbox);
    modalEls.lightboxOverlay?.addEventListener('click', closeLightbox);

    modalEls.lightboxPrev?.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
        updateLightbox();
        setModalImage(currentIndex);
    });

    modalEls.lightboxNext?.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % currentImages.length;
        updateLightbox();
        setModalImage(currentIndex);
    });

    document.addEventListener('keydown', e => {
        if (modalEls.lightbox?.classList.contains('hidden')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') {
            currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
            updateLightbox(); setModalImage(currentIndex);
        }
        if (e.key === 'ArrowRight') {
            currentIndex = (currentIndex + 1) % currentImages.length;
            updateLightbox(); setModalImage(currentIndex);
        }
    });
}