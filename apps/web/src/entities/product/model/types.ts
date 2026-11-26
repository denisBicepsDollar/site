export interface ProductVariant {
  id: string;
  name: string;
  price: number;
  oldPrice?: number | null;
  stock: number;
  previewImage?: string | null;
  images?: string[];
}

export interface ProductDetail {
  id: string;
  name: string;
  slug?: string | null;
  category?: string | null;
  subcategory?: string | null;
  type?: string | null;
  sku?: string | null;
  latin?: string | null;
  badge?: string | null;
  shortDescription?: string | null;
  description?: string | null;
  careInstructions?: string | null;
  light?: string | null;
  water?: string | null;
  level?: string | null;
  previewImage?: string | null;
  images?: string[];
  price: number;
  oldPrice?: number | null;
  stock: number;
  tags?: string[];
  variants?: ProductVariant[];
}

export type ProductsState = {
  sizes: string[];
  prices: { minPrice: number; maxPrice: number };
  products: any[];
  counts: string[];
  setProductsData: ({ data, meta }) => void;
};
