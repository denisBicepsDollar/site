/* ============================================================================
   CONSTANTS — справочники и моковые данные страницы товара.

   Пока товар берётся из массива `goods`. Когда появится API — меняется только
   функция findGoodById (или сам массив), остальной код страницы не трогаем.
   ============================================================================ */

/* Лимиты на длину текстовых полей */
import {data} from "../../../shared/data.js";

export const MAX_NAME_LENGTH = 100;
export const MAX_DESCRIPTION_LENGTH = 200;
export const MAX_NOTE_LENGTH = 100;

/* Категории товара */
export const CATEGORIES = ['Комнатные', 'Садовые'];

/* Какие размеры предлагать для быстрого добавления в зависимости от категории */
const SIZES_BY_CATEGORY = {
    Комнатные: ['D5', 'D7', 'D10'],
    Садовые: ['P9', 'C1', 'C2'],
};

export const getSizePresets = category => SIZES_BY_CATEGORY[category] ?? [];

/* Значения по умолчанию для нового товара */
export const DEFAULT_CATEGORY = CATEGORIES[0];
export const DEFAULT_STATUS = 'draft';

/* Варианты статуса товара */
export const STATUSES = [
    {
        value: 'active',
        name: 'Активен',
        description: 'Показывается в каталоге, можно купить',
    },
    {
        value: 'draft',
        name: 'Черновик',
        description: 'Не виден в каталоге, требует редактирования',
    },
    {
        value: 'archived',
        name: 'Архив',
        description: 'Скрыт с витрины, остается в истории',
    },
];

export const SIZES = {
    md: {wrapper: "h-28 w-28 sm:h-32 sm:w-32", image: "rounded-xl"},
    sm: {wrapper: "h-28 w-24 grow-0 shrink-0 overflow-hidden rounded-lg ", image: ""},
};

export const BREAKPOINTS = {
    xl: 1920,
    lg: 1366,
    md: 1200,
    sm: 800,
};
export const findGoodById = id => data.find(item => item.id === Number(id)) ?? null;



