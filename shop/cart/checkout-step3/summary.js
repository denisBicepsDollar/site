import {state} from '../checkout-step2/state.js';
import {els} from './elements.js';
import {
    formatPrice,
    getCartItemsData,
    getDeliveryAddress,
    getDeliveryCompanyName, getDeliveryFullName, getDeliveryPriceText, getDeliveryTariffName,
    getProductsSummaryData,
} from '../validation.js';

export function formatDeliveryAddress() {
    const address = getDeliveryAddress();

    if (!address) {
        return '';
    }

    return `<p>Доставка оформлена по адресу: ${address}</p>`;
}

export function renderDeliveryInfo() {

    if (els.deliveryAddress) {
        const deliveryAddressHtml = formatDeliveryAddress();

        if (deliveryAddressHtml) {
            els.deliveryAddress.innerHTML = deliveryAddressHtml;
            els.deliveryAddress.classList.remove('hidden');
        } else {
            els.deliveryAddress.innerHTML = '';
            els.deliveryAddress.classList.add('hidden');
        }
    }

    if (els.deliveryCompany) {
        els.deliveryCompany.textContent = getDeliveryCompanyName();
    }
}
export function renderStep3Summary() {
    const products = getProductsSummaryData();

    if (els.finalProductsPrice) {
        els.finalProductsPrice.textContent = products.totalPriceText;
    }

    if (els.finalDeliveryPrice) {
        els.finalDeliveryPrice.textContent = getDeliveryPriceText();
    }

    if (els.finalTotalPrice) {
        const deliveryPrice = Number(state?.deliveryPrice || 0);
        const total = Number(products.totalPrice) + deliveryPrice;
        els.finalTotalPrice.textContent = `${formatPrice(total)}`;
    }

    if (els.deliveryCompany) {
        els.deliveryCompany.textContent = getDeliveryFullName();
    }
    if (els.deliveryTariff) {
        els.deliveryTariff.textContent = getDeliveryTariffName();
    }

    if (els.deliveryAddress) {
        const address = getDeliveryAddress();
        els.deliveryAddress.textContent = address || '—';
    }
}


export function renderProductsList() {
    if (!els.finalProductsList) return;

    const items = getCartItemsData();

    els.finalProductsList.innerHTML = items.map((item) => `
        <div class="checkout-products-item">
            <span>${item.name} × ${item.count}</span>
            <span>${item.subtotalText}</span>
        </div>
    `).join('');
}

export function renderStep3All() {
    renderDeliveryInfo();
    renderStep3Summary();
    renderProductsList();
}