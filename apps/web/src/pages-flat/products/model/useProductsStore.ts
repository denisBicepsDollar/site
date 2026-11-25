import { create } from "zustand";
import { ProductsState } from "./types";

export const useProductsStore = create<ProductsState>((set) => ({
  sizes: [],
  products: [],
  counts: [],
  prices: new Object(),
  setProductsData: ({ data, meta }) =>
    set({
      counts: meta.counts,
      prices: meta.prices,
      sizes: meta.sizes,
      products: data,
    }),
}));
