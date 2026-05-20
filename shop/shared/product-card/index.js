import {bindProductCardEvents} from './events.js';

export function initProductCards() {
    bindProductCardEvents();
}

// Реэкспорт для удобства
export {renderCards} from './render.js';