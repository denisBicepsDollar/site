import {els} from './elements.js';
import {
    validateSurname,
    validateName,
    validateEmail,
    validatePhone,
    validatePrivacy,
    validateStep3
} from './validation.js';
import {submitOrder} from './submit.js';

function goToStep(step) {
    if (typeof window.showStep === 'function') {
        window.showStep(step);
    }
}

function applyPhoneMask(input) {
    if (!input) return;

    input.addEventListener('input', function () {
        let digits = input.value.replace(/\D/g, '');

        // Если начинается с 8, меняем на 7
        if (digits.startsWith('8') && digits.length > 1) {
            digits = '7' + digits.slice(1);
        }

        // Если не начинается с 7, добавляем
        if (!digits.startsWith('7') && digits.length > 0) {
            digits = '7' + digits;
        }

        let formatted = '';

        if (digits.length > 0) formatted += '+' + digits[0];
        if (digits.length > 1) formatted += ' (' + digits.slice(1, 4);
        if (digits.length > 4) formatted += ') ' + digits.slice(4, 7);
        if (digits.length > 7) formatted += '-' + digits.slice(7, 9);
        if (digits.length > 9) formatted += '-' + digits.slice(9, 11);

        input.value = formatted;
    });

    // Не даём вводить больше 18 символов
    input.addEventListener('keydown', function (e) {
        const digits = input.value.replace(/\D/g, '');

        if (digits.length >= 11 && e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
            if (/\d/.test(e.key)) {
                e.preventDefault();
            }
        }
    });
}

export function bindStep3Events() {
    // Навигация
    els.backToStep2?.addEventListener('click', () => goToStep(2));

    // Валидация на blur (при уходе с поля)
    els.surname?.addEventListener('blur', validateSurname);
    els.name?.addEventListener('blur', validateName);
    els.email?.addEventListener('blur', validateEmail);
    els.phone?.addEventListener('blur', validatePhone);
    els.privacy?.addEventListener('change', validatePrivacy);

    // Маска телефона
    applyPhoneMask(els.phone);

    // Закрытие алерта ошибки
    els.closeError?.addEventListener('click', () => {
        if (els.formError) {
            els.formError.classList.add('checkout-form__alert--hidden');
        }
        if (els.formErrorText) {
            els.formErrorText.textContent = '';
        }
    });

    // Кнопка «Оформить заказ»
    els.submitButton?.addEventListener('click', async (event) => {
        event.preventDefault();

        if (!validateStep3()) {
            // Скроллим к первой ошибке
            const firstError = document.querySelector('.checkout-form__input--error');

            if (firstError) {
                firstError.scrollIntoView({behavior: 'smooth', block: 'center'});
                firstError.focus();
            }

            return;
        }

        await submitOrder();
    });
}