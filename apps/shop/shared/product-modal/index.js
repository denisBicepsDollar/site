import {initModalElements} from './elements.js';
import {bindModalEvents} from './events.js';
import { initLightboxEvents } from './render.js';

export function initProductModal() {
    initModalElements();
    initLightboxEvents();
    bindModalEvents();
}