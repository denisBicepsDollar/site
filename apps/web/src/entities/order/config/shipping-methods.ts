import type { ShippingConfigNode } from "../model/order-store";

export const shippingMethodsConfig: ShippingConfigNode[] = [
  {
    id: "pickup",
    name: "Самовывоз",
    price: 0,
    description:
      "Адрес: Брянская обл. Новозыбков. После оформления мы свяжемся с вами.",
    time: "0-1 день",
  },
  {
    id: "delivery",
    name: "Доставка",
    description: "СДЭК, Почта России",
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
                price: 320,
                time: "5-7 рабочих дней",
              },
              {
                id: "first_class",
                name: "1 класс",
                price: 490,
                time: "2-4 рабочих дня",
              },
            ],
          },
          {
            id: "courier",
            name: "Курьер",
            price: 650,
            time: "2-5 рабочих дней",
          },
        ],
      },
      {
        id: "cdek",
        name: "СДЭК",
        description: "Стоимость уточняется после подтверждения",
        time: "2-4 рабочих дня",
      },
    ],
  },
];
