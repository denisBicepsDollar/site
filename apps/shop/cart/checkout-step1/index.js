import {initElements1} from './elements.js';
import {bindCartStep1Events} from './ui.js';
import {renderCartPage} from './render.js';

export function initStep1() {
    initElements1();
    bindCartStep1Events();
    renderCartPage();
}