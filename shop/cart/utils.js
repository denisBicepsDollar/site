export function show(el) {
    if (el) {
        if (el === null) return;
        el.classList.remove('hidden');
    } else {
        console.error('Ошибка: Попытка показать элемент, которого нет в DOM');
    }
}

export function hide(el) {
    if (el) {
        if (!el) return;
        el.classList.add('hidden');
    } else {
        console.error('Ошибка: Попытка скрыть элемент, которого нет в DOM', el);
    }
}
export function setHTML(el, html) {
    if (el) el.innerHTML = html;
}

export function clearHTML(el) {
    if (el) el.innerHTML = '';
}











// --- Кнопки навигации ---
const nextToStep4 = document.getElementById('next-to-step-4');

const backToStep2 = document.getElementById('back-to-step-2');
const backToStep3 = document.getElementById('back-to-step-3');

// =============================================
// 7. ПЕРЕХОДЫ МЕЖДУ ШАГАМИ
// =============================================

if (nextToStep4) nextToStep4.addEventListener('click', () => showStep(4));

if (backToStep2) backToStep2.addEventListener('click', () => showStep(2));
if (backToStep3) backToStep3.addEventListener('click', () => showStep(3));


// =============================================
// 10. ОТОБРАЖЕНИЕ ОШИБОК
// =============================================
function showFieldError(fieldId, message) {
    const errorEl = document.getElementById(fieldId + '-error');
    const inputEl = document.getElementById(fieldId);
    if (errorEl) errorEl.textContent = message;
    if (inputEl) inputEl.classList.add('checkout-form__input--error');
}

function clearFormErrors() {
    document.querySelectorAll('.checkout-form__error').forEach(el => {
        el.textContent = '';
    });
    document.querySelectorAll('.checkout-form__input--error').forEach(el => {
        el.classList.remove('checkout-form__input--error');
    });
    hideFormAlert();
}

function showFormAlert(message) {
    const alertBlock = document.getElementById('form-error');
    const alertText = document.getElementById('form-error-text');
    if (alertBlock && alertText) {
        alertText.textContent = message;
        alertBlock.classList.remove('checkout-form__alert--hidden');
    }
}

function hideFormAlert() {
    const alertBlock = document.getElementById('form-error');
    if (alertBlock) {
        alertBlock.classList.add('checkout-form__alert--hidden');
    }
}

// Закрытие алёрта по крестику
const closeErrorBtn = document.getElementById('close-error');
if (closeErrorBtn) {
    closeErrorBtn.addEventListener('click', hideFormAlert);
}