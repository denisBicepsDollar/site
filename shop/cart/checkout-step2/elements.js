export const els = {};

export function initElements2() {
    // навигация
    els.backToStep1 = document.getElementById('back-to-step-1');
    els.nextToStep3 = document.getElementById('next-to-step-3');

    // способ получения
    els.pickupRadio = document.querySelector('input[name="getting"][value="pickup"]');
    els.deliveryRadio = document.querySelector('input[name="getting"][value="delivery"]');
    els.pickupBlock = document.getElementById('pickup-block');
    els.deliveryBlock = document.getElementById('delivery-block');

    // адрес
    els.addressInput = document.getElementById('inp-address');
    els.companyDeliveryOptions = document.getElementById('company-delivery__options');

    // компания доставки
    els.pochtaRadio = document.querySelector('input[name="delivery-company"][value="pochta"]');
    els.cdekRadio = document.querySelector('input[name="delivery-company"][value="cdek"]');
    els.pochtaBlock = document.getElementById('pochta-block__method');
    els.cdekBlock = document.getElementById('cdek__block__method');

    // почта тип доставки
    els.pochtaOfficeRadio = document.querySelector('input[name="pochta-type"][value="office"]');
    els.pochtaCourierRadio = document.querySelector('input[name="pochta-type"][value="courier"]');
    els.pochtaOfficeBlock = document.getElementById('pochta-office__block');
    els.pochtaCourierBlock = document.getElementById('pochta-courier__block');

    //почта цены
    els.pochtaPriceMin = document.getElementById('price-pochta--min');
    els.pochtaOfficePriceTariffs = document.getElementById('pochta-office__tariffs');
    els.pochtaOfficePriceMin = document.getElementById('price-office--min');
    els.pochtaCourierTariff = document.getElementById('pochta-courier__tariff');
    els.pochtaCourierPriceMin = document.getElementById('price-courier--min');


    // почта выбранное отделение / виджет
    els.pochtaOfficeSelected = document.getElementById('pochta-office__selected');
    els.pochtaCourierSelected = document.getElementById('pochta-courier__selected');
    els.pochtaWidgetContainer = document.getElementById('ecom-widget');

    // сдек тип доставки
    els.cdekOfficeRadio = document.querySelector('input[name="cdek-type"][value="office"]');
    els.cdekCourierRadio = document.querySelector('input[name="cdek-type"][value="courier"]');
    els.cdekOfficeBlock = document.getElementById('cdek__office__block');
    els.cdekCourierBlock = document.getElementById('cdek__courier__block');
    //сдек цены
    els.cdekPriceMin = document.getElementById('cdek__price--min');
    els.cdekOfficePriceTariffs = document.getElementById('cdek__office__tariffs');
    els.cdekOfficePriceMin = document.getElementById('cdek__price__office--min');
    els.cdekCourierTariff = document.getElementById('cdek__courier__tariff');
    els.cdekCourierPriceMin = document.getElementById('cdek__price__courier--min');
    // сдек выбранное отделение / виджет
    els.cdekOfficeSelected = document.getElementById('cdek__office__selected');
    els.cdekCourierSelected = document.getElementById('cdek__courier__selected');
    els.cdekWidgetContainer = document.getElementById('cdek-map');
}