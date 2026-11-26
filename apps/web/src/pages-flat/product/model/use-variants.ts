import { useMemo } from "react";

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

const SIZE_ORDER: Record<string, number> = {
  xs: 1,
  s: 2,
  m: 3,
  l: 4,
  xl: 5,
  xxl: 6,
  xxxl: 7,
};

function compareVariantSize(aName: string, bName: string): number {
  const aLower = aName.trim().toLowerCase();
  const bLower = bName.trim().toLowerCase();

  const aRank = SIZE_ORDER[aLower];
  const bRank = SIZE_ORDER[bLower];
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

export function sortVariants(variants: ProductVariant[] = []): ProductVariant[] {
  return [...variants].sort((a, b) => {
    const aAvailable = Number(a.stock) > 0 ? 1 : 0;
    const bAvailable = Number(b.stock) > 0 ? 1 : 0;
    if (aAvailable !== bAvailable) {
      return bAvailable - aAvailable;
    }

    return compareVariantSize(a.name ?? "", b.name ?? "") || a.price - b.price;
  });
}

export function useVariants(variants: ProductVariant[] = []) {
  const sortedVariants = useMemo(() => sortVariants(variants), [variants]);
  return { sortedVariants };
}
