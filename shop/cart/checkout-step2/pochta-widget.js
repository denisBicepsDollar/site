import { calculateAndRenderPochta } from './pochta.js';
import { els } from './elements.js';

export async function callbackAddress(data) {
    console.log('Выбрано отделение:', data);

    const toIndex = data.indexTo;

    if (els.pochtaOfficeSelected) {
        els.pochtaOfficeSelected.innerHTML = `
            <strong>Выбрано отделение:</strong><br>
            ${data.regionTo || ''}, ${data.cityTo || ''}, ${data.addressTo || ''} (${toIndex})
        `;
    }

    if (!toIndex) return;

    if (els.pochtaOfficePriceTariffs) {
        els.pochtaOfficePriceTariffs.innerHTML = 'Пересчитываем точную стоимость...';
    }
    await calculateAndRenderPochta(toIndex);
}

