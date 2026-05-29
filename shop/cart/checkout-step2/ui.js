import {els} from './elements.js';
import {state} from './state.js';
import {show, hide} from '../utils.js';
import {initCdekWidget} from './cdek.js';
import {initPochtaWidget} from "./pochta.js";
import {refreshStep3} from "../checkout-step3/index.js";
import {showStep} from '../navigation.js';

export function bindUIEvents() {
    els.backToStep1?.addEventListener('click', () => goToStep(1));
    els.nextToStep3?.addEventListener('click', () => {
        refreshStep3();
        goToStep(3);
    });

    document.addEventListener('change', function (event) {


        const allowedNames = [
            'getting',
            'pochta-tariff',
            'pochta-courier-tariff',
            'cdek-tariff'
        ];

        if (allowedNames.includes(event.target.name)) {
            updateNextStepButtonState();
        }
    });

    document.addEventListener('change', function (event) {
        if (event.target.matches('input[name="pochta-tariff"]')) {
            const input = event.target;

            state.selectedPochtaTariff = {
                id: input.value,
                price: Number(input.dataset.price || 0),
                name: input.closest('.pochta-tariff-item')?.querySelector('.pochta-tariff-title')?.textContent?.trim() || ''
            };

            state.deliveryPrice = Number(input.dataset.price || 0);

            updateNextStepButtonState();
        }
    });
    document.addEventListener('change', function (event) {
        if (event.target.matches('input[name="pochta-courier-tariff"]')) {
            const input = event.target;

            state.selectedPochtaTariff = {
                id: input.value,
                price: Number(input.dataset.price || 0),
            };

            state.deliveryPrice = Number(input.dataset.price || 0);

            updateNextStepButtonState();
        }
    });
    document.addEventListener('change', function (event) {
        if (event.target.matches('input[name="cdek-tariff"]')) {
            const input = event.target;

            state.selectedCdekTariff = {
                id: input.value,
                price: Number(input.dataset.price || 0),
            };

            state.deliveryType = input.value;
            state.deliveryPrice = Number(input.dataset.price || 0);

            updateNextStepButtonState();
        }
    });
    els.pickupRadio?.addEventListener('change', updateMainDeliveryWay);
    els.deliveryRadio?.addEventListener('change', updateMainDeliveryWay);

    els.addressInput?.addEventListener('input', updateAddressInput);

    els.pochtaRadio?.addEventListener('change', updateDeliveryCompanyWay);
    els.cdekRadio?.addEventListener('change', updateDeliveryCompanyWay);

    els.pochtaOfficeRadio?.addEventListener('change', updateDeliveryPostWay);
    els.pochtaCourierRadio?.addEventListener('change', updateDeliveryPostWay);
}

export function syncInitialUI() {
    updateAddressInput();
    updateMainDeliveryWay();
    updateDeliveryCompanyWay();
    updateDeliveryPostWay();
}

function goToStep(step) {
    if (typeof showStep === 'function') {
        showStep(step);
    }
}

export function updateMainDeliveryWay() {
    if (els.pickupRadio?.checked) {
        state.deliveryMethod = 'pickup';
        state.fullSelectedAddress = 'Адрес: Брянская обл. Новозыбков.';
        show(els.pickupBlock);
        hide(els.deliveryBlock);
        return;
    }
    if (els.deliveryRadio?.checked) {

        state.deliveryMethod = 'delivery';

        hide(els.pickupBlock);
        show(els.deliveryBlock);
    }
}

export function updateDeliveryCompanyWay() {
    hide(els.pochtaBlock);
    hide(els.cdekBlock);

    if (els.pochtaRadio?.checked) {
        state.deliveryCompany = 'pochta';

        document.querySelectorAll('input[name="cdek-tariff"]').forEach((input) => {
            input.checked = false;
        });

        state.selectedPochtaOffice = null;
        state.selectedPochtaTariff = null;

        show(els.pochtaBlock);
        updateDeliveryPostWay();
        updateNextStepButtonState();
        return;
    }

    if (els.cdekRadio?.checked) {
        state.deliveryCompany = 'cdek';
        if (els.pochtaOfficeRadio) els.pochtaOfficeRadio.checked = false;
        if (els.pochtaCourierRadio) els.pochtaCourierRadio.checked = false;

        document.querySelectorAll('input[name="pochta-tariff"]').forEach((input) => {
            input.checked = false;
        });

        document.querySelectorAll('input[name="pochta-courier-tariff"]').forEach((input) => {
            input.checked = false;
        });

        state.selectedPochtaOffice = null;
        state.selectedPochtaTariff = null;

        show(els.cdekBlock);
        updateDeliveryPostWay();
        updateNextStepButtonState();
    }
}

