import {els} from './elements.js';
import {state} from '../checkout-step2/state.js';
import {
    loadCart,
    getCartTotal,
    clearCart
} from '../cart.js';
import {
    getDeliveryCompanyName,
    getDeliveryTypeName,
    getDeliveryTariffName,
    getDeliveryAddress
} from './validation.js';
import {showStep} from '../navigation.js'
function showLoader(show) {
    if (!els.submitLoader) return;

    if (show) {
        els.submitLoader.classList.remove('checkout-form__loader--hidden');
    } else {
        els.submitLoader.classList.add('checkout-form__loader--hidden');
    }
}

function showFormError(message) {
    if (!els.formError || !els.formErrorText) return;

    els.formErrorText.textContent = message;
    els.formError.classList.remove('checkout-form__alert--hidden');
}

function hideFormError() {
    if (!els.formError) return;

    els.formError.classList.add('checkout-form__alert--hidden');
    if (els.formErrorText) els.formErrorText.textContent = '';
}

function collectFormData() {
    const cart = loadCart();

    return {
        customer: {
            surname: els.surname?.value.trim() || '',
            name: els.name?.value.trim() || '',
            fathername: els.fathername?.value.trim() || '',
            email: els.email?.value.trim() || '',
            phone: els.phone?.value.trim() || '',
            comment: els.comment?.value.trim() || ''
        },

        delivery: {
            method: state.deliveryMethod || null,
            company: state.deliveryCompany || null,
            companyName: getDeliveryCompanyName(),
            type: state.deliveryType || null,
            typeName: getDeliveryTypeName(),
            tariffId: state.selectedPochtaTariff?.id
                || state.selectedCdekTariff?.id
                || state.selectedPochtaTariff
                || state.selectedCdekTariff
                || null,
            tariffName: getDeliveryTariffName(),
            address: getDeliveryAddress(),
            price: Number(state.deliveryPrice || 0)
        },

        cart: cart.map((item) => ({
            id: item.id,
            name: item.name,
            price: item.price,
            count: item.count,
            subtotal: item.price * item.count
        })),

        totals: {
            productsTotal: getCartTotal(),
            deliveryPrice: Number(state.deliveryPrice || 0),
            grandTotal: getCartTotal() + Number(state.deliveryPrice || 0)
        }
    };
}

export async function submitOrder() {
    hideFormError();

    const payload = collectFormData();

    console.log('Отправляем заказ:', payload);

    els.submitButton.disabled = true;
    showLoader(true);

    try {
        const response = await fetch('/api/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            throw new Error(
                errorData?.message || `Ошибка сервера: ${response.status}`
            );
        }

        const result = await response.json();

        console.log('Заказ оформлен:', result);

        // Очистка корзины
        clearCart();

        // Переход в папку order-success (спасибо за заказ)
        window.location.href = `/cart/order-success?orderId=${result.orderId}`;

    } catch (error) {
        console.error('Ошибка отправки:', error);
        showFormError(error.message || 'Не удалось оформить заказ. Попробуйте позже.');
    } finally {
        els.submitButton.disabled = false;
        showLoader(false);
    }
}