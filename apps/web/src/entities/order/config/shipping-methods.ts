export const shippingMethodsConfig = [
    {
        id: "pickup",
        name: "Самовывоз",
        price: 0,
        description: "Адрес: Брянская обл. Новозыбков. После оформления мы свяжемся с вами.",
        time: "0-1 день",
    },
    {
        id: "delivery",
        name: "Доставка",
        description: "Сдек, Почта России",
        variants: [
            {
                id: "russian_post",
                name: "Почта России",
                variants: [
                    {
                        id: "pickup_post_office",
                        name: "Самовывоз из отделения",
                        variants: [
                            {
                                id: "standard",
                                name: "Обычная доставка",
                                price: 0,
                                time: "5-7 рабочих дней",
                            },
                            {
                                id: "first_class",
                                name: "1 класс",
                                price: 0,
                                time: "2-4 рабочих дня",
                            },
                        ],
                    },
                    {
                        id: "courier",
                        name: "Курьер",
                        price: 0,
                        time: "2-5 рабочих дней",
                    },
                ],
            },
            {
                id: "cdek",
                name: "СДЭК",
                price: 0,
                time: "2-4 рабочих дня",
            },
        ],
    },
];
