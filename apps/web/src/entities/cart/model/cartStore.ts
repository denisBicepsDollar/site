import {create} from 'zustand';
import {getProductsByVariant} from '../../../shared/api/api';

export const useCartStore = create((set, get) => ({
    cartStorage: [],
    cartItems: [],
    isLoadingProducts: false,

    // Инициализация корзины (вызвать один раз при старте приложения или на экране)
    initCart: () => {
        if (typeof window === 'undefined') return;
        const saved = localStorage.getItem('cart');
        const cartStorage = saved ? JSON.parse(saved) : [];
        set({cartStorage});
        get().fetchCartProducts();
    },

    fetchCartProducts: async () => {
        const {cartStorage} = get();
        if (!cartStorage || cartStorage.length === 0) {
            set({cartItems: [], isLoadingProducts: false});
            return;
        }

        try {
            set({isLoadingProducts: true});
            const variantIds = cartStorage.map(({variantId}) => variantId);
            const response = await getProductsByVariant(variantIds);
            const backendProducts = response?.data || [];

            const mergedProducts = backendProducts.map(product => {
                const targetId = product.variantId || product.id;
                const cartItem = cartStorage.find(item => item.variantId === targetId);
                return {
                    ...product,
                    variantId: targetId, // гарантируем единый ID
                    cartQuantity: cartItem ? cartItem.cartQuantity : 1
                };
            });
            set({cartItems: mergedProducts});
        } catch (error) {
            console.error("Ошибка при загрузке продуктов:", error);
        } finally {
            set({isLoadingProducts: false});
        }
    },

    changeQuantity: (variantId, newQuantity, stock) => {
        if (newQuantity < 1) {
            get().removeFromCart(variantId);
            return;
        }

        let finalQuantity = newQuantity;
        if (newQuantity > stock) {
            alert(`На складе осталось всего ${stock} шт. Установлен максимум.`);
            finalQuantity = stock;
        }

        // Обновляем cartStorage
        const updatedStorage = get().cartStorage.map(item =>
            item.variantId === variantId ? {...item, cartQuantity: finalQuantity} : item
        );

        // Обновляем cartItems (чтобы карточка сразу увидела изменения)
        const updatedItems = get().cartItems.map(item =>
            item.variantId === variantId ? {...item, cartQuantity: finalQuantity} : item
        );

        localStorage.setItem('cart', JSON.stringify(updatedStorage));
        set({cartStorage: updatedStorage, cartItems: updatedItems});
    },

    removeFromCart: (variantId) => {
        const updatedStorage = get().cartStorage.filter(item => item.variantId !== variantId);
        const updatedItems = get().cartItems.filter(item => item.variantId !== variantId);

        localStorage.setItem('cart', JSON.stringify(updatedStorage));
        set({cartStorage: updatedStorage, cartItems: updatedItems});
    },
    // Добавь этот метод внутрь объекта create((set, get) => ({ ... })) в файле cartStore.js:

    addToCart: ({variantId, stock, quantity = 1}) => {
        const {cartStorage, fetchCartProducts} = get();

        // 1. Проверяем, есть ли уже этот товар в корзине
        const existingItem = cartStorage.find(item => item.variantId === variantId);

        if (existingItem) {
            // Если есть, просто перенаправляем в уже готовую функцию changeQuantity
            get().changeQuantity(variantId, existingItem.cartQuantity + quantity, stock);
            return;
        }

        // 2. Если добавляем первый раз, проверяем лимит склада
        const finalQuantity = quantity > stock ? stock : quantity;
        if (quantity > stock) {
            alert(`На складе осталось всего ${stock} шт. Добавлено максимально возможное количество.`);
        }

        // 3. Формируем новый массив для localStorage
        const updatedStorage = [...cartStorage, {variantId, cartQuantity: finalQuantity}];

        // 4. Записываем в localStorage и обновляем стейт стора
        localStorage.setItem('cart', JSON.stringify(updatedStorage));
        set({cartStorage: updatedStorage});

        // 5. Запускаем обновление полных данных (картинки, цены) с бэкенда
        get().fetchCartProducts();
    },

}));
