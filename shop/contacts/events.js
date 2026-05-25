import { els } from './elements.js';
import {
    validateName,
} from './validation.js'; //
import {clearError, setError,} from '../cart/validation.js'
import { submitContactForm } from './submit.js';

// Функция сбора всех проверок для формы контактов
function validateContactForm() {
    let isValid = true;

    const nameValid = validateName(els.contactName, els.contactNameError);

    if (!nameValid) isValid = false;

    const val = els.contact?.value.trim() || '';


    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[\d\s+\-()]{7,}$/;


    if (!val) {
        setError(els.contact, els.contactError, 'Укажите email или телефон');
        isValid = false;
    } else if (!emailRegex.test(val) && !phoneRegex.test(val)) {
        setError(els.contact, els.contactError, 'Некорректный email или телефон');
        isValid = false;
    } else {
        clearError(els.contact, els.contactError);
    }

    return isValid;
}

export function bindEvents() {
    // Валидация при уходе с поля (blur)
    els.contactName?.addEventListener('blur', () => {
        validateName(els.contactName, els.contactNameError);
    });

    // Закрытие общего алерта ошибки
    els.closeError?.addEventListener('click', () => {
        if (els.formError) {
            els.formError.classList.add('contacts-form__alert--hidden');
        }
        if (els.formErrorText) {
            els.formErrorText.textContent = '';
        }
    });

    // Отправка формы
    els.submitButton?.addEventListener('click', async (event) => {
        event.preventDefault();


        const valid = validateContactForm();


        if (!valid) {
            const firstError = document.querySelector('.contacts-form__input--error, .contacts-form__textarea--error');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                firstError.focus();
            }
            return;
        }
        await submitContactForm();
    });
}