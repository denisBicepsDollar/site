import {initElements3} from './elements.js';
import {bindStep3Events} from './events.js';
import {renderStep3All} from './summary.js';

export function initStep3() {
    initElements3();
    bindStep3Events();
}

export function refreshStep3() {
    renderStep3All();
}