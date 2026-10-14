export const data = [
    {
        id: "ORD-2026-1008",
        createdAt: "2026-10-08T14:32:00Z",
        status: "processing", // Варианты: pending, processing, shipped, delivered, cancelled

        customer: {
            id: "CUST-404",
            firstName: "Иван",
            lastName: "Иванов",
            email: "ivan.ivanov@example.com",
            phone: "+7 (999) 123-45-67"
        },

        delivery: {
            method: "courier", // courier, pickup, post
            address: "г. Санкт-Петербург, Невский проспект, д. 1, кв. 42",
            cost: 350,
            trackingNumber: null
        },

        payment: {
            method: "card_online", // cash, card_online, qr_code
            isPaid: true,
            paidAt: "2026-10-08T14:35:12Z"
        },

        // Массив товаров в заказе
        items: [
            {
                productId: "PROD-001",
                title: "Беспроводные наушники NeoSound",
                price: 4990,
                quantity: 1,
                discount: 500 // скидка в рублях на единицу товара
            },
            {
                productId: "PROD-015",
                title: "Кабель USB-C 1.5м",
                price: 590,
                quantity: 2,
                discount: 0
            }
        ],

        // Итоговые финансовые показатели заказа
        summary: {
            itemsPrice: 6170,  // Сумма за товары (с учетом количества)
            discountTotal: 500, // Общая скидка
            deliveryPrice: 350, // Стоимость доставки
            totalPrice: 6020   // Итого к оплате ((itemsPrice - discountTotal) + deliveryPrice)
        }
    },
    {
        id: "ORD-2026-1009",
        createdAt: "2026-10-08T16:15:00Z",
        status: "pending",
        customer: {
            id: "CUST-501",
            firstName: "Анна",
            lastName: "Петрова",
            email: "anna.p@example.com",
            phone: "+7 (999) 765-43-21"
        },
        delivery: {
            method: "pickup",
            address: "Пункт выдачи: ул. Ленина, д. 10",
            cost: 0,
            trackingNumber: null
        },
        payment: {
            method: "cash",
            isPaid: false,
            paidAt: null
        },
        items: [
            {
                productId: "PROD-088",
                title: "Умный светильник Glow",
                price: 3200,
                quantity: 1,
                discount: 0
            }
        ],
        summary: {
            itemsPrice: 3200,
            discountTotal: 0,
            deliveryPrice: 0,
            totalPrice: 3200
        }
    }
];
