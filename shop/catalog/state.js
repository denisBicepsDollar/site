export const state = {
    currentGroup: 'all',
    currentType: 'all',
    currentSubtype: 'all',
    currentVariety: 'all',
    currentSort: 'default',
    currentSearch: '',
    currentLimit: 6,
};

export const STEP = 6;

export function resetLimit() {
    state.currentLimit = STEP;
}

// Сброс нижних уровней при изменении верхнего
export function resetTypeAndBelow() {
    state.currentType = 'all';
    state.currentSubtype = 'all';
    state.currentVariety = 'all';
}

export function resetSubtypeAndBelow() {
    state.currentSubtype = 'all';
    state.currentVariety = 'all';
}

export function resetVariety() {
    state.currentVariety = 'all';
}