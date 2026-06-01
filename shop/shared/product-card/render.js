// =============================================
// УНИВЕРСАЛЬНЫЙ РЕНДЕР КАРТОЧЕК
// =============================================

/**
 * Рендерит карточки товаров в указанный контейнер
 *
 * @param {Object} options - настройки
 * @param {string|HTMLElement} options.container - селектор или DOM-элемент
 * @param {Array} options.products - массив товаров (если не задан — берёт PRODUCTS)
 * @param {string} options.filterTag - фильтр по тегу ('popular', 'new', 'all')
 * @param {string} options.search - строка поиска
 * @param {string} options.sort - сортировка ('price-asc', 'price-desc', 'name-asc', 'name-desc')
 * @param {number} options.limit - максимум карточек
 * @param {HTMLElement} options.emptyEl - элемент "ничего не найдено"
 */





import {safeImage, NO_IMAGE} from '../utils.js';
import {formatPrice} from "../../cart/validation.js";
import {normalizeText} from "../product-store.js";


export function renderCards(options = {}) {
    // Параметры по умолчанию
    const {
        container,
        products = [],
        category = 'all',
        search = '',
        sort = 'default',
        limit = null,
        emptyEl = null,
    } = options;

    // Находим контейнер
    const containerEl = typeof container === 'string'
        ? document.querySelector(container)
        : container;

    if (!containerEl) {
        console.warn('renderCards: контейнер не найден', container);
        return;
    }

    // Копируем массив

    let filtered = [...products];

    // 1. Фильтр по категории
    if (category !== 'all') {
        filtered = filtered.filter(p => p.category && p.category.includes(category));
    }

    // 2. Поиск
    if (search) {
        const queryWords = normalizeText(search)
            .split(' ')
            .filter(word => word.length > 0);

        filtered = filtered.filter(product =>
            queryWords.every(queryWord =>
                product._searchWords.some(word => word.includes(queryWord))
            )
        );
    }

    // 3. Сортировка
    switch (sort) {
        case 'popular':
            filtered.sort((a, b) => Number(hasTag(b, 'popular')) - Number(hasTag(a, 'popular')));
            break;

        case 'new':
            filtered.sort((a, b) => Number(hasTag(b, 'new')) - Number(hasTag(a, 'new')));
            break;

        case 'price-asc':
            filtered.sort((a, b) => a.price - b.price);
            break;

        case 'price-desc':
            filtered.sort((a, b) => b.price - a.price);
            break;
    }
    const total = filtered.length;

    // 4. Лимит
    if (limit) {
        filtered = filtered.slice(0, limit);
    }

    const shown = filtered.length;

    if (shown === 0) {
        if (containerEl && containerEl.id === 'catalog-grid') {
            containerEl.classList.add('hidden');
        }
        if (emptyEl) emptyEl.classList.remove('hidden');

        return {total, shown};
    }
    containerEl.classList.remove('hidden');
    if (emptyEl) emptyEl.classList.add('hidden');

    // 6. Рендерим карточки
    containerEl.innerHTML = filtered.map(createCardHTML).join('');

    return {total, shown};
}

// =============================================
// ШАБЛОН ОДНОЙ КАРТОЧКИ
// =============================================
function createCardHTML(product) {
    const available = product.stock > 0;
    const discount = getDiscountPercent(product);

    return `
        <div class="product-card" data-product-id="${product.id}">
           <div class="product-card__image-wrapper">
                <img class="product-card__image"
                     src="${safeImage(product.image)}" 
                     alt="${product.name}"
                     loading="lazy"
                     onerror="this.onerror=null; this.src='${NO_IMAGE}';">
  
                <span class="product-card__badge product-card__badge--${available ? 'available' : 'sold'}">
                    ${available ? `В наличии ${product.stock > 5 ? product.stock + " шт." : ""}` : 'Нет в наличии'}
                </span>
                ${discount > 0 ? `<span class="product-card__discount">-${discount}%</span>` : ''}
            </div>

            <div class="product-card__info">
                <div class="product-card__prices">
                    <span class="product-card__price">${formatPrice(product.price)}</span>
                    ${product.oldPrice
        ? `<span class="product-card__price-old">${formatPrice(product.oldPrice)}</span>`
        : ''}
                </div>

                <h3 class="product-card__name">${product.name}</h3>
                <p class="product-card__description">${product.description}</p>

                ${product.stock > 0 && product.stock <= 5
        ? `<p class="product-card__stock-warning">Осталось ${product.stock} шт!</p>`
        : ''}

                <div class="product-card__footer">
                    <button 
                        class="button button__about" 
                        type="button"
                        data-product-id="${product.id}">
                        Подробнее
                    </button>

                    <button 
                        class="button button--outline product-card__btn" 
                        type="button"
                        data-product-id="${product.id}"
                        ${!available ? 'disabled' : ''}>
                        ${available ? 'В корзину' : 'Нет в наличии'}
                    </button>
                </div>
            </div>
        </div>
    `;
}
export function renderSkeletons(container, count = 6) {
    const containerEl = typeof container === 'string'
        ? document.querySelector(container)
        : container;
    if (!containerEl) return;

    containerEl.innerHTML = Array.from({ length: count }, () => `
        <div class="product-card product-card--skeleton">
            <div class="product-card__image-wrapper skeleton-box"></div>
            <div class="product-card__info">
                <div class="skeleton-line skeleton-line--wide"></div>
                <div class="skeleton-line skeleton-line--medium"></div>
                <div class="skeleton-line skeleton-line--short"></div>
                <div class="product-card__footer">
                    <div class="skeleton-btn"></div>
                    <div class="skeleton-btn"></div>
                </div>
            </div>
        </div>
    `).join('');
}
// =============================================
// ХЕЛПЕР
// =============================================
export function getDiscountPercent(product) {
    if (!product.oldPrice || product.oldPrice <= product.price) return 0;
    return Math.round((1 - product.price / product.oldPrice) * 100);
}

function hasTag(product, tag) {
    return product.tags && product.tags.includes(tag);
}