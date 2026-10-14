export const els = {};

export function initElements3() {
    // Поля формы
    els.surname = document.getElementById('surname');
    els.name = document.getElementById('name');
    els.fathername = document.getElementById('fathername');
    els.email = document.getElementById('email');
    els.phone = document.getElementById('phone');
    els.comment = document.getElementById('comment');
    els.privacy = document.getElementById('privacy');

    // Ошибки полей
    els.surnameError = document.getElementById('surname-error');
    els.nameError = document.getElementById('name-error');
    els.emailError = document.getElementById('email-error');
    els.phoneError = document.getElementById('phone-error');
    els.privacyError = document.getElementById('privacy-error');

    // Алерт ошибки
    els.formError = document.getElementById('form-error');
    els.formErrorText = document.getElementById('form-error-text');
    els.closeError = document.getElementById('close-error');

    // Summary
    els.finalProductsPrice = document.getElementById('final-products-price');
    els.finalProductsList = document.getElementById('final-products-list');
    els.deliveryCompany = document.getElementById('deliveryCompany');
    els.deliveryTariff = document.getElementById('deliveryTariff');
    els.finalDeliveryPrice = document.getElementById('final-delivery-price');
    els.deliveryAddress = document.getElementById('deliveryAddress');
    els.finalTotalPrice = document.getElementById('final-total-price');

    // Навигация
    els.backToStep2 = document.getElementById('back-to-step-2');
    els.submitButton = document.getElementById('submit-button');
    els.submitLoader = document.getElementById('submit-loader');
}