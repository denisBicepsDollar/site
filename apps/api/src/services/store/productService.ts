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
  oldPrice?: number | string | null;
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

  const cheapestVariant = priceSource.find(
    (v: ProductVariantSummary) => Number(v.price) === minProductPrice,
  );
  const rawOldPrice = Number(cheapestVariant?.oldPrice ?? product.oldPrice);
  const oldPrice =
    Number.isFinite(rawOldPrice) && rawOldPrice > minProductPrice
      ? rawOldPrice
      : undefined;

  const allStock = variants.reduce(
    (acc: number, curr: ProductVariantSummary) => acc + (curr.stock || 0),
    0,
  );

  return {
    ...product,
    previewImage: product.previewImage?.trim() || defaultImage,
    price: minProductPrice,
    ...(oldPrice !== undefined ? { oldPrice } : {}),
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

type ProductVariantImageRow = {
  id?: string;
  imgUrl?: string | null;
  altText?: string | null;
  titleText?: string | null;
  isMain?: boolean | null;
};

type ProductVariantRow = ProductVariantSummary & {
  id?: string;
  name?: string | null;
  previewImage?: string | null;
  productVariantsImagesInProducts?: ProductVariantImageRow[];
};

const SIZE_RANK: Record<string, number> = {
  xs: 1,
  s: 2,
  m: 3,
  l: 4,
  xl: 5,
  xxl: 6,
  xxxl: 7,
};

function compareVariantNames(aName: string, bName: string): number {
  const aLower = aName.trim().toLowerCase();
  const bLower = bName.trim().toLowerCase();
  const aRank = SIZE_RANK[aLower];
  const bRank = SIZE_RANK[bLower];

  if (aRank !== undefined && bRank !== undefined) {
    return aRank - bRank;
  }

  const aNum = Number.parseFloat(aLower.replace(",", "."));
  const bNum = Number.parseFloat(bLower.replace(",", "."));
  if (Number.isFinite(aNum) && Number.isFinite(bNum) && aNum !== bNum) {
    return aNum - bNum;
  }

  return aName.localeCompare(bName, "ru");
}

function collectUniqueStrings(values: Array<string | null | undefined>): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const raw of values) {
    const trimmed = raw?.trim();
    if (!trimmed || seen.has(trimmed)) continue;
    seen.add(trimmed);
    result.push(trimmed);
  }
  return result;
}

export async function getOneProduct(slug: string) {
  const product = await productRepo.getOneProduct(slug);
  if (!product) return null;

  const rawVariants: ProductVariantRow[] = Array.isArray(
    product.productVariantsInProducts,
  )
    ? product.productVariantsInProducts
    : [];

  const formattedVariants = rawVariants
    .map((v) => {
      const price = Number(v.price) || 0;
      const rawOld = Number(v.oldPrice);
      const oldPrice =
        Number.isFinite(rawOld) && rawOld > price ? rawOld : null;
      const stock = Number(v.stock) || 0;
      const previewImage = v.previewImage?.trim() || null;

      const sortedVariantImgs = [...(v.productVariantsImagesInProducts ?? [])].sort(
        (a, b) => Number(Boolean(b.isMain)) - Number(Boolean(a.isMain)),
      );
      const images = collectUniqueStrings([
        previewImage,
        ...sortedVariantImgs.map((img) => img.imgUrl),
      ]);

      return {
        id: v.id,
        name: v.name?.trim() || "Стандарт",
        price,
        oldPrice,
        stock,
        previewImage: previewImage || images[0] || null,
        images,
      };
    })
    .sort((a, b) => {
      const aAvailable = a.stock > 0 ? 1 : 0;
      const bAvailable = b.stock > 0 ? 1 : 0;
      if (aAvailable !== bAvailable) return bAvailable - aAvailable;
      return (
        compareVariantNames(a.name, b.name) ||
        a.price - b.price
      );
    });

  const inStockVariants = formattedVariants.filter(
    (v) => v.stock > 0 && v.price > 0,
  );
  const pricedVariants = formattedVariants.filter((v) => v.price > 0);
  const priceSource =
    inStockVariants.length > 0 ? inStockVariants : pricedVariants;

  const minProductPrice =
    priceSource.length > 0
      ? Math.min(...priceSource.map((v) => v.price))
      : Number(product.price) || 0;

  const cheapestVariant = priceSource.find((v) => v.price === minProductPrice);
  const oldPrice =
    cheapestVariant?.oldPrice && cheapestVariant.oldPrice > minProductPrice
      ? cheapestVariant.oldPrice
      : undefined;

  const totalStock = formattedVariants.reduce((sum, v) => sum + v.stock, 0);

  const productPreview = product.previewImage?.trim() || null;
  const galleryImages = collectUniqueStrings([
    productPreview,
    ...formattedVariants.flatMap((v) => [v.previewImage, ...v.images]),
  ]);

  const effectivePreview =
    productPreview || galleryImages[0] || defaultImage;

  const { productVariantsInProducts: _rawVariants, ...rest } = product;

  return {
    ...rest,
    previewImage: effectivePreview,
    images: galleryImages.length > 0 ? galleryImages : [effectivePreview],
    price: minProductPrice,
    ...(oldPrice !== undefined ? { oldPrice } : {}),
    stock: totalStock,
    tags: Array.isArray(product.tags)
      ? product.tags.filter((t: unknown): t is string =>
          Boolean(typeof t === "string" && t.trim()),
        )
      : [],
    variants: formattedVariants,
  };
}

export async function getVariants(variantIds: string[]) {
  const variants = await productRepo.getVariants(variantIds);
  return variants.map((product) => ({
    ...product,
    previewImage: product.previewImage?.trim() || defaultImage,
  }));
}
