export interface CatalogLabels {
  categories?: Record<string, string>;
  pageTitles?: Record<string, string>;
  subcategories?: Record<string, string>;
  types?: Record<string, string>;
  order?: {
    category?: Record<string, number>;
    subcategory?: Record<string, number>;
    type?: Record<string, number>;
  };
}

export interface ProductsMeta {
  counts?: {
    total?: number;
    categories?: Record<string, number>;
    subcategories?: Record<string, number>;
    byCategory?: Record<string, Record<string, number>>;
    typesByCategory?: Record<string, Record<string, Record<string, number>>>;
  };
  labels?: CatalogLabels;
  prices?: { minPrice?: number | null; maxPrice?: number | null };
  sizes?: Array<{ size: string; stock: number }>;
  hasMore?: boolean;
  page?: number;
  limit?: number;
  totalPages?: number;
  total?: number;
}

export interface ProductsApiResponse {
  data: any[];
  meta?: ProductsMeta;
  isError?: boolean;
}
