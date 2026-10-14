import {els} from './elements.js';
import {
    state,
    resetLimit,
    resetTypeAndBelow,
    resetSubtypeAndBelow,
    resetVariety,
    STEP
} from './state.js';
import {renderAllFilters} from './filters.js';
import {updateCatalog} from './render.js';

function handleFilterClick(event) {
    const button = event.target.closest('.catalog-filter');
    if (!button) return;

    const filterType = button.dataset.filterType;
    const filterValue = button.dataset.filterValue;

    if (filterType === 'group') {
        state.currentGroup = filterValue;
        resetTypeAndBelow();
    } else if (filterType === 'type') {
        state.currentType = filterValue;
        resetSubtypeAndBelow();
    } else if (filterType === 'subtype') {
        state.currentSubtype = filterValue;
        resetVariety();
    } else if (filterType === 'variety') {
        state.currentVariety = filterValue;
    }

    resetLimit();
    renderAllFilters();
    updateCatalog();
}

function handleSortChange() {
    state.currentSort = els.sortSelect.value;
    resetLimit();
    updateCatalog();
}

function handleSearchInput() {
    let searchTimeout;

    return function () {
        clearTimeout(searchTimeout);

        searchTimeout = setTimeout(() => {
            state.currentSearch = els.searchInput.value.trim();
            resetLimit();
            updateCatalog();
        }, 300);
    };
}

function handleLoadMore() {
    state.currentLimit += STEP;
    updateCatalog();
}

export function bindCatalogEvents() {
    // Делегирование на все фильтры
    document.addEventListener('click', handleFilterClick);

    els.sortSelect?.addEventListener('change', handleSortChange);
    els.searchInput?.addEventListener('input', handleSearchInput());
    els.loadMoreBtn?.addEventListener('click', handleLoadMore);
}