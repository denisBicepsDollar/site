export const formatPrice = (n: number | string) =>
  `${new Intl.NumberFormat("ru-RU").format(Number(n))} ₽`;
