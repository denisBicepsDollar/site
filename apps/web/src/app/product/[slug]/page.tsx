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

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
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
  const decodedSlug = decodeURIComponent(slug);

  const [
    { data: product, isError },
    { data: products, meta },
    fallbackLabels,
  ] = await Promise.all([
    getCachedProductBySlug(decodedSlug),
    getCachedCatalogProducts({ page: "1" }),
    getCachedCatalogLabels(),
  ]);

  if (!isError && !product) {
    notFound();
  }

  const labels = meta?.labels ?? fallbackLabels;

  if (!product) {
    return <ProductScreen product={null} products={[]} labels={labels} />;
  }

  const siteUrl = getSiteUrl();
  const productUrl = `${siteUrl}/product/${encodeURIComponent(product.slug || decodedSlug)}`;
  const rawImage = product.previewImage || DEFAULT_OG_IMAGE;
  const imageUrl = /^https?:\/\//i.test(rawImage)
    ? rawImage
    : `${siteUrl}${rawImage.startsWith("/") ? rawImage : `/${rawImage}`}`;
  const variants = Array.isArray(product.variants) ? product.variants : [];
  const hasStock = variants.some((v: any) => Number(v?.stock ?? 0) > 0);
  const effectivePrice = Number(variants[0]?.price ?? product.price ?? 0);

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
        product={product}
        products={products ?? []}
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
