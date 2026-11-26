export const formatPrice = (n) =>
  `${new Intl.NumberFormat("ru-RU").format(n)} ₽`;
