import {initElements2} from "./elements.js";
import {bindUIEvents, syncInitialUI} from "./ui.js";
import {initDadata} from "./dadata.js";
import {callbackAddress} from './pochta-widget.js';

export function initStep2() {
    window.callbackAddress = callbackAddress;

    initElements2();
    bindUIEvents();
    syncInitialUI();
    initDadata();
}