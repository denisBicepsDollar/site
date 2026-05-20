import {POCHTA_FROM_INDEX, POCHTA_TARIFFS} from './constants.js';

export async function calculateAllPochtaOfficesTariffs(toIndex, weight, sumoc) {
    return Promise.all(
        POCHTA_TARIFFS.map(function (tariff) {
            return calculatePochtaTariff(toIndex, weight, sumoc, tariff);
        })
    );
}

export async function calculatePochtaTariff(toIndex, weight, sumoc, tariff) {
    if (!toIndex) {
        return {
            error: 'Нет индекса получателя',
            object: tariff.object,
            label: tariff.label
        };
    }

    const params = new URLSearchParams({
        json: '',
        object: tariff.object,
        from: POCHTA_FROM_INDEX,
        to: String(toIndex),
        weight: String(weight),
        sumoc: String(sumoc),
    });
    // sumoc — объявленная ценность в копейках

    const urlTariff = `https://tariff.pochta.ru/tariff/v1/calculate?${params.toString()}`;
    const urlDelivery = `https://tariff.pochta.ru/delivery/v1/calculate?${params.toString()}`;

    try {
        const [responseTariff, responseDelivery] = await Promise.all([
            fetch(urlTariff),
            fetch(urlDelivery)
        ]);

        if (!responseTariff.ok) throw new Error('Ошибка сети Почты: тариф');
        if (!responseDelivery.ok) throw new Error('Ошибка сети Почты: сроки');

        const [dataTariff, dataDelivery] = await Promise.all([
            responseTariff.json(),
            responseDelivery.json()
        ]);

        return {
            ...dataTariff,
            object: tariff.object,
            label: tariff.label,
            delivery: extractDeliveryInfo(dataDelivery),
            deliveryRaw: dataDelivery
        };
    } catch (error) {
        console.error(`Ошибка при расчете тарифа ${tariff.label}:`, error);
        return {
            error: error.message || 'Ошибка расчета',
            object: tariff.object,
            label: tariff.label
        };
    }
}

//Нормализация сроков доставки
function extractDeliveryInfo(data) {
    if (data?.delivery) {
        return {
            min: data.delivery.min ?? null,
            max: data.delivery.max ?? null,
            deadline: data.delivery.deadline ?? null
        };
    }

    const items = Array.isArray(data?.items) ? data.items : [];

    const rangeItem = items.find(item =>
            item?.delivery && (
                item.delivery.min != null ||
                item.delivery.max != null
            )
    );

    const deadlineItem = items.find(item =>
        item?.delivery?.deadline
    );

    return {
        min: rangeItem?.delivery?.min ?? null,
        max: rangeItem?.delivery?.max ?? null,
        deadline: deadlineItem?.delivery?.deadline ?? null
    };
}