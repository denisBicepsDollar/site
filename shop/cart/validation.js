import {state} from "./checkout-step2/state.js";
import {loadCart, getCartTotal, getTotalItems} from "./cart.js";
import {POCHTA_TARIFF_NAMES, CDEK_TARIFF_NAMES} from "./checkout-step3/constants.js";

export function formatPrice(value) {
    return `${Number(value || 0).toLocaleString('ru-RU')} руб.`;
}

export function getDeliveryCompanyName() {
    if (state.deliveryMethod === 'pickup') {
        return 'Самовывоз';
    }

    if (state.deliveryCompany === 'pochta') {
        return 'Почта России';
    }

    if (state.deliveryCompany === 'cdek') {
        return 'СДЭК';
    }

    return '—';
}

export function getDeliveryTypeName() {
    if (state.deliveryMethod === 'pickup') {
        return 'Самовывоз';
    }

    if (state.deliveryCompany === 'pochta' && state.deliveryType === 'office') {
        return 'В отделение';
    }

    if (state.deliveryCompany === 'pochta' && state.deliveryType === 'courier') {
        return 'Курьером';
    }

    if (state.deliveryCompany === 'cdek') {
        const tariffId = getCdekTariffId();
        if (tariffId === 'pvz') return 'Пункт выдачи';
        if (tariffId === 'courier') return 'Курьер';
    }

    return '—';
}

export function getDeliveryFullName() {
    const company = getDeliveryCompanyName();
    const type = getDeliveryTypeName();


    if (company === 'Самовывоз') {
        return company;
    }

    if (!company || company === '—') {
        return '—';
    }

    if (!type || type === '—') {
        return company;
    }

    return `${company}, ${type}`;
}

export function getDeliveryAddress() {
    if (state.deliveryMethod === 'pickup') {
        return 'Адрес: Брянская обл. Новозыбков.';
    }

    if (state.deliveryCompany === 'pochta') {
        return getPochtaAddress();
    }

    if (state.deliveryCompany === 'cdek') {
        return getCdekAddress();
    }

    if (state.deliveryMethod === 'delivery') {
        return state.fullSelectedAddress || null;
    }

    return null;
}

export function getPochtaAddress() {
    if (state.deliveryType === 'office') {
        return state.autoOffice || state.selectedPochtaOffice || null;
    }

    if (state.deliveryType === 'courier') {
        return state.fullSelectedAddress || null;
    }

    return null;
}

export function getCdekAddress() {
    return state.selectedCdekOffice || state.fullSelectedAddress || null;
}

function getPochtaTariffId() {
    if (!state.selectedPochtaTariff) return null;

    if (typeof state.selectedPochtaTariff === 'object') {
        return state.selectedPochtaTariff.id || '';
    }

    return state.selectedPochtaTariff;
}

function getCdekTariffId() {
    if (!state.selectedCdekTariff) return null;

    if (typeof state.selectedCdekTariff === 'object') {
        return state.selectedCdekTariff.id || '';
    }

    return state.selectedCdekTariff;
}

export function getDeliveryTariffName() {
    if (state.deliveryMethod === 'pickup') {
        return 'Без доставки';
    }

    if (state.deliveryCompany === 'pochta') {
        const tariffId = getPochtaTariffId();
        return POCHTA_TARIFF_NAMES[tariffId] || '—';
    }

    if (state.deliveryCompany === 'cdek') {
        const tariffId = getCdekTariffId();
        return CDEK_TARIFF_NAMES[tariffId] || '—';
    }

    return '—';
}

export function getDeliveryPriceText() {
    if (state.deliveryMethod === 'pickup') {
        return 'Бесплатно';
    }

    return state.deliveryPrice ? formatPrice(state.deliveryPrice) : '—';
}

export function getCartItemsData() {
    const cart = loadCart();

    return cart.map((item) => ({
        id: item.id,
        name: item.name,
        count: Number(item.count || 0),
        price: Number(item.price || 0),
        subtotal: Number(item.price || 0) * Number(item.count || 0),
        priceText: formatPrice(item.price || 0),
        subtotalText: formatPrice((item.price || 0) * (item.count || 0)),
    }));
}

export function getProductsSummaryData() {
    const totalItems = getTotalItems();
    const totalPrice = getCartTotal();

    return {
        totalItems,
        totalPrice,
        totalItemsText: `${totalItems} шт.`,
        totalPriceText: formatPrice(totalPrice),
        items: getCartItemsData(),
    };
}
import {els} from './checkout-step3/elements.js';

export function setError(input, errorEl, message) {
    if (errorEl) errorEl.textContent = message;
    if (input) input.classList.add('checkout-form__input--error');
}

export function clearError(input, errorEl) {
    if (errorEl) errorEl.textContent = '';
    if (input) input.classList.remove('checkout-form__input--error');
}

export function validateSurname() {
    const value = els.surname?.value.trim() || '';

    if (!value) {
        setError(els.surname, els.surnameError, 'Введите фамилию');
        return false;
    }

    if (value.length < 2) {
        setError(els.surname, els.surnameError, 'Минимум 2 символа');
        return false;
    }

    clearError(els.surname, els.surnameError);
    return true;
}

export function validateName() {
    const value = els.name?.value.trim() || '';

    if (!value) {
        setError(els.name, els.nameError, 'Введите имя');
        return false;
    }

    if (value.length < 2) {
        setError(els.name, els.nameError, 'Минимум 2 символа');
        return false;
    }

    clearError(els.name, els.nameError);
    return true;
}

export function validateEmail() {
    const value = els.email?.value.trim() || '';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!value) {
        setError(els.email, els.emailError, 'Введите email');
        return false;
    }

    if (!emailRegex.test(value)) {
        setError(els.email, els.emailError, 'Некорректный email');
        return false;
    }

    clearError(els.email, els.emailError);
    return true;
}

export function validatePhone() {
    const value = els.phone?.value.trim() || '';
    const digits = value.replace(/\D/g, '');

    if (!value) {
        setError(els.phone, els.phoneError, 'Введите телефон');
        return false;
    }

    if (digits.length < 11) {
        setError(els.phone, els.phoneError, 'Минимум 11 цифр');
        return false;
    }

    if (digits.length > 12) {
        setError(els.phone, els.phoneError, 'Слишком длинный номер');
        return false;
    }

    clearError(els.phone, els.phoneError);
    return true;
}

export function validatePrivacy() {
    if (!els.privacy?.checked) {
        if (els.privacyError) {
            els.privacyError.textContent = 'Необходимо дать согласие';
        }
        return false;
    }

    if (els.privacyError) {
        els.privacyError.textContent = '';
    }

    return true;
}

export function validateStep() {
    const results = [
        validateSurname(),
        validateName(),
        validateEmail(),
        validatePhone(),
        validatePrivacy()
    ];

    return results.every(Boolean);
}
