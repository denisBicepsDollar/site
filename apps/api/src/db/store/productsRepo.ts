import db from "@/db/index";
import {
  catalogLabelsInProducts,
  productsInProducts,
  productVariantsInProducts,
} from "@drizzle/schema";
import { and, asc, count, eq, exists, gte, inArray, lte } from "drizzle-orm";
import { buildProductSearchSql } from "./productSearch";

export type CatalogLabels = {
  categories: Record<string, string>;
  pageTitles: Record<string, string>;
  subcategories: Record<string, string>;
  types: Record<string, string>;
  order: {
    category: Record<string, number>;
    subcategory: Record<string, number>;
    type: Record<string, number>;
  };
};

export async function labels(): Promise<CatalogLabels> {
  const result: CatalogLabels = {
    categories: {},
    pageTitles: {},
    subcategories: {},
    types: {},
    order: {
      category: {},
      subcategory: {},
      type: {},
    },
  };

  let rows: Array<{
    kind: string;
    slug: string;
    labelRu: string;
    pageTitleRu: string | null;
    sortOrder: number;
  }>;

  try {
    rows = await db
      .select({
        kind: catalogLabelsInProducts.kind,
        slug: catalogLabelsInProducts.slug,
        labelRu: catalogLabelsInProducts.labelRu,
        pageTitleRu: catalogLabelsInProducts.pageTitleRu,
        sortOrder: catalogLabelsInProducts.sortOrder,
      })
      .from(catalogLabelsInProducts)
      .orderBy(
        asc(catalogLabelsInProducts.sortOrder),
        asc(catalogLabelsInProducts.id),
      );
  } catch (err: unknown) {
    const pgErr = err as { code?: string; cause?: { code?: string } };
    const code = pgErr?.code || pgErr?.cause?.code;
    if (code === "42P01") {
      return result;
    }
    throw err;
  }

  for (const row of rows) {
    const kind = row.kind?.trim().toLowerCase();
    const slug = row.slug?.trim();
    const labelRu = row.labelRu?.trim();
    const pageTitleRu = row.pageTitleRu?.trim();

    if (!kind || !slug || !labelRu) continue;

    if (kind === "category") {
      result.categories[slug] = labelRu;
      if (pageTitleRu) {
        result.pageTitles[slug] = pageTitleRu;
      }
      result.order.category[slug] = row.sortOrder;
    } else if (kind === "subcategory") {
      result.subcategories[slug] = labelRu;
      result.order.subcategory[slug] = row.sortOrder;
    } else if (kind === "type") {
      result.types[slug] = labelRu;
      result.order.type[slug] = row.sortOrder;
    }
  }

  return result;
}

export async function counts(
  minPrice?: number,
  maxPrice?: number,
  sizes?: string[],
  search?: string,
) {
  const searchSql = buildProductSearchSql(productsInProducts, search);
  const hasVariantFilters =
    minPrice !== undefined ||
    maxPrice !== undefined ||
    (sizes && sizes.length > 0);

  const rows = await db
    .select({
      category: productsInProducts.category,
      subcategory: productsInProducts.subcategory,
      type: productsInProducts.type,
      count: count(),
    })
    .from(productsInProducts)
    .where(
      and(
        searchSql,
        hasVariantFilters
          ? exists(
              db
                .select()
                .from(productVariantsInProducts)
                .where(
                  and(
                    eq(
                      productVariantsInProducts.productId,
                      productsInProducts.id,
                    ),
                    minPrice !== undefined
                      ? gte(productVariantsInProducts.price, minPrice)
                      : undefined,
                    maxPrice !== undefined
                      ? lte(productVariantsInProducts.price, maxPrice)
                      : undefined,
                    sizes && sizes.length > 0
                      ? inArray(productVariantsInProducts.name, sizes)
                      : undefined,
                  ),
                ),
            )
          : undefined,
      ),
    )
    .groupBy(
      productsInProducts.category,
      productsInProducts.subcategory,
      productsInProducts.type,
    );

  const result = {
    total: 0,
    categories: {} as Record<string, number>,
    subcategories: {} as Record<string, number>,
    byCategory: {} as Record<string, Record<string, number>>,
    typesByCategory: {} as Record<
      string,
      Record<string, Record<string, number>>
    >,
  };

  const canonicalKey = (
    map: Record<string, string>,
    rawValue: string,
  ): string => {
    const lower = rawValue.toLowerCase();
    if (!map[lower]) {
      map[lower] = rawValue;
    }
    return map[lower];
  };

  const categoryKeys: Record<string, string> = {};
  const subcategoryKeys: Record<string, string> = {};
  const byCategorySubKeys: Record<string, Record<string, string>> = {};
  const typeKeysByCatSub: Record<
    string,
    Record<string, Record<string, string>>
  > = {};

  for (const row of rows) {
    const num = Number(row.count);
    result.total += num;

    const rawCat = row.category?.trim() || "";
    const rawSub = row.subcategory?.trim() || "";
    const rawType = row.type?.trim() || "";

    const cat = rawCat ? canonicalKey(categoryKeys, rawCat) : "";

    // Иерархия: category -> subcategory ?? type -> type (subtype не используем)
    const chosenSub = rawSub || rawType;
    const chosenType =
      rawSub && rawType && rawType.toLowerCase() !== rawSub.toLowerCase()
        ? rawType
        : "";

    const effectiveSub = chosenSub
      ? canonicalKey(subcategoryKeys, chosenSub)
      : "";

    if (cat) {
      result.categories[cat] = (result.categories[cat] ?? 0) + num;
    }

    if (effectiveSub) {
      result.subcategories[effectiveSub] =
        (result.subcategories[effectiveSub] ?? 0) + num;
    }

    let catEffectiveSub = "";
    if (cat && chosenSub) {
      const catSubKeyMap = byCategorySubKeys[cat] ?? {};
      byCategorySubKeys[cat] = catSubKeyMap;
      catEffectiveSub = canonicalKey(catSubKeyMap, chosenSub);

      const catSubs = result.byCategory[cat] ?? {};
      catSubs[catEffectiveSub] = (catSubs[catEffectiveSub] ?? 0) + num;
      result.byCategory[cat] = catSubs;
    }

    if (cat && catEffectiveSub && chosenType) {
      const catTypeMap = typeKeysByCatSub[cat] ?? {};
      typeKeysByCatSub[cat] = catTypeMap;
      const subTypeKeyMap = catTypeMap[catEffectiveSub] ?? {};
      catTypeMap[catEffectiveSub] = subTypeKeyMap;
      const effectiveType = canonicalKey(subTypeKeyMap, chosenType);

      const catTypes = result.typesByCategory[cat] ?? {};
      const subTypes = catTypes[catEffectiveSub] ?? {};
      subTypes[effectiveType] = (subTypes[effectiveType] ?? 0) + num;
      catTypes[catEffectiveSub] = subTypes;
      result.typesByCategory[cat] = catTypes;
    }
  }

  return result;
}
