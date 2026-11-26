import type { MetadataRoute } from "next";
import { getCachedCatalogProducts } from "@/shared/api/catalog-cache";
import { getSiteUrl } from "@/shared/config/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();
  const entries: MetadataRoute.Sitemap = [
    {
      url: `${siteUrl}/`,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteUrl}/products`,
      changeFrequency: "daily",
      priority: 0.9,
    },
  ];

  const firstPage = await getCachedCatalogProducts({ page: "1" });
  const counts = firstPage?.meta?.counts;

  const categories = Object.keys(counts?.categories ?? {});
  for (const cat of categories) {
    if (!Number(counts?.categories?.[cat])) continue;
    const encodedCat = encodeURIComponent(cat);
    entries.push({
      url: `${siteUrl}/products/${encodedCat}`,
      changeFrequency: "daily",
      priority: 0.8,
    });

    const subs = Object.keys(counts?.byCategory?.[cat] ?? {});
    for (const sub of subs) {
      if (!Number(counts?.byCategory?.[cat]?.[sub])) continue;
      const encodedSub = encodeURIComponent(sub);
      entries.push({
        url: `${siteUrl}/products/${encodedCat}/${encodedSub}`,
        changeFrequency: "daily",
        priority: 0.8,
      });

      const types = Object.keys(counts?.typesByCategory?.[cat]?.[sub] ?? {});
      for (const type of types) {
        if (!Number(counts?.typesByCategory?.[cat]?.[sub]?.[type])) continue;
        entries.push({
          url: `${siteUrl}/products/${encodedCat}/${encodedSub}/${encodeURIComponent(type)}`,
          changeFrequency: "daily",
          priority: 0.7,
        });
      }
    }
  }

  const seenSlugs = new Set<string>();
  const addProductsFromPage = (items: any[] | undefined) => {
    for (const product of items ?? []) {
      const slug = product?.slug?.trim();
      if (!slug || seenSlugs.has(slug)) continue;
      seenSlugs.add(slug);
      entries.push({
        url: `${siteUrl}/product/${encodeURIComponent(slug)}`,
        changeFrequency: "weekly",
        priority: 0.7,
      });
    }
  };

  addProductsFromPage(firstPage?.data);

  let currentPage = 1;
  let hasMore = Boolean(firstPage?.meta?.hasMore);
  while (hasMore && currentPage < 200) {
    currentPage += 1;
    const nextPage = await getCachedCatalogProducts({
      page: String(currentPage),
    });
    if (nextPage?.isError) break;
    addProductsFromPage(nextPage?.data);
    hasMore = Boolean(nextPage?.meta?.hasMore);
  }

  return entries;
}
