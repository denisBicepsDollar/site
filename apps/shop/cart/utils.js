export function show(el) {
    if (!el) {
        console.error('show: элемент не найден');
        return;
    }
    el.classList.remove('hidden');
}

export function hide(el) {
    if (!el) {
        console.error('hide: элемент не найден');
        return;
    }
    el.classList.add('hidden');
}

export function setHTML(el, html) {
    if (el) el.innerHTML = html;
}

export function clearHTML(el) {
    if (el) el.innerHTML = '';
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