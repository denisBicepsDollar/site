//мб сделать так чтобы одна функция в разных вызовах или хз давала другое значение
import { state } from './state.js';
import {POCHTA_COURIER_OBJECT} from "./constants.js";

export function renderPochtaPostOffice(results) {
    const result = Array.isArray(results)
        ? results.find(function (item) {
            return item && Array.isArray(item.postoffice) && item.postoffice.length > 0;
        })
        : results;

    const offices = (Array.isArray(result?.postoffice) ? result.postoffice : [])
        .filter(off => String(off.index) !== '243020');
    // Берём второе отделение т.к. первое обычно — сам магазин
    const office = offices[1] || offices[offices.length - 1];

    if (!office) {
        return 'Пункт не выбран';
    }

    const name = office.name || 'Отделение';
    const index = office.index || '';
    const address = office.address || '';
    state.autoOffice = [name, index, address].filter(Boolean).join(', ');
    console.log('auto', state.autoOffice)

    return `
        <strong>Предварительное отделение Почты:</strong>
        ${name}${index ? `, ${index}` : ''}${address ? `, ${address}` : ''}
    `;
}

export function formatPochtaResults(results) {
    if (!Array.isArray(results) || results.length === 0) {
        return '<p>Не удалось рассчитать</p>';
    }

    const validResults = results
        .filter(function (item) {
            return item && !item.error && getPochtaTariffPrice(item) > 0 &&  String(item.object) !== POCHTA_COURIER_OBJECT;
        })
        .sort(function (a, b) {
            return getPochtaTariffPrice(a) - getPochtaTariffPrice(b);
        });

    if (validResults.length === 0) {
        return '<p>Не удалось рассчитать</p>';
    }

    return `
        <p>Выберите тариф доставки:</p>
        <ul class="pochta-tariffs-list">
            ${validResults.map(function (item) {
        const price = getPochtaTariffPrice(item);
        const termText = getDeliveryTermText(item);

        const inputId = `pochta-tariff-${item.object}`;

        return `
                <li class="pochta-tariff-item">
                    <label for="${inputId}" class="checkout-form__radio pochta-tariff-label">
                        <input
                            type="radio"
                            name="pochta-tariff"
                            id="${inputId}"
                            value="${item.object}"
                            data-price="${price}"
                        >
                        <span class="pochta-tariff-content">
                            <span class="pochta-tariff-title">${item.label}</span>
                            <span class="pochta-tariff-term">${termText || 'Срок доставки уточняется.'}</span>
                            <span class="pochta-tariff-price">Стоимость доставки: от ${price} руб.</span>
                        </span>
                    </label>
                </li>
            `;
    }).join('')}
        </ul>
    `;
}

export function getPochtaTariffPrice(item) {
    return Math.ceil((item?.ground?.valnds || 0) / 100);
}

export function formatPochtaMinPrice(results) {
    if (!Array.isArray(results) || results.length === 0) {
        return '';
    }

    const validResults = results
        .filter(function (item) {
            return item && !item.error && getPochtaTariffPrice(item) > 0;
        });

    if (validResults.length === 0) {
        return '';
    }

    const minPrice = Math.min(...validResults.map(getPochtaTariffPrice));

    return `от ${minPrice} руб.`;
}
export function formatAllPochtaPrice(results) {
    if (!Array.isArray(results) || results.length === 0) {
        return '';
    }

    const validResults = results
        .filter(function (item) {
            return item && !item.error && getPochtaTariffPrice(item) > 0;
        });

    if (validResults.length === 0) {
        return '';
    }

    const minPochtaAllPrice = Math.min(...validResults.map(getPochtaTariffPrice));

    return `от ${minPochtaAllPrice} руб.`;
}
export function formatPochtaCourierPriceMin(results) {
    const ems = findEmsItem(results);
    if (!ems) return '';
    return `от ${getPochtaTariffPrice(ems)} руб.`;
}
export function formatPochtaCourierSelected(address) {
    if (!address) {
        return '<strong>Адрес доставки:</strong> Не выбран';
    }

    return `<strong>Адрес доставки:</strong> ${address}`;
}
export function formatPochtaCourierTariff(results) {
    const item = findEmsItem(results);
    if (!item) return '';

    const price    = getPochtaTariffPrice(item);
    const termText = getDeliveryTermText(item);
    const inputId  = `pochta-courier-tariff-${item.object}`;

    return `
        <label for="${inputId}" class="checkout-form__radio pochta-tariff-label">
            <input
                type="radio"
                name="pochta-courier-tariff"
                id="${inputId}"
                value="${item.object}"
                data-price="${price}"
              
            >
            <span class="pochta-tariff-content">
                <span class="pochta-tariff-title">${item.label}</span>
                <span class="pochta-tariff-term">${termText || 'Срок доставки уточняется.'}</span>
                <span class="pochta-tariff-price">Стоимость доставки: от ${price} руб.</span>
            </span>
        </label>
    `;
}
//
export function getDeliveryTermText(item) {
    if (!item?.delivery) return '';

    const { min, max, deadline } = item.delivery;

    // 1. Если есть диапазон дней — показываем его
    if (min != null && max != null) {
        if (min === max) {
            return `Срок доставки до ${max} дней. `;
        }
        return `Срок доставки от ${min} до ${max} дней. `;
    }

    // 2. Если нет диапазона, но есть крайняя дата
    if (deadline) {
        return `Ориентировочно до ${formatDeadline(deadline)}. `;
    }

    return '';
}
//
function formatDeadline(deadlineStr) {
    if (!deadlineStr) return '';

    const datePart = String(deadlineStr).split('T')[0];
    if (datePart.length !== 8) return deadlineStr;

    const year = datePart.slice(0, 4);
    const month = datePart.slice(4, 6);
    const day = datePart.slice(6, 8);

    return `${day}.${month}.${year}`;
}
function findEmsItem(results) {
    if (!Array.isArray(results)) return null;
    return results.find(item =>
        item &&
        !item.error &&
        getPochtaTariffPrice(item) > 0 &&
        String(item.object) === POCHTA_COURIER_OBJECT
    ) ?? null;
}