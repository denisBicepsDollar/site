export const sampleOrderItems = [
    {
        id: "1",
        name: "Wireless Bluetooth Headphones",
        price: 89.99,
        originalPrice: 129.99,
        image:
            "https://cdn.21st.dev/assets/mirror/e5/e5cf3e492d41ee98126c30a2ad5db3b784cfd677ae2992b7882de1c7a12d68c4.jpg",
        quantity: 2,
        discount: 31,
    },
    {
        id: "2",
        name: "Minimalist Desk Lamp",
        price: 45.99,
        image:
            "https://cdn.21st.dev/assets/mirror/8a/8a8516975b286a13ae0da6ae56dfb5a186e0be287138877baedd195a4f0099e9.jpg",
        quantity: 1,
    },
    {
        id: "3",
        name: "Organic Coffee Beans",
        price: 24.99,
        originalPrice: 29.99,
        image:
            "https://cdn.21st.dev/assets/mirror/dc/dc06e73aea604769124ba775887ff460af6f83674301a5b2a9a1fa7c079573a5.jpg",
        quantity: 3,
        discount: 17,
    },
];

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
]
