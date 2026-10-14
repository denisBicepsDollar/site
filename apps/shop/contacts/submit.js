import { els } from './elements.js';

function showFormError(message) {
    if (!els.formError || !els.formErrorText) return;
    els.formErrorText.textContent = message;
    els.formError.classList.remove('hidden');
}

function hideFormError() {
    if (!els.formError) return;
    els.formError.classList.add('hidden');
    if (els.formErrorText) els.formErrorText.textContent = '';
}

export async function submitContactForm() {
    hideFormError();

    const val = els.contact?.value.trim() || '';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const payload = {
        name: els.contactName?.value.trim() || '',
        email: emailRegex.test(val) ? val : '',
        phone: emailRegex.test(val) ? '' : val,
        message: els.message?.value.trim() || ''
    };

    if (els.submitButton) els.submitButton.disabled = true;

    // Показываем лоадер
    if (els.submitLoader) {
        els.submitLoader.textContent = 'Отправка...';
        els.submitLoader.classList.remove('hidden');
    }

    try {
        const response = await fetch('/api/contacts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            throw new Error(errorData?.message || `Ошибка сервера: ${response.status}`);
        }

        // Успех
        if (els.submitLoader) {
            els.submitLoader.textContent = 'Сообщение отправлено! Свяжемся с вами в ближайшее время.';
            els.submitLoader.classList.remove('hidden');
        }

        if (els.contactsForm) els.contactsForm.reset();
        if (els.submitButton) els.submitButton.disabled = false; // ← здесь

        await new Promise(resolve => setTimeout(resolve, 4000));

        if (els.submitLoader) {
            els.submitLoader.classList.add('hidden');
            els.submitLoader.textContent = '';
        }

    } catch (error) {
        console.error('Ошибка отправки:', error);
        if (els.submitLoader) {
            els.submitLoader.classList.add('hidden');
        }
        showFormError(error.message || 'Не удалось отправить сообщение. Попробуйте позже.');
        if (els.submitButton) els.submitButton.disabled = false; // ← и здесь
    }
}