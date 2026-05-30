import {loadProductsData} from '../shared/product-store.js';

const STORAGE_KEY = 'cart';

let cart = [];
let cartCountEl = null;
let isCartEventsBound = false;

// Если PRODUCTS уже вынесен в модуль — импортируй оттуда
// import {PRODUCTS} from '../data/products.js';

// =============================================
// LOCAL STORAGE
// =============================================
function readCartFromStorage() {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
}
function saveCart() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
}
// =============================================
// ПУБЛИЧНЫЕ ГЕТТЕРЫ
// =============================================

export function loadCart() {
    cart = readCartFromStorage();
    return cart;
}
export function getCartTotal() {
    return cart.reduce((total, item) => total + item.price * item.count, 0);
}
export function getTotalItems() {
    return cart.reduce((total, item) => total + item.count, 0);
}
// =============================================
// СЧЁТЧИК В ХЕДЕРЕ
// =============================================
export function updateCartCount() {
    if (!cartCountEl) {
        cartCountEl = document.querySelector('.header__cart-count');
    }

    if (!cartCountEl) return;

    const count = getTotalItems();
    cartCountEl.textContent = count;

    if (count === 0) {
        cartCountEl.classList.add('header__cart-count--hidden');
    } else {
        cartCountEl.classList.remove('header__cart-count--hidden');
    }
}
// =============================================
// ОПЕРАЦИИ С КОРЗИНОЙ
// =============================================

export async function addToCart(productId, variantId = null, selectedPrice = null, selectedVolume = null, maxStock = null) {
    const products = await loadProductsData();
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    const price = selectedPrice ?? product.price;
    const volume = selectedVolume ?? product.volume;
    const cartKey = variantId ? `${productId}_${variantId}` : productId;
    const stock = maxStock ?? product.stock; // ← берём переданный stock

    if (stock <= 0) {
        alert('Товара нет в наличии');
        return;
    }

    const cartItem = cart.find((item) => item.cartKey === cartKey);
    if (cartItem) {
        if (cartItem.count >= stock) {
            alert('Нельзя добавить больше, чем есть в наличии');
            return;
        }
        cartItem.count += 1;
    } else {
        cart.push({
            cartKey,
            id: product.id,
            variantId: variantId || null,
            price,
            volume,
            name: product.name,
            image: product.image,
            count: 1,
            maxStock: maxStock || product.stock,
        });
    }

    saveCart();
    updateCartCount();
}

export function decreaseItem(cartKey) {
    const item = cart.find(i => (i.cartKey || i.id) === cartKey);
    if (!item) return;
    if (item.count > 1) {
        item.count -= 1;
    } else {
        cart.splice(cart.indexOf(item), 1);
    }
    saveCart();
    updateCartCount();
}

export function removeFromCart(cartKey) {
    const idx = cart.findIndex(i => (i.cartKey || i.id) === cartKey);
    if (idx !== -1) cart.splice(idx, 1);
    saveCart();
    updateCartCount();
}

export function clearCart() {
    cart = [];
    saveCart();
    updateCartCount();
}
// =============================================
// СОБЫТИЯ
// =============================================

function bindAddToCartButtons() {
    if (isCartEventsBound) return;

    document.addEventListener('click', function (event) {
        const cartBtn = event.target.closest('.card__cart-button');
        if (!cartBtn) return;
        if (cartBtn.disabled) return;

        const card = cartBtn.closest('.card');
        if (!card) return;

        const productId = card.dataset.productId;
        if (!productId) return;

        addToCart(productId);

        cartBtn.textContent = 'Добавлено';
        cartBtn.disabled = true;

        setTimeout(() => {
            cartBtn.textContent = 'В корзину';
            cartBtn.disabled = false;
        }, 1000);
    });

    isCartEventsBound = true;
}
// =============================================
// ИНИЦИАЛИЗАЦИЯ
// =============================================
export function initCart() {
    cart = readCartFromStorage();
    cartCountEl = document.querySelector('.header__cart-count');

    updateCartCount();
    bindAddToCartButtons();

    loadProductsData().catch(err => {
        console.warn('Не удалось предзагрузить товары:', err);
    });
}