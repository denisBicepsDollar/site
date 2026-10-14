export const els = {};

export function initElements() {
    els.contactName = document.getElementById('contact-name');
    els.message = document.getElementById('contact-message');

    els.contactNameError = document.getElementById('contact-name-error');
    els.contactEmailError = document.getElementById('contact-email-error');
    els.messageError = document.getElementById('contact-message-error');

    els.submitButton = document.getElementById('submit-button');
    els.contactsForm = document.getElementById('contacts-form');

    els.formError = document.getElementById('contacts-form-alert');
    els.formErrorText = document.getElementById('contacts-form-alert-text');
    els.closeError = document.getElementById('contacts-alert-close');
    els.submitLoader = document.getElementById('contacts-form-loader');

    els.contact = document.getElementById('contact-contact');
    els.contactError = document.getElementById('contact-contact-error');
}