export const SORTING_TAGS = [
  { label: "Популярные", value: "score" },
  { label: "Новинки", value: "new" },
  { label: "Дешевле", value: "price" },
  { label: "Дороже", value: "price_desc" },
] as const;

export const sortOptions = SORTING_TAGS;

export const PRODUCTS_PER_PAGE = 12;
