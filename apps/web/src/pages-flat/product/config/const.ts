export const formatPrice = (n: number | string) => {
  const num = Number(n);
  return `${new Intl.NumberFormat("ru-RU").format(Number.isFinite(num) ? num : 0)} ₽`;
};
