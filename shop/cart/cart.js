import {PRODUCTS} from "../shared/products.js";

const STORAGE_KEY = 'cart';

let cart = [];
let cartCountEl = null;
let isCartEventsBound = false;

// Если PRODUCTS уже вынесен в модуль — импортируй оттуда
// import {PRODUCTS} from '../data/products.js';

// Временный вариант, если PRODUCTS пока глобальный
function getProducts() {
    return PRODUCTS || [];
}

function readCartFromStorage() {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
}

export function loadCart() {
    cart = readCartFromStorage();
    return cart;
}

function saveCart() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
}

export function getCartTotal() {
    return cart.reduce((total, item) => total + item.price * item.count, 0);
}

export function getTotalItems() {
    return cart.reduce((total, item) => total + item.count, 0);
}

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

export function addToCart(productId) {

    const products = getProducts();

    const product = products.find((p) => p.id === productId);

    if (!product) return;


    if (product.stock <= 0) {
        alert('Товара нет в наличии');
        return;
    }

    const cartItem = cart.find((item) => item.id === productId);

    if (cartItem) {
        if (cartItem.count >= product.stock) {
            alert('Нельзя добавить больше, чем есть в наличии');
            return;
        }

        cartItem.count += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            count: 1,
        });
    }

    saveCart();
    updateCartCount();
}

export function decreaseItem(productId) {
    const cartItem = cart.find((item) => item.id === productId);

    if (!cartItem) return;

    cartItem.count -= 1;

    if (cartItem.count <= 0) {
        cart = cart.filter((item) => item.id !== productId);
    }

    saveCart();
    updateCartCount();
}

export function removeFromCart(productId) {
    const cartIndex = cart.findIndex((item) => item.id === productId);

    if (cartIndex === -1) return;

    cart.splice(cartIndex, 1);

    saveCart();
    updateCartCount();
}

export function clearCart() {
    cart = [];
    saveCart();
    updateCartCount();
}

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

export function initCart() {
    cart = readCartFromStorage();
    cartCountEl = document.querySelector('.header__cart-count');

    updateCartCount();
    bindAddToCartButtons();
}