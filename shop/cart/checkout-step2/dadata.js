import { DADATA_TOKEN } from './constants.js';
import { els } from './elements.js';
import { handleAddressSelect } from './pochta.js';

export function initDadata() {
    if (!els.addressInput) return;
    if (!window.Dadata?.createSuggestions) {
        console.warn('Dadata не подключена');
        return;
    }

    window.Dadata.createSuggestions(els.addressInput, {
        token: DADATA_TOKEN,
        type: 'address',
        bounds: 'city-settlement',
        locations: [{ country: 'Россия' }],
        autoSelectFirst: true,
        onSelect: handleAddressSelect
    });
}