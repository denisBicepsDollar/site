import {initCart} from './cart.js';
import {initNavigation, showStep} from './navigation.js';
import {initStep1} from './checkout-step1/index.js';
import {initStep2} from './checkout-step2/index.js';
import {initStep3} from './checkout-step3/index.js';

document.addEventListener('DOMContentLoaded', () => {
    initCart();
    initNavigation();

    initStep1();
    initStep2();
    initStep3();

    showStep(1);
});