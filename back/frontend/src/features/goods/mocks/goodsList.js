/* ============================================================================
   MOCK: список товаров для таблицы админки (20 позиций).

   Это временные данные до появления API. Обратите внимание: у карточки товара
   (features/goods/constants.js) мок другой формы — там варианты массивом и
   числовая цена. Когда появится API, оба мока уедут, а карточка и таблица
   будут читать один и тот же ответ сервера.
   ============================================================================ */

export const goodsList = [// --- КОМНАТНЫЕ РАСТЕНИЯ (Варианты: D5, D7, D10) ---
    {
        id: 1,
        name: "Монстера Делициоза",
        sku: "PL-001",
        category: "Комнатные растения",
        price: "2 400 ₽",
        stock: "15 шт",
        variants: "D10",
        status: "active",
        updated: "Сегодня",
        image: "/1.png"
    }, {
        id: 2,
        name: "Фикус Лирата",
        sku: "PL-002",
        category: "Комнатные растения",
        price: "4 800 ₽",
        stock: "1 шт",
        variants: "D10",
        status: "warning",
        updated: "Вчера",
        image: "/2.png"
    }, {
        id: 3,
        name: "Замиокулькас (Долларовое дерево)",
        sku: "PL-003",
        category: "Комнатные растения",
        price: "1 900 ₽",
        stock: "0 шт",
        variants: "D7",
        status: "inactive",
        updated: "2 дня назад",
        image: "/3.png"
    }, {
        id: 4,
        name: "Сансевиерия Лауренти",
        sku: "PL-004",
        category: "Комнатные растения",
        price: "1 600 ₽",
        stock: "40 шт",
        variants: "D7",
        status: "active",
        updated: "3 дня назад",
        image: "/4.png"
    }, {
        id: 5,
        name: "Хлорофитум Хохлатый",
        sku: "PL-005",
        category: "Комнатные растения",
        price: "650 ₽",
        stock: "25 шт",
        variants: "D5",
        status: "active",
        updated: "Сегодня",
        image: "/5.png"
    }, {
        id: 6,
        name: "Орхидея Фаленопсис (Белая)",
        sku: "PL-006",
        category: "Комнатные растения",
        price: "2 100 ₽",
        stock: "2 шт",
        variants: "D7",
        status: "warning",
        updated: "Вчера",
        image: "/6.png"
    }, {
        id: 7,
        name: "Спатифиллум (Женское счастье)",
        sku: "PL-007",
        category: "Комнатные растения",
        price: "1 350 ₽",
        stock: "0 шт",
        variants: "D7",
        status: "inactive",
        updated: "5 дней назад",
        image: "/7.png"
    }, {
        id: 8,
        name: "Эпипремнум Ауреум",
        sku: "PL-008",
        category: "Комнатные растения",
        price: "950 ₽",
        stock: "18 шт",
        variants: "D5",
        status: "active",
        updated: "Вчера",
        image: "/8.png"
    }, {
        id: 9,
        name: "Калатея Орната",
        sku: "PL-009",
        category: "Комнатные растения",
        price: "2 200 ₽",
        stock: "4 шт",
        variants: "D7",
        status: "active",
        updated: "Сегодня",
        image: "/9.png"
    }, {
        id: 10,
        name: "Антуриум Андре (Красный)",
        sku: "PL-010",
        category: "Комнатные растения",
        price: "1 750 ₽",
        stock: "3 шт",
        variants: "D7",
        status: "warning",
        updated: "2 дня назад",
        image: "/10.png"
    },

    // --- САДОВЫЕ РАСТЕНИЯ (Варианты: P9, C1, C2) ---
    {
        id: 11,
        name: "Гортензия крупнолистная",
        sku: "GD-001",
        category: "Садовые растения",
        price: "1 850 ₽",
        stock: "10 шт",
        variants: "C2",
        status: "active",
        updated: "Сегодня",
        image: "/11.png"
    }, {
        id: 12,
        name: "Лаванда узколистная",
        sku: "GD-002",
        category: "Садовые растения",
        price: "450 ₽",
        stock: "35 шт",
        variants: "P9",
        status: "active",
        updated: "Сегодня",
        image: "/12.png"
    }, {
        id: 13,
        name: "Туя Западная Смарагд",
        sku: "GD-003",
        category: "Садовые растения",
        price: "2 900 ₽",
        stock: "12 шт",
        variants: "C1",
        status: "active",
        updated: "Вчера",
        image: "/13.png"
    }, {
        id: 14,
        name: "Спирея японская Литл Принцесс",
        sku: "GD-004",
        category: "Садовые растения",
        price: "550 ₽",
        stock: "20 шт",
        variants: "P9",
        status: "active",
        updated: "Сегодня",
        image: "/14.png"
    }, {
        id: 15,
        name: "Роза чайно-гибридная Red",
        sku: "GD-005",
        category: "Садовые растения",
        price: "1 200 ₽",
        stock: "8 шт",
        variants: "C2",
        status: "active",
        updated: "Вчера",
        image: "/15.png"
    }, {
        id: 16,
        name: "Можжевельник Блю Эрроу",
        sku: "GD-006",
        category: "Садовые растения",
        price: "3 100 ₽",
        stock: "5 шт",
        variants: "C1",
        status: "active",
        updated: "3 дня назад",
        image: "/16.png"
    }, {
        id: 17,
        name: "Хоста Гибридная",
        sku: "GD-007",
        category: "Садовые растения",
        price: "480 ₽",
        stock: "15 шт",
        variants: "P9",
        status: "active",
        updated: "Сегодня",
        image: "/17.png"
    }, {
        id: 18,
        name: "Барбарис Тунберга",
        sku: "GD-008",
        category: "Садовые растения",
        price: "950 ₽",
        stock: "6 шт",
        variants: "C2",
        status: "warning",
        updated: "Вчера",
        image: "/18.png"
    }, {
        id: 19,
        name: "Клематис Президент",
        sku: "GD-009",
        category: "Садовые растения",
        price: "850 ₽",
        stock: "0 шт",
        variants: "P9",
        status: "inactive",
        updated: "4 дня назад",
        image: "/19.png"
    }, {
        id: 20,
        name: "Флокс метельчатый",
        sku: "GD-010",
        category: "Садовые растения",
        price: "380 ₽",
        stock: "22 шт",
        variants: "P9",
        status: "active",
        updated: "Сегодня",
        image: "/20.png"
    }];

