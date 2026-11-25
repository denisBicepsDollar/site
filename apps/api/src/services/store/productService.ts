import type { SearchParams } from "@/controllers/store/productController";
import * as productRepo from "@/db/store/productRepo";
import * as productVariants from "@/db/store/product_variants";
import { productsInProducts } from "@drizzle/schema";
import * as productsRepo from "@/db/store/productsRepo";
const defaultImage = "/default-image.png";

function parsePrice(value?: string): number | undefined {
  if (!value || value.trim() === "") return undefined;
  const num = Number(value);
  return Number.isFinite(num) ? num : undefined;
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
  return trimmed.slice(0, 100); // защита от слишком длинных запросов
}
function parseSizes(value?: string): string[] | undefined {
  const arr = value?.split(",").filter(Boolean);
  return arr && arr.length > 0 ? arr : undefined;
}

function parseSort(value?: string): ProductSort {
  if (value && ALLOWED_SORTS.has(value as ProductSort)) {
    return value as ProductSort;
  }
  return "score";
}

export async function list(searchParams: SearchParams) {
  const category = searchParams?.category;
  const subcategory = searchParams?.subcategory;
  const sizes = parseSizes(searchParams?.size);
  const minPrice = parsePrice(searchParams?.minPrice);
  const maxPrice = parsePrice(searchParams?.maxPrice);
  const sort = parseSort(searchParams?.sort);
  const search = parseSearch(searchParams.q);

  const products = await productRepo.list(
    category,
    subcategory,
    sizes,
    minPrice,
    maxPrice,
    sort,
    search,
  );

  return products.map((product) => {
    const validPrices = product.productVariantsInProducts
      .map((v) => Number(v.price))
      .filter((p) => p > 0);

    const minProductPrice =
      validPrices.length > 0
        ? Math.min(...validPrices)
        : Number(product.price) || 0;

    const allStock = product.productVariantsInProducts.reduce((acc, curr) => {
      return acc + (curr.stock || 0);
    }, 0);

    return {
      ...product,
      previewImage: product.previewImage ?? defaultImage,
      price: minProductPrice,
      stock: allStock,
    };
  });
}

export async function sizes(searchParams: SearchParams) {
  const category = searchParams.category;
  const subcategory = searchParams.subcategory;
  const minPrice = parsePrice(searchParams?.minPrice);
  const maxPrice = parsePrice(searchParams?.maxPrice);
  const search = parseSearch(searchParams.q);
  const sizes = await productVariants.sizes(
    category,
    subcategory,
    minPrice,
    maxPrice,
    search,
  );

  return sizes;
}

export async function prices(searchParams: SearchParams) {
  const category = searchParams.category;
  const subcategory = searchParams.subcategory;
  const sizes = searchParams?.size?.split(",");
  const search = parseSearch(searchParams.q);

  const prices = await productVariants.prices(
    category,
    subcategory,
    sizes,
    search,
  );
  return prices;
}

export async function counts(searchParams: SearchParams) {
  const minPrice = parsePrice(searchParams?.minPrice);
  const maxPrice = parsePrice(searchParams?.maxPrice);
  const sizes = searchParams?.size?.split(",");
  const search = parseSearch(searchParams.q);
  const counts = await productsRepo.counts(minPrice, maxPrice, sizes, search);
  return counts;
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
