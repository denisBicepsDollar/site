import {clearError, setError} from "../shared/validation.js"

export function validateName(input, errorEl) {
    const value = input?.value.trim() || '';

    if (!value) {
        setError(input, errorEl, 'Введите имя');
        return false;
    }
    if (value.length < 2) {
        setError(input, errorEl, 'Минимум 2 символа');
        return false;
    }
    clearError(input, errorEl);
    return true;
}

export function validateEmail(input,errorEl) {
    const value = input?.value.trim() || '';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!value) {
        setError(input, errorEl, 'Введите email');
        return false;
    }

    if (!emailRegex.test(value)) {
        setError(input, errorEl, 'Некорректный email');
        return false;
    }

    clearError(input, errorEl);
    return true;
}
