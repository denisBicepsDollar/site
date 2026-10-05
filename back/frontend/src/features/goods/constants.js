/* ============================================================================
   CONSTANTS — справочники и моковые данные страницы товара.

   Пока товар берётся из массива `goods`. Когда появится API — меняется только
   функция findGoodById (или сам массив), остальной код страницы не трогаем.
   ============================================================================ */

/* Лимиты на длину текстовых полей */
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

/* Данные товара (пока мок) */
export const goods = [// --- КОМНАТНЫЕ РАСТЕНИЯ (Варианты: D5, D7, D10) ---
    {
        id: 2,
        name: "Фикус Лирата",
        sku: "PL-002",
        category: "Комнатные",
        price: 4800,
        stock: 1,
        status: "active",
        updated: "Вчера",
        description: "the best good",

        // 1. Явно указываем главное фото (превью для карточки/списка)
        previewImage: "/1.png",

        variants: [{
            name: "D7", previewImage: "/6.png", stock: 5, price: 5000, images: ["/2.png", "/3.png", "/5.png", "/6.png"]
        }, {
            name: "D10", previewImage: "/4.png", stock: 3, price: 2000, images: ["/1.png", "/4.png", "/7.png"]
        }]
    }];

/* Поиск товара по id из адреса (/dashboard/goods/:id) */
export const findGoodById = id => goods.find(item => item.id === Number(id)) ?? null;