import { initElements, els } from './elements.js';
import { bindEvents } from './events.js';

document.addEventListener('DOMContentLoaded', () => {
    initElements();
    bindEvents();
});