export function updateAddressInput() {
    const value = els.addressInput?.value.trim() || '';

    state.fullSelectedAddress = value || null;

    if (value) {
        show(els.companyDeliveryOptions);
        return;
    }

    hide(els.companyDeliveryOptions);
}

export function updateDeliveryPostWay() {
    hide(els.pochtaOfficeBlock);
    hide(els.pochtaCourierBlock);
    hide(els.cdekBlock);

    // Почта
    if (els.pochtaRadio?.checked) {
        if (els.pochtaOfficeRadio?.checked) {
            state.deliveryType = 'office';
            show(els.pochtaOfficeBlock);

            state.selectedSdekOffice = null;
            state.selectedSdekTariff = null;

            if (els.pochtaCourierRadio) els.pochtaCourierRadio.checked = false;
            initPochtaWidget(state.fullSelectedAddress);
            updateNextStepButtonState();
            return;
        }

        if (els.pochtaCourierRadio?.checked) {
            state.deliveryType = 'courier';
            show(els.pochtaCourierBlock);

            if (els.pochtaOfficeRadio) els.pochtaOfficeRadio.checked = false;

            document.querySelectorAll('input[name="pochta-tariff"]').forEach((input) => {
                input.checked = false;
            });

            state.selectedPochtaOffice = null;
            state.selectedPochtaTariff = null;

            updateNextStepButtonState();
            return;
        }

        return;
    }

    // СДЭК
    if (els.cdekRadio?.checked) {
        show(els.cdekBlock);
        initCdekWidget();
        return;
    }
}
export function updateNextStepButtonState() {
    if (!els.nextToStep3) return;

    // Самовывоз
    if (els.pickupRadio?.checked) {
        els.nextToStep3.disabled = false;
        state.deliveryMethod = 'pickup';
        state.deliveryPrice = 0;
        state.selectedCdekTariff = null;
        state.selectedCdekOffice = null;
        state.selectedPochtaTariff = null;
        state.selectedPochtaOffice = null;
        state.deliveryType = null;
        return;
    }

    // Если доставка не выбрана — кнопка выключена
    if (!els.deliveryRadio?.checked) {
        els.nextToStep3.disabled = true;
        return;
    }

    // Почта
    if (els.pochtaRadio?.checked) {
        // В отделение
        if (els.pochtaOfficeRadio?.checked) {
            const selectedPochtaTariff = document.querySelector('input[name="pochta-tariff"]:checked');
            state.deliveryMethod = 'delivery';
            state.selectedCdekTariff = null;
            state.selectedCdekOffice = null;
            state.deliveryType = 'office';

            els.nextToStep3.disabled = !selectedPochtaTariff;
            return;
        }

        // Курьер
        if (els.pochtaCourierRadio?.checked) {
            const selectedCourierTariff = document.querySelector('input[name="pochta-courier-tariff"]:checked');

            state.deliveryMethod = 'delivery';
            state.selectedCdekTariff = null;
            state.selectedCdekOffice = null;
            state.selectedPochtaOffice = null;
            state.deliveryType = 'courier';
            els.nextToStep3.disabled = !selectedCourierTariff;
            return;
        }

        els.nextToStep3.disabled = true;
        return;
    }

    // СДЭК
    if (els.cdekRadio?.checked) {
        const selectedCdekTariff = document.querySelector('input[name="cdek-tariff"]:checked');
        state.deliveryMethod = 'delivery';
        state.deliveryCompany = 'cdek'
        state.selectedPochtaTariff = null;
        state.selectedPochtaOffice = null;
        els.nextToStep3.disabled = !selectedCdekTariff;
        return;
    }

    els.nextToStep3.disabled = true;
}