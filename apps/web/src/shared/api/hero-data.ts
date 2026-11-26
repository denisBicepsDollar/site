import type { ProductsApiResponse } from "./types";

export interface HeroFeaturedProduct {
  id: string;
  slug: string | null;
  name: string;
  price: number;
  previewImage: string;
  salesCount: number;
  stock: number;
}

export interface HeroData {
  product: HeroFeaturedProduct | null;
  totalCount: number | null;
}

export function extractHeroDataFromResponse(
  body: ProductsApiResponse | null | undefined,
): HeroData {
  const items = Array.isArray(body?.data) ? body.data : [];
  const sortedBySales = [...items].sort((a, b) => {
    const salesDiff = Number(b?.salesCount ?? 0) - Number(a?.salesCount ?? 0);
    if (salesDiff !== 0) return salesDiff;
    return Number(b?.stock ?? 0) - Number(a?.stock ?? 0);
  });
  const best = sortedBySales[0] ?? null;

  const product: HeroFeaturedProduct | null = best
    ? {
        id: String(best.id),
        slug: best.slug ? String(best.slug) : null,
        name: String(best.name || "Комнатное растение"),
        price: Number(best.price) || 0,
        previewImage:
          typeof best.previewImage === "string" && best.previewImage.trim()
            ? best.previewImage.trim()
            : "/default-image.png",
        salesCount: Number(best.salesCount ?? 0),
        stock: Number(best.stock ?? 0),
      }
    : null;

  const rawTotal = body?.meta?.counts?.total;
  const totalCount =
    typeof rawTotal === "number" && Number.isFinite(rawTotal)
      ? rawTotal
      : items.length > 0
        ? items.length
        : null;

  return { product, totalCount };
}
