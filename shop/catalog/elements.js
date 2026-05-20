export const els = {};

export function initCatalogElements() {
    els.catalogGrid = document.querySelector('#catalog-grid');
    els.emptyEl = document.querySelector('#catalog-empty');
    els.sortSelect = document.querySelector('#sort-select');
    els.searchInput = document.querySelector('#catalog-search-input');
    els.loadMoreWrap = document.querySelector('#catalog-load-more');
    els.loadMoreBtn = document.querySelector('#load-more-btn');

    // Блоки уровней (для show/hide всего блока с заголовком)
    els.typeBlock = document.querySelector('#type-block');
    els.subtypeBlock = document.querySelector('#subtype-block');
    els.varietyBlock = document.querySelector('#variety-block');

    // Контейнеры с кнопками
    els.groupFilters = document.querySelector('#group-filters');
    els.typeFilters = document.querySelector('#type-filters');
    els.subtypeFilters = document.querySelector('#subtype-filters');
    els.varietyFilters = document.querySelector('#variety-filters');
}