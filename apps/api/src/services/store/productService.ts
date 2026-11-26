import type { SearchParams } from "@/controllers/store/productController";
import * as productRepo from "@/db/store/productRepo";
import * as productVariants from "@/db/store/product_variants";
import * as productsRepo from "@/db/store/productsRepo";
const defaultImage = "/default-image.png";

const CATALOG_PAGE_LIMIT = 12;

function parsePrice(value?: string): number | undefined {
  if (!value || value.trim() === "") return undefined;
  const num = Number(value);
  return Number.isFinite(num) && num >= 0 ? num : undefined;
}

export type ProductSort = "score" | "new" | "price" | "price_desc";

const ALLOWED_SORTS = new Set<ProductSort>([
  "score",
  "new",
  "price",
  "price_desc",
]);

function parseSearch(value?: string): string | undefined {
  const trimmed = value?.trim();
  if (!trimmed) return undefined;
  return trimmed.slice(0, 100);
}

function parseSizes(value?: string): string[] | undefined {
  const arr = Array.from(
    new Set(
      value
        ?.split(",")
        .map((s) => s.trim())
        .filter(Boolean) ?? [],
    ),
  );
  return arr.length > 0 ? arr : undefined;
}

function parseSort(value?: string): ProductSort {
  if (value && ALLOWED_SORTS.has(value as ProductSort)) {
    return value as ProductSort;
  }
  return "score";
}

function parsePage(value?: string): number {
  const num = Number(value);
  return Number.isInteger(num) && num > 0 ? num : 1;
}

type ProductVariantSummary = {
  price?: number | string | null;
  stock?: number | null;
};

function formatCatalogProduct(product: any) {
  const variants: ProductVariantSummary[] = Array.isArray(
    product.productVariantsInProducts,
  )
    ? product.productVariantsInProducts
    : [];

  const inStockVariants = variants.filter(
    (v: ProductVariantSummary) => (v.stock || 0) > 0 && Number(v.price) > 0,
  );
  const allPricedVariants = variants.filter(
    (v: ProductVariantSummary) => Number(v.price) > 0,
  );
  const priceSource =
    inStockVariants.length > 0 ? inStockVariants : allPricedVariants;

  const validPrices = priceSource.map((v: ProductVariantSummary) =>
    Number(v.price),
  );
  const minProductPrice =
    validPrices.length > 0
      ? Math.min(...validPrices)
      : Number(product.price) || 0;

  const allStock = variants.reduce(
    (acc: number, curr: ProductVariantSummary) => acc + (curr.stock || 0),
    0,
  );

  return {
    ...product,
    previewImage: product.previewImage ?? defaultImage,
    price: minProductPrice,
    stock: allStock,
  };
}

export async function listPage(searchParams: SearchParams = {}) {
  const category = searchParams.category?.trim() || undefined;
  const subcategory = searchParams.subcategory?.trim() || undefined;
  const type = searchParams.type?.trim() || undefined;
  const sizes = parseSizes(searchParams.size);
  const minPrice = parsePrice(searchParams.minPrice);
  const maxPrice = parsePrice(searchParams.maxPrice);
  const sort = parseSort(searchParams.sort);
  const search = parseSearch(searchParams.q);

  const page = parsePage(searchParams.page);
  const limit = CATALOG_PAGE_LIMIT;
  const offset = (page - 1) * limit;

  const rows = await productRepo.list(
    category,
    subcategory,
    type,
    sizes,
    minPrice,
    maxPrice,
    sort,
    search,
    limit + 1,
    offset,
  );

  const hasMore = rows.length > limit;
  const items = rows.slice(0, limit).map(formatCatalogProduct);

  return {
    items,
    hasMore,
    page,
    limit,
  };
}

export async function list(searchParams: SearchParams = {}) {
  const { items } = await listPage(searchParams);
  return items;
}

export async function sizes(searchParams: SearchParams = {}) {
  const category = searchParams.category?.trim() || undefined;
  const subcategory = searchParams.subcategory?.trim() || undefined;
  const type = searchParams.type?.trim() || undefined;
  const minPrice = parsePrice(searchParams.minPrice);
  const maxPrice = parsePrice(searchParams.maxPrice);
  const search = parseSearch(searchParams.q);

  return await productVariants.sizes(
    category,
    subcategory,
    type,
    minPrice,
    maxPrice,
    search,
  );
}

export async function prices(searchParams: SearchParams = {}) {
  const category = searchParams.category?.trim() || undefined;
  const subcategory = searchParams.subcategory?.trim() || undefined;
  const type = searchParams.type?.trim() || undefined;
  const sizes = parseSizes(searchParams.size);
  const search = parseSearch(searchParams.q);

  return await productVariants.prices(
    category,
    subcategory,
    type,
    sizes,
    search,
  );
}

export async function counts(searchParams: SearchParams = {}) {
  const minPrice = parsePrice(searchParams.minPrice);
  const maxPrice = parsePrice(searchParams.maxPrice);
  const sizes = parseSizes(searchParams.size);
  const search = parseSearch(searchParams.q);

  return await productsRepo.counts(minPrice, maxPrice, sizes, search);
}

export async function labels() {
  return await productsRepo.labels();
}

export async function getOneProduct(slug) {
  console.log("dasdasd");
  let product = await productRepo.getOneProduct(slug);

  product.previewImage = product.previewImage ?? defaultImage;
  return product;
}

export async function getVariants(variantIds) {
  const variants = await productRepo.getVariants(variantIds);
  variants.forEach((product) => {
    product.previewImage = product.previewImage ?? defaultImage;
  });
  return variants;
}
