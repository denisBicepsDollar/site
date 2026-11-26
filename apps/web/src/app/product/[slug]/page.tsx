import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ProductScreen } from "@/pages-flat/product";
import {
  getCategoryLabel,
  getSubcategoryLabel,
} from "@/pages-flat/products/config/catalog-labels";
import {
  getCachedCatalogLabels,
  getCachedCatalogProducts,
  getCachedProductBySlug,
} from "@/shared/api/catalog-cache";
import { DEFAULT_OG_IMAGE, getSiteUrl, SITE_NAME } from "@/shared/config/site";

type PageProps = {
  params: Promise<{ slug: string }>;
};

function decodeSlugParam(raw: string): string {
  try {
    return decodeURIComponent(raw);
  } catch {
    return raw;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const decodedSlug = decodeSlugParam(slug);
  const { data: product, isError } = await getCachedProductBySlug(decodedSlug);

  if (isError) {
    return {
      title: `Товар | ${SITE_NAME}`,
      robots: { index: false, follow: true },
    };
  }

  if (!isError && !product) {
    notFound();
  }

  const title = `${product.name} — купить в ${SITE_NAME}`;
  const description =
    product.shortDescription ||
    product.description ||
    `${product.name} в интернет-магазине «${SITE_NAME}».`;
  const canonical = `/product/${encodeURIComponent(product.slug || decodedSlug)}`;
  const image = product.previewImage || DEFAULT_OG_IMAGE;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      type: "website",
      locale: "ru_RU",
      title,
      description,
      url: canonical,
      siteName: SITE_NAME,
      images: [{ url: image, alt: product.name }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

async function ProductLoader({ params }: PageProps) {
  const { slug } = await params;
  const decodedSlug = decodeSlugParam(slug);

  const { data: product, isError } = await getCachedProductBySlug(decodedSlug);

  if (!isError && !product) {
    notFound();
  }

  if (!product) {
    return (
      <ProductScreen
        key={decodedSlug}
        product={null}
        products={[]}
        labels={{}}
        isError={isError}
      />
    );
  }

  const [{ data: categoryProducts, meta }, fallbackLabels] = await Promise.all([
    getCachedCatalogProducts(
      product.category
        ? { category: product.category, page: "1" }
        : { page: "1" },
    ),
    getCachedCatalogLabels(),
  ]);

  const labels = meta?.labels ?? fallbackLabels;

  const siteUrl = getSiteUrl();
  const productUrl = `${siteUrl}/product/${encodeURIComponent(product.slug || decodedSlug)}`;
  const rawImage = product.previewImage || DEFAULT_OG_IMAGE;
  const imageUrl = /^https?:\/\//i.test(rawImage)
    ? rawImage
    : `${siteUrl}${rawImage.startsWith("/") ? rawImage : `/${rawImage}`}`;
  const variants = Array.isArray(product.variants) ? product.variants : [];
  const inStockVariants = variants.filter((v: any) => Number(v?.stock ?? 0) > 0);
  const hasStock = inStockVariants.length > 0;
  const priceCandidates = (inStockVariants.length > 0 ? inStockVariants : variants)
    .map((v: any) => Number(v?.price))
    .filter((p: number) => Number.isFinite(p) && p > 0);
  const effectivePrice =
    priceCandidates.length > 0
      ? Math.min(...priceCandidates)
      : Number(product.price ?? 0);

  const breadcrumbItems: Array<{ name: string; item: string }> = [
    { name: "Главная", item: `${siteUrl}/` },
    { name: "Каталог", item: `${siteUrl}/products` },
  ];
  if (product.category) {
    breadcrumbItems.push({
      name: getCategoryLabel(product.category, labels),
      item: `${siteUrl}/products/${encodeURIComponent(product.category)}`,
    });
  }
  if (product.category && product.subcategory) {
    breadcrumbItems.push({
      name: getSubcategoryLabel(product.subcategory, labels),
      item: `${siteUrl}/products/${encodeURIComponent(product.category)}/${encodeURIComponent(product.subcategory)}`,
    });
  }
  breadcrumbItems.push({
    name: product.name,
    item: productUrl,
  });

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: breadcrumbItems.map((entry, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: entry.name,
        item: entry.item,
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "Product",
      name: product.name,
      description:
        product.shortDescription ||
        product.description ||
        `${product.name} в интернет-магазине «${SITE_NAME}».`,
      image: imageUrl,
      sku: product.sku || undefined,
      url: productUrl,
      offers: {
        "@type": "Offer",
        url: productUrl,
        priceCurrency: "RUB",
        price: effectivePrice,
        availability: hasStock
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      },
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <ProductScreen
        key={product.id ?? decodedSlug}
        product={product}
        products={categoryProducts ?? []}
        labels={labels}
      />
    </>
  );
}

export default function ProductPage(props: PageProps) {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <ProductLoader {...props} />
    </Suspense>
  );
}
