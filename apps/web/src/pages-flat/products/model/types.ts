export type ProductsState = {
  sizes: string[];
  prices: { minPrice: number; maxPrice: number };
  products: any[];
  counts: string[];
  setProductsData: ({ data, meta }) => void;
};
