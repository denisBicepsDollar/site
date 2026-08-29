import {DEFAULT_CART_WEIGHT, DEFAULT_GOODS_COST} from './constants.js';
import {els} from './elements.js';
import {state} from './state.js';
import {show, clearHTML} from '../utils.js';
import {callbackAddress} from './pochta-widget.js';
import {calculateAllPochtaOfficesTariffs} from './pochta-api.js';
import {
    formatPochtaResults,
    formatPochtaMinPrice,
    renderPochtaPostOffice,
    formatAllPochtaPrice, formatPochtaCourierPriceMin, formatPochtaCourierSelected, formatPochtaCourierTariff,
} from './pochta-render.js';
import {updateNextStepButtonState} from "./ui.js";
import {getCartTotal} from "../cart.js";


export async function handleAddressSelect(suggestion) {
    const toIndex = suggestion.data.postal_code;
    state.fullSelectedAddress = suggestion.unrestricted_value;
    setPochtaPrice('Считаем...');

    if (!toIndex) {
        handleNoIndex();
        return;
    }
    if (els.pochtaOfficeRadio?.checked && state.fullSelectedAddress) {
        initPochtaWidget(state.fullSelectedAddress);
    }

    await calculateAndRenderPochta(toIndex);
}

function handleNoIndex() {
    setPochtaPrice('Точную стоимость доставки не удалось посчитать, уточните адрес.');
}

export async function calculateAndRenderPochta(toIndex) {
    try {
        const cartWeight = DEFAULT_CART_WEIGHT;
        // sumoc — объявленная ценность в копейках
        const cartSum = getCartTotal() * 100;

        const pochtaResults = await calculateAllPochtaOfficesTariffs(toIndex, cartWeight, cartSum);

        renderPochtaResults(pochtaResults);
    } catch (error) {
        console.error('Ошибка расчета Почты:', error);
        setPochtaPrice('Ошибка расчета');
    }
}

function renderPochtaResults(results) {

    if (els.pochtaPriceMin) {
        els.pochtaPriceMin.innerHTML = formatAllPochtaPrice(results);
    }
    //отделение
    if (els.pochtaOfficePriceMin) {
        els.pochtaOfficePriceMin.innerHTML = formatPochtaMinPrice(results);
    }

    if (els.pochtaOfficeSelected) {
        els.pochtaOfficeSelected.innerHTML = renderPochtaPostOffice(results);
    }
    if (els.pochtaOfficePriceTariffs) {
        els.pochtaOfficePriceTariffs.innerHTML = formatPochtaResults(results);
    }
    //курьер
    if (els.pochtaCourierPriceMin) {
        els.pochtaCourierPriceMin.innerHTML = formatPochtaCourierPriceMin(results);
    }
    if (els.pochtaCourierSelected) {
        els.pochtaCourierSelected.innerHTML = formatPochtaCourierSelected(state.fullSelectedAddress);
    }
    if (els.pochtaCourierTariff) {
        els.pochtaCourierTariff.innerHTML = formatPochtaCourierTariff(results);
    }
    updateNextStepButtonState();
}

export function setPochtaPrice(text) {
    if (els.pochtaPriceMin) els.pochtaPriceMin.innerHTML = text;
    if (els.pochtaOfficePriceMin) els.pochtaOfficePriceMin.innerHTML = text;
    if (els.pochtaCourierPriceMin) els.pochtaCourierPriceMin.innerHTML = text;
}

export function initPochtaWidget(address, goodsCost = DEFAULT_GOODS_COST) {
    if (!els.pochtaWidgetContainer || !address) return;


    show(els.pochtaWidgetContainer);
    clearHTML(els.pochtaWidgetContainer);


    window.ecomStartWidget({
        id: 62176,
        containerId: 'ecom-widget',
        callbackFunction: callbackAddress,
        start_location: address,
        sumoc: goodsCost,
    });
}